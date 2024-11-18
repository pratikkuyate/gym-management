import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import RevenueChart from '@/components/Chart/RevenueChart';

const Dashboard: React.FC & { layout?: boolean } = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn();
        }
    }, [status]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        return <p>Redirecting to login...</p>;
    }

    return (
        <div>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Container className="mt-5">
                <Row className="mt-4">
                    {/* Active Members Card */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card body>
                            <CardBody>
                                <CardTitle tag="h5">Active Members</CardTitle>
                                <CardText tag="h2">50</CardText>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Total Members Card */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card body>
                            <CardBody>
                                <CardTitle tag="h5">Total Members</CardTitle>
                                <CardText tag="h2">80</CardText>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* Revenue Card */}
                    <Col md="4" sm="12" className="mb-4">
                        <Card body>
                            <CardBody>
                                <CardTitle tag="h5">Revenue</CardTitle>
                                <CardText tag="h2">$ 150000</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md="12">
                        <RevenueChart />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default Dashboard;
Dashboard.layout = true;

