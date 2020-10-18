import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notyfError, notyfRedirecting } from '../utils/notyf';
import { VERIFY_PASSCODE } from '../SocketActions';
import { isEmpty } from '../utils/validators';

const JoinPageRoomPasscode = ({ socket, setAuthorized, roomName, username }) => {
    const history = useHistory();
    const [roomPasscode, setRoomPasscode] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!(roomName && username)) return history.push('/join');
    }, [history, roomName, username]);

    const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);

    const joinRoom = async (e) => {
        e.preventDefault();

        if (isEmpty(roomPasscode)) return setError('This field is required');

        socket.emit(VERIFY_PASSCODE, { roomName, passcode: roomPasscode }, (result) => {
            if (result === true) {
                notyfRedirecting(500);
                setAuthorized(true);
                setTimeout(() => history.push('/'), 500);
            } else notyfError('Incorrect passcode', 5000);
        });
    };

    return (
        <div className='join-page'>
            <div className='join-form-container'>
                <form>
                    <label htmlFor='roomPasscode'>Room Passcode</label>
                    <input
                        type='password'
                        name='roomPasscode'
                        id='roomPasscode'
                        value={roomPasscode}
                        onChange={handleOnChangeRoomPasscode}
                        className={ error && 'has-error' }
                    />
                    { error && <span className='error-message'>{error}</span> }
                    <button className='join-button' onClick={joinRoom}>
							Join
					</button>
                </form>
            </div>
        </div>
    )
};

export default JoinPageRoomPasscode;
