import React from 'react';
import { useHistory } from 'react-router-dom';

const NotFoundPage = () => {
    const history = useHistory();
    const handleRedirectToHome = () => history.push('/join');

	return (
		<div className='not-found-page'>
			<h1>404</h1>
			<h3>Something is wrong</h3>
			<p>The page you are looking for doesn't exist!</p>
			<button onClick={handleRedirectToHome}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='24'
					height='24'
				>
					<path fill='none' d='M0 0h24v24H0z' />
					<path
						d='M9.414 8l8.607 8.607-1.414 1.414L8 9.414V17H6V6h11v2z'
						fill='rgba(255,255,255,1)'
					/>
				</svg>
			</button>
		</div>
	);
};

export default NotFoundPage;
