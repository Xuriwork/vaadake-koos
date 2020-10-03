import React, { useRef } from 'react';

const UserActionsModal = ({ handleSetNewHost, handleKickUser, handleCloseModal, userId }) => {

    const modalRef = useRef(null);

    const setNewHost = () => {
        handleSetNewHost(userId);
        handleCloseModal();
    };

    const kickUser = () => {
        alert('Not implemented yet');
        // handleKickUser(userId);
        // handleCloseModal();
    };

    window.onclick = (e) => {
        if (e.target.contains(modalRef.current)) {
            handleCloseModal();
        };
    };

    return (
        <div className='user-actions-modal-container'>
            <div ref={modalRef} className='modal'>
                <button onClick={handleCloseModal} className='close-button'>×</button>
                <button onClick={setNewHost}>Make Admin</button>
                <button onClick={kickUser}>Kick User</button>
            </div>
        </div>
    )
}

export default UserActionsModal;
