import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, Avatar, Link, Tabs, TabsItem } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';

import { isFunction } from '@vkontakte/vkjs';

export const withPagination = ListComponent => (props => { 

    const DEFAULT_LIST_PAGE_LEN = 2;

    const [pageLen, setPageLen] = useState()

    return (
        <React.Fragment>
            <ListComponent 
                {...props} 
                limits={limits}
                setTotalItemsCount={setTotalItemsCount}/>
            <Div style={{display: 'flex', "justify-content" : 'center', "align-items" : "center"}}>
                <IconButton style={{height : "36px"}} onClick={e => {
                    if (limits.page_num > 1) 
                        setLimits({...limits, page_num : limits.page_num - 1});
                }}>
                    <Icon36ChevronLeftOutline/>
                </IconButton>
                <Caption level="1" weight="regular">
                    {"Страница " + limits.page_num.toString() + "/" + (Number.isInteger(totalItemsCount) ? (Math.ceil(totalItemsCount / LIST_PAGE_LEN)).toString() : "?")}
                </Caption>
                <IconButton style={{height : "36px"}} onClick={e => {
                    if (Number.isInteger(totalItemsCount) ? (LIST_PAGE_LEN * limits.page_num < totalItemsCount) : false) 
                        setLimits({...limits, page_num : limits.page_num + 1});
                }}>
                    <Icon36ChevronRightOutline/>
                </IconButton>
            </Div>

        </React.Fragment>
    );

})
