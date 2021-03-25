import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Group, PanelHeaderBack, Button} from '@vkontakte/vkui';

import UsersList from './../components/UsersList';

const AdminUsersPrivileges = (props) => {
    const {id, goBack, app} = props;

    const actions = props => (
        <React.Fragment>
            <Button>Полномочия</Button>
            <Button mode="secondary">{Number(user.is_blocked) ? "Разблокировать" : "Заблокировать"}</Button>
            <Button mode="destructive">Удалить</Button>
        </React.Fragment>
    );

    return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={goBack} />} >Полномочия пользователей</PanelHeader>
            <Button onClick={e => {
                props.setActiveModal('filters');
            }}>filters</Button>
            <Group>
                <UsersList 
                    actions={actions}                    
                    restRequestFunc={app.restRequest} 
                />
            </Group>
        </Panel>
    )
}

export default AdminUsersPrivileges;
