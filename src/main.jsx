// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ConfigProvider } from 'antd';

const customTheme = {
  token: {
    // Soft UI 关键：增加圆角
    borderRadius: 10,
    
    // 品牌色定义 (橙色主色，蓝色信息色)
    colorPrimary: '#f8a622',
    colorSuccess: '#4CAF50',
    colorWarning: '#FF9800',
    colorError: '#F44336',
    colorInfo: '#019eb8', 
  },
  components: {
    // 确保 Card 和 Input 继承新的圆角和阴影
    Card: {
      borderRadius: 10,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Button: {
      borderRadius: 10,
      controlHeight: 40,
    },
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);