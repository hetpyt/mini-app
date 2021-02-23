import React from 'react';
import { View } from '@vkontakte/vkui';

import ErrorService from './panels/ErrorService';


const ErrorServiceView = (props) => { 
	

	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <ErrorService id='errorservice' session={props.session} />
        </View>
    );
}

export default ErrorServiceView;
