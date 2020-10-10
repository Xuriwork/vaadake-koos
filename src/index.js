import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import swConfig from './swConfig';
import SettingsProvider from './context/SettingsContext';

ReactDOM.render(
  <React.StrictMode>
  <SettingsProvider>
    <App />
  </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register(swConfig);