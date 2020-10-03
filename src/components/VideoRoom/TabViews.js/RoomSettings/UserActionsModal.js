import React from 'react';

const UserActionsModal = ({ handleSetNewHost, handleKickUser, handleCloseModal, userId }) => {

    const setNewHost = () => {
        handleSetNewHost(userId);
        handleCloseModal();
    };

    const kickUser = () => {
        handleKickUser(userId);
        handleCloseModal();
    };

    return (
        <div className='user-actions-modal-container'>
            <div className='modal'>
                <button onClick={handleCloseModal} className='close-button'>×</button>
                <button onClick={setNewHost}>Make Admin</button>
                <button onClick={kickUser}>Kick User</button>
            </div>
        </div>
    )
}

export default UserActionsModal;
