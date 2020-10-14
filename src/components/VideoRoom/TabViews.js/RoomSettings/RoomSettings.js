import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SET_MAX_ROOM_SIZE, SET_ROOM_PASSCODE, SET_NEW_HOST } from '../../../../SocketActions';
import Modal from './UserActionsModal';
import { validateSettings } from '../../../../utils/validators';
import { notyfError, notyfSuccess } from '../../../../utils/notyf';
import { SheildIcon } from './SheildIcon';

const RoomSettings = ({ socket, host, users, room }) => {
	const location = useLocation();

	const [roomId, setMaxRoomId] = useState(location.state.roomId);
    const [roomPasscode, setRoomPasscode] = useState('');
	const [maxRoomSize, setMaxRoomSize] = useState(20);
	const [userActionModal, setUserActionModal] = useState(null);
	const [errors, setErrors] = useState({});

	const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);
	const handleOnChangeMaxRoomSize = (e) => {
		const newMaxRoomSize = parseInt(e.target.value)
		setMaxRoomSize(newMaxRoomSize);
	};
	const handleOnChangeRoomId = (e) => setMaxRoomId(e.target.value);

	const handleSaveSettings = () => {
		
		if (maxRoomSize !== room.maxRoomSize) {
			console.log('1');
			const { valid, errors } = validateSettings({ maxRoomSize, currentNumberOfUsers: users.length });
			if (!valid) return setErrors(errors);
			socket.emit(SET_MAX_ROOM_SIZE, (maxRoomSize));
		};
		
		if (roomId !== room.roomId) {
			console.log('2');
			const { valid, errors } = validateSettings({ roomId });
			if (!valid) return setErrors(errors);

			socket.emit('CHANGE_ROOM_ID', roomId, (result, payload) => {
				if (result) notyfSuccess(payload, 2000);
				else if (!result) notyfError(payload, 2000);
			});
		};

		if (roomPasscode) {
			console.log('3');
			const { valid, errors } = validateSettings({ passcode: roomPasscode });
			if (!valid) return setErrors(errors);
			socket.emit(SET_ROOM_PASSCODE, roomPasscode);
		};
	};

	const handleSetNewHost = (userId) => socket.emit(SET_NEW_HOST, userId);
	
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
						className={ errors.maxRoomSize && 'has-error' }
					/>
					{ errors.maxRoomSize && <span className='error-message'>{errors.maxRoomSize}</span> }
				</li>
				<li>
					<label htmlFor='roomPasscode'>Room Passcode</label>
					<input
						type='password'
						id='roomPasscode'
						value={roomPasscode}
						onChange={handleOnChangeRoomPasscode}
						disabled={socket.id !== host}
						className={ errors.passcode && 'has-error' }
					/>
					{ errors.passcode && <span className='error-message'>{errors.passcode}</span> }
				</li>
				<li>
					<label htmlFor='roomId'>Room Id</label>
					<input
						type='text'
						id='roomId'
						value={roomId}
						onChange={handleOnChangeRoomId}
						disabled={socket.id !== host}
						className={ errors.roomId && 'has-error' }
					/>
					{ errors.roomId && <span className='error-message'>{errors.roomId}</span> }
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
