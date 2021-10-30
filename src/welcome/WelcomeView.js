import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import Welcome from './panels/Welcome';
import Help from './panels/Help';


const WelcomeView = (props) => { 

    const [activePanel, setActivePanel] = useState('welcome');

	return (
        <View id={props.id} activePanel={activePanel} popout={props.popout} >
            <Welcome id='welcome' app={{setActivePanel, ...props.app}} />
            <Help id='help' app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default WelcomeView;
