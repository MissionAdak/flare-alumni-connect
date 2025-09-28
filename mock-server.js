const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-super-secret-jwt-key-here';

// Middleware
app.use(cors());
app.use(express.json());

// Mock users database for testing
const users = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'ALUMNI'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'STUDENT'
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'COLLEGE_ADMIN'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'FLARE Alumni Connect API is running' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password: '***' });

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    console.log('User not found or invalid credentials');
    return res.status(401).json({ 
      message: 'Invalid email or password' 
    });
  }

  console.log('User found:', { id: user.id, email: user.email, role: user.role });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FLARE Alumni Connect Mock API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log('\n📧 Test Credentials:');
  console.log('  Alumni: john@example.com / password123');
  console.log('  Student: jane@example.com / password123');
  console.log('  Admin: admin@example.com / password123');
});
