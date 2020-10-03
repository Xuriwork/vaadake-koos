import React, { useState } from 'react';
import { SET_MAX_ROOM_SIZE, SET_ROOM_PASSCODE } from '../../../../SocketActions';
import Modal from './UserActionsModal';
import { SheildIcon } from './SheildIcon';

const RoomSettings = ({ socket, host, users, handleSetNewHost, handleKickUser }) => {
    const [roomPasscode, setRoomPasscode] = useState('');
	const [maxRoomSize, setMaxRoomSize] = useState(20);
	const [userActionModal, setUserActionModal] = useState(null);

	const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);
	const handleOnChangeMaxRoomSize = (e) => setMaxRoomSize(e.target.value);

	const handleSaveSettings = () => {
		if (roomPasscode.trim() !== '') {
			socket.emit(SET_ROOM_PASSCODE, roomPasscode);
		};

		if (maxRoomSize > 0) {
			socket.emit(SET_MAX_ROOM_SIZE, (maxRoomSize * 1));
		};
	};
	
	const filteredUsers = users.filter((user) => user.id !== host);
	const currentHost = users.filter((user) => user.id === host)[0];

	const handleOpenUserModal = (userId) => {
		if (host !== socket.id) return;
		setUserActionModal(userId);
	};

	const handleCloseModal = () => setUserActionModal(null);

	return (
		<>
			{userActionModal && (
				<Modal
					userId={userActionModal}
					handleSetNewHost={handleSetNewHost}
					handleKickUser={handleKickUser}
					handleCloseModal={handleCloseModal}
				/>
			)}
			<h2>Room Settings</h2>
			<div className='users-list-container'>
				<h3>Connected Users: {users.length}</h3>
				<ul>
					{host && (
						<li data-isadmin={true}>
							<SheildIcon />
							{currentHost?.username}
						</li>
					)}
					{filteredUsers.map((user) => {
						return (
							<li
								key={user.id}
								onClick={() => handleOpenUserModal(user.id)}
							>
								{user.username}
							</li>
						);
					})}
				</ul>
			</div>
			<ul>
				<li>
					<label htmlFor='max-room-size'>Max Room Size</label>
					<input
						type='number'
						min={1}
						max={20}
						value={maxRoomSize}
						id='max-room-size'
						onChange={handleOnChangeMaxRoomSize}
						disabled={socket.id !== host}
					/>
				</li>
				<li>
					<label htmlFor='room-passcode'>Room Passcode</label>
					<input
						type='text'
						id='room-passcode'
						value={roomPasscode}
						onChange={handleOnChangeRoomPasscode}
						disabled={socket.id !== host}
					/>
				</li>
			</ul>
			<button
				className='save-button'
				onClick={handleSaveSettings}
				disabled={socket.id !== host}
			>
				Save
			</button>
		</>
	);
};

export default RoomSettings;
