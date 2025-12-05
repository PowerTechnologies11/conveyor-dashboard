// src/components/GifConveyorMap.jsx 

import React from 'react';
import { Popover, Card, Tag, Typography, Button, Space, theme } from 'antd';
import { FireOutlined, ReloadOutlined } from '@ant-design/icons';
import { rollerList, getRollerHealth } from '../data/dummyData';

const { Text, Title } = Typography;

const ROLLER_POSITIONS_MAP = {
    '100001': { top: '68%', left: '17.5%' }, 
    '100002': { top: '65%', left: '23.5%' }, 
    '100003': { top: '62.5%', left: '29%' }, 
    '100004': { top: '59%', left: '35.5%' }, 
    '100005': { top: '53%', left: '47.5%' },
    '100006': { top: '50%', left: '54%' },
    '100007': { top: '47%', left: '60%' },
    '100008': { top: '44%', left: '65.5%' },
    '100009': { top: '41%', left: '71%' },
    '100010': { top: '38%', left: '76%' },
    '100011': { top: '56%', left: '42%' }, 
    '100012': { top: '31.5%', left: '78%' }, 

    '100013': { top: '72%', left: '14%' },
    '100014': { top: '66%', left: '27%' },
    '100015': { top: '59%', left: '39%' },
    '100016': { top: '54%', left: '51.5%' },
    '100017': { top: '48%', left: '64%' },
    '100018': { top: '43%', left: '73%' },
    '100019': { top: '40%', left: '79%' },
    '100020': { top: '36.5%', left: '83%' }, 
};

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return status; 
};


const GifConveyorMap = ({ handleNavigate }) => { 
    const { token: { colorPrimary, colorBgContainer } } = theme.useToken();
    
    const rollersData = rollerList.map(r => ({ 
        ...r, 
        health: getRollerHealth(r), 
        positionStyle: ROLLER_POSITIONS_MAP[r.sensorId] 
    }));

    const renderPopoverContent = (roller) => {
        const isOffline = roller.health.status === 'OFFLINE';
        
        return (
            <Space direction="vertical" size={5}>
                <Text strong style={{ color: colorPrimary }}>Roller: {roller.rollerName} (Sensor: {roller.sensorId})</Text>
                <Tag color={roller.health.color}>{mapHealthStatus(roller.health.status)}</Tag>
                <Text>Conveyor: {roller.conveyor}</Text>
                
                <Text><FireOutlined /> Temp: {isOffline ? '-' : `${roller.temp}°C`}</Text>
                <Text><ReloadOutlined /> RPM: {isOffline ? '-' : roller.rpm}</Text>
                
                <Text type="secondary">Runtime: {roller.runtimeDays} Days</Text>
                <Text type="danger">{isOffline ? 'Data unavailable.' : (roller.health.alertType.join(', ') || 'No specific alerts.')}</Text>
                
                <Button 
                    size="small" 
                    type="primary" 
                    disabled={isOffline}
                    onClick={() => handleNavigate(roller)} 
                >
                    Go to Details
                </Button>
            </Space>
        );
    };

    const renderIndicator = (roller) => {
        if (!roller.positionStyle) return null; 

        return (
            <Popover
                key={`indicator-${roller.sensorId}`}
                content={renderPopoverContent(roller)}
                title={`Sensor Status: ${mapHealthStatus(roller.health.status)}`}
                trigger="click"
                placement="right"
            >
                <div
                    style={{
                        position: 'absolute',
                        width: 16, 
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: roller.health.color, 
                        border: '3px solid #fff', 
                        boxShadow: `0 0 12px ${roller.health.color}, inset 0 0 5px rgba(0,0,0,0.3)`, 
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        zIndex: 10, 
                        
                        top: roller.positionStyle.top, 
                        left: roller.positionStyle.left,
                        transform: 'translate(-50%, -50%)', 
                    }}
                    title={`Roller ${roller.rollerName} (${mapHealthStatus(roller.health.status)})`}
                />
            </Popover>
        );
    };

    return (
        <Card title="Real-time Status Map" style={{ border: 'none' }}>
            <div 
                style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: 550, 
                    backgroundImage: `url('/conveyor.gif')`, 
                    backgroundSize: 'contain', 
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center 50%', 
                    backgroundColor: colorBgContainer, 
                    borderRadius: 8,
                    overflow: 'hidden'
                }}
            >
                {rollersData.map(roller => renderIndicator(roller))}
                
                <Button style={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }} type="text">
                    <Text strong>Main Site</Text>
                </Button>
            </div>
            
            <div style={{ marginTop: 10, textAlign: 'center' }}>
                <Tag color="green">{mapHealthStatus('Normal')}</Tag>
                <Tag color="orange">{mapHealthStatus('WARNING')}</Tag>
                <Tag color="red">{mapHealthStatus('DANGER')}</Tag>
                <Tag color="gray">Offline</Tag>
            </div>
        </Card>
    );
};

export default GifConveyorMap;