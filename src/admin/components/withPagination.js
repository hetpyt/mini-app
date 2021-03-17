import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, Avatar, Link, Tabs, TabsItem } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';

import { isFunction } from '@vkontakte/vkjs';

export const withPagination = ListComponent => (props => { 

    const LIST_PAGE_LEN = 10;

	const [totalItemsCount, setTotalItemsCount] = useState(0);

    const [limits, setLimits] = useState({
        page_num : 1, 
        page_len : LIST_PAGE_LEN,
    });
    const [filters, seFilters] = useState([]);
    const [order, setOrder] = useState('vk_user_id');

    return (
        <React.Fragment>
            <Tabs>
                <TabsItem>Все</TabsItem>
                <TabsItem>Админы</TabsItem>
                <TabsItem>Операторы</TabsItem>
                <TabsItem>Пользователи</TabsItem>

            </Tabs>
            <ListComponent 
                {...props} 
                limits={limits}
                filters={filters}
                order={order}
                setTotalItemsCount={setTotalItemsCount}/>
            <Div style={{display: 'flex', "justify-content" : 'center', "align-items" : "center"}}>
                <IconButton style={{height : "36px"}} onClick={e => {
                    if (limits.page_num > 1) 
                        setLimits({
                            page_num : limits.page_num - 1, 
                            page_len : limits.page_len,
                        });
                }}>
                    <Icon36ChevronLeftOutline/>
                </IconButton>
                <Caption level="1" weight="regular">
                    {"Страница " + limits.page_num.toString() + "/" + (Math.ceil(totalItemsCount / LIST_PAGE_LEN)).toString()}
                </Caption>
                <IconButton style={{height : "36px"}} onClick={e => {
                    if (LIST_PAGE_LEN * limits.page_num < totalItemsCount) 
                        setLimits({
                            page_num : limits.page_num + 1, 
                            page_len : limits.page_len,
                        });
                }}>
                    <Icon36ChevronRightOutline/>
                </IconButton>
            </Div>

        </React.Fragment>
    );

})
