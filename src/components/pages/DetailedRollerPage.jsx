// src/components/pages/DetailedRollerPage.jsx 

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Space, theme, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { detailedRollerInfo, historicalDataFull, generateHistoricalData, getRollerHealth, HEALTH_THRESHOLDS } from '../../data/dummyData';
import { ScheduleOutlined } from '@ant-design/icons';
import { RpmGauge, TempThermometer } from '../GaugeDisplay'; 

const { Title } = Typography;

const mapHealthStatus = (status) => {
    if (status === 'DANGER') return 'Alarm';
    if (status === 'WARNING') return 'Pre-alarm';
    return status; 
};


const DetailedRollerPage = ({ selectedRoller }) => {
    const { PRE_ALARM_TEMP, ALARM_TEMP, PRE_ALARM_RPM_LOW, ALARM_RPM_HIGH } = HEALTH_THRESHOLDS;

    const { token: { colorError, colorPrimary, colorInfo, colorWarning } } = theme.useToken();
    const [timePeriod, setTimePeriod] = useState('30Days'); 

    const historicalDataFiltered = useMemo(() => {
        if (timePeriod === 'AllTime') return generateHistoricalData(90);
        if (timePeriod === '7Days') return generateHistoricalData(7);
        if (timePeriod === '24H') return generateHistoricalData(1); 
        return historicalDataFull;
    }, [timePeriod]);

    const currentHealth = selectedRoller ? getRollerHealth(selectedRoller) : { status: 'NORMAL', color: 'green', alertType: [] };
    const isOffline = currentHealth.status === 'OFFLINE';

    const renderInfoCard = (title, value) => (
        <Row style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
            <Col span={10} style={{ fontWeight: 500 }}>{title}</Col>
            <Col span={14}>{value}</Col>
        </Row>
    );

    const renderCurrentDataMetric = (title, value) => (
        <Row style={{ borderBottom: '1px solid #f0f0f0', padding: '8px 0' }}>
            <Col span={12} style={{ fontWeight: 500 }}>{title}</Col>
            <Col span={12} style={{ textAlign: 'right' }}>
                {value === null || value === undefined || value === '-' ? '-' : value}
            </Col>
        </Row>
    );
    
    const info = selectedRoller ? { ...detailedRollerInfo.location, ...selectedRoller } : detailedRollerInfo.location;
    const tempValue = selectedRoller?.temp;
    const rpmValue = selectedRoller?.rpm;

    const XAxisContent = () => (
        <XAxis 
            dataKey="name" 
            angle={timePeriod === '24H' ? -45 : 0} 
            textAnchor={timePeriod === '24H' ? 'end' : 'middle'}
            interval={timePeriod === '24H' ? 2 : 0} 
        />
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={3}>Detailed Roller Information (Roller {info.rollerName || 'Default'})</Title>
            
            <Row gutter={[16, 16]}>
                <Col span={8} xs={24} md={8}>
                    <TempThermometer temp={tempValue} isOffline={isOffline} />
                </Col>

                <Col span={8} xs={24} md={8}>
                    <RpmGauge rpm={rpmValue} isOffline={isOffline} />
                </Col>

                <Col span={8} xs={24} md={8}>
                    <Card style={{ backgroundColor: currentHealth.color, color: 'white', minHeight: 280, textAlign: 'center', border: 'none', 
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Title level={1} style={{ color: 'white', margin: '0 0 8px 0' }}>{mapHealthStatus(currentHealth.status)}</Title>
                        <p style={{ color: 'white', opacity: 0.8 }}>Health Status</p>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.3)', margin: '15px 0' }} />
                        <Title level={5} style={{ color: 'white', margin: 0 }}>Alerts: {currentHealth.alertType.join(', ') || 'None'}</Title>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16 }}>
                <Row gutter={[32, 16]}>
                    <Col span={12} xs={24} md={12}>
                        <Title level={4}>Asset Information (PTSPS120)</Title>
                        {renderInfoCard('Site', info.site)}
                        {renderInfoCard('Conveyor', info.conveyor)}
                        {renderInfoCard('Roller Name', info.rollerName)}
                        {renderInfoCard('Sensor ID', info.sensorId)}
                        {renderInfoCard('Runtime', `${info.runtimeDays || '-'} Days`)}
                        {renderInfoCard('Business', info.business)}
                    </Col>
                    <Col span={12} xs={24} md={12}>
                        <Title level={4}>Current Data & Thresholds</Title>
                        {renderCurrentDataMetric('Current Temp', tempValue === null ? null : `${tempValue}°C`)}
                        {renderCurrentDataMetric('Current RPM', rpmValue)}
                        
                        {renderCurrentDataMetric('Temp Threshold', `Pre-Alarm: > ${PRE_ALARM_TEMP}°C | ALARM: > ${ALARM_TEMP}°C`)}
                        {renderCurrentDataMetric('RPM Threshold', `ALARM High: > ${ALARM_RPM_HIGH} | Pre-Alarm Low: < ${PRE_ALARM_RPM_LOW}`)}
                    </Col>
                </Row>
            </Card>

            {!isOffline ? (
                <React.Fragment>
                    <Title level={4} style={{ marginTop: 24 }}>Trend Analysis & Prediction</Title>
                    
                    <Row justify="end" style={{ marginBottom: 8 }}>
                        {['24H', '7Days', '30Days', 'AllTime'].map(period => (
                            <Button 
                                key={period}
                                type={timePeriod === period ? 'primary' : 'default'}
                                onClick={() => setTimePeriod(period)}
                                style={{ marginLeft: 8 }}
                            >
                                {period}
                            </Button>
                        ))}
                    </Row>
                    
                    <Card title="Temperature Over Time (For Prediction)" style={{ height: 350, overflowX: 'auto' }}>
                        <LineChart width={900} height={300} data={historicalDataFiltered}> 
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxisContent />
                            <YAxis domain={[30, 90]} label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="temperature" stroke={colorPrimary} strokeWidth={3} dot={false} name="Temperature Trend" />
                            <Line type="monotone" dataKey={() => ALARM_TEMP} stroke={colorError} strokeDasharray="3 3" dot={false} name={`ALARM Threshold (${ALARM_TEMP}°C)`} /> 
                            <Line type="monotone" dataKey={() => PRE_ALARM_TEMP} stroke={colorWarning} strokeDasharray="3 3" dot={false} name={`Pre-ALARM Threshold (${PRE_ALARM_TEMP}°C)`} /> 
                        </LineChart>
                    </Card>

                    <Card title="RPM Stability Trend (Detection of Slip/Seize)" style={{ height: 350, marginTop: 16, overflowX: 'auto' }}>
                        <LineChart width={900} height={300} data={historicalDataFiltered}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxisContent />
                            <YAxis domain={[250, 500]} label={{ value: 'RPM', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rpm_stability" stroke={colorInfo} strokeWidth={3} dot={false} name="RPM Fluctuation" />
                        </LineChart>
                    </Card>
                </React.Fragment>
            ) : (
                 <Card style={{ marginTop: 24, padding: 50, textAlign: 'center' }}>
                     <Title level={4} type="secondary">Sensor is Offline</Title>
                     <p>Historical trend data is unavailable while the sensor is disconnected.</p>
                 </Card>
            )}
            
        </Space>
    );
};

export default DetailedRollerPage;