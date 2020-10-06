/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { notyfError } from '../../../../utils/notyf';
import { TrashIcon, PlayVideoIcon } from './QueueIcons';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

const Queue = ({ queue, addToQueue, removeFromQueue, handleChangeVideo, setTab }) => {
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

    const handleAddVideoToQueue = () => {
		if (videoURL.trim() === '') return;
		if (!URL_REGEX.test(videoURL)) {
			return notyfError('Invalid URL', 2500);
		};

		const videoId = convertURLToYoutubeVideoId(videoURL);

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
			const { items } = data;

			const id = items[0].id;
			const thumbnail = items[0].snippet.thumbnails.medium.url;
			const title = items[0].snippet.title;

			const queueItem = { id, thumbnail, title };

			addToQueue(queueItem);
			setVideoURL('');
		})
		.catch((error) => console.error(error));
    };

    const removeVideoFromQueue = (videoId) => removeFromQueue(videoId);

	const playVideo = async (videoId) => {
		await handleChangeVideo(videoId);
		removeVideoFromQueue(videoId);
	};
	
	const handleOnKeyDown = (e) => {
    	if (e.keyCode === 13) handleAddVideoToQueue(e);
	};

	const handleOnChange = (e) => setVideoURL(e.target.value);

    return (
			<>
				<h2>Queue</h2>
				<div className='add-to-queue-input-container'>
					<input
						type='text'
						placeholder='Add video to queue'
						pattern='https://.*'
						onChange={handleOnChange}
						value={videoURL}
						onKeyDown={handleOnKeyDown}
					/>
					<button onClick={handleAddVideoToQueue}>Add Video</button>
				</div>
				<ul className='video-queue'>
					{queue.map((video) => (
						<li key={video.id}>
							<img src={video.thumbnail} alt={video.title} />
							<span>
								<button onClick={() => removeVideoFromQueue(video.id)}>
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

export default Queue;
