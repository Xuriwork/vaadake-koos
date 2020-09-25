/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import YouTube from 'react-youtube';

import {
	PLAY,
	JOIN,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	GET_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	SEND_MESSAGE,
	MESSAGE,
	GET_ROOM_DATA,
	NEW_USER_JOINED,
	SET_HOST,
	SET_NEW_HOST
} from '../Commands';

import { SettingsContext } from '../context/SettingsContext';
import Loading from '../components/Loading';
import Chat from '../components/Chat/Chat';

import UserJoinedSoundEffect from '../assets/audio/user-joined-sound.mp3';

const socketURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_GAE_API_URL;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

const youtubeConfig = {
	height: '390',
	width: '640',
	playerVars: {
		controls: 2,
		rel: 0,
		modestbranding: 1,
		autoplay: 1,
	},
};

export class VideoRoom extends Component {
	static contextType = SettingsContext;

	state = {
		socket: null,
		player: null,
		users: [],
		messages: [],
		host: null,
		loading: true,
	};

	componentDidMount() {
		const { roomId, username, history } = this.props;
		if (!(roomId && username)) return history.push('/join');
	};

	componentWillUnmount() {
		if (this.state.socket) {
			this.state.socket.removeAllListeners();
			this.props.setInfo({});
		}
	};

	onSocketMethods = (socket) => {
		const { roomId, username } = this.props;
		const { player } = this.state;
		
		socket.on('connect', () => {
			socket.emit(JOIN, { roomId, username });
			socket.emit(GET_VIDEO_INFORMATION);
		});

		socket.on(NEW_USER_JOINED, () => this.context.playUserJoinedSound());

		socket.on(PLAY, () => player.playVideo());

		socket.on(PAUSE, () => player.pauseVideo());

		socket.on(SYNC_TIME, (currentTime) => this.syncTime(currentTime));

		socket.on(NEW_VIDEO, (videoURL) => {
			player.loadVideoById({
				videoId: this.convertURLToYoutubeVideoId(videoURL)
			});
		});

		socket.on(GET_VIDEO_INFORMATION, () => {
			const data = {
				videoURL: player.getVideoUrl(),
				currentTime: player.getCurrentTime()
			}
			socket.emit(SYNC_VIDEO_INFORMATION, data);
		});

		socket.on(SYNC_VIDEO_INFORMATION, (data) => {
			const videoId = this.convertURLToYoutubeVideoId(data.videoURL)
			player.loadVideoById({
				videoId,
				startSeconds: data.currentTime
			});
		});

		socket.on(MESSAGE, (data) => this.getMessages(data));

		socket.on(GET_ROOM_DATA, ({ roomId, users }) => {
			this.setState({ roomId, users });
		});

		socket.on(SET_HOST, (host) => this.setState({ host }));
	};

	onReady = (e) => {
		this.setState({ player: e.target });
		const socket = io(socketURL);
		this.setState({ socket });
		this.onSocketMethods(socket);
		this.setState({ loading: false });
	};

	onError = (error) => console.error(error);

	convertURLToYoutubeVideoId = (url) => {
		let id = '';
		url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	
		if(url[2] !== undefined) {
			id = url[2].split(/[^0-9a-z_-]/i);
			id = id[0];
		} else id = url;
		return id;
	};

	syncTime = (currentTime) => {
		if (
			this.state.player.getCurrentTime() < currentTime - 0.5 ||
			this.state.player.getCurrentTime() > currentTime + 0.5
		) {
			this.state.player.seekTo(currentTime);
			this.state.player.playVideo();
		}
	};

	handleChangeVideo = (e) => {
		e.preventDefault();
		if (!URL_REGEX.test(this.urlInput.value)) return;
		this.state.socket.emit(NEW_VIDEO, this.urlInput.value);
	};

	getMessages = (data) => {
		this.setState({
			messages: [
				...this.state.messages,
				{
					username: data.username,
					content: data.content,
					type: data.type,
					id: data.id,
				},
			],
		});
	};

	sendMessage = (message) => {
		this.state.socket.emit(SEND_MESSAGE, {
			content: message,
			username: this.props.username,
		});
	};

	playUserJoinedSound = () => {
		const audio = new Audio(UserJoinedSoundEffect);
		audio.play();
	};

	handleSetNewHost = (userId) => {
		console.log(userId);
		this.state.socket.emit(SET_NEW_HOST, userId);
	};

	onStateChanged = () => {
		const { player, socket } = this.state;

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
	
	render() {	
		
		const { loading, messages, users, socket, host } = this.state;

		return (
			<>
				{ loading && <Loading /> }
				<div className='room-page'>
					<div className='video-and-chat-container'>
						<div className='video-and-input-container' data-chatishidden={this.context.chatHidden}>
							<div className='embed-responsive embed-responsive-16by9'>
								<YouTube
									videoId='_hql7mO-zaA'
									opts={youtubeConfig}
									onStateChange={this.onStateChanged}
									onReady={this.onReady}
									onError={this.onError}
									className='embed-responsive'
								/>
							</div>
							<div className='change-video-container'>
								<input
									type='text'
									placeholder='Enter YouTube Video URL'
									pattern='https://.*'
									ref={(input) => this.urlInput = input}
								/>
								<button onClick={this.handleChangeVideo}>Change Video</button>
							</div>
						</div>
						{!this.context.chatHidden && (
							<Chat
								messages={messages}
								users={users}
								socket={socket}
								sendMessage={this.sendMessage}
								host={host}
								handleSetNewHost={this.handleSetNewHost}
							/>
						)}
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(VideoRoom);
