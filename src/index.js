import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SettingsProvider from './context/SettingsContext';
import ServiceWorkerWrapper from './utils/ServiceWorkerWrapper';

ReactDOM.render(
  <React.StrictMode>
  <ServiceWorkerWrapper>
  <SettingsProvider>
    <App />
  </SettingsProvider>
  </ServiceWorkerWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();