import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

const ErrorService = props => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="begin" />}
		>
			Ошибка
		</PanelHeader>
        <Div>
            <Caption level="1" weight="heavy" >В настоящее время сервис недоступен. Повторите попытку позже.</Caption>
        </Div>
        <Div>
			<Button size="xl" mode="primary" onClick={props.go} data-to="begin">
				В начало
			</Button>
		</Div>

	</Panel>
);

ErrorService.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default ErrorService;
