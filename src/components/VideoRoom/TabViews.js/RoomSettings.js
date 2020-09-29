import React, { useState } from 'react';
import { SET_MAX_ROOM_SIZE, SET_ROOM_PASSCODE } from '../../../SocketActions';

const RoomSettings = ({ socket, host }) => {
    const [roomPasscode, setRoomPasscode] = useState('');
    const [maxRoomSize, setMaxRoomSize] = useState(20);

	const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);
	const handleOnChangeMaxRoomSize = (e) => setMaxRoomSize(e.target.value);

	const handleSaveSettings = () => {
		if (roomPasscode.trim() !== '') {
			socket.emit(SET_ROOM_PASSCODE, roomPasscode);
		};

		if (maxRoomSize.trim() !== '') {
			socket.emit(SET_MAX_ROOM_SIZE, maxRoomSize);
		};
    };

	return (
		<>
			<h2>Room Settings</h2>
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
			<button onClick={handleSaveSettings}>Save</button>
		</>
	);
};

export default RoomSettings;
