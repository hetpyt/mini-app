import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import List from '@vkontakte/vkui/dist/components/List/List';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28BlockOutline from '@vkontakte/icons/dist/28/block_outline';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon28User from '@vkontakte/icons/dist/28/user';

const RegRequestsDetail = (props) => {

	const userInfo = props.app.userInfo;

	const [activeRegRequest, setActiveRegRequest] = useState(null);
	const [accIndex, setAccIndex] = useState(null);

	useEffect(() => {
		console.log('useEffect activeRegRequest=', props.regRequestId);
		props.app.restRequest(
            'admin/regrequests/get',
            {
				regrequest_id : props.regRequestId
			},
            res => {
                setActiveRegRequest(res);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, []);

	useEffect(() => {

	}, [activeRegRequest]);

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.app.goBack} />} >Заявка на присоединение ЛС</PanelHeader>

			{(userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && activeRegRequest) &&

				<Group header={
					<Header mode="primary">
						{'№ ' + activeRegRequest.id + ' от ' + activeRegRequest.request_date}
					</Header>
				}>
					<SimpleCell 
						before={activeRegRequest.vk_user_data ? <Avatar src={activeRegRequest.vk_user_data.photo_200}/> : <Icon28User/>}
						description={(activeRegRequest.vk_user_data && activeRegRequest.vk_user_data.city && activeRegRequest.vk_user_data.city.title) ? activeRegRequest.vk_user_data.city.title : ''}
					>
						<Link href={'https://vk.com/id'+activeRegRequest.vk_user_id} target="_blank">
							{activeRegRequest.vk_user_data 
							? activeRegRequest.vk_user_data.last_name + ' ' + activeRegRequest.vk_user_data.first_name
							: 'Пользователь ВК ' + activeRegRequest.vk_user_id}
						</Link>
					</SimpleCell>
				</Group>	
			}
		</Panel>
	)
};

export default RegRequestsDetail;
