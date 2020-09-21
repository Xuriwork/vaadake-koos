import React, { useState } from 'react';
import shortid from 'shortid';

const Chat = ({ messages, sendMessage, users }) => {
	const [message, setMessage] = useState('');

	const handleOnChangeMessage = (e) => setMessage(e.target.value);
	const handleOnKeyDown = (e) => {
        if (e.keyCode === 13) handleSendMessage(e);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
        if (message.trim() === '') return;
        sendMessage(message);
        setMessage('');
	};

	return (
		<div className='chat-container'>
			<div className='users-list-container'>
				<h3>Connected Users</h3>
				<ul>
					{users.map((user) => (
						<li key={shortid.generate()}>
							<span role='img' aria-label='online indicator'></span>
							{user}
						</li>
					))}
				</ul>
			</div>
			<div className='messages-container'>
				{messages.map((message, index) => (
					<div
						className={
							message.type === 'SERVER_USER-JOINED'
								? 'SERVER_USER-JOINED message'
								: message.type === 'SERVER_USER-LEFT'
								? 'SERVER_USER-LEFT message'
								: 'message'
						}
						key={index}
					>
						{message.type === 'SERVER_USER-JOINED' ||
						message.type === 'SERVER_USER-LEFT' ? null : (
							<h4 className='message-author'>{message.username}</h4>
						)}
						<div className='message-content'>{message.content}</div>
					</div>
				))}
			</div>
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
