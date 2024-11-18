// pages/members/[mid].tsx

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Spinner,
    Alert,
    Row,
    Col,
} from 'reactstrap';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { formatDateForInput } from '@/utils/formatDate';
import Head from 'next/head';

interface Member {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    joiningDate: string;
    membershipType: string;
    membershipStartDate: string;
    membershipEndDate: string;
    pricing: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface Pricing {
    monthly: number;
    quarterly: number;
    yearly: number;
    [key: string]: number; // Add this line
}

const fetchMember = async (id: number): Promise<Member> => {
    const response = await axios.get<ApiResponse<Member>>(`/api/members/${id}`);
    if (response.data.success) {
        if (response.data.data) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch member details.');
        }
    } else {
        throw new Error(response.data.message || 'Failed to fetch member details.');
    }
};

const updateMember = async (member: Member): Promise<ApiResponse<Member>> => {
    const response = await axios.put<ApiResponse<Member>>(`/api/members/${member.id}`, member);
    return response.data;
};

const MemberDetails: React.FC & { layout?: boolean } = () => {
    const router = useRouter();
    const { mid } = router.query;

    const [member, setMember] = useState<Member | null>(null);

    // Fetch member details
    const { data, isLoading, isError, error } = useQuery<Member, Error>({
        queryKey: ['member', mid],
        queryFn: () => fetchMember(Number(mid)),
        enabled: !!mid,
    });

    // Fetch pricing list from the settings API
    const {
        data: pricingData,
        isLoading: isPricingLoading,
        isError: isPricingError,
        error: pricingError,
    } = useQuery<ApiResponse<Pricing>, Error>(
        {
            queryKey: ['pricing-list'],
            queryFn: async () => {
                // Ensure the endpoint matches the one used in add.tsx
                const response = await axios.get<ApiResponse<Pricing>>('/api/settings/pricing-list');
                if (response.data.success && response.data.data) {
                    return response.data;
                } else {
                    throw new Error(response.data.message || 'Failed to fetch pricing list.');
                }
            },
            staleTime: Infinity,
        }
    );

    // Initialize member state when data is fetched
    useEffect(() => {
        if (data) {
            setMember(data);
        }
    }, [data]);

    // Update pricing based on membership type when both member and pricingData are available
    useEffect(() => {
        if (member && pricingData?.data) {
            const membershipTypeKey = member.membershipType.toLowerCase();
            const newPricing = pricingData.data[membershipTypeKey] || 0;
            setMember((prev) => {
                if (!prev) return prev;
                // Only update pricing if it doesn't match the expected value
                if (prev.pricing !== newPricing) {
                    return { ...prev, pricing: newPricing };
                }
                return prev;
            });
        }
    }, [member?.membershipType, pricingData?.data, member]);

    const mutation = useMutation<ApiResponse<Member>, Error, Member>({
        mutationFn: updateMember,
        onSuccess: (data: ApiResponse<Member>) => {
            if (data.success) {
                toast.success("Member updated successfully!");
                router.push('/members');
            } else {
                toast.error(data.message || 'Failed to update member.');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update member.');
        },
    });

    // Function to calculate the membership end date based on type
    const calculateEndDate = (startDate: string, membershipType: string): string => {
        const durationMap: { [key: string]: number } = {
            Monthly: 1,
            Quarterly: 3,
            Yearly: 12,
        };

        const duration = durationMap[membershipType] || 0;
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + duration);

        // Handle month overflow (e.g., adding 1 month to January 31)
        if (end.getDate() !== start.getDate()) {
            end.setDate(0); // Set to last day of the previous month
        }

        // Format end date to YYYY-MM-DD
        return end.toISOString().split('T')[0];
    };

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!member) return;

        const { name, value } = e.target;

        setMember((prev) => {
            if (!prev) return prev;
            const updatedMember = { ...prev, [name]: value };

            // If the membership type is changed and pricing data is available
            if (name === 'membershipType' && pricingData?.data) {
                const membershipTypeKey = value.toLowerCase();
                const selectedPrice = pricingData.data[membershipTypeKey] || 0;
                updatedMember.pricing = selectedPrice;

                // If the membership start date is already selected, update the end date
                if (updatedMember.membershipStartDate) {
                    updatedMember.membershipEndDate = calculateEndDate(
                        updatedMember.membershipStartDate,
                        value
                    );
                } else {
                    updatedMember.membershipEndDate = '';
                }
            }

            // If the membership start date is changed, update the end date based on the selected membership type
            if (name === 'membershipStartDate' && updatedMember.membershipType) {
                updatedMember.membershipEndDate = calculateEndDate(
                    value,
                    updatedMember.membershipType
                );
            }

            return updatedMember;
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (member) {
            mutation.mutate(member);
        }
    };

    if (isLoading || isPricingLoading || !member) {
        return (
            <Container className="mt-5 text-center">
                <Spinner color="primary" />
                <p>Loading...</p>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container className="mt-5">
                <Alert color="danger">
                    {error.message || 'An error occurred while fetching member details.'}
                </Alert>
            </Container>
        );
    }

    if (isPricingError) {
        return (
            <Container className="mt-5">
                <Alert color="danger">
                    {pricingError.message || 'An error occurred while fetching pricing data.'}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Member Details</title>
            </Head>
            <Container className="mt-5">
                <h1>Edit Member</h1>
                {mutation.isError && <Alert color="danger">{mutation.error.message}</Alert>}
                {mutation.isSuccess && <Alert color="success">Member updated successfully!</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* First Name */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    value={member.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    value={member.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={member.email}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {/* Phone Number */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="phoneNumber">Phone Number</Label>
                                <Input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={member.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        {/* Date of Birth */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="dateOfBirth">Date of Birth</Label>
                                <Input
                                    type="date"
                                    name="dateOfBirth"
                                    id="dateOfBirth"
                                    value={member ? formatDateForInput(member.dateOfBirth) : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        {/* Gender */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="gender">Gender</Label>
                                <Input
                                    type="select"
                                    name="gender"
                                    id="gender"
                                    value={member.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {/* Membership Type */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="membershipType">Membership Type</Label>
                                <Input
                                    type="select"
                                    name="membershipType"
                                    id="membershipType"
                                    value={member.membershipType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Membership Type</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                </Input>
                            </FormGroup>
                        </Col>

                        {/* Membership Start Date */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="membershipStartDate">Membership Start Date</Label>
                                <Input
                                    type="date"
                                    name="membershipStartDate"
                                    id="membershipStartDate"
                                    value={member ? formatDateForInput(member.membershipStartDate) : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>

                        {/* Membership End Date */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="membershipEndDate">Membership End Date</Label>
                                <Input
                                    type="date"
                                    name="membershipEndDate"
                                    id="membershipEndDate"
                                    value={member ? formatDateForInput(member.membershipEndDate) : ''}
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        {/* Pricing (Disabled) */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="pricing">Pricing ($)</Label>
                                <Input
                                    type="number"
                                    name="pricing"
                                    id="pricing"
                                    value={member.pricing}
                                    disabled
                                />
                            </FormGroup>
                        </Col>

                        {/* Joining Date */}
                        <Col md="4">
                            <FormGroup>
                                <Label for="joiningDate">Joining Date</Label>
                                <Input
                                    type="date"
                                    name="joiningDate"
                                    id="joiningDate"
                                    value={member ? formatDateForInput(member.joiningDate) : ''}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Button type="submit" color="primary" disabled={mutation.status === 'pending'}>
                        {mutation.status === 'pending' ? <Spinner size="sm" /> : 'Update'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default MemberDetails;
MemberDetails.layout = true;