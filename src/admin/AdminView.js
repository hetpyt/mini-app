import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AdminMainMenu from './panels/AdminMainMenu';
import AdminRegRequestsList from './panels/AdminRegRequestsList';
import AdminRegRequestsDetail from "./panels/AdminRegRequestsDetail";

const AdminView = (props) => { 

    const [activePanel, setActivePanel] = useState('mainmenu');
    const [regRequestId, setRegRequestId] = useState(null);
    const [vkAccessToken, setVkAccessToken] = useState('');

	return (
        <View id={props.id} activePanel={activePanel} popout={props.popout} >
            <AdminMainMenu id='mainmenu' app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsList id='regrequestslist' setRegRequestId={setRegRequestId} app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsDetail id='regrequestsdetail' regRequestId={regRequestId} app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default AdminView;
