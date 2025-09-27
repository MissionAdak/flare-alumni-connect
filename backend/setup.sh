#!/bin/bash

# FLARE Alumni Connect Backend Setup Script

echo "🚀 Setting up FLARE Alumni Connect Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v13 or higher."
    exit 1
fi

echo "✅ PostgreSQL is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your configuration before continuing."
    echo "   Required: DATABASE_URL, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*"
    read -p "Press Enter after updating .env file..."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npm run migrate --dry-run &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL in .env"
    echo "   Example: postgresql://username:password@localhost:5432/flare_alumni_db"
    exit 1
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migrate

# Create admin user
echo "👤 Creating admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@flarealums.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'COLLEGE_ADMIN',
        status: 'ACTIVE',
        emailVerified: true
      }
    });
    
    await prisma.collegeProfile.create({
      data: {
        userId: admin.id,
        collegeName: 'FLARE University',
        collegeCode: 'FLARE001'
      }
    });
    
    console.log('✅ Admin user created successfully');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.\$disconnect();
  }
}

createAdmin();
"

echo ""
echo "🎉 Backend setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your .env file with proper configuration"
echo "   2. Start the development server: npm run dev"
echo "   3. The API will be available at: http://localhost:5000"
echo "   4. Health check: http://localhost:5000/health"
echo ""
echo "🔑 Admin credentials:"
echo "   Email: admin@flarealums.com"
echo "   Password: admin123"
echo ""
echo "📚 For more information, see the README.md file"
