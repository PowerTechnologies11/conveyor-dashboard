import React from 'react';
import { Form, Input, Button, Checkbox, Card, Row, Col, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const LoginPage = ({ onLoginSuccess }) => {
    
    const loginBgColor = '#019eb8'; 
    const logoUrl = '/logo.png'; 
    
    const onFinish = (values) => {
        
        if (values.username === 'admin' && values.password === 'password') {
            onLoginSuccess(); 
        } else {
            alert('Login Fail: Wrong Username or Password');
        }
    };

    return (
        
        <Layout style={{ minHeight: '100vh', backgroundColor: loginBgColor }}>
            <Content>
                
                <Row 
                    justify="center" 
                    align="middle" 
                    style={{ 
                        minHeight: '100vh', 
                        padding: '24px'
                    }}
                >
                    <Col xs={24} sm={16} md={10} lg={8} xl={6}>
                        <Card 
                            bordered={false} 
                            style={{ 
                                borderRadius: '8px', 
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                width: '100%', 
                                height: 'auto' 
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                {}
                                <img 
                                    src={logoUrl} 
                                    alt="Company Logo" 
                                    style={{ width: '250px', height: 'auto', marginBottom: '16px' }} 
                                />
                                <Title level={4}>Login to your account</Title>
                                <p>Enter your credentials below</p>
                            </div>
                            <Form
                                name="normal_login"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Please Enter Your Username!' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="admin" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please Enter Your Password!' }]}
                                >
                                    <Input
                                        prefix={<LockOutlined />}
                                        type="password"
                                        placeholder="password"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Row justify="space-between">
                                        <Col>
                                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                                <Checkbox>Remember my login credentials</Checkbox>
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <a href="" onClick={(e) => e.preventDefault()}>
                                                Forgot password?
                                            </a>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default LoginPage;