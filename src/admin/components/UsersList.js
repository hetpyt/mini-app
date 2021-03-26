import React, { useState, useEffect} from 'react';
import { Link, RichCell, Avatar} from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import PagedItemsList from './PagedItemsList';


const UsersList = (props) => {

    const {...rest} = props;

    const ItemComponent = props => {
        console.log(ItemComponent)
        const user = props.value;
        const ItemActions = props.actions;

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
                        after={<Link target="_blank" href={"https://vk.com/id" + String(user.vk_user_id)}>профиль ВК</Link>}
                        actions={ItemActions && <ItemActions user={user}/>}
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
            itemComponent={ItemComponent}
            pageLen={2}
        />
    );
}

export default UsersList;
