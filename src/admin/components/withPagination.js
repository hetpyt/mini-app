import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, Avatar, Link, Tabs, TabsItem } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';

import { isFunction } from '@vkontakte/vkjs';

export const withPagination = ListComponent => (
    props => { 
        console.log('withPagination.props=', props);
        const {pageNum, pageLen, totalLen, onPageChange, ...rest} = props;

        const onPrevClick = e => {
            console.log('onPrevClick');
            if (isFunction(onPageChange)) onPageChange(pageNum - 1);
        }

        const onNextClick = e => {
            console.log('onNextClick');
            if (isFunction(onPageChange)) onPageChange(pageNum + 1);
        }

        return (
            <React.Fragment>
                <ListComponent 
                    {...rest} 
                />
                <Div style={{display: 'flex', "justify-content" : 'center', "align-items" : "center"}}>
                    <IconButton 
                        style={{height : "36px"}} 
                        onClick={onPrevClick}
                        disabled={!(pageNum > 1)}
                    >
                        <Icon36ChevronLeftOutline/>
                    </IconButton>
                    <Caption level="1" weight="regular">
                        {"Страница " + pageNum.toString() + "/" + (Math.ceil(totalLen / pageLen)).toString()}
                    </Caption>
                    <IconButton 
                        style={{height : "36px"}} 
                        onClick={onNextClick}
                        disabled={!(pageLen * pageNum < totalLen)}
                    >
                        <Icon36ChevronRightOutline/>
                    </IconButton>
                </Div>

            </React.Fragment>
        );

    }
)
