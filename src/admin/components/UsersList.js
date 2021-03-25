import React, { useState, useEffect} from 'react';
import { Link, RichCell, Avatar} from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import PagedItemsList from './PagedItemsList';


const UsersList = (props) => {

    const {actions, ...rest} = props;

    const itemComponent = props => {
        const user = props.value;

        const privToStr = (priv) => {
            switch (String(priv).toUpperCase()) {
                case "ADMIN":
                    return "Администратор";
                case "OPERATOR":
                    return "Оператор";
                case "USER":
                    return "Пользователь";
                default:
                    return "НЕИЗВЕСТНО";
            }
        }

        return (
            <React.Fragment>
                {user &&
                    <RichCell
                        key={props.key}
                        data-vk_user_id={user.vk_user_id}
                        disabled
                        multiline
                        before={user.vk_user_info ? <Avatar size={72} src="" /> : <Icon56UserCircleOutline size={72}/>}
                        text={"Полномочия: " + privToStr(user.privileges)}
                        caption={"Заблокрован: " + (Number(user.is_blocked) ? "Да" : "Нет")}
                        after={<Link href={"https://vk.com/id" + String(user.vk_user_id)}>профиль ВК</Link>}
                        actions={actions && <actions user={user}/>}
                    >
                        {user.vk_user_info ? (user.vk_user_info.last_name + " " + user.vk_user_info.first_name) : "Пользователь ID" + user.vk_user_id}
                    </RichCell>
                }
            </React.Fragment>
        );
    };

    return (
        <PagedItemsList 
            {...rest}
            itemComponent={itemComponent}
            listParams={null}
            listStyle={null}
            pageLen={2}
            dataSource={
                (p, d, e) => {
                    app.restRequest(
                        'admin/users/list',
                        p, d, e);
                }
            }
        />
    );
}

export default UsersList;
