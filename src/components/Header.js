import React, { useState } from 'react';
import Logo from '../assets/vaadake_koos_logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {
    const [dropdownOpen, setDropdown] = useState(false);
    
    const toggleDropdown = () => setDropdown(!dropdownOpen);

	return (
		<header className='header'>
            <Link to='/join'>
                <img src={Logo} alt='logo' className='logo' />
            </Link>
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
						<button>
							<span className='toggled-on'>Show</span>
							<span>Hide</span>
						</button>
					</div>
					<h3>Interface Settings</h3>
					<div className='settings-option-container'>
						<p>Toggle Dark Mode</p>
						<button>
							<span className='toggled-on'>On</span>
							<span>Off</span>
						</button>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
