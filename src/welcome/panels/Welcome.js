import React from 'react';
import { Panel, PanelHeader, Button, Div, Caption, Group } from '@vkontakte/vkui';

import { Icon24Report, Icon24DismissSubstract, Icon24Spinner } from '@vkontakte/icons';

const Welcome = (props) => { 
	console.log("Welcome.props=", props);
	const appPermIndications = props.app.appPermissions && parseInt(props.app.appPermissions.indications);
	const appPermRegistration = props.app.appPermissions && parseInt(props.app.appPermissions.registration);
	const userInfo = props.app.userInfo;
	const isOperator = props.app.userInfo && ['ADMIN', 'OPERATOR'].indexOf(props.app.userInfo.privileges) != -1;
	const isBlocked = props.app.userInfo && parseInt(props.app.userInfo.is_blocked) !== 0;

	return (
		<Panel id={props.id} centered={false}>
			<PanelHeader>Добро пожаловать, {(props.app.vkUser ? props.app.vkUser.first_name : "Неизвестный")}!</PanelHeader>
	{/* 		<Div>
				<Title style={{color: "red"}} align="center" level="2" weight="semibold">Приложение работает в тестовом режиме!</Title>
				<Title align="center" level="3" weight="regular">Переданные через данное приложение показания НЕ БУДУТ ДОСТАВЛЕНЫ в управляющую организацию.</Title>
			</Div>
	*/}		
			{userInfo &&
				<Group
					description={(appPermIndications && appPermRegistration) ? "" : "Некоторые функции приложения отключены администратором!"}
				>
					{!isBlocked &&
						<React.Fragment>
							<Div>
								<Button 
									size="l" 
									mode={isOperator ? (appPermIndications ? "primary" : "destructive") : "primary"}
									stretched={true} 
									disabled={isOperator ? false : !appPermIndications}
									onClick={e => {props.app.setActiveView("indicationsview")}} 
								>
									Перейти к вводу показаний
								</Button>
							</Div>
							<Div>
								<Button 
									size="l" 
									mode={isOperator ? (appPermRegistration ? "primary" : "destructive") : "primary"}
									stretched={true} 
									disabled={isOperator ? false : !appPermRegistration}
									onClick={e => {props.app.setActiveView("registrationview")}} 
								>
									Присоединить лицевой счет
								</Button>
							</Div>
							{isOperator && 
								<Div>
									<Button size="l" mode="primary" stretched={true} onClick={e => {props.app.setActiveView("adminview")}} >
										Администрирование
									</Button>
								</Div>

							}
						</React.Fragment>
					}
					<Div>
						<Button size="l" mode="primary" stretched={true} onClick={e => {props.app.setActiveView("helpview")}} >
							Помощь
						</Button>
					</Div>
					{isBlocked &&
						<Div>
							<Caption level="1" weight="regular">Пользователь заблокирован в системе.</Caption>		
						</Div>
					}
				</Group>
			}	
		</Panel>
	)
};

export default Welcome;
