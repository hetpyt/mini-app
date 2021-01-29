import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
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

const Lobby = ({ id, go, vkUser, userInfo, restRequest }) => {

	const [regReqCount, setRegReqCount] = useState(0);

	useEffect(() => {
		restRequest('adminprocessregistrationrequests',
		{
			action: 'count',
			filters: [{
				field: "is_approved",
				value: 'null'
			}],
		},
		(result) => {
			if (result.result){
				if (result.data_len) {
					setRegReqCount(result.data[0]);
				}
			}
		}
		)
	}, []);

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="welcomeview.welcome" />} >Администрирование</PanelHeader>
			{vkUser &&
			<Group title="VK User Data">
				<SimpleCell
					before={vkUser.photo_200 ? <Avatar src={vkUser.photo_200}/> : null}
					description={vkUser.city && vkUser.city.title ? vkUser.city.title : ''}
				>
					{`${vkUser.first_name} ${vkUser.last_name} (${vkUser.id})`}
				</SimpleCell>
			</Group>}
			{userInfo && 'ADMIN' === userInfo.privileges &&
			<Group header={<Header mode="secondary">Меню администратора</Header>}>
				<SimpleCell expandable >Полномочия пользователей</SimpleCell>
			</Group>
			}
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
			<Group header={<Header mode="secondary">Меню оператора</Header>}>
				<SimpleCell expandable onClick={go} data-to="regrequests-list" after={parseInt(regReqCount) ? <Counter mode="prominent">{regReqCount}</Counter> : null} >Заявки на привязку ЛС</SimpleCell>
				<SimpleCell expandable onClick={go} data-to="dataprocess-upload">Загрузка реестра ЛС</SimpleCell>
				<SimpleCell expandable onClick={go} data-to="dataprocess-download">Выгрузка принятых показаний</SimpleCell>
			</Group>	
			}
		</Panel>
	);
};

Lobby.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
	restRequest: PropTypes.func,
};

export default Lobby;
