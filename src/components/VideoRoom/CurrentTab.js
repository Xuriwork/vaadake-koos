import React from 'react';
import Chat from './TabViews.js/Chat';
import Playlist from './TabViews.js/Playlist/Playlist';
import RoomSettings from './TabViews.js/RoomSettings/RoomSettings';

const CurrentTab = ({
	tab,
	setTab,
	messages,
	users,
	socket,
	host,
	sendMessage,
	handleSetNewHost,
	handleKickUser,
	playlist,
	addToPlaylist,
	removeFromPlaylist,
	handleChangeVideo
}) => {

	const handleSetToChatView = () => setTab('chat');

    const currentTabComponentClassName =
			tab === 'chat'
				? 'current-tab-component chat-tab'
				: tab === 'playlist'
				? 'current-tab-component playlist-tab'
				: 'current-tab-component room-settings-tab';

	return (
		<div className={currentTabComponentClassName}>
			<button onClick={handleSetToChatView} className='close-button'>
				×
			</button>
			{tab === 'chat' && (
				<Chat
					messages={messages}
					users={users}
					socket={socket}
					sendMessage={sendMessage}
				/>
			)}
			{tab === 'playlist' && (
				<Playlist
					playlist={playlist}
					addToPlaylist={addToPlaylist}
					removeFromPlaylist={removeFromPlaylist}
					handleChangeVideo={handleChangeVideo}
				/>
			)}
			{tab === 'room-settings' && (
				<RoomSettings
					socket={socket}
					host={host}
					users={users}
					handleSetNewHost={handleSetNewHost}
					handleKickUser={handleKickUser}
				/>
			)}
		</div>
	);
};

export default CurrentTab;
