import React from 'react';

const Loading = () => {
	return (
		<div className='loading-screen'>
			<h1>
				Please wait, we're doing some magic
				<span role='img' aria-label='winking face'>
					😉
				</span>
			</h1>
			<div className='loading-balls'>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loading;
