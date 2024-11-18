import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function signupHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { firstName, lastName, email, password } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                },
            });
            res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'User creation failed' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}