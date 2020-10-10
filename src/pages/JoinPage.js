import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import { validateData } from '../utils/validators';
import { notyfError } from '../utils/notyf';
import { CHECK_IF_ROOM_REQUIRES_PASSCODE, CHECK_IF_ROOM_IS_FULL } from '../SocketActions';

const JoinPage = ({ socket, handleSetCredentials, setAuthorized }) => {
    const history = useHistory();
	const location = useLocation();
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
	const [hideRoomNameInput, setHideRoomNameInput] = useState(false);
	const [errors, setErrors] = useState({});

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

		const { valid, errors } = validateData(username, roomName);

		if (!valid) return setErrors(errors);

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
									className={ errors.roomName && 'has-error' }
								/>
								{ errors.roomName && <span className='error-message'>{errors.roomName}</span> }
								<button
									className='generate-random-roomname-button'
									onClick={handleGenerateRandomRoomName}
								>
									Generate Random Room Name
								</button>
							</>
						)}
						<label htmlFor='username'>Username</label>
						<input
							type='text'
							name='username'
							id='username'
							value={username}
							onChange={handleOnChangeUsername}
							onKeyDown={preventDefault}
							className={ errors.username && 'has-error' }
						/>
						{ errors.username && <span className='error-message'>{errors.username}</span> }
						<button className='join-button' onClick={joinRoom}>
							Join
						</button>
					</form>
				</div>
			</div>
		);
}

export default JoinPage;
