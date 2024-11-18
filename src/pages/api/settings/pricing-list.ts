// pages/api/pricing-list.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface Pricing {
    monthly: number;
    quarterly: number;
    yearly: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<Pricing>>
) {
    if (req.method === 'GET') {
        try {
            const settings = await prisma.settings.findFirst();

            if (settings) {
                const pricing: Pricing = {
                    monthly: settings.monthlyMembership,
                    quarterly: settings.quarterlyMembership,
                    yearly: settings.yearlyMembership,
                };

                res.status(200).json({
                    success: true,
                    message: 'Pricing list fetched successfully.',
                    data: pricing,
                });
            } else {
                // Return default pricing if settings are not found
                const defaultPricing: Pricing = {
                    monthly: 700,
                    quarterly: 2000,
                    yearly: 8000,
                };

                res.status(200).json({
                    success: true,
                    message: 'Default pricing returned.',
                    data: defaultPricing,
                });
            }
        } catch (error) {
            console.error('Error fetching pricing list:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
            success: false,
            message: `Method ${req.method} Not Allowed`,
        });
    }
}