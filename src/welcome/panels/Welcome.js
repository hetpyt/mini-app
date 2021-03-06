import React from 'react';
import { Panel, PanelHeader, Button, Div, Caption, Group } from '@vkontakte/vkui';

import { Icon24Report, Icon24DismissSubstract, Icon24Spinner } from '@vkontakte/icons';

const Welcome = (props) => { 
	
	const userInfo = props.app.userInfo;

	return (
		<Panel id={props.id} centered={false}>
			<PanelHeader>Добро пожаловать, {(props.app.vkUser ? props.app.vkUser.first_name : "Неизвестный")}!</PanelHeader>
	{/* 		<Div>
				<Title style={{color: "red"}} align="center" level="2" weight="semibold">Приложение работает в тестовом режиме!</Title>
				<Title align="center" level="3" weight="regular">Переданные через данное приложение показания НЕ БУДУТ ДОСТАВЛЕНЫ в управляющую организацию.</Title>
			</Div>
	*/}		
			{userInfo && parseInt(userInfo.is_blocked) === 0 &&
				<Group>
					<Div>
						<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="indicationsview.accountslist">
							Перейти к вводу показаний
						</Button>
					</Div>
					<Div>
						<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="registrationview.registrationlist">
							Присоединить лицевой счет
						</Button>
					</Div>
					{['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && 
						<Div>
							<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="adminview.mainmenu">
								Администрирование
							</Button>
						</Div>
					}

				</Group>
			}
			<Div>
				<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="welcomeview.help">
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
