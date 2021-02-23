import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, Div, Caption } from '@vkontakte/vkui';

const ErrorService = (props) => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.session.go} data-to="welcomeview.welcome" />}
		>
			Ошибка
		</PanelHeader>
        <Div>
            <Caption level="1" weight="heavy" >
				{props.session.error ? ` Во время работы с сервисом возникла ошибка: ` 
				+ (typeof props.session.error === 'object' ? `[${props.session.error.name}] ${props.session.error.message}` : `${props.session.error}` )
				: 'В настоящее время сервис недоступен. Повторите попытку позже.'}
			</Caption>
        </Div>
        <Div>
			<Button size="xl" mode="primary" onClick={props.session.go} data-to="welcomeview.welcome">
				В начало
			</Button>
		</Div>

	</Panel>
);

export default ErrorService;
