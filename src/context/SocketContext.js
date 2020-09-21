import Loading from '../components/Loading';
import React, { useState } from 'react';
import io from 'socket.io-client';
import {
	PLAY,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	ASK_FOR_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	JOIN_ROOM,
	RECEIVED_MESSAGE,
	ASK_FOR_USERNAME,
	SEND_USERNAME,
} from '../Constants';

//const socketUrl = "/";
const socketUrl = 'http://localhost:5000';

const SocketContext = React.createContext();

const SocketProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [socket, setSocket] = useState(null);
	const [player, setPlayer] = useState(null);
	const [videoURL, setVideoURL] = useState('');
	const [info, setInfo] = useState({});
	const [users, setUsers] = useState([]);

    const handleCredentials = (username, roomId) => {
        setInfo({username, roomId});
	};
	
	const onReady = (e) => {
		setPlayer(e.target);
		const socket = io(socketUrl);
		setSocket(socket);
		onSocketMethods(socket);
	};

	console.log('Connect1');
	const onSocketMethods = (socket) => {
		socket.on('connect', () => {
			socket.emit(JOIN_ROOM, {
				room: info.roomId,
				username: info.username,
			});
			socket.emit(ASK_FOR_VIDEO_INFORMATION);
			setLoading(false);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected');
		});

		socket.on(PLAY, () => player.playVideo());

		socket.on(PAUSE, () => player.pauseVideo());

		socket.on(SYNC_TIME, (currentTime) => syncTime(currentTime));

		socket.on(NEW_VIDEO, (videoUrl) => {
			player.loadVideoById({
				videoId: getYoutubeIdByUrl(videoUrl),
			});
			setVideoURL('');
		});

		socket.on(ASK_FOR_VIDEO_INFORMATION, () => {
			const data = {
				url: player.getVideoUrl(),
				currentTime: player.getCurrentTime(),
			};
			socket.emit(SYNC_VIDEO_INFORMATION, data);
		});

		socket.on(SYNC_VIDEO_INFORMATION, (data) => {
			const videoId = getYoutubeIdByUrl(data.url);
			player.loadVideoById({
				videoId: videoId,
				startSeconds: data.currentTime,
			});
		});

		socket.on(ASK_FOR_USERNAME, () => {
			setUsers([]);
			socket.emit(SEND_USERNAME, info.username);
		});

		socket.on(SEND_USERNAME, (username) => {
			setUsers([...users, username]);
		});
	};

	const syncTime = (currentTime) => {
		if (
			player.getCurrentTime() < currentTime - 0.5 ||
			player.getCurrentTime() > currentTime + 0.5
		) {
			player.seekTo(currentTime);
			player.playVideo();
		}
	};

	const getYoutubeIdByUrl = (url) => {
		let id = '';
		url = url
			.replace(/(>|<)/gi, '')
			.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

		if (url[2] !== undefined) {
			id = url[2].split(/[^0-9a-z_-]/i);
			id = id[0];
		} else id = url;

		return id;
	};

	const onStateChanged = (e) => {
		switch (player.getPlayerState()) {
			case -1:
				socket.emit(PLAY);
				break;
			case 0:
				break;
			case 1:
				socket.emit(SYNC_TIME, player.getCurrentTime());
				socket.emit(PLAY);
				break;
			case 2:
				socket.emit(PAUSE);
				break;
			case 3:
				socket.emit(SYNC_TIME, player.getCurrentTime());
				break;
			case 5:
				break;
			default:
				break;
		}
	};

	if (loading) return <Loading />;

	return (
		<SocketContext.Provider
			value={{
				socket,
				onSocketMethods,
				videoURL,
				onReady,
				onStateChanged,
				handleCredentials,
				info,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

const useSocket = () => React.useContext(SocketContext);

export { SocketProvider, useSocket };
