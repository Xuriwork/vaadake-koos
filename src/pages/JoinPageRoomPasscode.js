import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notyfError, notyfSuccess } from '../utils/notyf';
import { VERIFY_PASSCODE } from '../SocketActions';

const JoinPageRoomPasscode = ({ socket, setAuthorized, handleSetCredentials }) => {
    const history = useHistory();
    const [roomPasscode, setRoomPasscode] = useState('');

    useEffect(() => {
        const { state } = history.location;
        if (!state) return history.push('/join');
        if (!(state.username && state.roomName)) return history.push('/join');

    }, [history]);

    const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);

    const joinRoom = (e) => {
        e.preventDefault();
        const { username, roomName } = history.location.state;

        socket.emit(VERIFY_PASSCODE, { roomName, username, passcode: roomPasscode }, (result, other) => {
            if (result === 'CORRECT_PASSCODE') {
                notyfSuccess('Passcode correct', 5000);
                handleSetCredentials(username, roomName);
                setAuthorized(true);
                history.push('/');
            } else if (result === 'INCORRECT_PASSCODE') {
                notyfError('Incorrect passcode', 5000);
            };
        });
    };

    return (
        <div className='join-page'>
            <div className='join-form-container'>
                <form>
                    <label htmlFor='roomPasscode'>Room Passcode</label>
                    <input
                        type='text'
                        name='name'
                        id='roomPasscode'
                        value={roomPasscode}
                        onChange={handleOnChangeRoomPasscode}
                    />
                    <button className='join-button' onClick={joinRoom}>
							Join
					</button>
                </form>
            </div>
        </div>
    )
};

export default JoinPageRoomPasscode;
