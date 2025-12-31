// src/App.jsx
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';           
import DashboardLayout from './components/DashboardLayout'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
                <DashboardLayout onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;