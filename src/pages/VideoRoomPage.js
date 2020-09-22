/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import YouTube from 'react-youtube';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';
import './Bootstrap.scss';

import {
	PLAY,
	PAUSE,
	SYNC_TIME,
	NEW_VIDEO,
	GET_VIDEO_INFORMATION,
	SYNC_VIDEO_INFORMATION,
	JOIN_ROOM,
	RECEIVED_MESSAGE,
	GET_USERNAME,
	SEND_USERNAME,
	SEND_MESSAGE,
} from '../Commands';

import { SettingsContext } from '../context/SettingsContext';
import Loading from '../components/Loading';
import Chat from '../components/Chat';

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
		videoURL: 'https://www.youtube.com/watch?v=_hql7mO-zaA',
		messages: [],
		users: [],
		played: 0,
		duration: 0,
		loading: true,
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

	onSocketMethods = (socket) => {
		const { roomId, username } = this.props;
		const { player } = this.state;
		
		socket.on('connect', () => {
			socket.emit(JOIN_ROOM, { roomId, username });
			socket.emit(GET_VIDEO_INFORMATION);
		});

		socket.on(PLAY, () => {
			player.playVideo();
		});

		socket.on(PAUSE, () => {
			player.pauseVideo()
		});

		socket.on(SYNC_TIME, (currentTime) => {
			this.syncTime(currentTime);
		});

		socket.on(NEW_VIDEO, (videoURL) => {
			player.loadVideoById({
				videoId: this.getYoutubeIdByUrl(videoURL)
			});
			this.setState({ videoURL: '' });
		});

		socket.on(GET_VIDEO_INFORMATION, () => {
			const data = {
				videoURL: player.getVideoUrl(),
				currentTime: player.getCurrentTime()
			}
			socket.emit(SYNC_VIDEO_INFORMATION, data);
		});

		socket.on(SYNC_VIDEO_INFORMATION, (data) => {
			const videoId = this.getYoutubeIdByUrl(data.videoURL)
			player.loadVideoById({
				videoId,
				startSeconds: data.currentTime
			});
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

		socket.on(GET_USERNAME, () => {
			this.setState({ users: [] });
			this.state.socket.emit(SEND_USERNAME, this.props.username);
		});

		socket.on(SEND_USERNAME, (username) => {
			this.setState({
				users: [...this.state.users, username],
			});
		});
	};

	onReady = (e) => {
		this.setState({ player: e.target });

		const socket = io(socketURL);
		this.setState({ socket });
		this.onSocketMethods(socket);
	};

	onError = (error) => console.log(error);

	getYoutubeIdByUrl = (url) => {
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
		console.log(this.urlInput.value);
		if (!URL_REGEX.test(this.urlInput.value)) return;
		this.state.socket.emit(NEW_VIDEO, this.urlInput.value);
	};

	sendMessage = (message) => {
		this.state.socket.emit(SEND_MESSAGE, {
			content: message,
			username: this.props.username,
		});
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
		if (this.state.loading) return <Loading />;
		
		const { messages, users } = this.state;
		
		return (
			<div className='room-page'>
				<div className='video-and-chat-container'>
					<div className='bootstrap-iso video-and-input-container'>
						<ResponsiveEmbed aspectRatio='16by9'>
							<YouTube
								videoId='_hql7mO-zaA'
								opts={youtubeConfig}
								onStateChange={this.onStateChanged}
								onReady={this.onReady}
								onError={this.onError}
							/>
						</ResponsiveEmbed>
						<div className='change-video-container'>
							<input
								type='text'
								placeholder='Enter URL'
								pattern='https://.*'
								ref={(input) => {
									this.urlInput = input;
								}}
							/>
							<button onClick={this.handleChangeVideo}>Change Video</button>
						</div>
					</div>
					{!this.context.chatHidden && (
						<Chat
							messages={messages}
							users={users}
							sendMessage={this.sendMessage}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(VideoRoom);
