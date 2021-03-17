import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Group, Header, PanelHeaderBack, Tabs, TabsItem} from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28RecentOutline, Icon28BlockOutline, Icon24Hide, Icon24Delete, Icon24Filter, Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray } from '@vkontakte/vkjs';

import UsersList from './../components/UsersList';
import {withPagination} from './../components/withPagination';

const AdminUsersPrivileges = (props) => {
    console.log("withPagination=", withPagination);
    const [UsersListWithPagination, _] = useState(withPagination(UsersList));

    return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />} >Полномочия пользователей</PanelHeader>
            <Group>
                <UsersListWithPagination app={props.app}/>
            </Group>
        </Panel>
    )
}

export default AdminUsersPrivileges;
