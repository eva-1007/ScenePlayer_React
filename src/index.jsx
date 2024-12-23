import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 可选，如果有样式文件
import ScenePlayer from './ScenePlayer'; // 确保引入 ScenePlayer 组件
import reportWebVitals from './reportWebVitals'; // 可选

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ScenePlayer />
    </React.StrictMode>
);

reportWebVitals(); // 可选