import React, { useEffect, useRef, useState } from 'react';
import DownArrowIcon from '../assets/icons/arrow-down-circle-fill.svg';

const Chat = ({ messages, sendMessage, users, socket }) => {
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
							<li key={user.id}>
								<span role='img' aria-label='online indicator'></span>
								{user.username}
							</li>
						))}
					</ul>
				</div>
				<div className='messages-container' ref={chatContainerRef}>
					{messages.map((message, index) => (
						<div
							className={
								message.type === 'SERVER_USER-JOINED'
									? 'SERVER_USER-JOINED SERVER_MESSAGE message'
									: message.type === 'SERVER_USER-LEFT'
									? 'SERVER_USER-LEFT SERVER_MESSAGE message'
									: 'message'
							}
							key={index}
						>
							{message.type === 'SERVER_USER-JOINED' ||
							message.type === 'SERVER_USER-LEFT' ? null : (
								<h4 className='message-author'>{message.username}</h4>
							)}
							<p className='message-content'>{message.content}</p>
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
