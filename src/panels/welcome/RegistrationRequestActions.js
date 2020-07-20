import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

const RegistrationRequestActions = props => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="welcomeview.welcome" />}
		>
			Заявка № {props.request_id}
		</PanelHeader>
		<Header mode="primary">Выберите действие над заявкой</Header>
		<Div style={{display: 'flex'}}>
			<Button size="l" stretched style={{ marginRight: 8 }} onClick={props.go} data-action="hide" data-to="welcomeview.welcome">Не показывать</Button>
			<Button size="l" stretched onClick={props.go} data-action="delete" mode="destructive" data-to="welcomeview.welcome">Удалить</Button>
		</Div>

	</Panel>
);

RegistrationRequestActions.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default RegistrationRequestActions;
