import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';

import Header from './components/Header/Header';
import JoinPage from './pages/JoinPage';
import JoinPageRoomPasscode from './pages/JoinPageRoomPasscode';
import RoomPage from './pages/VideoRoomPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.scss';
import 'notyf/notyf.min.css';

const socketURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_GAE_API_URL;

const App = () => {
	const socket = io(socketURL);
	const [info, setInfo] = useState({});
	const [authorized, setAuthorized] = useState(false);

	const handleSetCredentials = (username, roomId) => {
		username = username.trim();
		roomId = roomId.trim();
        setInfo({ username, roomId });
	};
	
	return (
		<BrowserRouter>
			<Header roomId={info.roomId} />
			<div className='app-component'>
				<Switch>
					<Route exact path='/' component={() => <RoomPage username={info.username} roomId={info.roomId} authorized={authorized} setAuthorized={setAuthorized} />} />
					<Route path='/join' component={() => <JoinPage handleSetCredentials={handleSetCredentials} socket={socket} setAuthorized={setAuthorized} />} />
					<Route path='/join-room-passcode' component={() => <JoinPageRoomPasscode handleSetCredentials={handleSetCredentials} socket={socket} setAuthorized={setAuthorized} />} />
					<Route component={NotFoundPage} />
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default App;
