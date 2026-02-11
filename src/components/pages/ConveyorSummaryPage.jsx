// src/components/pages/ConveyorSummaryPage.jsx
import React from 'react';
import { Card, Typography, Space, Table, Tag, Button, Tabs } from 'antd';
import { rollerList, getRollerHealth } from '../../data/dummyData'; 
import { ThunderboltOutlined, DashboardOutlined, WifiOutlined, ShakeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return 'Normal';
};

const ConveyorSummaryPage = ({ setActiveKey, setSelectedRoller }) => {
    
    const dataWithHealth = rollerList.map(r => ({ ...r, health: getRollerHealth(r) }));
    const vibrationSensors = dataWithHealth.filter(r => r.type === 'VIBRATION');
    const rpmSensors = dataWithHealth.filter(r => r.type === 'RPM');

    const renderStatus = (_, record) => (
        <Tag color={record.health.color}>{record.isOnline ? mapHealthStatus(record.health.status) : 'Offline'}</Tag>
    );
    const renderAction = (_, record) => (
        <Button 
            type="primary" size="small" disabled={!record.isOnline}
            
            onClick={() => { setSelectedRoller(record); setActiveKey('detailedRoller'); }}
        >
            View Details
        </Button>
    );

    const vibrationColumns = [
        { title: 'ID', dataIndex: 'sensorId', key: 'id', width: 100, fixed: 'left' },
        { title: 'Name', dataIndex: 'rollerName', key: 'name' },
        { title: 'Status', key: 'status', render: renderStatus, width: 100 },
        { title: 'Temp', dataIndex: 'temp', key: 'temp', width: 100, render: (v, r) => r.isOnline ? `${v}°C` : '-' },
        { title: 'Voltage', dataIndex: 'voltage', key: 'voltage', width: 100, render: (v, r) => r.isOnline ? `${v}V` : '-' },
        { title: 'Action', key: 'action', fixed: 'right', width: 120, render: renderAction },
    ];

    const rpmColumns = [
        { title: 'ID', dataIndex: 'sensorId', key: 'id', width: 100, fixed: 'left' },
        { title: 'Name', dataIndex: 'rollerName', key: 'name' },
        { title: 'Status', key: 'status', render: renderStatus, width: 100 },
        { title: 'Temp', dataIndex: 'temp', key: 'temp', width: 100, render: (v, r) => r.isOnline ? `${v}°C` : '-' },
        { title: 'Speed', dataIndex: 'rpm', key: 'rpm', width: 120, render: (v, r) => r.isOnline ? `${v} RPM` : '-' },
        { title: 'Action', key: 'action', fixed: 'right', width: 120, render: renderAction },
    ];

    const items = [
        { key: '1', label: <span><ShakeOutlined/> Vibration ({vibrationSensors.length})</span>, children: <Table columns={vibrationColumns} dataSource={vibrationSensors} rowKey="id" /> },
        { key: '2', label: <span><DashboardOutlined /> Temperature & RPM ({rpmSensors.length})</span>, children: <Table columns={rpmColumns} dataSource={rpmSensors} rowKey="id" /> },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>Sensor Status Overview</Title>
            <Card bodyStyle={{ padding: '10px 24px' }}>
                <Tabs defaultActiveKey="1" items={items} size="large" />
            </Card>
        </Space>
    );
};

export default ConveyorSummaryPage;