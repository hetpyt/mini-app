import React from 'react';
import { View } from '@vkontakte/vkui';

import Registration from './panels/Registration';
import RegistrationList from './panels/RegistrationList';


const RegistrationView = (props) => { 
	

	return (
        <View id={props.id} activePanel={props.activePanel}  popout={props.popout} >
            <RegistrationList id='registrationlist' session={props.session} />
            <Registration id='registration' session={props.session} />
        </View>
    );
}

export default RegistrationView;
