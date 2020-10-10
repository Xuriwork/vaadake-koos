import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { notyfError, notyfSuccess } from '../../utils/notyf';
import { useSettings } from '../../context/SettingsContext';

import Dropdown from './Dropdown/Dropdown';

import Logo from '../../assets/images/vaadake_koos_logo.svg';
import LogoDarkMode from '../../assets/images/vaadake_koos_logo_dm.svg';
import InviteUserIcon from '../../assets/icons/user-add-fill.svg';

const Header = ({ roomName }) => {
	const roomNameInputRef = useRef(null);
	const dropdownButtonRef = useRef(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const location = useLocation();
	const { theme } = useSettings();
    
	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	const closeDropdown = () => setTimeout(() => setDropdownOpen(false), 250);

	const copyToClipboard = (e) => {
		roomNameInputRef.current.select();
		document.execCommand('copy');
		e.target.focus();
		notyfSuccess('Copied to clipboard 📋', 2500);
	};
	
	const updateClipboard = (textToCopy) => {
		navigator.clipboard.writeText(textToCopy).then(() => {
			notyfSuccess('Copied invite link 📋', 2500);
		}, () => notyfError('Failed to copy invite link 🙁', 3000));
	};

	const handleGetInviteCode = () => {
		const inviteCode = location.state.inviteCode;
		const inviteLink = `${window.location.href}invite/${inviteCode}`;
		updateClipboard(inviteLink);
	};

	return (
		<header className='header'>
			<Link to='/join'>
				{theme === 'light' ? (
					<img src={Logo} alt='logo' className='logo' />
				) : (
					<img src={LogoDarkMode} alt='logo' className='logo' />
				)}
			</Link>
			{roomName && (
				<div className='roomName-code-container'>
					<input
						ref={roomNameInputRef}
						defaultValue={roomName}
						readOnly={true}
						className='roomName-code-input'
						onClick={copyToClipboard}
					/>
					<button onClick={handleGetInviteCode}>
						<img src={InviteUserIcon} alt='Get invite link' />
					</button>
				</div>
			)}
			<button
				ref={dropdownButtonRef}
				onClick={toggleDropdown}
				className='settings-button'
				aria-label='settings'
			>
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
				<Dropdown
					dropdownOpen={dropdownOpen}
					closeDropdown={closeDropdown}
					dropdownButtonRef={dropdownButtonRef}
				/>
			)}
		</header>
	);
};

export default Header;
