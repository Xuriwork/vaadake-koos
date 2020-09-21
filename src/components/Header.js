import React, { useState, useEffect, useRef } from 'react';
import Logo from '../assets/vaadake_koos_logo.svg';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toggleButton from './toggleButton';
 
const Header = ({ roomId }) => {
	const { theme, chatHidden, setTheme, setChatHidden } = useTheme();
	const toggleChatButtonRef = useRef(null);
	const toggleDarkModeButtonRef = useRef(null);
	const roomIdInputRef = useRef(null);
	const [dropdownOpen, setDropdown] = useState(false);

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
    
	const toggleDropdown = () => setDropdown(!dropdownOpen);
	const toggleShowChat = () => toggleButton(toggleChatButtonRef, 'toggleChatButton', setChatHidden);
	const toggleDarkMode = () => toggleButton(toggleDarkModeButtonRef, 'toggleDarkModeButton', setTheme);

	const copyToClipboard = (e) => {
		roomIdInputRef.current.select();
		document.execCommand('copy');
		e.target.focus();
	};

	return (
		<header className='header'>
			<Link to='/join'>
				<img src={Logo} alt='logo' className='logo' />
			</Link>
			{roomId && (
				<input
					ref={roomIdInputRef}
					defaultValue={roomId}
					readOnly={true}
					className='show-connected-roomId-input'
					onClick={copyToClipboard}
				/>
			)}
			<button onClick={toggleDropdown} className='settings-button'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='24'
					height='24'
				>
					<path fill='none' d='M0 0h24v24H0z' />
					<path
						d='M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
						fill='rgba(255,255,255,1)'
					/>
				</svg>
			</button>
			{dropdownOpen && (
				<div className='dropdown'>
					<h3>Layout Settings</h3>
					<div className='settings-option-container'>
						<p>Chat</p>
						<button onClick={toggleShowChat} ref={toggleChatButtonRef}>
							<span>Show</span>
							<span>Hide</span>
						</button>
					</div>
					<h3>Interface Settings</h3>
					<div className='settings-option-container'>
						<p>Toggle Dark Mode</p>
						<button onClick={toggleDarkMode} ref={toggleDarkModeButtonRef}>
							<span>On</span>
							<span>Off</span>
						</button>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
