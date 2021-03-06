import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import MainMenu from './panels/MainMenu';
import RegRequestsList from './panels/RegRequestsList';
import RegRequestsDetail from "./panels/RegRequestsDetail";

const AdminView = (props) => { 

    const [regRequestId, setRegRequestId] = useState(null);
    const [vkAccessToken, setVkAccessToken] = useState('');

	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <MainMenu id='mainmenu' app={props.app} />
            <RegRequestsList id='regrequestslist' setRegRequestId={setRegRequestId} app={props.app} />
            <RegRequestsDetail id='regrequestsdetail' regRequestId={regRequestId} app={props.app} />
        </View>
    );
}

export default AdminView;
