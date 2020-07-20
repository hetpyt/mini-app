import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import persik from './img/persik.png';
import './Persik.css';


const Persik = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="account-selection">
				
			</PanelHeaderBack>}
		>
			Спасибо!
		</PanelHeader>
		<img className="Persik" src={persik} alt="Persik The Cat"/>
		
		<Div>
			<Button size="xl" mode="primary" onClick={props.go} data-to="account-selection">
				К выбору лицевого счета
			</Button>
		</Div>
	</Panel>
);

Persik.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Persik;
