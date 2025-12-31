// src/components/pages/DetailedRollerPage.jsx

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Space, theme, Button, Tag, Modal, Divider, Statistic, Empty, Segmented } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { detailedRollerInfo, getRollerHealth } from '../../data/dummyData';
import { 
    WifiOutlined, ThunderboltOutlined, FireOutlined, DashboardOutlined, 
    ColumnHeightOutlined, CompressOutlined, ArrowsAltOutlined, LineChartOutlined, AreaChartOutlined
} from '@ant-design/icons';
import { RpmGauge, TempThermometer } from '../GaugeDisplay'; 

const { Title, Text } = Typography;

// 安全取值：如果是对象取 current，否则返回数值或0
const safelyGetValue = (val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'object' && val.current !== undefined) return val.current;
    if (typeof val === 'number') return val;
    return 0;
};

// --- 组件：带图表按钮的单项指标 ---
const MetricItem = ({ icon, title, dataObj, unit, color, onGraphClick }) => {
    const { token } = theme.useToken();
    const primaryColor = color || token.colorPrimary;
    const value = safelyGetValue(dataObj);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                    fontSize: 24, color: primaryColor, backgroundColor: `${primaryColor}20`,
                    padding: 12, borderRadius: 12, marginRight: 16
                }}>
                    {icon}
                </div>
                <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{title}</Text>
                    <div style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 1.2 }}>
                        {value} <span style={{ fontSize: 14, fontWeight: 'normal' }}>{unit}</span>
                    </div>
                </div>
            </div>
            {/* 只有当数据包含 history 时才显示按钮 */}
            {dataObj && dataObj.history && (
                <Button 
                    type="text" 
                    icon={<LineChartOutlined style={{ fontSize: 18, color: token.colorTextSecondary }} />} 
                    onClick={() => onGraphClick(title, dataObj, primaryColor)}
                />
            )}
        </div>
    );
};

// --- 组件：带图表按钮的振动轴卡片 ---
const AxisCard = ({ axisLabel, data, accentColor, onGraphClick }) => {
    const { token } = theme.useToken();
    const safeData = data || {}; 

    // 内部小组件：显示数值 + 图表小按钮
    const renderStat = (title, dataObj, unit, icon) => (
        <div style={{ position: 'relative' }}>
            <Statistic 
                title={title} 
                value={safelyGetValue(dataObj)} 
                precision={2} 
                suffix={<span style={{fontSize: 12}}>{unit}</span>}
                valueStyle={{ fontSize: 20, fontWeight: 'bold' }}
                prefix={icon}
            />
            {dataObj && dataObj.history && (
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                     <Button 
                        size="small" type="text" icon={<LineChartOutlined />} 
                        onClick={() => onGraphClick(`${axisLabel}-Axis ${title}`, dataObj, accentColor)}
                    />
                </div>
            )}
        </div>
    );

    return (
        <Card bordered={false} style={{ height: '100%', borderTop: `4px solid ${accentColor}` }} bodyStyle={{ padding: '16px 24px' }}>
             <Title level={5} style={{ marginBottom: 16, color: accentColor }}>
                <ArrowsAltOutlined /> {axisLabel}-Axis Vibration
            </Title>
            <Row gutter={24}>
                <Col span={8}>{renderStat("Velocity", safeData.velocity, "mm/s", <DashboardOutlined style={{ color: token.colorInfo, opacity: 0.6 }} />)}</Col>
                <Col span={8}>{renderStat("Displacement", safeData.displacement, "um", <ColumnHeightOutlined style={{ color: token.colorWarning, opacity: 0.6 }} />)}</Col>
                <Col span={8}>{renderStat("Acceleration", safeData.acceleration, "m/s²", <CompressOutlined style={{ color: token.colorSuccess, opacity: 0.6 }} />)}</Col>
            </Row>
        </Card>
    );
};

