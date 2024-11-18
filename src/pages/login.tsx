import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle, Nav } from 'reactstrap';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import Head from 'next/head';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      toast.error('Incorrect credentials. Please try again.');
    }
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container>
        <ToastContainer />
        <Nav className="justify-content-end mt-3">
          <button
            className="btn btn-outline-secondary ms-auto"
            onClick={handleSignupClick}
          >
            Sign up
          </button>
        </Nav>
        <Row className='login-container'>
          <Col md="6">
            <Card className="login-card">
              <CardBody>
                <CardTitle tag="h2" className="text-center">Login</CardTitle>
                <Form onSubmit={handleSubmit}>
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
                  <Button type="submit" color="primary" block>Login</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;