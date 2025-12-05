// src/components/pages/DashboardPage.jsx 

import React from 'react';
import { Card, Row, Col, Typography, Space, theme } from 'antd';
import { conveyorKPIs, currentKPIs, HEALTH_THRESHOLDS } from '../../data/dummyData'; 
import { AlertOutlined, FireOutlined, LikeOutlined, DislikeOutlined, WarningOutlined } from '@ant-design/icons';
import GifConveyorMap from '../GifConveyorMap'; 

const { Title } = Typography;

const DashboardPage = ({ setActiveKey, setSelectedRoller }) => {
    const { token: { colorError, colorWarning, colorSuccess, colorPrimary } } = theme.useToken();
    
    const renderKpiCard = (title, value, unit, icon, color) => (
        <Col span={6} xs={24} sm={12} md={6}>
            <Card 
                style={{ 
                    textAlign: 'left', 
                    backgroundColor: color, 
                    color: 'white', 
                    border: 'none',
                    boxShadow: `0 4px 12px ${color}77`,
                    minHeight: 120
                }}
            >
                <div style={{ float: 'right', background: 'white', borderRadius: 8, padding: 8, color: color, fontSize: 24 }}>
                    {icon}
                </div>
                <p style={{ color: 'white', margin: 0, opacity: 0.8 }}>{title}</p>
                <Title level={2} style={{ color: 'white', margin: '8px 0 0 0' }}>
                    {value} <span style={{ fontSize: 16, opacity: 0.8 }}>{unit}</span>
                </Title>
            </Card>
        </Col>
    );

    const maxTemp = Math.max(conveyorKPIs['Conveyor X'].maxTemp, conveyorKPIs['Conveyor Y'].maxTemp);
    const totalRollers = currentKPIs.totalRollers;
    const totalOnline = currentKPIs.totalRollers - currentKPIs.totalOffline;
    const avgTempSite = ((parseFloat(conveyorKPIs['Conveyor X'].avgTemp) + parseFloat(conveyorKPIs['Conveyor Y'].avgTemp)) / 2).toFixed(1);

    const handleMapNavigation = (roller) => {
        if (setSelectedRoller) {
            setSelectedRoller(roller);
        }
        if (setActiveKey) {
            setActiveKey('detailedRoller');
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>Home & KPIs - System Overview</Title>
            
            <Title level={4}>Site Health Summary</Title>
            
            <Row gutter={[16, 16]}>
                {renderKpiCard(
                    'Total Alarmed', 
                    currentKPIs.totalDangerAlerts, 
                    'Sensors', 
                    <FireOutlined />, 
                    colorError 
                )}

                {renderKpiCard(
                    'Total Pre-Alarm', 
                    currentKPIs.totalWarningAlerts, 
                    'Sensors', 
                    <WarningOutlined />, 
                    colorWarning 
                )}
                
                 {renderKpiCard(
                    'Sensors Online', 
                    totalOnline, 
                    'Sensors', 
                    <LikeOutlined />, 
                    colorSuccess
                )}

                 {renderKpiCard(
                    'Sensors Offline', 
                    currentKPIs.totalOffline, 
                    'Sensors', 
                    <DislikeOutlined />, 
                    '#546E7A' 
                )}
            </Row>

            <Title level={4} style={{ marginTop: 40 }}>Real-time Health Map</Title>
            <GifConveyorMap handleNavigate={handleMapNavigation} />
            
        </Space>
    );
};

export default DashboardPage;