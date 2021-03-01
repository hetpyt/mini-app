import React from 'react';
import { View } from '@vkontakte/vkui';

import ErrorService from './panels/ErrorService';


const ErrorServiceView = (props) => { 
	

	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <ErrorService id='errorservice' app={props.app} />
        </View>
    );
}

export default ErrorServiceView;
