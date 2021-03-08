import React, { useState, useEffect } from 'react';
import { View, Panel, PanelHeader } from '@vkontakte/vkui';

import Registration from './panels/Registration';
import RegistrationList from './panels/RegistrationList';


const RegistrationView = (props) => { 

    const [activePanel, setActivePanel] = useState('registrationlist');
    const [regrequest, setRegrequest] = useState(null);

    useEffect(() => {
        console.log('RegistrationView');
        setRegrequest(null);
    }, []);
    console.log("RegistrationView.props=", props);
	return (
        <View id={props.id} activePanel={activePanel}  popout={props.popout} >
            <RegistrationList id='registrationlist' setRegrequest={setRegrequest} app={{setActivePanel, ...props.app}} />
            <Registration id='registration' regrequest={regrequest} app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default RegistrationView;
