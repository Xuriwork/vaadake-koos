import React, { useState } from 'react';

const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {

    const [chatHidden, setChatHidden] = useState(() => {
        return localStorage.getItem('chatHidden') || false;
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    return (
        <SettingsContext.Provider 
        value={{ 
            theme, 
            chatHidden, 
            setTheme, 
            setChatHidden, 
        }}>
            {children}
        </SettingsContext.Provider>
    )
};

const useSettings = () => React.useContext(SettingsContext);

export { useSettings, SettingsContext };

export default SettingsProvider;