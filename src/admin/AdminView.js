import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AdminMainMenu from './panels/AdminMainMenu';
import AdminRegRequestsList from './panels/AdminRegRequestsList';

import AdminRegRequestsDetail from "./panels/AdminRegRequestsDetail";
import AdminUploadData from './panels/AdminUploadData';
import AdminDownloadData from './panels/AdminDownloadData';

import AdminModalRoot from './modals/AdminModalRoot';

const AdminView = (props) => { 

    const [activePanel, setActivePanel] = useState('mainmenu');
    const [activeModal, setActiveModal] = useState(null);
    const [regRequestId, setRegRequestId] = useState(null);
    const [regRequestsFilters, setRegRequestsFilters] = useState([
        {
            field : "is_approved",
            value : [null]
        }
    ]);
    const [vkAccessToken, setVkAccessToken] = useState('');

	return (
        <View id={props.id} 
            activePanel={activePanel} 
            popout={props.popout} 
            modal={
                <AdminModalRoot 
                    activeModal={activeModal} 
                    regRequestsFilters={regRequestsFilters} 
                    setRegRequestsFilters={setRegRequestsFilters} 
                    app={{setActivePanel, setActiveModal, ...props.app}} 
                />
            } 
        >
            <AdminMainMenu id='mainmenu' app={{setActivePanel, ...props.app}} />
            <AdminRegRequestsList id='regrequestslist' setRegRequestId={setRegRequestId} regRequestsFilters={regRequestsFilters} app={{setActivePanel, setActiveModal, ...props.app}} />
            <AdminRegRequestsDetail id='regrequestsdetail' regRequestId={regRequestId} app={{setActivePanel, ...props.app}} />
            <AdminUploadData id='uploaddata' app={{setActivePanel, ...props.app}} />
            <AdminDownloadData id='downloaddata' app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default AdminView;
