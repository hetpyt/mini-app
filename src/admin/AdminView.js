import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AdminMainMenu from './panels/AdminMainMenu';
import AdminRegRequestsList from './panels/AdminRegRequestsList';

import AdminRegRequestsDetail from "./panels/AdminRegRequestsDetail";
import AdminUploadData from './panels/AdminUploadData';
import AdminDownloadData from './panels/AdminDownloadData';
import AdminAppPermittedFunctions from './panels/AdminAppPermittedFunctions';
import AdminUsersPrivileges from './panels/AdminUsersPrivileges';
import AdminModalRoot from './modals/AdminModalRoot';

const AdminView = (props) => { 

    const [activePanel, setActivePanel] = useState('mainmenu');
    const [activeModal, setActiveModal] = useState(null);
    const [regRequestId, setRegRequestId] = useState(null);
    const [regRequestsFilters, setRegRequestsFilters] = useState(
        {
            filters : [
                {
                    field : "is_approved",
                    value : [null]
                }
            ],
            order : "request_date",
        }
    );

    const [vkAccessToken, setVkAccessToken] = useState('');

    const goBack = e => {
		setActivePanel('mainmenu');
	}

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
            <AdminMainMenu id='mainmenu' setActivePanel={setActivePanel} app={props.app} />
            <AdminAppPermittedFunctions id='apppermittedfunctions' goBack={goBack} app={props.app} />
            <AdminUsersPrivileges id='usersprivileges' goBack={goBack} app={props.app} />
            <AdminRegRequestsList id='regrequestslist' setRegRequestId={setRegRequestId} regRequestsFilters={regRequestsFilters} setActivePanel={setActivePanel} setActiveModal={setActiveModal} app={props.app} />
            <AdminRegRequestsDetail id='regrequestsdetail' regRequestId={regRequestId} setActivePanel={setActivePanel} app={props.app} />
            <AdminUploadData id='uploaddata' goBack={goBack} app={props.app} />
            <AdminDownloadData id='downloaddata' goBack={goBack} app={props.app} />
        </View>
    );
}

export default AdminView;
