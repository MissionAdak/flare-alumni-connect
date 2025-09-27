@echo off
echo 🚀 Setting up FLARE Alumni Connect Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if PostgreSQL is available (basic check)
echo 🔍 Checking PostgreSQL availability...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL not found in PATH. Please ensure PostgreSQL is installed and accessible.
    echo    You can continue with the setup, but make sure to configure DATABASE_URL correctly.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please update the .env file with your configuration before continuing.
    echo    Required: DATABASE_URL, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*
    pause
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npm run generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Run database migrations
echo 🗄️  Running database migrations...
call npm run migrate
if %errorlevel% neq 0 (
    echo ❌ Database migration failed. Please check your DATABASE_URL in .env
    echo    Example: postgresql://username:password@localhost:5432/flare_alumni_db
    pause
    exit /b 1
)

REM Create admin user
echo 👤 Creating admin user...
node -e "const { PrismaClient } = require('@prisma/client'); const bcrypt = require('bcryptjs'); const prisma = new PrismaClient(); async function createAdmin() { try { const adminEmail = process.env.ADMIN_EMAIL || 'admin@flarealums.com'; const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } }); if (existingAdmin) { console.log('✅ Admin user already exists'); return; } const hashedPassword = await bcrypt.hash(adminPassword, 12); const admin = await prisma.user.create({ data: { email: adminEmail, password: hashedPassword, firstName: 'Admin', lastName: 'User', role: 'COLLEGE_ADMIN', status: 'ACTIVE', emailVerified: true } }); await prisma.collegeProfile.create({ data: { userId: admin.id, collegeName: 'FLARE University', collegeCode: 'FLARE001' } }); console.log('✅ Admin user created successfully'); console.log('   Email:', adminEmail); console.log('   Password:', adminPassword); } catch (error) { console.error('❌ Error creating admin user:', error.message); } finally { await prisma.$disconnect(); } } createAdmin();"

echo.
echo 🎉 Backend setup completed successfully!
echo.
echo 📋 Next steps:
echo    1. Update your .env file with proper configuration
echo    2. Start the development server: npm run dev
echo    3. The API will be available at: http://localhost:5000
echo    4. Health check: http://localhost:5000/health
echo.
echo 🔑 Admin credentials:
echo    Email: admin@flarealums.com
echo    Password: admin123
echo.
echo 📚 For more information, see the README.md file
echo.
pause
