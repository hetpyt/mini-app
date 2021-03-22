import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Group, Header, PanelHeaderBack, Tabs, TabsItem} from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28RecentOutline, Icon28BlockOutline, Icon24Hide, Icon24Delete, Icon24Filter, Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray } from '@vkontakte/vkjs';

import UsersList from './../components/UsersList';

const AdminUsersPrivileges = (props) => {
    
    const userActions = props => {
        const user = props.user;
        return (
            <React.Fragment>
                <Button>Полномочия</Button>
                <Button mode="secondary">{Number(user.is_blocked) ? "Разблокировать" : "Заблокировать"}</Button>
                <Button mode="destructive">Удалить</Button>
            </React.Fragment>
        )
    }

    return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />} >Полномочия пользователей</PanelHeader>
            <Group>
                <UsersList app={props.app} />
            </Group>
        </Panel>
    )
}

export default AdminUsersPrivileges;
