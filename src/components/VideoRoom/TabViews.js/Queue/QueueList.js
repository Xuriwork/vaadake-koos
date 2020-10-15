import React from 'react';
import QueueItem from './QueueItem';

export const QueueList = ({ queue, playVideo, removeVideoFromQueue, isDisabled }) => (
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
				isDisabled={isDisabled}
			/>
		))}
	</ul>
);


export default QueueList;