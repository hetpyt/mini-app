import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Header, SimpleCell, Div } from '@vkontakte/vkui';
import { Icon28UserCircleFillBlue } from '@vkontakte/icons';
import Form from './../../Form/Form';
import { isObject } from '@vkontakte/vkjs';

const AccountsList = (props) => {

	const [accList, setAccList] = useState(null);

    useEffect(() => {
		props.app.restRequest(
            'accounts/list',
            null,
            res => {
                setAccList(res);
            },
            err => {
                console.log('err=', err);
            }
        );
    }, []);

    return (
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={props.app.goBack} />}>Список лицевых счетов</PanelHeader>
            <Group>
                <Header mode='secondary'>Выберите лицевой счет</Header>
                {accList && accList.map((acc, index) => (
                        <Div key={acc.acc_id}>
                            <SimpleCell 
                                expandable={true} 
                                multiline={true} 
                                before={<Icon28UserCircleFillBlue />} 
                                description={acc.acc_id_repr} 
                                data-index={index} 
                                data-to='indicationsinput'
                                onClick={e => {
                                    console.log('active_acc=', accList[e.currentTarget.dataset.index]);
                                    props.setAccount(accList[e.currentTarget.dataset.index]);
                                    props.app.go(e);
                                }
                            }>
                                {acc.address_repr}
                            </SimpleCell>
                        </Div>
                    )
                )}
            </Group>
        </Panel>
    );
};

export default AccountsList;
