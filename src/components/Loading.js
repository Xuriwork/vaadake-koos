import React from 'react';

const Loading = () => {
	return (
		<div className='loading-screen'>
            <h1>Please wait, magic is happening or something like that.</h1>
			<div className='loading-balls'>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loading;
