import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Group, PanelHeaderBack, Button} from '@vkontakte/vkui';

import UsersList from './../components/UsersList';

const AdminUsersPrivileges = (props) => {
    console.log("AdminUsersPrivileges.props=", props);
    const {id, goBack, app, ...rest} = props;

    const Actions = props => {
        const user = props.user;
        return (
            <React.Fragment>
                <Button>Полномочия</Button>
                <Button mode="secondary">{Number(user.is_blocked) ? "Разблокировать" : "Заблокировать"}</Button>
                <Button mode="destructive">Удалить</Button>
            </React.Fragment>
        );
    };

    return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={goBack} />} >Пользователи</PanelHeader>
{/*           
            <Button onClick={e => {
                props.setActiveModal('filters');
            }}>filters</Button>
*/}
            <Group>
                <UsersList 
                    {...rest}
                    actions={null}                    
                    DataSource={app.DataSource} 
                />
            </Group>
        </Panel>
    )
}

export default AdminUsersPrivileges;
