import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.scss';
import 'notyf/notyf.min.css';

import ThemeProvider from './context/ThemeContext';

import Header from './components/Header';
import JoinPage from './pages/JoinPage';
import RoomPage from './pages/VideoRoomPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
	const [info, setInfo] = useState({});

	const handleSetCredentials = (username, roomId) => {
        setInfo({username, roomId });
	};

	return (
		<ThemeProvider>
			<BrowserRouter>
				<Header roomId={info.roomId} />
				<div className='app-component'>
					<Switch>
						<Route exact path='/' component={() => <RoomPage username={info.username} roomId={info.roomId} />} />
						<Route path='/join' component={() => <JoinPage handleSetCredentials={handleSetCredentials} />} />
						<Route component={NotFoundPage} />
					</Switch>
				</div>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
