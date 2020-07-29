import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

const StaticMessage = props => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to={'to' in props ? props.to : 'welcomeview.welcome'} />}
		>
			Сообщение
		</PanelHeader>
        <Div>
            <Caption level="1" weight="heavy" >
				{'message' in props ? `${props.message}`
				: '(Сообщение не указано)'}
			</Caption>
        </Div>
        <Div>
			<Button size="xl" mode="primary" onClick={props.go} data-to={'to' in props ? props.to : 'welcomeview.welcome'}>
				{'to' in props ? 'Вернуться' : 'В начало'}
			</Button>
		</Div>

	</Panel>
);

StaticMessage.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	to: PropTypes.string,
	message: PropTypes.string,
};

export default StaticMessage;
