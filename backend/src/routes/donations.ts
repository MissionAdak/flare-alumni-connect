import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

// Create donation order
router.post('/create-order', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const orderSchema = Joi.object({
      amount: Joi.number().min(1).required(),
      currency: Joi.string().default('INR'),
      purpose: Joi.string().optional(),
      message: Joi.string().optional()
    });

    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { amount, currency, purpose, message } = value;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `donation_${Date.now()}`,
      notes: {
        purpose: purpose,
        message: message,
        donorId: req.user!.id
      }
    };

    const order = await razorpay.orders.create(options);

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount: amount,
        currency: currency,
        purpose: purpose,
        message: message,
        donorId: req.user!.id,
        razorpayOrderId: order.id,
        status: 'PENDING'
      }
    });

    return res.json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      donation
    });
  } catch (error) {
    return next(error);
  }
});

// Verify payment
router.post('/verify-payment', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const verificationSchema = Joi.object({
      orderId: Joi.string().required(),
      paymentId: Joi.string().required(),
      signature: Joi.string().required()
    });

    const { error } = verificationSchema.validate({ orderId, paymentId, signature });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Find donation by razorpayOrderId first
    const existingDonation = await prisma.donation.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (!existingDonation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Update donation status
    const donation = await prisma.donation.update({
      where: { id: existingDonation.id },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId: paymentId,
        razorpaySignature: signature
      }
    });

    return res.json({
      message: 'Payment verified successfully',
      donation
    });
  } catch (error) {
    return next(error);
  }
});

// Get donation history
router.get('/history', requireRole(['ALUMNI']), async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const donations = await prisma.donation.findMany({
      where: { donorId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.donation.count({
      where: { donorId: req.user!.id }
    });

    const totalDonated = await prisma.donation.aggregate({
      where: { 
        donorId: req.user!.id,
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    });

    return res.json({
      donations,
      totalDonated: totalDonated._sum.amount || 0,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get donation statistics (for admin)
router.get('/statistics', requireRole(['COLLEGE_ADMIN', 'UNIVERSITY_ADMIN']), async (req: AuthRequest, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    const whereClause: any = {
      status: 'COMPLETED',
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
    };

    const [
      totalDonations,
      totalAmount,
      donationsByPurpose,
      recentDonations
    ] = await Promise.all([
      prisma.donation.count({ where: whereClause }),
      prisma.donation.aggregate({
        where: whereClause,
        _sum: { amount: true }
      }),
      prisma.donation.groupBy({
        by: ['purpose'],
        where: whereClause,
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.donation.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          donor: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ]);

    return res.json({
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      donationsByPurpose,
      recentDonations
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
