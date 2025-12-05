// src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Row, Col, Typography, Space } from 'antd';
import { 
    DashboardOutlined, AlertOutlined, LogoutOutlined, ContainerOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { ScheduleOutlined } from '@ant-design/icons';

import DashboardPage from './pages/DashboardPage';         
import ConveyorSummaryPage from './pages/ConveyorSummaryPage'; 
import DetailedRollerPage from './pages/DetailedRollerPage';  
import ActiveAlertsPage from './pages/ActiveAlertsPage'; 
import UserPage from './pages/UserPage';


const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout = ({ onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeKey, setActiveKey] = useState('DashboardPage'); 
    const [selectedRoller, setSelectedRoller] = useState(null); 
    const { token: { colorBgContainer, colorPrimary, colorInfo } } = theme.useToken();
    
    const SIDER_BG_COLOR = colorInfo; 

    const items = [
        { key: 'Home', icon: <HomeOutlined /> }, 
        { key: 'Sensor Status', icon: <DashboardOutlined /> }, 
        { key: 'Active Alerts List', icon: <AlertOutlined /> }, 
        { key: 'User Profile', icon:<UserOutlined />},
        { key: 'detailedRoller', isHidden: true } 
    ];

    const handleMenuClick = ({ key }) => {
        if (key === 'Logout') {
            onLogout();
        } else {
            setActiveKey(key);
            if (key !== 'detailedRoller') {
                setSelectedRoller(null); 
            }
        }
    };
    
    const renderContent = () => {
        switch (activeKey) {
            case 'Sensor Status':
                return <ConveyorSummaryPage setActiveKey={setActiveKey} setSelectedRoller={setSelectedRoller} />;
            case 'detailedRoller':
                return <DetailedRollerPage selectedRoller={selectedRoller} />;
            case 'Active Alerts List':
                return <ActiveAlertsPage />;
            case 'User Profile':
                return <UserPage />;
            case 'DashboardPage & KPIs':
            default:
                return <DashboardPage setActiveKey={setActiveKey} 
                setSelectedRoller={setSelectedRoller}
                />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed} 
                width={250}
                style={{ backgroundColor: SIDER_BG_COLOR }}
            >
                <div style={{ 
                    height: 64, 
                    margin: 16, 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: collapsed ? 'center' : 'flex-start', 
                    padding: collapsed ? 0 : '0 16px',
                    borderRadius: 4
                }}>
                     <img 
                        src="/small logo.png" 
                        alt="Logo" 
                        style={{ height: collapsed ? '30px' : '40px' }} 
                    />
                    {!collapsed && <span style={{ color: 'white', marginLeft: 10, fontSize: 18, fontWeight: 'bold' }}>Dashboard</span>}
                </div>
                <Menu
                    theme="dark" 
                    mode="inline"
                    selectedKeys={[activeKey]}
                    onClick={handleMenuClick}
                    items={items.filter(item => !item.isHidden).map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: item.key, 
                    }))}
                    style={{ backgroundColor: SIDER_BG_COLOR }} 
                />
                 {/* 退出登录按钮 - 保持在底部 */}
                <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: 16 }}>
                    <Button
                        type="default"
                        icon={<LogoutOutlined />}
                        onClick={onLogout}
                        block={!collapsed}
                        style={{ width: collapsed ? '40px' : 'calc(100% - 32px)', color: colorPrimary, borderColor: colorPrimary }}
                    >
                        {!collapsed && 'Logout'}
                    </Button>
                </div>
            </Sider>
            
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{ fontSize: '16px', width: 64, height: 64 }}
                            />
                        </Col>
                        <Col style={{ paddingRight: 24 }}>
                            <Space>
                                <UserOutlined />
                                <Typography.Text strong>Admin</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, overflow: 'auto' }}>
                    {renderContent()}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    {new Date().getFullYear()} © Power Technologies Convey Roller Belt Sensor Dashboard
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;