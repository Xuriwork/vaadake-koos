import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import shortid from 'shortid';
import queryString from 'query-string';

const JoinPage = ({ handleSetCredentials }) => {
    const history = useHistory();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [hideRoomIdInput, setHideRoomIdInput] = useState(false);
    const formContainerStyles = hideRoomIdInput ? 'join-form-container show-only-name-input' : 'join-form-container';

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
        if (!/^[a-zA-Z0-9_-]{1,30}$/.test(username)) return;
        if (roomId.length > 150) return;

        handleSetCredentials(username, roomId);
        history.push('/');
    };

    return (
        <div className='join-page'>
            <div className={formContainerStyles}>
                <form>
                    {!hideRoomIdInput && (
                        <>
                            <label>Room Id</label>
                            <input 
                                type='text' 
                                name='roomId' 
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
                    <label>Name</label>
                    <input 
                        type='text' 
                        name='name' 
                        value={username} 
                        onChange={handleOnChangeUsername} 
                        onKeyDown={preventDefault}   
                    />
                    <button className='join-button' onClick={joinRoom}>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinPage;
