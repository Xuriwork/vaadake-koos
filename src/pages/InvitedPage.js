import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Redirecting from '../components/Redirecting';
import { GET_SHORT_URL } from '../SocketActions';
import { notyfError } from '../utils/notyf';

const InvitedPage = ({ socket }) => {
    const { roomId } = useParams();
    const history = useHistory();

    useEffect(() => {
        socket.emit(GET_SHORT_URL, roomId, (result, roomName) => {
            if (result) {
                history.push('/join', { roomName });
            } else if (!result) {
                history.push('/join');
                notyfError('Invalid invite link', 2500);
            };
        });
    }, [roomId, socket, history]);

    return <Redirecting />;
}

export default InvitedPage;
