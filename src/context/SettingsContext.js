import React, { useEffect } from 'react';
import useSound from 'use-sound';
import { useLocalStorage } from '../hooks/useLocalStorage';
import UserJoinedSoundEffect from '../assets/audio/user-joined-sound.mp3';
import ToggleSoundEffect from '../assets/audio/slider-sound.mp3';

const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {

    const [volume, setVolume] = useLocalStorage(0.5, 'volume');
    const [tabContentHidden, setTabContentHidden] = useLocalStorage(false, 'hidden');
    const [theme, setTheme] = useLocalStorage('light', 'theme');

    const [playUserJoinedSound] = useSound(UserJoinedSoundEffect, { volume });
    const [playSliderSound] = useSound(ToggleSoundEffect, { volume });

    useEffect(() => {
        if (theme === 'light' && document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            document.querySelector('meta[name="theme-color"]').setAttribute("content", '#f02eaa');
            document.querySelector('link[rel="icon"]').setAttribute("href", 'favicon.svg');
            document.querySelector('link[rel="alternate icon"]').setAttribute("href", 'favicon.ico');
        } else if (theme === 'dark' && document.body.classList.contains('light')) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            document.querySelector('meta[name="theme-color"]').setAttribute("content", '#41d6d6');
            document.querySelector('link[rel="icon"]').setAttribute("href", 'favicon_dm.svg');
            document.querySelector('link[rel="alternate icon"]').setAttribute("href", 'favicon_dm.ico');
        };
    }, [theme]);
    
    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        playSliderSound();
    };
    
    return (
        <SettingsContext.Provider 
        value={{ 
            theme, 
            tabContentHidden, 
            setTheme, 
            setTabContentHidden,
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