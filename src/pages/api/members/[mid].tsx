// pages/api/members/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Member } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<Member>>
) {
    const { mid } = req.query;

    if (req.method === 'GET') {
        try {
            const member = await prisma.member.findUnique({
                where: {
                    id: Number(mid),
                },
            });

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found.',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Member fetched successfully.',
                data: member,
            });
        } catch (error: unknown) {
            console.error('Error fetching member:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error. Please try again later.',
            });
        }
    }
    else if (req.method === 'PUT') {

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

            const member = await prisma.member.update({
                where: {
                    id: Number(mid),
                },
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

            return res.status(200).json({
                success: true,
                message: 'Member updated successfully.',
                data: member,
            });
        } catch (error: unknown) {
            console.error('Error updating member:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error. Please try again later.',
            });
        }

    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} Not Allowed`,
        });
    }
}