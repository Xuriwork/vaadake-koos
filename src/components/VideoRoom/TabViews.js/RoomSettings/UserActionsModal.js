import React, { useRef } from 'react';

const UserActionsModal = ({ handleSetNewHost, handleCloseModal, userId }) => {

    const modalRef = useRef(null);

    const setNewHost = () => {
        handleSetNewHost(userId);
        handleCloseModal();
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
            </div>
        </div>
    )
}

export default UserActionsModal;
