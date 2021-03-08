import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import Welcome from './panels/Welcome';


const WelcomeView = (props) => { 

    const [activePanel, setActivePanel] = useState('welcome');

	return (
        <View id={props.id} activePanel={activePanel} popout={props.popout} >
            <Welcome id='welcome' app={props.app} />
        </View>
    );
}

export default WelcomeView;
