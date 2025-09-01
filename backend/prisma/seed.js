import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Database Seed...");

    // Check if there is already an Admin in our system.
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'shamba@admin.com' },
    });

    if (existingAdmin) {
        console.log('Admin user already exists. Skipping seed.');
        return;
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('12345678', saltRounds);

    // 3. Create the Admin User AND their Profile in a transaction
    const adminUser = await prisma.user.create({
        data: {
            email: 'shamba@admin.com',
            password: hashedPassword,
            role: 'ADMIN',
            profile: {
                create: {
                    fullName: 'Mazao ERP Administrator',
                    location: 'Nairobi, Kenya',
                    contactInfo: '+254758492438',
                    // avatar: 'https://example.com/avatar.jpg',
                },
            },
        },
        include: {
            profile: true, // Return the created profile as well
        },
    });

    console.log('Admin user created successfully:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: 12345678`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Name: ${adminUser.profile.fullName}`);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });