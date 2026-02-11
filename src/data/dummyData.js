// src/data/dummyData.js

export const HEALTH_THRESHOLDS = {
    TEMP_ALARM: 60,
    VOLTAGE_LOW: 3.1,
    DISPLACEMENT_ALARM: 100,
    VELOCITY_ALARM: 4.5,
    RPM_LOW: 100,
};

const generateHistory = (baseValue, variance) => {
    const history = [];
    const now = new Date();
    // 720 = 30 days * 24 hours
    for (let i = 720; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 3600000);
        let val = baseValue 
                  + (Math.sin(i / 24) * (variance / 3)) 
                  + ((Math.random() - 0.5) * variance);
        if (val < 0) val = 0;
        history.push({
            date: time.toISOString(),
            label: `${time.getDate()}/${time.getMonth()+1} ${time.getHours()}:00`,
            value: parseFloat(val.toFixed(2))
        });
    }
    return history;
};

const createMetric = (min, max) => {
    const current = parseFloat((Math.random() * (max - min) + min).toFixed(2));
    const history = generateHistory(current, current * 0.2); 
    return { current, history };
};


const generateRawRollers = () => {
    const rollers = [];
    for (let i = 1; i <= 20; i++) {
        const idSuffix = i < 10 ? `0${i}` : `${i}`;
        const sensorId = `1000${idSuffix}`;
        const isVibration = i % 2 !== 0; 
        
        let baseData = {
            id: sensorId,
            type: isVibration ? 'VIBRATION' : 'RPM',
            title: isVibration ? `PTSPS104 #${sensorId}` : `PTSPS120 #${sensorId}`,
            site: 'Main Site',
            conveyor: i <= 10 ? 'Conveyor X' : 'Conveyor Y',
            isOnline: true,
            
            temperature: createMetric(30, 55),
            voltage: isVibration ? createMetric(3.3, 3.6) : null,
            rpm: isVibration ? null : createMetric(1400, 1500),
            data: null
        };

        if (isVibration) {
            baseData.data = {
                velocity: { x: createMetric(0.5, 2.0), y: createMetric(0.5, 2.0), z: createMetric(0.5, 2.0) },
                displacement: { x: createMetric(15, 40), y: createMetric(15, 40), z: createMetric(15, 40) },
                acceleration: { x: createMetric(0.1, 0.5), y: createMetric(0.1, 0.5), z: createMetric(0.1, 0.5) }
            };
        }

        if (sensorId === '100001') { 
            baseData.data.displacement.z = createMetric(110, 130); 
        }
        if (sensorId === '100005') { 
            baseData.voltage = createMetric(2.8, 3.0); 
        }
        if (sensorId === '100012') { 
            baseData.isOnline = false; 
        }

        rollers.push(baseData);
    }
    return rollers;
};

const rawRollers = generateRawRollers();

export const rollerList = rawRollers.map(r => {
    let vibrationData = null;
    if (r.type === 'VIBRATION' && r.data) {
        vibrationData = {
            x: { 
                velocity: r.data.velocity.x, 
                displacement: r.data.displacement.x, 
                acceleration: r.data.acceleration.x 
            },
            y: { 
                velocity: r.data.velocity.y, 
                displacement: r.data.displacement.y, 
                acceleration: r.data.acceleration.y 
            },
            z: { 
                velocity: r.data.velocity.z, 
                displacement: r.data.displacement.z, 
                acceleration: r.data.acceleration.z 
            }
        };
    }

    return {
        ...r,
        sensorId: r.id,      
        rollerName: r.title,
        
        temp: r.temperature.current,
        rpm: r.rpm ? r.rpm.current : null,
        voltage: r.voltage ? r.voltage.current : null,

        tempObj: r.temperature, 
        voltageObj: r.voltage,
        rpmObj: r.rpm,
        vibration: vibrationData,

        runtimeDays: 124
    };
});

export const getRollerHealth = (roller) => {
    if (!roller || !roller.isOnline) return { status: 'OFFLINE', color: '#bfbfbf', alertType: [] };

    const alerts = [];
    let status = 'NORMAL';
    let color = '#52c41a';

    if (roller.temp > HEALTH_THRESHOLDS.TEMP_ALARM) { 
        status = 'DANGER'; color = '#f5222d'; alerts.push('Overheat'); 
    }

    if (roller.type === 'VIBRATION' && roller.vibration) {
        if (roller.vibration.z.displacement.current > HEALTH_THRESHOLDS.DISPLACEMENT_ALARM) { 
            status = 'DANGER'; color = '#f5222d'; alerts.push('High Displacement'); 
        }
        if (roller.voltage < HEALTH_THRESHOLDS.VOLTAGE_LOW) { 
            if (status !== 'DANGER') { status = 'WARNING'; color = '#faad14'; } 
            alerts.push('Low Battery'); 
        }
    }

    if (roller.type === 'RPM') {
        if (roller.rpm < HEALTH_THRESHOLDS.RPM_LOW && roller.rpm > 0) { 
            if (status !== 'DANGER') { status = 'WARNING'; color = '#faad14'; } 
            alerts.push('Low RPM'); 
        }
    }

    return { status, color, alertType: alerts };
};

export const currentKPIs = {
    totalRollers: rollerList.length,
    totalDangerAlerts: rollerList.filter(r => getRollerHealth(r).status === 'DANGER').length,
    totalWarningAlerts: rollerList.filter(r => getRollerHealth(r).status === 'WARNING').length,
    totalOffline: rollerList.filter(r => !r.isOnline).length,
};

export const conveyorKPIs = { 'Conveyor X': { maxTemp: 55, avgTemp: 45 }, 'Conveyor Y': { maxTemp: 42, avgTemp: 40 } };
export const detailedRollerInfo = rollerList[0]; 
export const frameSummaryData = [];
export const historicalDataFull = generateHistory(50, 5);