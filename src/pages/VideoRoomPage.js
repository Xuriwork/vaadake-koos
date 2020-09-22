/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import ReactPlayer from 'react-player/youtube';

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
	SEND_MESSAGE,
} from '../Constants';

import { SettingsContext } from '../context/SettingsContext';
import Loading from '../components/Loading';
import Chat from '../components/Chat';

const socketUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_GAE_API;
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
		videoURL: 'https://www.youtube.com/watch?v=_hql7mO-zaA',
		messages: [],
		users: [],
		played: 0,
		duration: 0,
		loading: true,
		playing: true,
	};

	componentDidMount() {
		const { roomId, username } = this.props;
		if (!(roomId && username)) {
			return this.props.history.push('/join');
		};
		this.setState({ loading: false });
	};

	componentWillUnmount() {
		if (this.state.socket) {
			this.state.socket.removeAllListeners();
		}
	};

	ref = player => this.player = player;

	onSocketMethods = (socket) => {
		const { roomId, username } = this.props;
		
		socket.on('connect', () => {
			socket.emit(JOIN_ROOM, { roomId, username });
			socket.emit(ASK_FOR_VIDEO_INFORMATION);
		});

		socket.on(PLAY, () => {
			this.setState({ playing: true });
		});

		socket.on(PAUSE, () => {
			this.setState({ playing: false });
		});

		socket.on(SYNC_TIME, (currentTime) => {
			this.syncTime(currentTime);
		});

		socket.on(NEW_VIDEO, (videoURL) => {
			this.setState({ videoURL });
		});

		socket.on(ASK_FOR_VIDEO_INFORMATION, () => {
			const data = {
				videoURL: this.player.props.url,
				currentTime: this.player.getCurrentTime(),
			};
			socket.emit(SYNC_VIDEO_INFORMATION, data);
		});

		socket.on(SYNC_VIDEO_INFORMATION, (data) => {
			this.syncTime(data.currentTime);
		});

		socket.on(RECEIVED_MESSAGE, (data) => {
			this.setState({
				messages: [
					...this.state.messages,
					{
						username: data.username,
						content: data.content,
						type: data.type
					},
				],
			});
		});

		socket.on(ASK_FOR_USERNAME, () => {
			this.setState({ users: [] });
			this.state.socket.emit(SEND_USERNAME, this.props.username);
		});

		socket.on(SEND_USERNAME, (username) => {
			this.setState({
				users: [...this.state.users, username],
			});
		});
	};
	
	handlePause = () => {
		this.state.socket.emit(PAUSE);
	};
	
	handlePlay = () => {
		this.state.socket.emit(PLAY);
	};

	handlePlayPause = () => this.setState({ playing: !this.state.playing });

	onReady = () => {
		const socket = io(socketUrl);
		this.setState({ socket });
		this.onSocketMethods(socket);
	};

	onError = (error) => console.log(error);

	syncTime = (currentTime) => {
		if (
			this.player.getCurrentTime() < currentTime - 0.5 ||
			this.player.getCurrentTime() > currentTime + 0.5
		) {
			this.player.seekTo(currentTime, 'seconds');
		}
	};

	handleChangeVideo = (e) => {
		e.preventDefault();
		if (!URL_REGEX.test(this.urlInput.value)) return;
		this.state.socket.emit(NEW_VIDEO, this.urlInput.value);
	};

	sendMessage = (message) => {
		this.state.socket.emit(SEND_MESSAGE, {
			content: message,
			username: this.props.username,
		});
	};
	
	handleTest = () => {
		console.log(this.state.socket);
	};
	
	render() {
		if (this.state.loading) return <Loading />;
		
		const { messages, videoURL, playing, users } = this.state;
		
		return (
			<div className='room-page'>
				<div className='video-and-chat-container'>
					<div className='video-and-input-container'>
						<ReactPlayer 
							url={videoURL} 
							ref={this.ref}
							playing={playing}
							onError={this.onError}
							onReady={this.onReady}
							onPause={this.handlePause}
							onPlay={this.handlePlay}
							height='100%'
							width='100%'
							className='youtube-video-component'
							config={{
								youtube: youtubeConfig
							}}
						/>
						<div className='change-video-container'>
							<input
								type='text'
								placeholder='Enter URL'
								pattern='https://.*'
								ref={input => { this.urlInput = input }}
							/>
							<button onClick={this.handleChangeVideo}>Change Video</button>
						</div>
					</div>
					{
						!this.context.chatHidden && (
							<Chat
								messages={messages}
								users={users}
								sendMessage={this.sendMessage}
							/>
						)
					}
				</div>
			</div>
		);
	}
}

export default withRouter(VideoRoom);
