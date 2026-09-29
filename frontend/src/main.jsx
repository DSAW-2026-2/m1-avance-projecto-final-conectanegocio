import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import DataProvider from './context/DataProvider.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/catalog.css';
import './styles/shopping.css';
import './styles/sales.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider><DataProvider><App /></DataProvider></AuthProvider>
    </HashRouter>
  </React.StrictMode>,
);
