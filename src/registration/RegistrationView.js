import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import Registration from './panels/Registration';
import RegistrationList from './panels/RegistrationList';


const RegistrationView = (props) => { 

    const [regrequest, setRegrequest] = useState(null);

    useEffect(() => {
        console.log('RegistrationView');
        setRegrequest(null);
    }, []);

	return (
        <View id={props.id} activePanel={props.activePanel}  popout={props.popout} >
            <RegistrationList id='registrationlist' setRegrequest={setRegrequest} session={props.session} />
            <Registration id='registration' regrequest={regrequest} session={props.session} />
        </View>
    );
}

export default RegistrationView;
