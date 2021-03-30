import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, List } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray, isFunction, isObject } from '@vkontakte/vkjs';

const PagedItemsList = (props) => { 
    console.log('ItemsList.props=', props);

    const [listPageNum, setListPageNum] = useState(1);

    const {itemComponent, listStyle, pageLen, listData, totalDataLen, onPageChange, ...rest} = props;

    useEffect(() => {
        onPageChange(listPageNum);
    }, [listPageNum]);

    const onPrevClick = e => {
        //console.log('onPrevClick');
        setListPageNum(listPageNum - 1);
    }

    const onNextClick = e => {
        //console.log('onNextClick');
        setListPageNum(listPageNum + 1);
    }

    const hasLimits = Boolean(Number.isInteger(totalDataLen) && Number.isInteger(pageLen));

    return (
        <React.Fragment>
            <List style={listStyle}>
                {listData && itemComponent && listData.map(
                    (item, index) => (
                        <props.itemComponent {...rest} value={item} key={index} />
                    )
                )}
            </List>
            <Div style={{display: 'flex', "justify-content" : 'center', "align-items" : "center"}}>
                <IconButton 
                    style={{height : "36px"}} 
                    onClick={onPrevClick}
                    disabled={!(listPageNum > 1)}
                >
                    <Icon36ChevronLeftOutline/>
                </IconButton>
                <Caption level="1" weight="regular">
                    {"Страница " + listPageNum.toString() + "/" + (hasLimits ? (Math.ceil(totalDataLen / pageLen)).toString() : "?")}
                </Caption>
                <IconButton 
                    style={{height : "36px"}} 
                    onClick={onNextClick}
                    disabled={hasLimits ? !(pageLen * listPageNum < totalDataLen) : false}
                >
                    <Icon36ChevronRightOutline/>
                </IconButton>
            </Div>

        </React.Fragment>
    );
}

export default PagedItemsList;