import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import List from '@vkontakte/vkui/dist/components/List/List';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28BlockOutline from '@vkontakte/icons/dist/28/block_outline';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';

const RegRequestsList = ({ id, go, vkUser, userInfo, regRequests, setFormData, regRequestsFilters, setRegRequestsFilters, showModal}) => (
	<Panel id={id}>
		<PanelHeader left={<PanelHeaderBack onClick={go} data-to="adminview.lobby" />} >Заявки на привязку ЛС</PanelHeader>

		{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
		<Group header={<Header 
			mode="secondary"
			aside={<Link onClick={e => {
				e.preventDefault();
				showModal();
			}}>Фильтры</Link>}
			>
				Перечень заявок
			</Header>}>
			{regRequests &&
			<List>
				{regRequests.map(
					(item, index) => (
						<SimpleCell 
						key={index}
						multiline 
						expandable
						data-to='regrequest-detail'
						data-request_id={item.id}
						before={item.is_approved === null ? <Icon28RecentOutline/> : (parseInt(item.is_approved) === 1 ? <Icon28DoneOutline/> : <Icon28BlockOutline/>)}
						after={parseInt(item.del_in_app) === 1 ? <Icon24Delete/> : (parseInt(item.hide_in_app) === 1 ? <Icon24Hide/> : null)}
						description={item.is_approved === null ? 
							'Ожидает обработки' : 
							(parseInt(item.is_approved) === 1 ? 
								'Одобрена ' : 
								'Отклонена ') + (vkUser.id === parseInt(item.processed_by) ? 'вами' : 'пользователем ID' + item.processed_by)}
						onClick={e => {
							console.log('selected ' + e.currentTarget.dataset.request_id);
							setFormData({request_id: e.currentTarget.dataset.request_id});
							go(e);
						}}
						>{'Заявка №' + item.id + ' от ' + item.request_date}</SimpleCell>
					)
				)}
			</List>
			}
    	</Group>	
		}
	</Panel>
);

RegRequestsList.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	regRequestsFilters: PropTypes.any,
	setRegRequestsFilters: PropTypes.func.isRequired,
	regRequests: PropTypes.array,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object
};

export default RegRequestsList;
