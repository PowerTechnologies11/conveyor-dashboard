// src/components/pages/ActiveAlertsPage.jsx 
import React, { useMemo } from 'react';
import { Card, Typography, Space, List, Tag, theme, Button } from 'antd';
import { currentKPIs, rollerList, getRollerHealth } from '../../data/dummyData'; 
import { ScheduleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return status;
};

const ActiveAlertsPage = () => {
    const { token: { colorError, colorPrimary } } = theme.useToken();
    
    const sortedAlerts = useMemo(() => {
        const dataWithHealth = rollerList.map(r => ({ ...r, health: getRollerHealth(r) }));
        
        const allAlertingRollers = dataWithHealth.filter(r => 
            r.health.status === 'DANGER' || r.health.status === 'WARNING'
        );
        
        const sorted = allAlertingRollers.sort((a, b) => {
            if (a.health.status === 'DANGER' && b.health.status !== 'DANGER') return -1;
            if (b.health.status === 'DANGER' && a.health.status !== 'DANGER') return 1;
            return 0;
        });

        return sorted;

    }, [rollerList]);

    const totalAlerts = sortedAlerts.length;

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>Active Alerts List</Title>

            <Title level={4} style={{ color: colorError }}>All Alarms: {totalAlerts}</Title>
            
            <Card>
                {totalAlerts > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={sortedAlerts} 
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={`Roller ${item.rollerName} (Sensor ID: ${item.sensorId}) - ${mapHealthStatus(item.health.status)}`}
                                    description={item.health.alertType.map(alert => (
                                        <Tag color={item.health.color} key={alert}>{alert}</Tag>
                                    )) || null}
                                />
                                <Space>
                                    <Tag color="geekblue">Temp: {item.temp === null ? '-' : `${item.temp}°C`}</Tag>
                                    <Tag color="purple">RPM: {item.rpm === null ? '-' : item.rpm}</Tag>
                                    
                                </Space>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>Congratulations! There are currently no active alarm detected.</p>
                )}
            </Card>
        </Space>
    );           
};

export default ActiveAlertsPage;