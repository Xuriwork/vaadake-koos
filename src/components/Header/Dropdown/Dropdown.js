import React, { useEffect, useRef } from 'react';
import useSound from 'use-sound';

import { useSettings } from '../../../context/SettingsContext';
import toggleButton from './toggleButton';
import DropdownItem from './DropdownItem';
import VolumeSlider from './VolumeSlider';

import { LayoutIcon, PaletteIcon } from './DropdownIcons';
import ToggleSoundEffect from '../../../assets/audio/switch-sound.mp3';

const Dropdown = ({ dropdownOpen, closeDropdown, dropdownButtonRef }) => {
	const { theme, chatHidden, setTheme, setChatHidden, volume } = useSettings();
	const [playToggleSound] = useSound(ToggleSoundEffect, { volume });
    const toggleChatButtonRef = useRef(null);
	const toggleDarkModeButtonRef = useRef(null);
	const dropdownRef = useRef(null);

    useEffect(() => {
		const button = toggleDarkModeButtonRef.current;

		if (dropdownOpen && button) {
			const ToggledOn = button.children[0];
			const ToggledOff = button.children[1];

			if (theme === 'light') ToggledOff.classList.add('toggled');
			else ToggledOn.classList.add('toggled');
		};

	}, [dropdownOpen, theme]);

	useEffect(() => {
		const button = toggleChatButtonRef.current;

		if (dropdownOpen && button) {
			const ToggledOn = button.children[0];
			const ToggledOff = button.children[1];

			if (chatHidden) ToggledOff.classList.add('toggled');
			else ToggledOn.classList.add('toggled');
		};

	}, [dropdownOpen, chatHidden]);

	useEffect(() => {
		const handleClick = (e) => {
			if (
				dropdownButtonRef.current.contains(e.target) || 
				dropdownRef.current.contains(e.target)
			) return;

			dropdownRef.current.style.animation = 'fadeOut ease 0.3s';
			closeDropdown();
		};
		
		document.addEventListener('mousedown', handleClick, false);

		return () => document.removeEventListener('mousedown', handleClick, false);
	}, [closeDropdown, dropdownButtonRef]);

	const toggleDarkMode = () => {
		toggleButton(toggleDarkModeButtonRef, 'toggleDarkModeButton', setTheme);
		playToggleSound();
	};

	const toggleShowChat = () => {
		toggleButton(toggleChatButtonRef, 'toggleChatButton', setChatHidden);
		playToggleSound();
	};

	const LayoutSettings = [
		{
			name: 'Chat',
			onClick: toggleShowChat,
			ref: toggleChatButtonRef,
			buttonOptions: ['Show', 'Hide'],
		}
	];

	const InterfaceSettings = [
		{
			name: 'Toggle Dark Mode',
			onClick: toggleDarkMode,
			ref: toggleDarkModeButtonRef,
			buttonOptions: ['On', 'Off'],
		}
	];

	return (
		<div ref={dropdownRef} className='dropdown'>
			<DropdownItem
				Icon={LayoutIcon}
				name='Layout Settings'
				options={LayoutSettings}
			/>
			<DropdownItem
				Icon={PaletteIcon}
				name='Interface Settings'
				options={InterfaceSettings}
			/>
			<VolumeSlider />

		</div>
	);
};

export default Dropdown;
