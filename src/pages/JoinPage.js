import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import queryString from 'query-string';
import { CHECK_IF_ROOM_REQUIRES_PASSCODE, CHECK_IF_ROOM_IS_FULL } from '../SocketActions';
import { notyfError } from '../utils/notyf';

const JoinPage = ({ socket, handleSetCredentials, setAuthorized }) => {
    const history = useHistory();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [hideRoomIdInput, setHideRoomIdInput] = useState(false);

    useEffect(() => {
        const getRoomId = () => {
            const { roomId } = queryString.parse(location.search);
            return roomId ?? null;
        };

        const _roomId = getRoomId();

        if (_roomId) {
            setRoomId(_roomId);
            setHideRoomIdInput(true);
        };

    }, [location.search]);

    const handleOnChangeRoomId = (e) => setRoomId(e.target.value);
    const handleOnChangeUsername = (e) => setUsername(e.target.value);

    const handleGenerateRandomRoomId = (e) => setRoomId(createRandomRoomId(e));

    const preventDefault = (e) => e.keyCode === 13 && e.preventDefault();

	const createRandomRoomId = (e) => {
        e.preventDefault();
        const randomId = shortid.generate() + shortid.generate();
		return randomId;
	};

    const joinRoom = (e) => {
        e.preventDefault();
        
		if (username.trim() === '' || roomId.trim() === '') return;
		
        if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) {
			return notyfError('Username must be 1-30 characters', 2500);
		};

		if (roomId.length > 150) {
			return notyfError('The max length for RoomId is 150 characters', 2500);
		};
		
		socket.emit(CHECK_IF_ROOM_IS_FULL, roomId, (result) => {

			if (result === 'ROOM_IS_FULL') {
				return notyfError('Sorry, this room is full', 2500);
			};

			socket.emit(CHECK_IF_ROOM_REQUIRES_PASSCODE, roomId, (result) => {
				if (result === 'REQUIRES_PASSCODE') {
					return history.push('/enter-passcode', { username, roomId });
				} else if (!result) {
					handleSetCredentials(username, roomId);
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
						{!hideRoomIdInput && (
							<>
								<label htmlFor='roomId'>Room Id</label>
								<input
									type='text'
									name='roomId'
									id='roomId'
									value={roomId}
									onChange={handleOnChangeRoomId}
								/>
								<button
									className='generate-random-roomId-button'
									onClick={handleGenerateRandomRoomId}
								>
									Generate Random Room Id
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
