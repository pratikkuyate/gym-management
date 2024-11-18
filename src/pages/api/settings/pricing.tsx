// pages/api/settings/pricing.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<{ monthlyMembership: number; quarterlyMembership: number; yearlyMembership: number }>>
) {
    if (req.method === 'GET') {
        try {
            let settings = await prisma.settings.findFirst();
            if (!settings) {
                settings = await prisma.settings.create({
                    data: {
                        monthlyMembership: 700,
                        quarterlyMembership: 2000,
                        yearlyMembership: 8000,
                    },
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Pricing fetched successfully.',
                data: settings,
            });
        } catch (error: unknown) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch pricing.',
            });
        }
    } else if (req.method === 'PUT') {
        try {
            const { monthlyMembership, quarterlyMembership, yearlyMembership } = req.body;
            const settings = await prisma.settings.findFirst();
            if (!settings) {
                return res.status(404).json({ success: false, message: 'Settings not found.' });
            }
            const updatedSettings = await prisma.settings.update({
                where: { id: settings.id },
                data: { monthlyMembership, quarterlyMembership, yearlyMembership },
            });
            return res.status(200).json({
                success: true,
                message: 'Pricing updated successfully.',
                data: updatedSettings,
            });
        } catch (error: unknown) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update pricing.',
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} Not Allowed`,
        });
    }
}