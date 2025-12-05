// src/components/pages/UserPage.jsx 

import React from 'react';
import { Card, Typography, Space, Row, Col, List } from 'antd';
import { UserOutlined, MailOutlined, KeyOutlined, SettingOutlined } from '@ant-design/icons';
import { theme } from 'antd';

const { Title, Text } = Typography;

const userData = {
    username: 'Administrator',
    email: 'admin@powertechnologies.com',
    role: 'System Admin',
    lastLogin: '2025-12-04 10:00 AM'
};

const UserPage = () => {
    const { token: { colorPrimary } } = theme.useToken();
    
    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>User Profile</Title>
            
            <Row justify="center"> 

                <Col span={10} xs={24} md={10}> 
                    <Card title="Profile Information" style={{ border: 'none', textAlign: 'center' }}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            
                            <div style={{ paddingBottom: 16 }}>
                                <Row gutter={16} align="middle" justify="center">
                                    <Col><UserOutlined style={{ fontSize: 40, color: colorPrimary }} /></Col>
                                    <Col style={{ textAlign: 'left' }}>
                                        <Title level={4} style={{ margin: 0 }}>{userData.username}</Title>
                                        <Text type="secondary">{userData.role}</Text>
                                    </Col>
                                </Row>
                            </div>

                            <List
                                size="small"
                                itemLayout="horizontal"
                                style={{ textAlign: 'left', width: '100%' }}
                                dataSource={[
                                    { label: 'Email', value: userData.email, icon: <MailOutlined /> },
                                    { label: 'Role', value: userData.role, icon: <SettingOutlined /> },
                                    { label: 'Last Login', value: userData.lastLogin, icon: <KeyOutlined /> },
                                ]}
                                renderItem={item => (
                                    <List.Item style={{ padding: '8px 0', justifyContent: 'space-between' }}>
                                        <Text strong>
                                            <span style={{ marginRight: 8 }}>{item.icon}</span>
                                            {item.label}:
                                        </Text>
                                        <Text>{item.value}</Text>
                                    </List.Item>
                                )}
                            />
                        </Space>
                    </Card>
                </Col>

            </Row>
        </Space>
    );
};

export default UserPage;