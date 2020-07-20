import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Icon28User from '@vkontakte/icons/dist/28/user';

const AccountSelection = ({ id, go, userInfo, vkUser, setActiveAcc }) => (
	<Panel id={id}>
		<PanelHeader left={<PanelHeaderBack onClick={go} data-to="welcomeview.welcome" />}>Выбор лицевого счета</PanelHeader>
        <Group>
			<Header mode='secondary'>Выберите лицевой счет</Header>
			{userInfo && userInfo.accounts.map((acc, index) => (
						<Div key={acc.acc_id}>
							<SimpleCell 
								expandable={true} 
								multiline={true} 
								before={<Icon28User />} 
								description={acc.acc_id_repr} 
								data-index={index} 
								data-to='datainput'
								onClick={e => {
									console.log('active_acc=', userInfo.accounts[e.currentTarget.dataset.index]);
									setActiveAcc(userInfo.accounts[e.currentTarget.dataset.index]);
									go(e);
								}
							}>
								{acc.address_repr}
							</SimpleCell>
						</Div>
					)
				)
			}
        </Group>
	</Panel>
);

AccountSelection.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
	setActiveAcc: PropTypes.object,
};

export default AccountSelection;
