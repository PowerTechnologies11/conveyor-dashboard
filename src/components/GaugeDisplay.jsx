// src/components/GaugeDisplay.jsx 

import React from 'react';
import GaugeChart from 'react-gauge-chart'; 
import { theme, Typography, Card } from 'antd';

const { Title, Text } = Typography;

const COMMON_HEIGHT = 280; 

const RpmGauge = ({ rpm, isOffline }) => {
    const { token: { colorError, colorWarning, colorInfo, colorSuccess } } = theme.useToken();
    
    if (isOffline) {
        return (
            <Card style={{ 
                textAlign: 'center', 
                backgroundColor: '#546E7A', 
                color: 'white', 
                minHeight: COMMON_HEIGHT,
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                border: 'none',
            }}>
                <Title level={4} style={{ color: 'white', margin: 0, opacity: 0.8 }}>RPM Monitoring</Title>
                <Title level={1} style={{ color: 'white', margin: '10px 0 0 0' }}>---</Title>
                <p>OFFLINE</p>
            </Card>
        );
    }
    
    const MIN_RPM = 200;
    const MAX_RPM = 600;
    const currentRpm = rpm || 0; 
    const normalizedRpm = Math.min(Math.max(currentRpm, MIN_RPM), MAX_RPM);
    const chartValue = (normalizedRpm - MIN_RPM) / (MAX_RPM - MIN_RPM);

    return (
        <Card style={{ 
            backgroundColor: colorInfo, 
            color: 'white', 
            minHeight: COMMON_HEIGHT,
            padding: 0, 
            border: 'none',
            overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
        >
            <Title level={4} style={{ color: 'white', margin: 0, padding: '10px 0', textAlign: 'center', backgroundColor: colorInfo }}>RPM Monitoring</Title>
            <div style={{ position: 'relative', padding: '10px 0 0 0' }}>
                <GaugeChart
                    id="rpm-gauge"
                    nrOfLevels={3} 
                    arcsLength={[0.4, 0.3, 0.3]} 
                    colors={[colorSuccess, colorWarning, colorError]}
                    percent={chartValue}
                    arcPadding={0.02}
                    cornerRadius={3}
                    needleColor="#fff"
                    needleBaseColor="#fff"
                    textColor="#fff" 
                    formatTextValue={(value) => `${currentRpm} RPM`} 
                />
            </div>
        </Card>
    );
};

const TempThermometer = ({ temp, isOffline }) => {
    const { token: { colorError, colorWarning, colorInfo } } = theme.useToken();
    
    const MAX_TEMP = 100;
    const MIN_TEMP = 30;
    const currentTemp = temp || MIN_TEMP;

    const normalizedTemp = isOffline ? MIN_TEMP : Math.min(Math.max(currentTemp, MIN_TEMP), MAX_TEMP);
    const percent = isOffline ? 0 : ((normalizedTemp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
    
    const tempColor = isOffline ? '#546E7A' : (currentTemp >= 80 ? colorError : (currentTemp >= 60 ? colorWarning : colorInfo));

    return (
        <Card 
            style={{ 
                border: 'none', 
                backgroundColor: tempColor, 
                color: 'white', 
                minHeight: COMMON_HEIGHT, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
             <Title level={4} style={{ color: 'white', margin: 0, opacity: 0.8 }}>Temperature Monitoring</Title>
             <Title level={1} style={{ color: 'white', margin: '15px 0 10px 0' }}>
                {isOffline ? '---' : `${currentTemp}°C`}
            </Title>
            
            <div style={{ 
                width: 30, 
                height: 100, 
                backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                borderRadius: 15,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: 'white', 
                    height: `${Math.min(percent, 100)}%`, 
                    transition: 'height 1s',
                }}/>
            </div>

            <Text style={{ color: 'white', marginTop: 10 }}>{isOffline ? 'OFFLINE' : `Range: ${MIN_TEMP}-${MAX_TEMP}°C`}</Text>
        </Card>
    );
}

export { RpmGauge, TempThermometer };