import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, Avatar, Link } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';


const withFilters = ListComponent => (props => { 

    const [filters, seFilters] = useState([]);
    const [order, setOrder] = useState();

    return (
        <React.Fragment>
            <Tabs>
                <TabsItem>Все</TabsItem>
                <TabsItem>Админы</TabsItem>
                <TabsItem>Операторы</TabsItem>
                <TabsItem>Пользователи</TabsItem>

            </Tabs>
            <ListComponent {...props} filters={filters} order={order}/>
        </React.Fragment>
    );

})

export default withFilters;