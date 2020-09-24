import React, { useEffect } from 'react';
import useSound from 'use-sound';
import { useLocalStorage } from '../hooks/useLocalStorage';
import UserJoinedSoundEffect from '../assets/audio/user-joined-sound.mp3';

const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {

    const [volume, setVolume] = useLocalStorage(0.5, 'volume');
    const [chatHidden, setChatHidden] = useLocalStorage(false, 'chatHidden');
    const [theme, setTheme] = useLocalStorage('light', 'theme');
    const [playUserJoinedSound] = useSound(UserJoinedSoundEffect, { volume });

    useEffect(() => {
        if (theme === 'light' && document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else if (theme === 'dark' && document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        };
    }, [theme]);
    
    const handleVolumeChange = (e) => setVolume(e.target.value);
    
    return (
        <SettingsContext.Provider 
        value={{ 
            theme, 
            chatHidden, 
            setTheme, 
            setChatHidden,
            volume,
            handleVolumeChange,
            playUserJoinedSound
        }}>
            {children}
        </SettingsContext.Provider>
    )
};

const useSettings = () => React.useContext(SettingsContext);

export { useSettings, SettingsContext };

export default SettingsProvider;