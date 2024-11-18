import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle, Nav } from 'reactstrap';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
            }),
        });

        if (response.ok) {
            // Sign in the user
            await signIn('credentials', { redirect: false, email, password });
            // Redirect to the dashboard
            router.push('/dashboard');
        } else {
            const errorData = await response.json();
            console.error('Sign-up failed:', errorData.error);
        }
    };

    const handleLoginClick = () => {
        router.push('/login');
    };

    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>
            <Container>
                <Nav className="justify-content-end mt-3">
                    <button
                        className="btn btn-outline-secondary ms-auto"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                </Nav>
                <Row className='login-container'>
                    <Col md="6">
                        <Card>
                            <CardBody>
                                <CardTitle tag="h2" className="text-center">Sign Up</CardTitle>
                                <Form onSubmit={handleSubmit}>

                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="firstName">First Name</Label>
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="Enter your first name"
                                                    className="input-field"
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="lastName">Last Name</Label>
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Enter your last name"
                                                    className="input-field"
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input-field"
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="confirmPassword">Confirm Password</Label>
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            placeholder="Confirm your password"
                                            className="input-field"
                                        />
                                    </FormGroup>
                                    <Button type="submit" color="primary" block className="submit-button">Sign Up</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Signup;