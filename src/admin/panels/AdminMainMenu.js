import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Header, Group, SimpleCell, Div, Counter} from '@vkontakte/vkui';

const AdminMainMenu = (props) => {

	const [regReqCount, setRegReqCount] = useState(0);

	useEffect(() => {
		props.app.restRequest(
            'admin/regrequests/count',
            {
				filters : [
					{
						field : "is_approved",
						value : null
					}
				]
			},
            res => {
                setRegReqCount(res);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, []);

	const userInfo = props.app.userInfo;

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={e => {props.app.setActiveView('welcomeview')}} />} >Администрирование</PanelHeader>
			{userInfo && 'ADMIN' === userInfo.privileges &&
			<Group header={<Header mode="secondary">Меню администратора</Header>}>
				<SimpleCell expandable >Полномочия пользователей</SimpleCell>
			</Group>
			}
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
			<Group header={<Header mode="secondary">Меню оператора</Header>}>
				<SimpleCell expandable onClick={e => {props.app.setActivePanel('regrequestslist')}}  
					after={parseInt(regReqCount) ? <Counter mode="primary">{regReqCount}</Counter> : null} 
				>Заявки на присоединение ЛС</SimpleCell>
				<SimpleCell expandable onClick={e => {props.app.setActivePanel('uploaddata')}} >Загрузка реестра ЛС</SimpleCell>
				<SimpleCell expandable onClick={e => {props.app.setActivePanel('downloaddata')}} >Выгрузка принятых показаний</SimpleCell>
			</Group>	
			}
		</Panel>
	);
};

export default AdminMainMenu;
