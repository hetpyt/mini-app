import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import Welcome from './panels/Welcome';


const WelcomeView = (props) => { 

	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <Welcome id='welcome' app={props.app} />
        </View>
    );
}

export default WelcomeView;
