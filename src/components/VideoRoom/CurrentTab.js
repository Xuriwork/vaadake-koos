import React from 'react';
import Chat from './TabViews.js/Chat';
import Queue from './TabViews.js/Queue/Queue';
import RoomSettings from './TabViews.js/RoomSettings/RoomSettings';

const CurrentTab = ({
	tab,
	setTab,
	messages,
	users,
	socket,
	room,
	host,
	sendMessage,
	handleSetNewHost,
	queue,
	addToQueue,
	removeFromQueue,
	handleChangeVideo
}) => {

	const handleSetToChatView = () => setTab('chat');

    const currentTabComponentClassName =
			tab === 'chat'
				? 'current-tab-component chat-tab'
				: tab === 'queue'
				? 'current-tab-component queue-tab'
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
			{tab === 'queue' && (
				<Queue
					queue={queue}
					addToQueue={addToQueue}
					removeFromQueue={removeFromQueue}
					handleChangeVideo={handleChangeVideo}
				/>
			)}
			{tab === 'room-settings' && (
				<RoomSettings
					socket={socket}
					host={host}
					room={room}
					users={users}
					handleSetNewHost={handleSetNewHost}
				/>
			)}
		</div>
	);
};

export default CurrentTab;
