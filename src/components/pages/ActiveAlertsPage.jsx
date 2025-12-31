// src/components/pages/ActiveAlertsPage.jsx 
import React, { useMemo, useState } from 'react';
import { Card, Typography, Space, List, Tag, theme, Button, Popconfirm, message, Tooltip } from 'antd';
import { rollerList, getRollerHealth } from '../../data/dummyData'; 
import { CheckCircleOutlined, SoundOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return status;
};

const ActiveAlertsPage = () => {
    const { token: { colorError, colorSuccess } } = theme.useToken();
    
    // --- 1. 新增状态：存储已经被 Acknowledge (确认) 掉的传感器 ID ---
    const [ackedIds, setAckedIds] = useState([]);

    // --- 2. 处理确认动作 ---
    const handleAcknowledge = (id) => {
        // 将 ID 加入到已确认数组中
        setAckedIds(prev => [...prev, id]);
        message.success(`Alert for Sensor ${id} acknowledged.`);
    };

    const sortedAlerts = useMemo(() => {
        const dataWithHealth = rollerList.map(r => ({ ...r, health: getRollerHealth(r) }));
        
        // --- 3. 修改过滤逻辑：只保留 (报警状态) 且 (未被确认) 的设备 ---
        const allAlertingRollers = dataWithHealth.filter(r => 
            (r.health.status === 'DANGER' || r.health.status === 'WARNING') &&
            !ackedIds.includes(r.sensorId) // 关键：如果 ID 在已确认列表中，则隐藏
        );
        
        const sorted = allAlertingRollers.sort((a, b) => {
            if (a.health.status === 'DANGER' && b.health.status !== 'DANGER') return -1;
            if (b.health.status === 'DANGER' && a.health.status !== 'DANGER') return 1;
            return 0;
        });

        return sorted;

    }, [ackedIds]); // 依赖项加入 ackedIds，当它变化时重新计算列表

    const totalAlerts = sortedAlerts.length;

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>Active Alerts List</Title>
            </div>

            <Card style={{ borderTop: `4px solid ${totalAlerts > 0 ? colorError : colorSuccess}` }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0, color: totalAlerts > 0 ? colorError : colorSuccess }}>
                        <SoundOutlined /> Current Active Alarms: {totalAlerts}
                    </Title>
                </div>

                {totalAlerts > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={sortedAlerts} 
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    // --- 4. 新增 Acknowledge 按钮 (带确认气泡) ---
                                    <Popconfirm
                                        key="ack"
                                        title="Acknowledge Alert"
                                        description="Are you sure you want to dismiss this alert?"
                                        onConfirm={() => handleAcknowledge(item.sensorId)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Tooltip title="Acknowledge & Dismiss">
                                            <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} success />
                                            {/* 为了更明显，可以用文字按钮 */}
                                            {/* <Button type="link" icon={<CheckCircleOutlined />}>Acknowledge</Button> */}
                                        </Tooltip>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            <Text strong>{item.rollerName}</Text>
                                            <Tag>{`ID: ${item.sensorId}`}</Tag>
                                            <Tag color={item.health.color}>{mapHealthStatus(item.health.status)}</Tag>
                                        </Space>
                                    }
                                    description={
                                        <div style={{ marginTop: 8 }}>
                                            {item.health.alertType.map(alert => (
                                                <Tag color="red" key={alert}>{alert}</Tag>
                                            ))}
                                        </div>
                                    }
                                />
                                
                            </List.Item>
                        )}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <CheckCircleOutlined style={{ fontSize: 48, color: colorSuccess, marginBottom: 16 }} />
                        <Title level={4}>All Systems Normal</Title>
                        <Text type="secondary">No active alerts detected or all alerts have been acknowledged.</Text>
                    </div>
                )}
            </Card>
        </Space>
    );         
};

export default ActiveAlertsPage;