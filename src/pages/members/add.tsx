import React, { useState } from 'react';
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col,
    Alert,
    Spinner,
} from 'reactstrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
// import { API_BASE_URL } from '@/utils/constants';

interface Member {
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
    pricing?: number;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

interface Pricing {
    monthly: number;
    quarterly: number;
    yearly: number;
}

const addMember = async (member: Member): Promise<ApiResponse> => {
    const response = await axios.post(`/api/members`, member);
    return response.data as ApiResponse;
};

const AddMember: React.FC & { layout?: boolean } = () => {
    const [member, setMember] = useState<Member>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        joiningDate: '',
        membershipType: '',
        membershipStartDate: '',
        membershipEndDate: '',

    });

    const {
        data: pricingData,
        isLoading: isPricingLoading,
        isError: isPricingError,
        error: pricingError,
    } = useQuery<ApiResponse<Pricing>, Error>({
        queryKey: ['pricing-list'],
        queryFn: async () => {
            const response = await axios.get<ApiResponse<Pricing>>('/api/settings/pricing-list');
            if (response.data.success && response.data.data) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch pricing list.');
            }
        },
        staleTime: Infinity,
    });

    const mutation = useMutation<ApiResponse, Error, Member, unknown>({
        mutationFn: addMember,
        onSuccess: (data: ApiResponse) => {
            if (data.success) {
                setMember({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    gender: '',
                    joiningDate: '',
                    membershipType: '',
                    membershipStartDate: '',
                    membershipEndDate: '',

                });
            } else {
                alert(data.message);
            }
        },
        onError: (error: Error) => {
            alert(error.message || 'Failed to add member.');
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMember((prev) => {
            const updatedMember = { ...prev, [name]: value };

            // If membershipType changes, update pricing
            if (name === 'membershipType' && pricingData?.data) {
                const membershipTypeKey = value.toLowerCase() as keyof Pricing;
                const selectedPrice = pricingData.data[membershipTypeKey] || 0;
                updatedMember.pricing = selectedPrice;

                // If membershipStartDate is already selected, update membershipEndDate
                if (updatedMember.membershipStartDate) {
                    updatedMember.membershipEndDate = calculateEndDate(
                        updatedMember.membershipStartDate,
                        value
                    );
                } else {
                    updatedMember.membershipEndDate = '';
                }
            }

            // If membershipStartDate changes, update membershipEndDate based on selected membershipType
            if (name === 'membershipStartDate' && updatedMember.membershipType) {
                updatedMember.membershipEndDate = calculateEndDate(
                    value,
                    updatedMember.membershipType
                );
            }

            return updatedMember;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(member);
    };

    if (isPricingLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner color="primary" />
                <p>Loading pricing...</p>
            </Container>
        );
    }

    if (isPricingError) {
        return (
            <Container className="mt-5">
                <Alert color="danger">
                    {pricingError.message || 'An error occurred while fetching pricing.'}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Add Member</title>
            </Head>
            <Container className="mt-5">
                <h1>Add Member</h1>
                {mutation.isError && <Alert color="danger">{mutation.error.message}</Alert>}
                {mutation.isSuccess && <Alert color="success">Member added successfully!</Alert>}
                <Form onSubmit={handleSubmit}>

                    <Row>
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
                        <Col md="4">
                            <FormGroup>
                                <Label for="dateOfBirth">Date of Birth</Label>
                                <Input
                                    type="date"
                                    name="dateOfBirth"
                                    id="dateOfBirth"
                                    value={member.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
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
                        <Col md="4">
                            <FormGroup>
                                <Label for="joiningDate">Joining Date</Label>
                                <Input
                                    type="date"
                                    name="joiningDate"
                                    id="joiningDate"
                                    value={member.joiningDate}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
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
                        <Col md="4">
                            <FormGroup>
                                <Label for="membershipStartDate">Membership Start Date</Label>
                                <Input
                                    type="date"
                                    name="membershipStartDate"
                                    id="membershipStartDate"
                                    value={member.membershipStartDate}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <Label for="membershipEndDate">Membership End Date</Label>
                                <Input
                                    type="date"
                                    name="membershipEndDate"
                                    id="membershipEndDate"
                                    value={member.membershipEndDate}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                        </Col>

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

                    </Row>
                    <Button type="submit" color="primary" disabled={mutation.status === 'pending'}>
                        {mutation.status === 'pending' ? <Spinner size="sm" /> : 'Add Member'}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AddMember;

AddMember.layout = true;