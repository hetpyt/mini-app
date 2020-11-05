import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import List from '@vkontakte/vkui/dist/components/List/List';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Icon28DocumentOutline from '@vkontakte/icons/dist/28/document_outline';
const Help = props => (
    <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to={'to' in props ? props.to : 'welcomeview.welcome'} />}
		>
			Помощь
		</PanelHeader>
		<List>
			<Cell before={<Icon28DocumentOutline />}>
				<Link href="https://vk.com/doc382795146_574957134" target="_blank">Инструкция по работе с приложением</Link>
			</Cell>
		</List>
        <Div>
			<Button size="xl" mode="primary" onClick={props.go} data-to={'to' in props ? props.to : 'welcomeview.welcome'}>
				{'to' in props ? 'Вернуться' : 'В начало'}
			</Button>
		</Div>

	</Panel>
);

Help.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	to: PropTypes.string,
};

export default Help;
