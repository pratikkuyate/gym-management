import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                });

                if (user && user.password) {
                    // Compare the hashed password
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) {
                        return { ...user, id: user.id.toString() };
                    }
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Redirect to your custom login page
    },
});