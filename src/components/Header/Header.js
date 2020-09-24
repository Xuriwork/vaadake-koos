import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';

import Logo from '../../assets/images/vaadake_koos_logo.svg';
import LinksIcon from '../../assets/icons/links-line.svg';

import Dropdown from './Dropdown/Dropdown';

const notyf = new Notyf({
	duration: 2500,
	position: {
		x: 'right',
		y: 'bottom',
	},
});

const Header = ({ roomId }) => {
	const roomIdInputRef = useRef(null);
	const dropdownButtonRef = useRef(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
    
	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	const closeDropdown = () => setTimeout(() => setDropdownOpen(false), 250);

	const copyToClipboard = (e) => {
		roomIdInputRef.current.select();
		document.execCommand('copy');
		e.target.focus();
		notyf.success('Copied to clipboard 📋');
	};
	
	const updateClipboard = (textToCopy) => {
		navigator.clipboard.writeText(textToCopy).then(() => {
			notyf.success('Copied invite link 📋');
		}, () => notyf.success('Failed to copy invite link 🙁'));
	};

	const handleCreateInviteCode = () => {
		const inviteLink = `${window.location.href}join?roomId=${roomId}`;
		updateClipboard(inviteLink);
	};

	return (
		<header className='header'>
			<Link to='/join'>
				<img src={Logo} alt='logo' className='logo' />
			</Link>
			{roomId && (
				<div className='roomId-code-container'>
					<input
						ref={roomIdInputRef}
						defaultValue={roomId}
						readOnly={true}
						className='show-connected-roomId-input'
						onClick={copyToClipboard}
					/>
					<button onClick={handleCreateInviteCode}>
						<img src={LinksIcon} alt='Get invite link' />
					</button>
				</div>
			)}
			<button
				ref={dropdownButtonRef}
				onClick={toggleDropdown}
				className='settings-button'
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
