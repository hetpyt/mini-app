import React, { useState, useEffect } from 'react';
import { ModalPage, ModalPageHeader, Group, PanelHeaderSubmit, SimpleCell, Header, Switch, Div } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

const AdminRegRequestsFilters = (props) => {

    console.log("AdminRegRequestsFilters.props=", props);
    const [filters, setFilters] = useState(props.regRequestsFilters.filters.map(e => ({...e})));
    const [order, setOrder] = useState(props.regRequestsFilters.order);

    const isFilter = (field, val) => {
        let res = false;
        //console.log("isFilter.filters=", filters);
        if (filters) filters.map(f => {
            if (f.field == field) {
                if (isArray(f.value)) {
                    res = f.value.includes(val);
                } else {
                    res = Boolean(val === f.value);
                }
            }
        })
        return res;
    }

    const onFiltersSwitchChangeGen = (field, val) => {
        return (e => {
            setFilters(filters.reduce((newFilters, f) =>{ 
                if (f.field == field) {
                    if (isArray(f.value)) {
                        // delete val if exists
                        f.value = f.value.filter(v => (v !== val));
                        // add val if checked
                        e.currentTarget.checked && f.value.push(val);
                        newFilters.push(f);
                    } else {
                        if (e.currentTarget.checked) {
                            f.value = val;
                            newFilters.push(f);
                        }
                    }
                } else newFilters.push(f);
                return newFilters;
            }, []))
        })
    }

    const onOrderSwitchChange = e => {
        let o = order;
        if (o.charAt(0) === "-") o = o.substr(1);
        setOrder(e.currentTarget.checked ? o : "-" + o)
    }

    const onSubmit = e => {
        console.log("onSubmit");
        props.setRegRequestsFilters(
            {
                filters : filters.map(e => ({...e})),
                order : order,
            }
        );
        props.app.setActiveModal(null);
    }

    const onPageClose = id => {
        console.log("AdminRegRequestsFilters.onClose.id=", id);
    }

    return (
        <ModalPage 
            id={props.id} 
            header={
                <ModalPageHeader right={<PanelHeaderSubmit onClick={onSubmit} />} >Фильтры заявок</ModalPageHeader>
            }
            onClose={onPageClose}
        >
            <Div>
                <Group mode="card" header={<Header mode="secondary" >Сортировка</Header>}>
                    <SimpleCell disabled after={<Switch id="sort" defaultChecked={order.charAt(0) !== "-"} onChange={onOrderSwitchChange} />}>{order.charAt(0) !== "-" ? "Сначала старые" : "Сначала новые"}</SimpleCell>
                </Group>
                <Group mode="card" header={<Header mode="secondary" >Состояние заявки (ИЛИ)</Header>}>
                    <SimpleCell disabled after={<Switch id="is_approved_null" defaultChecked={isFilter("is_approved", null)} onChange={onFiltersSwitchChangeGen("is_approved", null)} />}>Ожидает обработки</SimpleCell>
                    <SimpleCell disabled after={<Switch id="is_approved_1" defaultChecked={isFilter("is_approved", 1)} onChange={onFiltersSwitchChangeGen("is_approved", 1)} />}>Одобрена</SimpleCell>
                    <SimpleCell disabled after={<Switch id="is_approved_0" defaultChecked={isFilter("is_approved", 0)} onChange={onFiltersSwitchChangeGen("is_approved", 0)} />}>Отклонена</SimpleCell>
                </Group>
            </Div>
        </ModalPage>
    );
}

export default AdminRegRequestsFilters;