/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { notyfError } from '../../../../utils/notyf';
import { TrashIcon, PlayVideoIcon } from './PlaylistIcons';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

const Playlist = ({ playlist, addToPlaylist, removeFromPlaylist, handleChangeVideo }) => {
	const [videoURL, setVideoURL] = useState('');

	const convertURLToYoutubeVideoId = (url) => {
		let id = '';
		url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	
		if(url[2] !== undefined) {
			id = url[2].split(/[^0-9a-z_-]/i);
			id = id[0];
		} else id = url;
		return id;
	};

	const videos = [
		'https://youtu.be/olKJ6_BD10k',
		'https://youtu.be/pPmW4b9BRuA',
		'https://youtu.be/X9ybVTw9rtk',
		'https://youtu.be/oVBL8KgxZU4',
		'https://youtu.be/X9ybVTw9rtk',
		'https://youtu.be/HRNNimi1xuY',
		'https://youtu.be/oTdFsRZg0no',
		'https://youtu.be/fFlDoutuooI'
	];

	const test = () => {
		videos.forEach((video) => {
			handleAddVideoToPlaylist(video);
		});
	};

    const handleAddVideoToPlaylist = (videoURL) => {
		// if (videoURL.trim() === '') return;
		// if (!URL_REGEX.test(videoURL)) {
		// 	return notyfError('Invalid URL', 2500);
		// };

		const videoId = convertURLToYoutubeVideoId(videoURL);

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
			const { items } = data;

			const id = items[0].id;
			const thumbnail = items[0].snippet.thumbnails.medium.url;
			const title = items[0].snippet.title;

			const playlistItem = { id, thumbnail, title };

			addToPlaylist(playlistItem);
			setVideoURL('');
		})
		.catch((error) => console.error(error));
    };

    const removeVideoFromPlaylist = (videoId) => removeFromPlaylist(videoId);

	const playVideo = async (videoId) => {
		await handleChangeVideo(videoId);
		removeVideoFromPlaylist(videoId);
	};
	
	const handleOnKeyDown = (e) => {
    	if (e.keyCode === 13) handleAddVideoToPlaylist(e);
	};

	const handleOnChange = (e) => setVideoURL(e.target.value);

    return (
			<>
				<h2>Playlist</h2>
				<div className='add-to-playlist-input-container'>
					<input
						type='text'
						placeholder='Add video to playlist'
						pattern='https://.*'
						onChange={handleOnChange}
						value={videoURL}
						onKeyDown={handleOnKeyDown}
					/>
					<button onClick={test}>Add Video</button>
				</div>
				<ul className='video-playlist'>
					{playlist.map((video) => (
						<li key={video.id}>
							<img src={video.thumbnail} alt={video.title} />
							<span>
								<button onClick={() => removeVideoFromPlaylist(video.id)}>
									<TrashIcon />
								</button>
								<button onClick={() => playVideo(video.id)}>
									<PlayVideoIcon />
								</button>
							</span>
							<h3>{video.title.substring(0, 75)}</h3>
						</li>
					))}
				</ul>
			</>
		);
}

export default Playlist;
