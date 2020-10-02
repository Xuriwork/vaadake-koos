import React from 'react';
import { PlaylistIcon, ChatIcon, RoomSettingsIcon } from './TabIcons';

export const Tabs = ({ tab, setTab }) => {

	const handleChangeTabView = (tab) => setTab(tab);

	return (
		<div
			className='video-room-page-tabs'
			role='tablist'
			aria-label='Video Room Tabs'
		>
			<button
				role='tab'
				className={tab === 'chat' ? 'tab active' : 'tab'}
				onClick={() => handleChangeTabView('chat')}
			>
				<ChatIcon />
				Chat
			</button>
			<button
				role='tab'
				className={tab === 'playlist' ? 'tab active' : 'tab'}
				onClick={() => handleChangeTabView('playlist')}
			>
				<PlaylistIcon />
				Playlist
			</button>
			<button
				role='tab'
				className={tab === 'room-settings' ? 'tab active' : 'tab'}
				onClick={() => handleChangeTabView('room-settings')}
			>
				<RoomSettingsIcon />
				Room Settings
			</button>
		</div>
	);
};

export default Tabs;