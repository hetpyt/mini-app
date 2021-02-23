import React from 'react';
import { Panel, PanelHeader, Button, Div, Caption } from '@vkontakte/vkui';

import { Icon24Report, Icon24DismissSubstract, Icon24Spinner } from '@vkontakte/icons';

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

export default Welcome;
