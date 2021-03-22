import React, { useState, useEffect } from 'react';
import { Tabs, TabsItem, RichCell, Button, Avatar, Link } from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import PagedItemsList from './ItemsList';

import { isFunction } from '@vkontakte/vkjs';

const UsersList = (props) => { 
    console.log('UsersList.props=', props);
    const PAGE_LEN = 10;

    const [usersList, setUsersList] = useState(null);
    const [totalLen, setTotalLen] = useState(0);
    const [limits, setLimits] = useState({
        page_num : 1,
        page_len : PAGE_LEN,
    });
    const [filters, setFilters] = useState([]);

	useEffect(() => {
        console.log('UsersList.useEffect.[]');
        updateList();
	}, [limits]);

    const updateList = () => {
        let params = {
            limits : limits,
            filters : filters,
        };
		props.app.restRequest(
            'admin/users/list',
            params,
            res => {
                setUsersList(res.data);
                setTotalLen(res.total_count);
            },
            err => {
                console.log('err=', err);
            }
        );
    }

    const itemActions = props => {
        return (
            <React.Fragment>
                <Button>Полномочия</Button>
                <Button mode="secondary">{Number(props.user.is_blocked) ? "Разблокировать" : "Заблокировать"}</Button>
                <Button mode="destructive">Удалить</Button>
            </React.Fragment>
        );
    }

    const itemComponent = props => {
        const user = props.value;

        return (
            <React.Fragment>
                {user &&
                    <RichCell
                        key={props.key}
                        data-vk_user_id={user.vk_user_id}
                        disabled
                        multiline
                        before={user.vk_user_info ? <Avatar size={72} src="" /> : <Icon56UserCircleOutline size={72}/>}
                        text={"Полномочия: " + user.privileges}
                        caption={"Заблокрован: " + (Number(user.is_blocked) ? "Да" : "Нет")}
                        after={<Link href="">профиль ВК</Link>}
                        actions={props.actions ? <props.actions user={user}/> : null}
                    >
                        {user.vk_user_info ? (user.vk_user_info.last_name + " " + user.vk_user_info.first_name) : "Пользователь ID" + user.vk_user_id}
                    </RichCell>
                }
            </React.Fragment>
        );
    }

    const onPageChange = pageNum => {
        setLimits({ ...limits, page_num : pageNum });
    }

    return (
        <React.Fragment>
            <Tabs mode="buttons">
                <TabsItem>Все</TabsItem>
                <TabsItem>Админы</TabsItem>
                <TabsItem>Операторы</TabsItem>
                <TabsItem>Пользователи</TabsItem>

            </Tabs>

            <PagedItemsList
                pageNum={limits.page_num}
                pageLen={limits.page_len}
                totalLen={totalLen}
                onPageChange={onPageChange}
                itemComponent={itemComponent}
                actions={itemActions}
                itemsList={usersList}
            />
        </React.Fragment>
    );
}

export default UsersList;