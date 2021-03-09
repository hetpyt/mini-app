import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, SimpleCell, Switch, Group, Header } from '@vkontakte/vkui';

const AdminRegRequestsFilters = (props) => {
    
    const isFiltersSwitchChecked = id => {
        let field = id.slice(0, id.indexOf('-'));
        let value = id.slice(id.indexOf('-') + 1);

        let filters = [... regRequestsFilters];
        for (let i=0; i < filters.length; i++) {
            if (filters[i].field === field) {
                if (Array.isArray(filters[i].value)) {
                    return (filters[i].value.indexOf(value) >= 0);
                } else {
                    return (filters[i].value === value);
                }
            }
        }
        return false;
    }

    return (
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={props.onDone} />} >Фильтры</PanelHeader>
            <Group header={<Header>Состояние заявки</Header>}>
                <SimpleCell disabled after={<Switch id="is_approved-null" defaultChecked={isFiltersSwitchChecked('is_approved-null')} onChange={e => {}} />}>Ожидает обработки</SimpleCell>
                <SimpleCell disabled after={<Switch id="is_approved-1" defaultChecked={isFiltersSwitchChecked('is_approved-1')} onChange={e => {}} />}>Одобрена</SimpleCell>
                <SimpleCell disabled after={<Switch id="is_approved-0" defaultChecked={isFiltersSwitchChecked('is_approved-0')} onChange={e => {}} />}>Отклонена</SimpleCell>
            </Group>
        </Panel>
    );
}

export default AdminRegRequestsFilters;