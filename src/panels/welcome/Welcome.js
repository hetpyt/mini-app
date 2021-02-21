import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Title from '@vkontakte/vkui/dist/components/Typography/Title/Title';

import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24DismissSubstract from '@vkontakte/icons/dist/24/dismiss_substract';
import Icon24Spinner from '@vkontakte/icons/dist/24/spinner';

const Welcome = ({ id, go, vkUser, userInfo, restRequest }) => { 
	

	return (
		<Panel id={id}>
			<PanelHeader>Добро пожаловать, {(vkUser ? vkUser.first_name : "Неизвестный")}!</PanelHeader>
	{/* 		<Div>
				<Title style={{color: "red"}} align="center" level="2" weight="semibold">Приложение работает в тестовом режиме!</Title>
				<Title align="center" level="3" weight="regular">Переданные через данное приложение показания НЕ БУДУТ ДОСТАВЛЕНЫ в управляющую организацию.</Title>
			</Div>
	*/}		
			{userInfo && parseInt(userInfo.is_blocked) === 0  &&
			<Div>
				<Button size="xl" mode="primary" onClick={go} data-to="mainview.account-selection">
					Перейти к вводу показаний
				</Button>
			</Div>
			}
			{(!userInfo || (userInfo && parseInt(userInfo.is_blocked) === 0)) &&
			<Div>
				<Button size="xl" mode="primary" onClick={go} data-to="registrationview.registrationlist">
					Присоединить лицевой счет
				</Button>
			</Div>
			}
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && parseInt(userInfo.is_blocked) === 0  &&
			<Div>
				<Button size="xl" mode="primary" onClick={go} data-to="adminview.lobby">
					Администрирование
				</Button>
			</Div>
			}
			<Div>
				<Button size="xl" mode="primary" onClick={go} data-to="welcomeview.help">
					Помощь
				</Button>
			</Div>
			{userInfo && parseInt(userInfo.is_blocked) !== 0 &&
			<Div>
				<Caption level="1" weight="regular">Пользователь заблокирован в системе.</Caption>		
			</Div>
			}
		</Panel>
	)
};

Welcome.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
	regInfo: PropTypes.object,
	setActiveRegRequest: PropTypes.func
};

export default Welcome;
