// src/components/pages/ConveyorSummaryPage.jsx 
import React from 'react';
import { Card, Typography, Space, Table, Tag, Button, theme } from 'antd';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import { rollerList, frameSummaryData, getRollerHealth } from '../../data/dummyData'; 

const { Title } = Typography;

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return 'Normal';
};

const ConveyorSummaryPage = ({ setActiveKey, setSelectedRoller }) => {
    const { token: { colorInfo } } = theme.useToken();
    
    const columns = [
        { title: 'Site', dataIndex: 'site', key: 'site' },
        { title: 'Conveyor', dataIndex: 'conveyor', key: 'conveyor' },
        { title: 'Roller Name', dataIndex: 'rollerName', key: 'rollerName' },
        { title: 'Sensor ID', dataIndex: 'sensorId', key: 'sensorId' },
        { title: 'Runtime (Days)', dataIndex: 'runtimeDays', key: 'runtimeDays' },
        { 
            title: 'Status', 
            dataIndex: 'health', 
            key: 'health',
            render: (health) => {
                const displayStatus = mapHealthStatus(health.status);
                const statusLabel = health.status === 'OFFLINE' ? 'Offline' : displayStatus;
                
                return (
                    <Tag color={health.color} key={health.status}>
                        {statusLabel}
                    </Tag>
                );
            }
        },
        { 
            title: 'Temp (°C)', 
            dataIndex: 'health',
            key: 'temp',
            render: (health) => (health.temp === null ? '-' : `${health.temp}°C`)
        },
        { 
            title: 'RPM', 
            dataIndex: 'health', 
            key: 'rpm',
            render: (health) => (health.rpm === null ? '-' : health.rpm)
        },
        { 
            title: '', 
            key: 'action', 
            render: (_, record) => (
                <Button 
                    type="primary" 
                    size="small"
                    disabled={record.isOnline === false}
                    onClick={() => { 
                        setSelectedRoller(record);
                        setActiveKey('detailedRoller');
                    }}
                >
                    View
                </Button>
            ),
        },
    ];

    const rollersWithHealth = rollerList.map(r => ({ ...r, health: getRollerHealth(r) }));

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>Sensor Status & Data</Title>
            
            <Title level={5}>All Sensor Real-time Data & Health Status</Title>
            <Card bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={rollersWithHealth} 
                    pagination={false} 
                    size="middle" 
                    scroll={{ x: 'max-content' }}
                />
            </Card>

        </Space>
    );
};

export default ConveyorSummaryPage;