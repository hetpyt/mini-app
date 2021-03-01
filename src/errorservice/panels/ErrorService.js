import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, Div, Caption } from '@vkontakte/vkui';

const ErrorService = (props) => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.app.go} data-to="welcomeview.welcome" />}
		>
			Ошибка
		</PanelHeader>
        <Div>
            <Caption level="1" weight="heavy" >
				{props.app.error ? ` Во время работы с сервисом возникла ошибка: ` 
				+ (typeof props.app.error === 'object' ? `[${props.app.error.name}] ${props.app.error.message}` : `${props.app.error}` )
				: 'В настоящее время сервис недоступен. Повторите попытку позже.'}
			</Caption>
        </Div>
        <Div>
			<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="welcomeview.welcome">
				В начало
			</Button>
		</Div>

	</Panel>
);

export default ErrorService;
