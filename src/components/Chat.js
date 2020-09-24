import React, { useEffect, useRef, useState } from 'react';
import DownArrowIcon from '../assets/icons/arrow-down-circle-fill.svg';

const SheildIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width='24'
		height='24'
	>
		<path fill='none' d='M0 0h24v24H0z' />
		<path
			d='M3.783 2.826L12 1l8.217 1.826a1 1 0 0 1 .783.976v9.987a6 6 0 0 1-2.672 4.992L12 23l-6.328-4.219A6 6 0 0 1 3 13.79V3.802a1 1 0 0 1 .783-.976zM12 13.5l2.939 1.545-.561-3.272 2.377-2.318-3.286-.478L12 6l-1.47 2.977-3.285.478 2.377 2.318-.56 3.272L12 13.5z'
			fill='rgba(215,35,35,1)'
		/>
	</svg>
);

const AddUserIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width='24'
		height='24'
	>
		<path fill='none' d='M0 0h24v24H0z' />
		<path
			d='M14 14.252V22H4a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm6 4v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z'
			fill='rgba(215,35,35,1)'
		/>
	</svg>
);

const Chat = ({ messages, sendMessage, users, socket, host, handleSetNewHost }) => {
	const [message, setMessage] = useState('');
	const [newMessagePopup, setNewMessagePopup] = useState(false);
	const chatContainerRef = useRef(null);
	
	const scrollToBottom = () => {
		const chatContainer = chatContainerRef.current;
		const { scrollHeight, scrollTop, offsetHeight } = chatContainer;
		chatContainer.maxScrollTop = scrollHeight - offsetHeight;

		if (chatContainer.maxScrollTop - scrollTop <= offsetHeight) {
			chatContainer.scroll(0, scrollHeight);
		} else setNewMessagePopup(true);
	};

	useEffect(() => scrollToBottom(), [messages]);

	const handleRemoveNewMessagesAlert = () => setNewMessagePopup(false);

	const handleOnChangeMessage = (e) => setMessage(e.target.value);
	const handleOnKeyDown = (e) => {
        if (e.keyCode === 13) handleSendMessage(e);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
        if (!socket || message.trim() === '') return;
        sendMessage(message);
        setMessage('');
	};

	return (
		<div className='chat-container'>
			<div className='users-list-container'>
				<h3>Connected Users: {users.length}</h3>
				<ul>
					{users.map((user) => (
						<li key={user.id} data-isadmin={user.id === host}>
							{user.id === host && <SheildIcon />}
							{host === socket.id && user.id !== host && (
								<button
									className='add-user-button'
									onClick={() => handleSetNewHost(user.id)}
								>
									<AddUserIcon />
								</button>
							)}
							{user.username}
						</li>
					))}
				</ul>
			</div>
			<div className='messages-container' ref={chatContainerRef}>
				{messages.map(({ type, content, username }, index) => (
					<div
						className={
							type === 'SERVER_USER-JOINED'
								? 'SERVER_USER-JOINED message'
								: type === 'SERVER_USER-LEFT'
								? 'SERVER_USER-LEFT message' 
								: type === 'NEW_HOST'
								? 'NEW_HOST message'
								: 'message'
						}
						key={index}
					>
						{type === 'SERVER_USER-JOINED' ||
						type === 'SERVER_USER-LEFT' || 
						type === 'NEW_HOST' ? null : (
							<h4 className='message-author'>{username}</h4>
						)}
						<p className='message-content'>{content}</p>
					</div>
				))}
			</div>
			{newMessagePopup && (
				<span
					className='new-messages-alert'
					onClick={handleRemoveNewMessagesAlert}
				>
					New messages <img src={DownArrowIcon} alt='Scroll down' />{' '}
				</span>
			)}
			<div className='message-input-container'>
				<input
					type='text'
					value={message}
					onChange={handleOnChangeMessage}
					onKeyDown={handleOnKeyDown}
					placeholder='Say something'
				/>
				<button onClick={handleSendMessage}>Send</button>
			</div>
		</div>
	);
};

export default Chat;
