import React, { useEffect, useRef } from 'react';
import { Notyf } from 'notyf';
import { useSettings } from '../../context/SettingsContext';
import toggleButton from './toggleButton';
import LayoutIcon from '../../assets/layout-5-fill.svg';
import PaletteIcon from '../../assets/palette-fill.svg';

const notyf = new Notyf({
	duration: 2500,
	position: {
		x: 'right',
		y: 'bottom',
	},
});

const Dropdown = ({ dropdownOpen, closeDropdown, dropdownButtonRef }) => {
    const { theme, chatHidden, setTheme, setChatHidden } = useSettings();
    const toggleChatButtonRef = useRef(null);
	const toggleDarkModeButtonRef = useRef(null);
	const dropdownRef = useRef(null);

	const dropdownClass = dropdownOpen ? 'dropdown' : 'dropdown hidden';

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
		notyf.error('Not implemented yet, but I\'m like this 🤏 close.');
	};

	const toggleShowChat = () => toggleButton(toggleChatButtonRef, 'toggleChatButton', setChatHidden);

	return (
		<>
		<div ref={dropdownRef} className={dropdownClass}>
			<span>
				<img src={LayoutIcon} alt='layout' />
				<h3>Layout Settings</h3>
			</span>
			<div className='settings-option-container'>
				<p>Chat</p>
				<button onClick={toggleShowChat} ref={toggleChatButtonRef}>
					<span>Show</span>
					<span>Hide</span>
				</button>
			</div>
			<span>
				<img src={PaletteIcon} alt='palette' />
				<h3>Interface Settings</h3>
			</span>
			<div className='settings-option-container'>
				<p>Toggle Dark Mode</p>
				<button onClick={toggleDarkMode} ref={toggleDarkModeButtonRef}>
					<span>On</span>
					<span>Off</span>
				</button>
			</div>
		</div>
		</>
	);
};

export default Dropdown;
