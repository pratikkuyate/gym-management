import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Member } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T | Partial<Member>[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<Member | Member[]>>) {
    if (req.method === 'POST') {
        try {
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                dateOfBirth,
                gender,
                joiningDate,
                membershipType,
                membershipStartDate,
                membershipEndDate,
            } = req.body;

            // Validate required fields
            if (
                !firstName ||
                !lastName ||
                !email ||
                !phoneNumber ||
                !dateOfBirth ||
                !gender ||
                !joiningDate ||
                !membershipType ||
                !membershipStartDate ||
                !membershipEndDate
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'All required fields must be provided.',
                });
            }

            // Create a new member
            const newMember = await prisma.member.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    dateOfBirth: new Date(dateOfBirth),
                    gender,
                    joiningDate: new Date(joiningDate),
                    membershipType,
                    membershipStartDate: new Date(membershipStartDate),
                    membershipEndDate: new Date(membershipEndDate),
                },
            });

            return res.status(201).json({
                success: true,
                message: 'Member added successfully.',
                data: newMember,
            });
        } catch (error: unknown) {
            console.error('Error adding member:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error. Please try again later.',
            });
        }
    }
    else if (req.method === 'GET') {
        try {
            const members = await prisma.member.findMany(
                {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        membershipEndDate: true,
                    },
                },
            );
            return res.status(200).json({
                success: true,
                message: 'Members retrieved successfully.',
                data: members,
            });
        } catch (error: unknown) {
            console.error('Error retrieving members:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error. Please try again later.',
            });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} Not Allowed`,
        });
    }
}