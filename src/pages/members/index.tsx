// pages/index.tsx

import React from 'react';
import { Table, Container, Button, Alert, Spinner } from 'reactstrap';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatDate } from '@/utils/formatDate';
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
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    emergencyContactName: string;
    emergencyContactPhoneNumber: string;
    emergencyContactRelationship: string;
    notes?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const fetchMembers = async (): Promise<Member[]> => {
    const response = await axios.get<ApiResponse<Member[]>>('/api/members');
    if (response.data.success) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to fetch members.');
    }
};

const Members: React.FC & { layout?: boolean } = () => {
    const router = useRouter();

    // Use React Query's useQuery hook to fetch members
    const {
        data: members,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Member[], Error>({
        queryKey: ['members'],
        queryFn: fetchMembers,
        // Refetch the data every time the window is focused
        refetchOnWindowFocus: true,
    });

    const onClickAddMember = () => {
        router.push('/members/add');
    };

    if (isLoading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner color="primary" />
                <p>Loading members...</p>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container className="mt-5">
                <Alert color="danger">
                    {error.message || 'An error occurred while fetching members.'}
                    <Button color="link" onClick={() => refetch()}>
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>All Member</title>
            </Head>
            <Container className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Members</h3>
                    <Button color="primary" onClick={onClickAddMember}>
                        Add Member
                    </Button>
                </div>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Membership End Date</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.map((member) => (
                            <tr key={member.id}>
                                <td>{`${member.firstName} ${member.lastName}`}</td>
                                <td>{formatDate(member.membershipEndDate)}</td>
                                <td>{member.phoneNumber}</td>
                                <td>{member.email}</td>
                                <td>
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => router.push(`/members/${member.id}`)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default Members;

Members.layout = true;