const DetailedRollerPage = ({ selectedRoller }) => {
    const { token } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', fullHistory: [], color: token.colorPrimary });
    const [timeRange, setTimeRange] = useState('24H');

    // 数据源获取
    const roller = selectedRoller || detailedRollerInfo;
    if (!roller || !roller.sensorId) return <Empty description="No Sensor Selected" style={{ marginTop: 50 }} />;

    const isVibrationSensor = roller.type === 'VIBRATION';
    const health = getRollerHealth(roller);
    const isOffline = health.status === 'OFFLINE';

    // --- 图表打开逻辑 ---
    const handleOpenGraph = (title, dataObj, color) => {
        if (!dataObj || !dataObj.history) return;
        setModalConfig({ title, fullHistory: dataObj.history, color: color || token.colorPrimary });
        setTimeRange('24H');
        setIsModalOpen(true);
    };

    // --- 图表数据筛选逻辑 ---
    const chartData = useMemo(() => {
        const full = modalConfig.fullHistory || [];
        switch (timeRange) {
            case '24H': return full.slice(-24);
            case '1 Week': return full.slice(-168); // 7 * 24
            case '1 Month': return full; 
            case 'All Time': return full; 
            default: return full.slice(-24);
        }
    }, [modalConfig, timeRange]);

    const SensorTypeTag = () => isVibrationSensor ? 
        <Tag color="geekblue" icon={<WifiOutlined />}>PTSPS104 (Vibration)</Tag> : 
        <Tag color="orange" icon={<ThunderboltOutlined />}>PTSPS120 (RPM)</Tag>;

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex', paddingBottom: 20 }}>
            {/* Header */}
            <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Space direction="vertical" size={0}>
                         <Title level={3} style={{ margin: 0 }}>{roller.rollerName || 'Device Detail'}</Title>
                        <Text type="secondary">Sensor ID: <Text code>{roller.sensorId}</Text></Text>
                    </Space>
                    <Tag color={health.color} style={{ fontSize: 14, padding: '4px 10px', fontWeight: 'bold' }}>{health.status}</Tag>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <Space wrap>
                    <Tag color="blue">Site: {roller.site}</Tag>
                    <Tag color="cyan">Conveyor: {roller.conveyor}</Tag>
                    <SensorTypeTag />
                    {isOffline && <Tag color="default">Main Power: OFF</Tag>}
                </Space>
            </Card>

            {/* Content Logic */}
            {isVibrationSensor ? (
                <Row gutter={[20, 20]}>
                    <Col xs={24} lg={8}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Card title="Environment" bordered={false}>
                                <MetricItem 
                                    icon={<FireOutlined />} title="Temperature" unit="°C" color={token.colorError}
                                    dataObj={roller.tempObj} onGraphClick={handleOpenGraph}
                                />
                                <Divider style={{ margin: '8px 0' }} />
                                <MetricItem 
                                    icon={<ThunderboltOutlined />} title="Voltage" unit="V" color={token.colorSuccess}
                                    dataObj={roller.voltageObj} onGraphClick={handleOpenGraph}
                                />
                            </Card>
                        </Space>
                    </Col>
                    <Col xs={24} lg={16}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <AxisCard axisLabel="X" data={roller.vibration?.x} accentColor="#FF6B6B" onGraphClick={handleOpenGraph} />
                            <AxisCard axisLabel="Y" data={roller.vibration?.y} accentColor="#51CF66" onGraphClick={handleOpenGraph} />
                            <AxisCard axisLabel="Z" data={roller.vibration?.z} accentColor="#339AF0" onGraphClick={handleOpenGraph} />
                        </Space>
                    </Col>
                </Row>
            ) : (
                <Row gutter={[20, 20]}>
                    <Col span={8}>
                        <Card title="RPM Speed" extra={<Button type="text" icon={<LineChartOutlined />} onClick={() => handleOpenGraph('RPM Trend', roller.rpmObj, token.colorWarning)} />}>
                            <RpmGauge rpm={safelyGetValue(roller.rpmObj)} isOffline={isOffline} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Temperature" extra={<Button type="text" icon={<LineChartOutlined />} onClick={() => handleOpenGraph('Temp Trend', roller.tempObj, token.colorError)} />}>
                             <TempThermometer temp={safelyGetValue(roller.tempObj)} isOffline={isOffline} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Info" bordered={false} style={{ height: '100%' }}>
                             <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                <ThunderboltOutlined style={{ fontSize: 56, color: token.colorWarning, marginBottom: 24 }} />
                                <Title level={4}>Self-Powered</Title>
                                <Text type="secondary">Energy Harvesting</Text>
                             </div>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Modal */}
            <Modal
                title={<Space><AreaChartOutlined style={{ color: modalConfig.color }} /> {modalConfig.title} History</Space>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={900}
                centered
                destroyOnClose
            >
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Segmented 
                        options={['24H', '1 Week', '1 Month', 'All Time']} 
                        value={timeRange}
                        onChange={setTimeRange}
                        size="large"
                    />
                </div>
                <div style={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={modalConfig.color} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={modalConfig.color} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" minTickGap={30} tick={{ fontSize: 12 }} />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ borderRadius: 8 }} />
                            <Area type="monotone" dataKey="value" stroke={modalConfig.color} fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Modal>
        </Space>
    );
};

export default DetailedRollerPage;