import React, { useState } from 'react';

const RoomSettings = ({ socket }) => {
    const [roomPasscode, setRoomPasscode] = useState('');
    const [maxRoomSize, setMaxRoomSize] = useState(20);

	const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);
	const handleOnChangeMaxRoomSize = (e) => setMaxRoomSize(e.target.value);

	const handleSaveSettings = () => {
        console.log('Room Passcode: ', roomPasscode);
        console.log('Max Room Size: ', maxRoomSize);
		
		socket.emit('SET_ROOM_PASSCODE', roomPasscode);
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
					/>
				</li>
				<li>
					<label htmlFor='room-passcode'>Room Passcode</label>
					<input
						type='text'
						id='room-passcode'
                        value={roomPasscode}
						onChange={handleOnChangeRoomPasscode}
					/>
				</li>
			</ul>
			<button onClick={handleSaveSettings}>Save</button>
		</>
	);
};

export default RoomSettings;
