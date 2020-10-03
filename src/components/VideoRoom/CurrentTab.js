import React from 'react';
import Chat from './TabViews.js/Chat/Chat';
import Playlist from './TabViews.js/Playlist/Playlist';
import RoomSettings from './TabViews.js/RoomSettings';

const CurrentTab = ({
	tab,
	setTab,
	messages,
	users,
	socket,
	host,
	sendMessage,
	handleSetNewHost,
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
		<button onClick={handleSetToChatView} className='close-button'>×</button>
			{tab === 'chat' && (
				<Chat
					messages={messages}
					users={users}
					socket={socket}
					sendMessage={sendMessage}
					host={host}
					handleSetNewHost={handleSetNewHost}
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
			{tab === 'room-settings' && <RoomSettings socket={socket} host={host} />}
		</div>
	);
};

export default CurrentTab;
