import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Select from '@vkontakte/vkui/dist/components/Select/Select';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Link from '@vkontakte/vkui/dist/components/Link/Link';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import List from '@vkontakte/vkui/dist/components/List/List';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28BlockOutline from '@vkontakte/icons/dist/28/block_outline';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';
import Icon28User from '@vkontakte/icons/dist/28/user';

const RegRequestDetail = ({ id, go, vkUser, userInfo, activeRegRequest, formData, setFormData }) => {

	console.log('RegRequestDetail exec');

	const [accIndex, setAccIndex] = useState(null);

	useEffect(() => {
		console.log('useEffect activeRegRequest=', activeRegRequest);
		if (activeRegRequest) {
			let fdata = {...formData};
			fdata.request_id = activeRegRequest.id;
			setFormData(fdata);
		}
		if (activeRegRequest && activeRegRequest.selected_accounts) {
			if (activeRegRequest.selected_accounts.length) {
				console.log('useEffect.default=0');
				setAccIndex(0);
			}
		}
	}, []);


	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="adminview.regrequests-list" />} >Заявка</PanelHeader>
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && activeRegRequest &&
			<Group header={<Header mode="primary">{'№ ' + activeRegRequest.id + ' от ' + activeRegRequest.request_date}</Header>}>
				<SimpleCell 
				before={activeRegRequest.vk_user_data ? <Avatar src={activeRegRequest.vk_user_data.photo_200}/> : <Icon28User/>}
				description={activeRegRequest.vk_user_data && activeRegRequest.vk_user_data.city && activeRegRequest.vk_user_data.city.title ? activeRegRequest.vk_user_data.city.title : ''}>
					<Link href={'https://vk.com/id'+activeRegRequest.vk_user_id} target="_blank">
						{activeRegRequest.vk_user_data 
						? activeRegRequest.vk_user_data.last_name + ' ' + activeRegRequest.vk_user_data.first_name
						: 'Пользователь ВК ' + activeRegRequest.vk_user_id}
					</Link>
				</SimpleCell>
				<Separator />
				<FormLayout>
					<Header mode="secondary">Номер лицевого счета</Header>
					<Input type="text"  top="указанный в заявке" disabled value={activeRegRequest.acc_id}/>
					<Select required disabled={activeRegRequest.is_approved === null ? false : true} top="указанный в Реестре ЛС" onChange={e => {
						//console.log('select key=',e.currentTarget.key);
						let index= null;
						for (let i=0; i < activeRegRequest.selected_accounts.length; i++) 
							if (activeRegRequest.selected_accounts[i].acc_id === e.currentTarget.value) {
								index= i;
								break;
							}
						setAccIndex(index);
						let fdata = {...formData};
						fdata.account_id = e.currentTarget.value;
						setFormData(fdata);
						console.log('formdata=',fdata);
					}}>
						{
							((arr) => {
								return arr.map((el, index) => (
									<option key={index} value={el.acc_id}>{el.acc_id_repr}</option>
								));
							})(activeRegRequest.selected_accounts)
						}
					</Select>
					<Separator />
				</FormLayout>
				<FormLayout>
					<Header mode="secondary">Ф.И.О.</Header>
					<Input type="text"  top="указанное в заявке" disabled value={activeRegRequest.surname + ' ' + activeRegRequest.first_name + ' ' + activeRegRequest.patronymic}/>
					<Input type="text"  top="указанное в Реестре ЛС" disabled value={accIndex === null ? '' : activeRegRequest.selected_accounts[accIndex].tenant_repr}/>
					<Separator />
				</FormLayout>
				<FormLayout>
					<Header mode="secondary">Адрес</Header>
					<Input type="text"  top="указанный в заявке" disabled value={activeRegRequest.street + ' ' + activeRegRequest.n_dom + ', кв. ' + activeRegRequest.n_kv}/>
					<Input type="text"  top="указанный в Реестре ЛС" disabled value={accIndex === null ? '' : activeRegRequest.selected_accounts[accIndex].address_repr}/>
					<Separator />
				</FormLayout>
				<FormLayout>
					<Header mode="secondary">Причина отказа</Header>
					<Input type="text" top="Будет показана заявителю в случае отказа" name="rejection_reason" disabled={activeRegRequest.is_approved !== null} 
					defaultValue={activeRegRequest.rejection_reason} 
					onChange={e => {
						let fdata = {...formData};
						fdata.rejection_reason = e.currentTarget.value;
						setFormData(fdata);
					}}/> 
				</FormLayout>
				{activeRegRequest.is_approved === null && 
					<FormLayout>
						{parseInt(activeRegRequest.del_in_app) === 0 
						?
						<Div style={{display: 'flex'}}>
							<Button size="l" stretched style={{ marginRight: 8 }} onClick={go} data-action="approve" data-to="regrequest-action">Одобрить</Button>
							<Button size="l" stretched onClick={go} data-action="reject" mode="destructive" data-to="regrequest-action">Отклонить</Button>
						</Div>
						:
						<Div style={{display: 'flex'}}>
							<Button size="l" stretched onClick={go} data-action="delete" mode="destructive" data-to="regrequest-action">Удалить окончательно</Button>
						</Div>	
						}
					</FormLayout>
				}
			</Group>	
			}
		</Panel>
	)
};

RegRequestDetail.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
	activeRegRequest: PropTypes.array

};

export default RegRequestDetail;
