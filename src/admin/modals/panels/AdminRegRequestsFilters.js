import React, { useState, useEffect } from 'react';
import { ModalPage, ModalPageHeader, Group, PanelHeaderSubmit, SimpleCell, Header, Switch } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

const AdminRegRequestsFilters = (props) => {

    const [filters, setFilters] = useState([...props.regRequestsFilters]);

    useEffect(() => {
        console.log("AdminRegRequestsFilters.useEffect.[]");
        setFilters([...props.regRequestsFilters]);
    }, []);

    const isFilter = (field, val) => {
        let res = false;
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

    const onSwitchChangeGen = (field, val) => {
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

    const onSubmit = e => {
        console.log("onSubmit");
        props.setRegRequestsFilters(filters);
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
            <Group mode="card" header={<Header>Состояние заявки (ИЛИ)</Header>}>
                <SimpleCell disabled after={<Switch id="is_approved_null" defaultChecked={isFilter("is_approved", null)} onChange={onSwitchChangeGen("is_approved", null)} />}>Ожидает обработки</SimpleCell>
                <SimpleCell disabled after={<Switch id="is_approved_1" defaultChecked={isFilter("is_approved", 1)} onChange={onSwitchChangeGen("is_approved", 1)} />}>Одобрена</SimpleCell>
                <SimpleCell disabled after={<Switch id="is_approved_0" defaultChecked={isFilter("is_approved", 0)} onChange={onSwitchChangeGen("is_approved", 0)} />}>Отклонена</SimpleCell>
            </Group>
        </ModalPage>
    );
}

export default AdminRegRequestsFilters;