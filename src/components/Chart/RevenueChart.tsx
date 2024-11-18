// components/RevenueChart.tsx

import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
import dynamic from 'next/dynamic';
// import { Spinner, Alert } from 'reactstrap';

// Dynamically import ApexCharts to prevent SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// interface ApiResponse<T> {
//     success: boolean;
//     message: string;
//     data?: T;
// }

// interface MonthlyRevenue {
//     month: string;
//     revenue: number;
// }

// const fetchMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
//     const response = await axios.get<ApiResponse<MonthlyRevenue[]>>('/api/dashboard/monthly-revenue');
//     if (response.data.success && response.data.data) {
//         return response.data.data;
//     } else {
//         throw new Error(response.data.message || 'Failed to fetch monthly revenue.');
//     }
// };

const RevenueChart: React.FC = () => {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const revenues = [
        5000, 7000, 6000, 8000,
        9000, 7500, 8500, 9500,
        7000, 8000, 6500, 9000
    ];

    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        title: {
            text: 'Monthly Revenue',
            align: 'left',
        },
        xaxis: {
            categories: months,
            title: {
                text: 'Month',
            },
        },
        yaxis: {
            title: {
                text: 'Revenue ($)',
            },
        },
        dataLabels: {
            enabled: true,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            },
        },
        colors: ['#26A0FC'],
    };

    const series = [
        {
            name: 'Revenue',
            data: revenues,
        },
    ];

    return (
        <div id="revenue-chart">
            <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
        </div>
    );
};

export default RevenueChart;