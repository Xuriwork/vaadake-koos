import React from 'react';

const DropdownItem = ({ Icon, name, options }) => {
    return (
			<>
				<span>
					<img src={Icon} alt={name} />
					<h3>{name}</h3>
				</span>
				<div className='settings-option-container'>
					{options.map((option) => (
						<React.Fragment key={option.name}>
							<p>{option.name}</p>
							<button onClick={option.onClick} ref={option.ref}>
								{option.buttonOptions.map((button) => (
									<span key={button}>{button}</span>
								))}
							</button>
						</React.Fragment>
					))}
				</div>
			</>
		);
}

export default DropdownItem;
