import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { PlayVideoIcon, TrashIcon } from './QueueIcons';

export const QueueItem = ({ id, title, thumbnail, index, playVideo, removeVideoFromQueue }) => (
	<Draggable draggableId={id} index={index}>
		{provided => (
			<li 
				ref={provided.innerRef}
          		{...provided.draggableProps}
          		{...provided.dragHandleProps}
			>
				<img src={thumbnail} alt={title} />
				<span>
					<button onClick={() => removeVideoFromQueue(id)}>
						<TrashIcon />
					</button>
					<button onClick={() => playVideo(id)}>
						<PlayVideoIcon />
					</button>
				</span>
				<h3>{title.substring(0, 75)}</h3>
			</li>
		)}
	</Draggable>
);

export default QueueItem;