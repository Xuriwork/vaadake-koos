import React from 'react';
import QueueItem from './QueueItem';

export const QueueList = ({ queue, playVideo, removeVideoFromQueue }) => (
	<ul className='video-queue'>
		{queue.map((video, index) => (
			<QueueItem 
				key={video.id}
				id={video.id}
				title={video.title}
				thumbnail={video.thumbnail}
				index={index}
				removeVideoFromQueue={removeVideoFromQueue}
				playVideo={playVideo}
			/>
		))}
	</ul>
);


export default QueueList;