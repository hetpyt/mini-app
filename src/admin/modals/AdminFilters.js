import React, { useState, useEffect } from 'react';
import { ModalPage, ModalPageHeader, Group, PanelHeaderSubmit, SimpleCell, Header, Switch, Div } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

import Form from './../../Form/Form';
import FormMultiCheckInput from './../forms/FormMultiCheckInput';

const AdminFilters = (props) => {

    console.log("AdminFilters.props=", props);

    const filtersMap = props.filtersMap;

    const [filters, setFilters] = useState(props.filters);

    const onFormConfirm = e => {
        console.log("onSubmit.filters=", filters);
        props.submitFilters(filters.map(e=>({...e})));
    }

    const onFormChange = fields => {
        console.log("onFormChange.f=", fields);
        setFilters(fields.map(f => {
            return {
                field : f.name,
                value : f.value,
            }
        }));
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
                    fields={
                        filtersMap.map(
                            field => (
                                {
                                    ...field, 
                                    defaultValue : (
                                        (
                                            v => (
                                                v === undefined ? null : v.value
                                            )
                                        )(props.filters.find(
                                            filter => (
                                                filter.field === field.name
                                            )
                                        ))
                                    )
                                }
                            )
                        )
                    }
                    readOnly={false}
                    itemComponent={null}
                    noButtons
                    _onChange={onFormChange}
                />
            </Div>
        </ModalPage>
    );
}

export default AdminFilters;