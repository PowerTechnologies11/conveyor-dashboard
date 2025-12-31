// src/components/GifConveyorMap.jsx 
import React, { useState, useEffect, useRef } from 'react';
import { Popover, Card, Tag, Typography, Button, Space, theme } from 'antd';
import { FireOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { rollerList, getRollerHealth } from '../data/dummyData';

const { Text } = Typography;

// 注意：如果图片比例改变，可能需要微调一下这里的坐标
// 但改用 img 标签后，这就兼容所有屏幕尺寸了
const ROLLER_POSITIONS_MAP = {
    '100001': { top: '68%', left: '17.5%' }, 
    '100002': { top: '65%', left: '23.5%' }, 
    '100003': { top: '62.5%', left: '29%' }, 
    '100004': { top: '59%', left: '35.5%' }, 
    '100005': { top: '52%', left: '47.5%' },
    '100006': { top: '49%', left: '54%' },
    '100007': { top: '46%', left: '60%' },
    '100008': { top: '42.5%', left: '65.5%' },
    '100009': { top: '39.5%', left: '71%' },
    '100010': { top: '36.5%', left: '76%' },
    '100011': { top: '55.5%', left: '41.5%' }, 
    '100012': { top: '29%', left: '78%' }, 
    '100013': { top: '75%', left: '14.5%' },
    '100014': { top: '67.5%', left: '27%' },
    '100015': { top: '60.5%', left: '39%' },
    '100016': { top: '54%', left: '51%' },
    '100017': { top: '47%', left: '63.5%' },
    '100018': { top: '41.5%', left: '73.5%' },
    '100019': { top: '38.5%', left: '79%' },
    '100020': { top: '35%', left: '83%' }, 
};

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return status; 
};

const GifConveyorMap = ({ handleNavigate }) => { 
    const { token: { colorPrimary } } = theme.useToken();
    
    // 安全映射数据
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
                     <Text><ThunderboltOutlined /> Volt: {isOffline || !roller.voltage ? '-' : roller.voltage + 'V'}</Text>
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
                        position: 'absolute', // 绝对定位，相对于父容器(Map Wrapper)
                        // 使用百分比定位，这将永远相对于图片的尺寸
                        top: roller.positionStyle.top, 
                        left: roller.positionStyle.left,
                        
                        width: 16, 
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: roller.health.color, 
                        border: '3px solid #fff', 
                        boxShadow: `0 0 8px ${roller.health.color}`, 
                        cursor: 'pointer',
                        zIndex: 10, 
                        
                        // 关键：确保定位点是圆心的正中心，而不是左上角
                        transform: 'translate(-50%, -50%)', 
                        transition: 'all 0.3s ease', // 加一点动画让变化更平滑
                    }}
                    // 鼠标悬停变大一点
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                />
            </Popover>
        );
    };

    return (
        <Card title="Real-time Status Map" style={{ border: 'none' }}>
            {/* 关键修改：
               1. 外层容器设为 relative，作为定位基准。
               2. 移除固定的 height: 550px，让高度由图片自动撑开 (height: auto)。
               3. 移除 background-image，改用 <img /> 标签。
            */}
            <div 
                style={{ 
                    position: 'relative', 
                    width: '100%', 
                    // 高度自动，随宽度等比缩放
                    height: 'auto', 
                    borderRadius: 8,
                    overflow: 'hidden', // 防止圆点溢出
                    backgroundColor: '#f0f2f5'
                }}
            >
                {/* 使用 img 标签作为地图底图 */}
                <img 
                    src="/conveyor.gif" 
                    alt="Conveyor Map" 
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block', // 消除图片底部的微小间隙
                    }} 
                />

                {/* 渲染覆盖层圆点 */}
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