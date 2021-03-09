import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AdminMainMenu from './panels/AdminMainMenu';
import AdminRegRequestsList from './panels/AdminRegRequestsList';
import AdminRegRequestsFilters from './panels/AdminRegRequestsFilters';

import AdminRegRequestsDetail from "./panels/AdminRegRequestsDetail";
import AdminUploadData from './panels/AdminUploadData';
import AdminDownloadData from './panels/AdminDownloadData';

const AdminView = (props) => { 

    const [activePanel, setActivePanel] = useState('mainmenu');
    const [regRequestId, setRegRequestId] = useState(null);
    const [regReqestsFiltes, setRegReqestsFiltes] = useState([
        {
            field : "is_approved",
            value : null
        }
    ]);
    const [vkAccessToken, setVkAccessToken] = useState('');

	return (
        <View id={props.id} activePanel={activePanel} popout={props.popout} >
            <AdminMainMenu id='mainmenu' app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsList id='regrequestslist' setRegRequestId={setRegRequestId} app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsFilters id='regrequestsfilters' regReqestsFiltes={regReqestsFiltes} setRegReqestsFiltes={setRegReqestsFiltes} app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsDetail id='regrequestsdetail' regRequestId={regRequestId} app={{setActivePanel, ...props.app}} />
            <AdminUploadData id='uploaddata' app={{setActivePanel, ...props.app}} />
            <AdminDownloadData id='downloaddata' app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default AdminView;
