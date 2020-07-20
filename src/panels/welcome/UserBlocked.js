import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

const UserBlocked = props => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="welcomeview.welcome" />}
		>
			Регистрация
		</PanelHeader>
        <Div>
            <Caption level="1" weight="heavy" >Запрос на регистрацию отправлен.</Caption>
        </Div>
        <Div>
			<Button size="xl" mode="primary" onClick={props.go} data-to="welcomeview.welcome">
				В начало
			</Button>
		</Div>

	</Panel>
);

UserBlocked.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default UserBlocked;
