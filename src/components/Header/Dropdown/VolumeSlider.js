import React from 'react';
import VolumeIcon from '../../../assets/icons/volume-up-fill.svg';
import { useSettings } from '../../../context/SettingsContext';

const VolumeSlider = () => {
    const { volume, handleVolumeChange } = useSettings();

	return (
		<>
			<span style={{ marginBottom: '10px' }}>
				<img src={VolumeIcon} alt='volume' />
				<h3>Sound Settings</h3>
			</span>
			<div className='settings-option-container'>
				<p>Sound Effects</p>
				<input
					type='range'
					name='volumeSlider'
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
