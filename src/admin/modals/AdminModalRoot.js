import React, { useState, useEffect } from 'react';
import { ModalRoot, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import AdminRegRequestsFilters from './panels/AdminRegRequestsFilters';

const AdminModalRoot = (props) => {

    const onModalPageClose = id => {
        console.log("onModalPageClose.id=", id);
        props.app.setActiveModal(null);
    };

    return (
        <ModalRoot activeModal={props.activeModal} onClose={onModalPageClose}>
            <AdminRegRequestsFilters 
                id="regrequestsfilters"
                regRequestsFilters={props.regRequestsFilters} 
                setRegRequestsFilters={props.setRegRequestsFilters} 
                app={props.app}
            />
        </ModalRoot>
    );
}

export default AdminModalRoot;