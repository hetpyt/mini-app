import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24DismissSubstract from '@vkontakte/icons/dist/24/dismiss_substract';
import Icon24Spinner from '@vkontakte/icons/dist/24/spinner';

const Lobby = ({ id, go, vkUser, userInfo }) => (
	<Panel id={id}>
		<PanelHeader left={<PanelHeaderBack onClick={go} data-to="welcomeview.welcome" />} >Администрирование</PanelHeader>
		{vkUser &&
		<Group title="VK User Data">
			<SimpleCell
				before={vkUser.photo_200 ? <Avatar src={vkUser.photo_200}/> : null}
				description={vkUser.city && vkUser.city.title ? vkUser.city.title : ''}
			>
				{`${vkUser.first_name} ${vkUser.last_name} (${vkUser.id})`}
			</SimpleCell>
		</Group>}

	</Panel>
);

Lobby.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object
};

export default Lobby;