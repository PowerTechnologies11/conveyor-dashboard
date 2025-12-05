// src/App.jsx
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';           // 确保导入路径正确
import DashboardLayout from './components/DashboardLayout'; // 确保导入路径正确

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return <DashboardLayout onLogout={handleLogout} />;
}

export default App;