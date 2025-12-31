// src/components/GifConveyorMap.jsx 
import React from 'react';
import { Popover, Card, Tag, Typography, Button, Space, theme } from 'antd';
import { FireOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { rollerList, getRollerHealth } from '../data/dummyData';

const { Text } = Typography;

// 您的 20 个坐标点
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
    const { token: { colorBgContainer, colorPrimary } } = theme.useToken();
    
    // 映射数据
    const rollersData = rollerList.map(r => ({ 
        ...r, 
        health: getRollerHealth(r), 
        positionStyle: ROLLER_POSITIONS_MAP[r.sensorId] 
    }));

    const renderPopoverContent = (roller) => {
        const isOffline = roller.health.status === 'OFFLINE';
        const isVib = roller.type === 'VIBRATION';

        return (
            <Space direction="vertical" size={5} style={{ minWidth: 200 }}>
                <Text strong style={{ color: colorPrimary }}>{roller.rollerName}</Text>
                <Space>
                    <Tag color={roller.health.color}>{mapHealthStatus(roller.health.status)}</Tag>
                    <Tag>{isVib ? 'Vib' : 'RPM'}</Tag>
                </Space>
                
                <Text><FireOutlined /> Temp: {isOffline ? '-' : `${roller.temp}°C`}</Text>
                
                {isVib ? (
                     <Text><ThunderboltOutlined /> Volt: {roller.voltage}V</Text>
                ) : (
                     <Text><ReloadOutlined /> RPM: {isOffline ? '-' : roller.rpm}</Text>
                )}
                
                <Button 
                    size="small" 
                    type="primary" 
                    disabled={isOffline}
                    style={{ marginTop: 8 }}
                    onClick={() => handleNavigate(roller)} 
                >
                    Details
                </Button>
            </Space>
        );
    };

    const renderIndicator = (roller) => {
        if (!roller.positionStyle) return null; 

        return (
            <Popover
                key={roller.sensorId}
                content={renderPopoverContent(roller)}
                title="Sensor Status"
                trigger="click"
            >
                <div
                    style={{
                        position: 'absolute',
                        width: 16, 
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: roller.health.color, 
                        border: '3px solid #fff', 
                        boxShadow: `0 0 8px ${roller.health.color}`, 
                        cursor: 'pointer',
                        zIndex: 10, 
                        top: roller.positionStyle.top, 
                        left: roller.positionStyle.left,
                        transform: 'translate(-50%, -50%)', 
                    }}
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
                    backgroundPosition: 'center', 
                    backgroundColor: colorBgContainer, 
                    borderRadius: 8,
                }}
            >
                {rollersData.map(roller => renderIndicator(roller))}
            </div>
            
            <div style={{ marginTop: 10, textAlign: 'center' }}>
                <Space>
                    <Tag color="#52c41a">Normal</Tag>
                    <Tag color="#faad14">Warning</Tag>
                    <Tag color="#f5222d">Alarm</Tag>
                    <Tag color="#bfbfbf">Offline</Tag>
                </Space>
            </div>
        </Card>
    );
};

export default GifConveyorMap;