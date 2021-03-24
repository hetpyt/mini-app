import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Group, Header, PanelHeaderBack, Button, TabsItem} from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28RecentOutline, Icon28BlockOutline, Icon24Hide, Icon24Delete, Icon24Filter, Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray } from '@vkontakte/vkjs';

import UsersList from './../components/UsersList';

const AdminUsersPrivileges = (props) => {
    const {id, goBack, app, ...rest} = props;
    return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={goBack} />} >Полномочия пользователей</PanelHeader>
            <Button onClick={e => {
                props.setActiveModal('filters');
            }}>filters</Button>
            <Group>
                <UsersList {...rest} app={app} />
            </Group>
        </Panel>
    )
}

export default AdminUsersPrivileges;
