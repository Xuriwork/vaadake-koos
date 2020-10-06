import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import { CHECK_IF_ROOM_REQUIRES_PASSCODE, CHECK_IF_ROOM_IS_FULL } from '../SocketActions';
import { notyfError } from '../utils/notyf';

const JoinPage = ({ socket, handleSetCredentials, setAuthorized }) => {
    const history = useHistory();
	const location = useLocation();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [hideRoomNameInput, setHideRoomNameInput] = useState(false);

    useEffect(() => {
        const getRoomName = () => {
			if (!location.state) return null;
			else if (location.state.roomName) {
				return location.state.roomName;
			};
        };

        const roomName = getRoomName();

        if (roomName) {
            setRoomName(roomName);
            setHideRoomNameInput(true);
		};
    }, [location.state]);

    const handleOnChangeRoomName = (e) => setRoomName(e.target.value);
    const handleOnChangeUsername = (e) => setUsername(e.target.value);

    const handleGenerateRandomRoomName = (e) => setRoomName(createRandomRoomName(e));

    const preventDefault = (e) => {
		if (e.keyCode === 13 && hideRoomNameInput) {
			return joinRoom(e);
		};
		if (e.keyCode === 13 && roomName.trim() !== '' && username.trim() !== '') {
			joinRoom(e);
		};
		e.keyCode === 13 && e.preventDefault();
	};

	const createRandomRoomName = (e) => {
        e.preventDefault();
        const randomId = shortid.generate() + shortid.generate();
		return randomId;
	};

    const joinRoom = (e) => {
        e.preventDefault();
        
		if (username.trim() === '' || roomName.trim() === '') return;
		
        if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) {
			return notyfError('Username must be 1-30 characters', 2500);
		};

		if (!/^[a-zA-Z0-9_-]{1,150}$/.test(roomName)) {
			return notyfError('Roomname must be 1-30 characters', 2500);
		};

		if (roomName.length > 150) {
			return notyfError('The max length for room name is 150 characters', 2500);
		};
		
		socket.emit(CHECK_IF_ROOM_IS_FULL, roomName, (result) => {

			if (result === 'ROOM_IS_FULL') {
				return notyfError('Sorry, this room is full', 2500);
			};

			socket.emit(CHECK_IF_ROOM_REQUIRES_PASSCODE, roomName, (result) => {
				if (result === 'REQUIRES_PASSCODE') {
					return history.push('/enter-passcode', { username, roomName });
				} else if (!result) {
					handleSetCredentials(username, roomName);
					setAuthorized(true);
					history.push('/');
				};
			});
		});
    };

    return (
			<div className='join-page'>
				<div className='join-form-container'>
					<form>
						{!hideRoomNameInput && (
							<>
								<label htmlFor='roomName'>Room Name</label>
								<input
									type='text'
									name='roomName'
									id='roomName'
									value={roomName}
									onChange={handleOnChangeRoomName}
								/>
								<button
									className='generate-random-roomName-button'
									onClick={handleGenerateRandomRoomName}
								>
									Generate Random Room Name
								</button>
							</>
						)}
						<label htmlFor='name'>Name</label>
						<input
							type='text'
							name='name'
							id='name'
							value={username}
							onChange={handleOnChangeUsername}
							onKeyDown={preventDefault}
						/>
						<button className='join-button' onClick={joinRoom}>
							Join
						</button>
					</form>
				</div>
			</div>
		);
}

export default JoinPage;
