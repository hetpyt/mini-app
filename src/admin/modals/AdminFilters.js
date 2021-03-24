import React, { useState, useEffect } from 'react';
import { ModalPage, ModalPageHeader, Group, PanelHeaderSubmit, SimpleCell, Header, Switch, Div } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

import Form from './../../../Form/Form';
import FormMultiCheckInput from './../../forms/FormMultiCheckInput';

const AdminFilters = (props) => {

    console.log("AdminRegRequestsFilters.props=", props);

    const orderMap = props.listParamsMap && props.listParamsMap.order;
    const filtersMap = props.listParamsMap && props.listParamsMap.filters;

    const [filters, setFilters] = useState(props.listParams.filters);
    const [order, setOrder] = useState(props.listParams.order);

    const onOrderSwitchChange = e => {
        let o = order;
        if (o.charAt(0) === "-") o = o.substr(1);
        setOrder(e.currentTarget.checked ? o : "-" + o)
    }

    const onSubmit = val => {
        //console.log("onSubmit");
        props.setFilters(val.map())
        props.app.setActiveModal(null);
    }

    const onCancel = e => {
        console.log("AdminFilters.onCancel.id=", id)
    }

    const onPageClose = id => {
        console.log("AdminFilters.onClose.id=", id);
    }

    return (
        <ModalPage 
            id={props.id} 
            header={
                <ModalPageHeader right={<PanelHeaderSubmit onClick={onSubmit} />} >Фильтры</ModalPageHeader>
            }
            onClose={onPageClose}
        >
            <Div>
                <Form 
                    header={null}
                    fields={filtersMap}
                    readOnly={false}
                    itemComponent={null}
                    onConfirm={onSubmit}
                    onCancel={onCancel}
                />
            </Div>
        </ModalPage>
    );
}

export default AdminFilters;