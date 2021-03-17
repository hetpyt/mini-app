import React, { useState, useEffect } from 'react';
import { Tabs, TabsItem, List, RichCell, Button, Avatar, Link } from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';


import { isFunction } from '@vkontakte/vkjs';

const UsersList = (props) => { 
    console.log('UsersList.props=', props);

    const [usersList, setUsersList] = useState(null);

	useEffect(() => {
        console.log('UsersList.useEffect.[]');
        let params = {
            limits : props.limits,
            filters : props.filters,
            order : props.order,
        };
		props.app.restRequest(
            'admin/users/list',
            params,
            res => {
				if (isFunction(props.setTotalItemsCount)) props.setTotalItemsCount(res.total_count);
                setUsersList(res.data);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, [props.limits, props.filters, props.order]);

    return (
        <React.Fragment>
            {usersList &&
                <List>
                    {usersList.map((user, index) => (
                        <RichCell
                            key={index}
                            data-vk_user_id={user.vk_user_id}
                            disabled
                            multiline
                            before={user.vk_user_info ? <Avatar size={72} src="" /> : <Icon56UserCircleOutline size={72}/>}
                            text={"Полномочия: " + user.privileges}
                            caption={"Заблокрован: " + (user.is_blocked ? "Да" : "Нет")}
                            after={<Link href="">профиль ВК</Link>}
                            actions={
                                <React.Fragment>
                                    <Button>Полномочия</Button>
                                    <Button mode="secondary">{user.is_blocked ? "Разблокировать" : "Заблокировать"}</Button>
                                    <Button mode="destructive">Удалить</Button>
                                </React.Fragment>
                            }
                        >
                            {user.vk_user_info ? (user.vk_user_info.last_name + " " + user.vk_user_info.first_name) : "Пользователь ID" + user.vk_user_id}
                        </RichCell>
                    ))}
                </List>
            }
        </React.Fragment>
    );
}

export default UsersList;