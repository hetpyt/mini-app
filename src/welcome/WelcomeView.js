import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import Welcome from './panels/Welcome';


const WelcomeView = (props) => { 

	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <Welcome id='welcome' session={props.session} />
        </View>
    );
}

export default WelcomeView;
