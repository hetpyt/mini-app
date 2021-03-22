import React, { useState, useEffect } from 'react';
import { Tabs, TabsItem, List } from '@vkontakte/vkui';
import { Icon56UserCircleOutline } from '@vkontakte/icons';

import {withPagination} from './withPagination';

const ItemsList = (props) => { 
    console.log('ItemsList.props=', props);

    const {itemsList, itemComponent, listStyle, ...rest} = props;

    return (
        <List style={listStyle}>
            {itemsList && itemComponent && itemsList.map(
                (item, index) => (
                    <props.itemComponent {...rest} value={item} key={index} />
                )
            )}
        </List>
    );
}

export default withPagination(ItemsList);