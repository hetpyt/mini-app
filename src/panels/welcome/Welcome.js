import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
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

const Welcome = ({ id, go, vkUser, userInfo, regInfo, setActiveRegRequest }) => (
	<Panel id={id}>
		<PanelHeader>Добро пожаловать!</PanelHeader>
		{vkUser &&
		<Group title="VK User Data">
			<SimpleCell
				before={vkUser.photo_200 ? <Avatar src={vkUser.photo_200}/> : null}
				description={vkUser.city && vkUser.city.title ? vkUser.city.title : ''}
			>
				{`${vkUser.first_name} ${vkUser.last_name} (${vkUser.id})`}
			</SimpleCell>
		</Group>}

		{regInfo &&
			<Div>
				{regInfo.map(
					({ id, acc_id, is_approved, rejection_reason }, index) => (
						<SimpleCell 
							key={id} 
							data-index={index}
							data-to='regrequest-actions'
							multiline={true} 
							expandable={true}
							text={'Номер заявки ' + id}
							description={'Заявка №' + id + (is_approved === null ? ' ожидает проверки' : (parseInt(is_approved) === 0 ? ' отклонена по причине: ' + (rejection_reason === null ? 'причина не указана' : rejection_reason) : ' одобрена'))}
							onClick={e => {
								console.log('request_index=', e.currentTarget.dataset.index);
								setActiveRegRequest(regInfo[e.currentTarget.dataset.index]);
								go(e);
							}}
						>
							Заявка на привязку лицевого счета №{acc_id}
						</SimpleCell>
					)
				)
				}
				<Caption level="2" weight="regular">По всем вопросам Вы можете обратиться используя контактные данные, указанные в Вашей квитанции.</Caption>
			</Div>
		}
		{userInfo && parseInt(userInfo.is_blocked) === 0  &&
		<Div>
			<Button size="xl" mode="primary" onClick={go} data-to="mainview.account-selection">
				Перейти к вводу показаний
			</Button>
		</Div>
		}
		{(!userInfo || (userInfo && parseInt(userInfo.is_blocked) === 0)) &&
		<Div>
			<Button size="xl" mode="primary" onClick={go} data-to="registrationview.registration">
				Привязать лицевой счет
			</Button>
		</Div>
		}
		{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && parseInt(userInfo.is_blocked) === 0  &&
		<Div>
			<Button size="xl" mode="primary" onClick={go} data-to="adminview.lobby">
				Администрирование
			</Button>
		</Div>
		}
		{userInfo && parseInt(userInfo.is_blocked) !== 0 &&
		<Div>
			<Caption level="1" weight="regular">Пользователь заблокирован в системе.</Caption>		
		</Div>
		}
	</Panel>
);

Welcome.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
	regInfo: PropTypes.object,
	setActiveRegRequest: PropTypes.func
};

export default Welcome;
