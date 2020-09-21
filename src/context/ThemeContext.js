import React, { useState } from 'react';

const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {

    const [chatHidden, setChatHidden] = useState(() => {
        return localStorage.getItem('chatHidden') || false;
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    return (
        <ThemeContext.Provider 
        value={{ 
            theme, 
            chatHidden, 
            setTheme, 
            setChatHidden, 
        }}>
            {children}
        </ThemeContext.Provider>
    )
};

const useTheme = () => React.useContext(ThemeContext);

export { useTheme };

export default ThemeProvider;