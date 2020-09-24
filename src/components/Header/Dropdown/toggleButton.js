const toggleButton = (ref, name, set) => {
	const toggledOn = ref.current.children[0];
	const toggledOff = ref.current.children[1];
	
	if (toggledOn.classList.contains('toggled')) {
		toggledOn.classList.remove('toggled');
		toggledOff.classList.add('toggled');
		if (name === 'toggleDarkModeButton') set('light');
        else if (name === 'toggleChatButton') set(true);
        
        //SAVE TO LCOAL STORAGE
	} else if (toggledOff.classList.contains('toggled')) {
		toggledOff.classList.remove('toggled');
		toggledOn.classList.add('toggled');
		if (name === 'toggleDarkModeButton') set('dark');
		else if (name === 'toggleChatButton') set(false);
	};
};

export default toggleButton;