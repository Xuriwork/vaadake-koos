import React from 'react';
import useSound from 'use-sound';
import { useLocalStorage } from '../hooks/useLocalStorage';
import UserJoinedSoundEffect from '../assets/audio/user-joined-sound.mp3';

const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {

    const [volume, setVolume] = useLocalStorage(0.5, 'volume');
    const [chatHidden, setChatHidden] = useLocalStorage(false, 'chatHidden');
    const [theme, setTheme] = useLocalStorage('light', 'theme');
    
    const handleVolumeChange = (e) => setVolume(e.target.value);
    
    const [playUserJoinedSound] = useSound(UserJoinedSoundEffect, { volume });

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