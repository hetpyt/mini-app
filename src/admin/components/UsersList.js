import React, { useState, useEffect } from 'react';
import { List, RichCell, Button, Avatar, Link } from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import { isFunction } from '@vkontakte/vkjs';

const UsersList = (props) => { 
    console.log('UsersList.props=', props);

    const [usersList, setUsersList] = useState(null);
    const [listPage, setListPage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);

	useEffect(() => {
		props.app.restRequest(
            'admin/regrequests/list',
            {
				...props.regRequestsFilters,
				limits : { 
					page_num : listPage,
					page_len : REGREQ_LIST_PAGE_SIZE
				}
			},
            res => {
				setTotalItemsCount(res.total_count);
                setregRequests(res.data);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, []);

    return (
        <div>
            {props.usersList &&
                <List>
                    {props.usersList.map((user, index) => (
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
                            {user.vk_user_info ? (user.vk_user_info.last_name + " " + user.vk_user_info.last_name.first_name) : "Пользователь ID" + user.vk_user_id}
                        </RichCell>
                    ))}
                </List>
            }
        </div>
    );
}

export default UsersList;