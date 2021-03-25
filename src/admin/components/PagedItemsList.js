import React, { useState, useEffect } from 'react';
import { Div, Caption, IconButton, List } from '@vkontakte/vkui';
import { Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray, isFunction, isObject } from '@vkontakte/vkjs';

const PagedItemsList = (props) => { 
    console.log('ItemsList.props=', props);
    const PAGE_LEN = 10;

    const [listData, setListData] = useState(null);
    const [totalDataLen, setTotalDataLen] = useState(0);
    const [listPageNum, setListPageNum] = useState(1);

    const {itemComponent, listStyle, pageLen, dataSource, listParams, ...rest} = props;

    if (!pageLen) pageLen = PAGE_LEN;
    
    useEffect(() => {
        updateList();
    }, [listPageNum]);

    const updateList = () => {
        let param = {}
        if (isObject(listParams)) param = {...listParams};

        param.limits = {
            page_num : listPageNum,
            page_len : pageLen
        }

        if (isFunction(dataSource)) {
            dataSource(
                param,
                res => {
                    if (isArray(res)) {
                        setListData(res);
                        setTotalDataLen(0);
                    } else if (isObject(res)) {
                        if (res.data) setListData(res.data);
                        if (res.total_count) setTotalDataLen(res.total_count);
                    } else {
                        setListData([]);
                        setTotalDataLen(0);
                    }
                }, 
                err => {
                    console.log('err=', err);
                }
            );
        }
    }

    const onPrevClick = e => {
        //console.log('onPrevClick');
        setListPageNum(listPageNum - 1);
    }

    const onNextClick = e => {
        //console.log('onNextClick');
        setListPageNum(listPageNum + 1);
    }

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
                    {"Страница " + listPageNum.toString() + "/" + (Math.ceil(totalDataLen / pageLen)).toString()}
                </Caption>
                <IconButton 
                    style={{height : "36px"}} 
                    onClick={onNextClick}
                    disabled={!(pageLen * listPageNum < totalDataLen)}
                >
                    <Icon36ChevronRightOutline/>
                </IconButton>
            </Div>

        </React.Fragment>
    );
}

export default PagedItemsList;