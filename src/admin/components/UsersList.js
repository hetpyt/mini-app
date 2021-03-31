import React, { useState, useEffect} from 'react';
import { Link, RichCell, Avatar} from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import PagedItemsList from './PagedItemsList';


const UsersList = (props) => {

    const PAGE_LEN = 2;

    const ParamsMap = {
        filtersMap : [
            {
                field : "privileges",
                caption : "Полномочия пользователей",
                type : "enum",
                enum : [
                    {
                        name : "admin",
                        caption : "Администраторы",
                        value : "ADMIN"
                    },
                    {
                        name : "operator",
                        caption : "Операторы",
                        value : "OPERATOR"
                    },
                    {
                        name : "user",
                        caption : "Пользователи",
                        value : "USER"
                    },
                ]
            },
        ],
        orderMap : [
            {
                field : "vk_user_id",
                caption : "ИД пользователя"
            }
        ]
    };

    const {DataSource, ...rest} = props;

    const [dataSource, _] = useState(new DataSource('admin/users/list', ParamsMap));

    const onDSUpdate = ds => {
        console.log("onDSUpdate.ds=", ds);
    }

    const onPageChange = (pageNum) => {
        console.log("onPageChange.page_num=", pageNum);
        dataSource.limits = {
            page_num : pageNum,
            page_len : PAGE_LEN,
        }
        dataSource.update(onDSUpdate);
    }

    const ItemComponent = props => {
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
        <React.Fragment>
            {dataSource &&
                <PagedItemsList 
                    {...rest}
                    itemComponent={ItemComponent}
                    pageLen={PAGE_LEN}
                    listData={dataSource.data}
                    totalDataLen={dataSource.totalDataLen}
                    onPageChange={onPageChange}
                />
            }
        </React.Fragment>
    );
}

export default UsersList;
