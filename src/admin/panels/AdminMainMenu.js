import React, { useState, useEffect} from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24DismissSubstract from '@vkontakte/icons/dist/24/dismiss_substract';
import Icon24Spinner from '@vkontakte/icons/dist/24/spinner';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';

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
