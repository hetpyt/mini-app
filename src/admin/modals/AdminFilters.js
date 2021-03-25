import React, { useState, useEffect } from 'react';
import { ModalPage, ModalPageHeader, Group, PanelHeaderSubmit, SimpleCell, Header, Switch, Div } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

import Form from './../../Form/Form';
import FormMultiCheckInput from './../forms/FormMultiCheckInput';

const AdminFilters = (props) => {

    console.log("AdminRegRequestsFilters.props=", props);

    const filtersMap = props.filtersMap;

    const [filters, setFilters] = useState(props.filters);

    const onFormConfirm = e => {
        //console.log("onSubmit");
    }

    const onFormCancel = e => {
        console.log("AdminFilters.onCancel.id=", id)
    }

    return (
        <ModalPage 
            id={props.id} 
            header={
                <ModalPageHeader right={<PanelHeaderSubmit onClick={onFormConfirm} />} >Фильтры</ModalPageHeader>
            }
        >
            <Div>
                <Form 
                    header={null}
                    fields={filtersMap}
                    readOnly={false}
                    itemComponent={null}
                    noButtons
                />
            </Div>
        </ModalPage>
    );
}

export default AdminFilters;