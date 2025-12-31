// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ConfigProvider } from 'antd';

const customTheme = {
  token: {
    borderRadius: 10,
    colorPrimary: '#f8a622', // 橙色主色
    colorSuccess: '#4CAF50',
    colorWarning: '#FF9800',
    colorError: '#F44336',
    colorInfo: '#019eb8',    // 青色信息色
  },
  components: {
    Card: {
      borderRadius: 10,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    },
    Input: { borderRadius: 10, controlHeight: 40 },
    Button: { borderRadius: 10, controlHeight: 40 },
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);