// src/data/dummyData.js - 最终完整版 (包含 2 个离线 Sensor 和 PdM 术语)

// --- 1. 阈值和规则 ---
export const HEALTH_THRESHOLDS = {
    PRE_ALARM_TEMP: 60,  // PRE ALARM TEMP (°C)
    ALARM_TEMP: 80,      // ALARM TEMP (°C)
    PRE_ALARM_RPM_LOW: 300, // PRE ALARM RPM (过低)
    ALARM_RPM_HIGH: 450,    // ALARM RPM (过高)
};

// --- 2. 实时滚筒列表（10个传感器，2个离线）---
export const rollerList = [
    // --- Conveyor X (12 Rollers) ---
    { key: '1', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100001', rollerName: 'A', temp: 45, rpm: 380, runtimeDays: 150, isOnline: true },
    { key: '2', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100002', rollerName: 'B', temp: 65, rpm: 400, runtimeDays: 150, isOnline: true }, // Pre Alarm
    { key: '3', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100003', rollerName: 'C', temp: 50, rpm: 290, runtimeDays: 100, isOnline: true },  // Pre Alarm Low
    { key: '4', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100004', rollerName: 'D', temp: 85, rpm: 420, runtimeDays: 100, isOnline: true },   // ALARM
    { key: '5', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100005', rollerName: 'E', temp: 55, rpm: 350, runtimeDays: 50, isOnline: false }, // --- OFFLINE 1 ---
    
    { key: '6', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100006', rollerName: 'F', temp: 40, rpm: 460, runtimeDays: 50, isOnline: true },    // ALARM High
    { key: '7', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100007', rollerName: 'G', temp: 82, rpm: 370, runtimeDays: 20, isOnline: true }, // ALARM
    { key: '8', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100008', rollerName: 'H', temp: 70, rpm: 320, runtimeDays: 20, isOnline: true },  // Pre Alarm
    { key: '9', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100009', rollerName: 'I', temp: 58, rpm: 410, runtimeDays: 180, isOnline: true },
    { key: '10', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100010', rollerName: 'J', temp: 90, rpm: 440, runtimeDays: 180, isOnline: false }, // --- OFFLINE 2 ---
    
    { key: '11', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100011', rollerName: 'K', temp: 42, rpm: 390, runtimeDays: 10, isOnline: true }, // 新增 X
    { key: '12', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100012', rollerName: 'L', temp: 68, rpm: 455, runtimeDays: 10, isOnline: true }, // 新增 X
    
    // --- Conveyor Y (8 Rollers) ---
    { key: '13', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100013', rollerName: 'M', temp: 75, rpm: 430, runtimeDays: 15, isOnline: true }, // Pre Alarm
    { key: '14', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100014', rollerName: 'N', temp: 41, rpm: 310, runtimeDays: 15, isOnline: true },
    { key: '15', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100015', rollerName: 'O', temp: 88, rpm: 305, runtimeDays: 20, isOnline: true }, // ALARM
    { key: '16', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100016', rollerName: 'P', temp: 51, rpm: 470, runtimeDays: 20, isOnline: true }, // ALARM High
    { key: '17', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100017', rollerName: 'Q', temp: 59, rpm: 360, runtimeDays: 30, isOnline: true },
    { key: '18', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100018', rollerName: 'R', temp: 62, rpm: 280, runtimeDays: 30, isOnline: true }, // Pre Alarm + RPM Low
    { key: '19', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100019', rollerName: 'S', temp: 40, rpm: 350, runtimeDays: 40, isOnline: true },
    { key: '20', site: 'Main Site', conveyor: 'Conveyor Y', sensorId: '100020', rollerName: 'T', temp: 48, rpm: 380, runtimeDays: 40, isOnline: false }, // --- OFFLINE 3 ---
];


// --- 3. 健康状态计算函数 (包含离线逻辑) ---
export const getRollerHealth = (roller) => {
    // 优先检查离线状态
    if (roller.isOnline === false) {
        return { status: 'OFFLINE', color: 'gray', alertType: ['Sensor Offline'], temp: null, rpm: null };
    }
    
    const { temp, rpm } = roller;
    const { PRE_ALARM_TEMP, ALARM_TEMP, PRE_ALARM_RPM_LOW, ALARM_RPM_HIGH } = HEALTH_THRESHOLDS;

    let status = 'NORMAL';
    let color = 'green';
    let alertType = [];

    // ALARM (最高优先级)
    if (temp >= ALARM_TEMP) {
        status = 'DANGER';
        color = 'red';
        alertType.push('Temperature ALARM');
    } 
    
    // PRE ALARM
    else if (temp >= PRE_ALARM_TEMP) {
        status = 'WARNING';
        color = 'orange';
        alertType.push('Temperature Pre-Alarm');
    }
    
    // RPM ALARM / PRE ALARM
    if (rpm < PRE_ALARM_RPM_LOW || rpm > ALARM_RPM_HIGH) {
         if (rpm < PRE_ALARM_RPM_LOW) {
             alertType.push('RPM Pre-Alarm Low');
         } else if (rpm > ALARM_RPM_HIGH) {
             alertType.push('RPM ALARM High');
         }

        if (status === 'NORMAL') {
            status = 'WARNING';
            color = 'orange';
        }
    }

    return { status, color, alertType, temp, rpm };
};


// --- 4. 实时 KPI 汇总计算 (按 Conveyor 计算) ---
export const calculateConveyorKPIs = () => {
    const conveyors = ['Conveyor X', 'Conveyor Y'];
    const kpis = {};

    const dataWithHealth = rollerList.map(r => ({ ...r, health: getRollerHealth(r) }));

    conveyors.forEach(conveyor => {
        const conveyorRollers = dataWithHealth.filter(r => r.conveyor === conveyor);
        
        let dangerCount = 0;
        let warningCount = 0;

        conveyorRollers.forEach(roller => {
            if (roller.health.status === 'DANGER') dangerCount++;
            if (roller.health.status === 'WARNING') warningCount++;
        });

        // KPI 计算只针对 ONLNE 传感器
        const onlineRollers = conveyorRollers.filter(r => r.isOnline !== false);
        const totalOnline = onlineRollers.length;
        
        const totalTemp = onlineRollers.reduce((sum, r) => sum + r.temp, 0);
        const totalRpm = onlineRollers.reduce((sum, r) => sum + r.rpm, 0);

        const maxTempRoller = onlineRollers.reduce((max, r) => (r.temp > max.temp ? r : max), onlineRollers[0] || {temp: 0});

        kpis[conveyor] = {
            avgTemp: totalOnline > 0 ? (totalTemp / totalOnline).toFixed(1) : 'N/A',
            maxTemp: maxTempRoller.temp,
            maxTempRollerPosition: maxTempRoller.rollerName ? `${maxTempRoller.rollerName} (Sensor: ${maxTempRoller.sensorId})` : 'N/A',
            avgRpm: totalOnline > 0 ? (totalRpm / totalOnline).toFixed(0) : 'N/A',
            totalRollers: conveyorRollers.length,
            totalOnline: totalOnline,
            dangerAlertsCount: dangerCount,
            warningAlertsCount: warningCount,
            totalActiveAlerts: dangerCount + warningCount,
        };
    });

    return kpis;
};

export const conveyorKPIs = calculateConveyorKPIs();


// --- 5. 辅助数据和默认值（全局汇总）---
export const totalDangerAlerts = conveyorKPIs['Conveyor X'].dangerAlertsCount + conveyorKPIs['Conveyor Y'].dangerAlertsCount;
export const totalWarningAlerts = conveyorKPIs['Conveyor X'].warningAlertsCount + conveyorKPIs['Conveyor Y'].warningAlertsCount;

export const TOTAL_OFFLINE_SENSORS = rollerList.filter(r => r.isOnline === false).length; 

export const currentKPIs = {
    totalActiveAlerts: totalDangerAlerts + totalWarningAlerts,
    totalDangerAlerts: totalDangerAlerts,
    totalWarningAlerts: totalWarningAlerts,
    totalOffline: TOTAL_OFFLINE_SENSORS,
    totalRollers: rollerList.length,
};

// 历史数据生成（用于图表 - 24H 小时制已修复）
export const generateHistoricalData = (days) => {
    const data = [];
    const now = new Date();
    
    if (days === 1) {
        for (let i = 23; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hour = date.getHours(); 
            const hourStr = `${hour < 10 ? '0' : ''}${hour}:00`; 
            
            const baseTemp = 45 + Math.sin(i / 6) * 3 + Math.random() * 2;
            const baseRpm = 360 + Math.cos(i / 8) * 15 + Math.random() * 8;
            
            data.push({
                name: hourStr,
                temperature: baseTemp + (hour > 18 ? 5 : 0),
                rpm_stability: baseRpm + (i % 4 === 0 ? Math.random() * 30 : 0),
            });
        }
        return data.reverse(); 
    }

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        const baseTemp = 40 + Math.sin(i / 7) * 5 + Math.random() * 3;
        const baseRpm = 350 + Math.cos(i / 10) * 20 + Math.random() * 10;
        
        data.push({
            name: dateStr,
            temperature: baseTemp + (i > 25 ? (i - 25) * 1.5 : 0),
            rpm_stability: baseRpm + (i % 5 === 0 ? Math.random() * 50 : 0),
        });
    }
    return data;
};

export const historicalDataFull = generateHistoricalData(30);

// 辅助数据 (用于兼容旧组件和默认值)
export const summaryData = {
    activeGateways: 10,
    rollersOnline: rollerList.length,
    rollersOffline: 0,
};

export const detailedRollerInfo = {
    location: { business: 'Power Technologies', site: 'Main Site', conveyor: 'Conveyor X', sensorId: '100001', rollerName: 'A' },
    currentData: { temp1: 45, temp2: 65, rpm: 380 },
};

export const frameSummaryData = Array.from({ length: 17 }, (_, i) => ({
    frame: i * 2 + 2,
    tempPeak: Math.floor(Math.random() * 5 + 28 + (i > 10 && i < 15 ? 5 : 0)), 
    rmsPeak: Math.floor(Math.random() * 30 + 100 + (i > 10 && i < 15 ? 50 : 0)), 
}));