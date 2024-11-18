import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    Spinner,
} from 'reactstrap';
import Head from 'next/head';

interface Settings {
    id: number;
    monthlyMembership: number;
    quarterlyMembership: number;
    yearlyMembership: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

const fetchPricing = async (): Promise<Settings> => {
    const response = await axios.get<ApiResponse<Settings>>('/api/settings/pricing');
    if (response.data.success && response.data.data) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to fetch pricing.');
    }
};

const updatePricing = async (pricing: Settings): Promise<ApiResponse<Settings>> => {
    const response = await axios.put<ApiResponse<Settings>>('/api/settings/pricing', pricing);
    return response.data;
};

const SettingsPage: React.FC & { layout?: boolean } = () => {
    const { data, isLoading, isError, error } = useQuery<Settings, Error>({
        queryKey: ['pricing'],
        queryFn: fetchPricing,
    });
    const mutation = useMutation({
        mutationFn: updatePricing,
        onSuccess: () => {
            // Optionally refetch or show success message
        },
    });

    const [pricing, setPricing] = useState<Settings | null>(null);

    useEffect(() => {
        if (data) {
            setPricing(data);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPricing((prev) =>
            prev ? { ...prev, [name]: parseFloat(value) } : prev
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pricing) {
            mutation.mutate(pricing);
        }
    };

    if (isLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner color="primary" />
                <p>Loading pricing...</p>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container className="mt-5">
                <Alert color="danger">
                    {error.message || 'An error occurred while fetching pricing.'}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Settings</title>
            </Head>
            <Container className="mt-5">
                <h1>Settings</h1>
                {mutation.isError && (
                    <Alert color="danger">{(mutation.error as Error).message}</Alert>
                )}
                {mutation.isSuccess && (
                    <Alert color="success">Pricing updated successfully.</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="monthlyMembership">Monthly Membership ($)</Label>
                        <Input
                            type="number"
                            name="monthlyMembership"
                            id="monthlyMembership"
                            value={pricing?.monthlyMembership || ''}
                            onChange={handleChange}
                            required
                            min={0}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="quarterlyMembership">Quarterly Membership ($)</Label>
                        <Input
                            type="number"
                            name="quarterlyMembership"
                            id="quarterlyMembership"
                            value={pricing?.quarterlyMembership || ''}
                            onChange={handleChange}
                            required
                            min={0}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="yearlyMembership">Yearly Membership ($)</Label>
                        <Input
                            type="number"
                            name="yearlyMembership"
                            id="yearlyMembership"
                            value={pricing?.yearlyMembership || ''}
                            onChange={handleChange}
                            required
                            min={0}
                        />
                    </FormGroup>
                    <Button type="submit" color="primary" disabled={mutation.status === "pending"}>
                        {mutation.status === 'pending' ? <Spinner size="sm" /> : 'Update Pricing'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default SettingsPage;

SettingsPage.layout = true;