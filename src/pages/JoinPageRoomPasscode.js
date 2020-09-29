import React, { useState } from 'react';

const JoinPageRoomPasscode = () => {
    const [roomPasscode, setRoomPasscode] = useState('');

    const handleOnChangeRoomPasscode = (e) => setRoomPasscode(e.target.value);

    const joinRoom = (e) => {
        e.preventDefault();
        console.log('Verifying passcode...');
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
