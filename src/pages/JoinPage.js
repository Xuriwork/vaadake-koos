import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import shortid from 'shortid';

const JoinPage = ({ handleSetCredentials }) => {
    const history = useHistory();
    const [username, setUsername] = useState('');
	const [roomId, setRoomId] = useState('');

    const handleOnChangeRoomId = (e) => setRoomId(e.target.value);
    const handleOnChangeUsername = (e) => setUsername(e.target.value);

    const handleGenerateRandomRoomId = (e) => setRoomId(createRandomRoomId(e));

	const createRandomRoomId = (e) => {
        e.preventDefault();
        const randomId = shortid.generate() + shortid.generate();
		return randomId;
	};

    const joinRoom = (e) => {
        e.preventDefault();
        
        if (username.trim() === '' || roomId.trim() === '') return;
        if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) return;

        handleSetCredentials(username, roomId);
        history.push('/');
    };

    return (
        <div className='join-page'>
            <div className='join-form-container'>
                <form>
                    <label>Room Id</label>
                    <input type='text' name='roomId' value={roomId} onChange={handleOnChangeRoomId} />
                    <button className='generate-random-roomId-button' onClick={handleGenerateRandomRoomId}>Generate Random Room Id</button>
                    <label>Name</label>
                    <input type='text' name='name' value={username} onChange={handleOnChangeUsername} />
                    <button className='join-button' onClick={joinRoom}>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinPage;
