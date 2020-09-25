import React from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { VolumeIcon } from './DropdownIcons';

const VolumeSlider = () => {
    const { volume, handleVolumeChange } = useSettings();

	return (
		<>
			<span style={{ marginBottom: '10px' }}>
				<VolumeIcon />
				<h3>Sound Settings</h3>
			</span>
			<div className='settings-option-container'>
				<p>Sound Effects</p>
				<input
					type='range'
					name='volumeSlider'
					id='volumeSlider'
					className='volume-range-slider'
					value={volume}
					min='0'
					max='1'
					step='0.1'
					onChange={handleVolumeChange}
				/>
			</div>
		</>
	);
};

export default VolumeSlider;
