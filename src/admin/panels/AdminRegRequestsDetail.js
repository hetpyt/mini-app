import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Header, PanelHeaderBack, Group, Input, SimpleCell, Link, Avatar, FormLayout, FormLayoutGroup, FormItem, Button, Div } from '@vkontakte/vkui';
import { Icon28User } from '@vkontakte/icons';


import FormSelectInput from './../forms/FormSelectInput';
import { isArray } from '@vkontakte/vkjs';

const AdminRegRequestsDetail = (props) => {

	const userInfo = props.app.userInfo;

	const [formError, setFormError] = useState(null);
	const [activeRegRequest, setActiveRegRequest] = useState(null);
	const [accIndex, setAccIndex] = useState(null);
	const [rejectionReason, setRejectionReason] = useState(null);

	useEffect(() => {
		console.log('useEffect activeRegRequest=', props.regRequestId);
		props.app.restRequest(
            'admin/regrequests/get',
            {
				regrequest_id : props.regRequestId
			},
            res => {
                setActiveRegRequest(res);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, []);

	useEffect(() => {
		if (activeRegRequest) {
			if (isArray(activeRegRequest.selected_accounts) 
			&& activeRegRequest.selected_accounts.length) {
				setAccIndex(0);
			}
		}
	}, [activeRegRequest]);


	const onApprove = e => {
		if (accIndex === null) {
            setFormError(
                {
                    header : "Ошибка заполнения формы",
                    text : "Не выбран лицевой счет"
                }
            );
		} else {
			props.app.restRequest(
				'admin/regrequests/aprove',
				{
					regrequest_id : activeRegRequest.id,
					account_id : activeRegRequest.selected_accounts[accIndex].acc_id
				},
				res => {
					console.log('res=', res);
					props.app.inform_alert("Успех", "Заявка успешно подтверждена",
					e => {
						props.app.setActivePanel('regrequestslist');
					});
				},
				err => {
					console.log('err=', err);
					props.app.inform_alert("Отказ", err.message + " [" + err.code + "]");
				}
			);
		}
	}

	const onReject = e => {
		props.app.restRequest(
			'admin/regrequests/reject',
			{
				regrequest_id : activeRegRequest.id,
				rejection_reason : rejectionReason
			},
			res => {
				console.log('res=', res);
				props.app.inform_alert("Успех", "Заявка успешно отклонена",
				e => {
					props.app.setActivePanel('regrequestslist');
				});
			},
			err => {
				console.log('err=', err);
				props.app.inform_alert("Отказ", err.message + " [" + err.code + "]");
			}
		);
}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={e => {props.app.setActivePanel('regrequestslist')}} />} >Заявка на присоединение ЛС</PanelHeader>

			{(userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 && activeRegRequest) &&

				<Div>
					<Group header={
						<Header mode="primary">
							{'№ ' + activeRegRequest.id + ' от ' + activeRegRequest.request_date}
						</Header>
					}>
						<SimpleCell 
							disabled 
							before={activeRegRequest.vk_user_data ? <Avatar src={activeRegRequest.vk_user_data.photo_200}/> : <Icon28User/>}
							description={(activeRegRequest.vk_user_data && activeRegRequest.vk_user_data.city && activeRegRequest.vk_user_data.city.title) ? activeRegRequest.vk_user_data.city.title : ''}
						>
							<Link href={'https://vk.com/id'+activeRegRequest.vk_user_id} target="_blank">
								{activeRegRequest.vk_user_data 
								? activeRegRequest.vk_user_data.last_name + ' ' + activeRegRequest.vk_user_data.first_name
								: 'Пользователь ВК ' + activeRegRequest.vk_user_id}
							</Link>
						</SimpleCell>
					</Group>

					<FormLayout>
						{formError && 
							<FormItem>
								<FormStatus header={formError.header} mode="error">
									{formError.text}
								</FormStatus>
							</FormItem>
						}
						<Group
							mode="card"
							header={<Header mode="secondary" >Лицевой счет</Header>}
						>
							<FormLayoutGroup>
								<FormItem top="в заявке">
									<Input type="text" disabled value={activeRegRequest.acc_id}/>
								</FormItem>
								{activeRegRequest.is_approved === null
								?
								<FormSelectInput 
									top="в Реестре ЛС"
									options={activeRegRequest && activeRegRequest.selected_accounts && activeRegRequest.selected_accounts.map(
										(acc, index) => (
											{
												value : index,
												caption : acc.acc_id_repr,
											}
										)
									)}
									value={accIndex === null ? '' : activeRegRequest.selected_accounts[accIndex].address_repr}
									onChange={e => {
										console.log("selected=", e.currentTarget.value);
										setAccIndex(Number(e.currentTarget.value));
									}}
								/>
								:
								<FormItem top="в Реестре ЛС">
									<Input type="text" disabled value={activeRegRequest.linked_acc_id}/>
								</FormItem>
								}
							</FormLayoutGroup>
						</Group>
						<Group
							mode="card"
							header={<Header mode="secondary" >ФИО</Header>}
						>
							<FormLayoutGroup>
								<FormItem top="в заявке">
									<Input type="text" disabled value={activeRegRequest.surname + ' ' + activeRegRequest.first_name + ' ' + activeRegRequest.patronymic}/>
								</FormItem>
								<FormItem top="в Реестре ЛС">
									<Input type="text" disabled value={accIndex === null ? '' : activeRegRequest.selected_accounts[accIndex].tenant_repr}/>
								</FormItem>
							</FormLayoutGroup>
						</Group>
						<Group
							mode="card"
							header={<Header mode="secondary" >Адрес</Header>}
						>
							<FormLayoutGroup>
								<FormItem top="в заявке">
									<Input type="text" disabled value={activeRegRequest.street + ' ' + activeRegRequest.n_dom + ', кв. ' + activeRegRequest.n_kv}/>
								</FormItem>
								<FormItem top="в Реестре ЛС">
									<Input type="text" disabled value={accIndex === null ? '' : activeRegRequest.selected_accounts[accIndex].address_repr}/>
								</FormItem>
							</FormLayoutGroup>
						</Group>
						<Group
							mode="card"
							header={<Header mode="secondary" >Причина отклонения заявки</Header>}
						>
							<FormLayoutGroup>
								<FormItem top="будет показано пользователю в случае отклонения заявки">
									<Input type="text" disabled={activeRegRequest.is_approved !== null} value={activeRegRequest.rejection_reason} onChange={
										e => {
											setRejectionReason(e.currentTarget.value);
										}
									}/>
								</FormItem>
							</FormLayoutGroup>
						</Group>

						<FormLayoutGroup mode="horizontal">
							<FormItem>
								<Button size="l" mode="primary" stretched={true} onClick={onApprove}>
									Подтвердить
								</Button>
							</FormItem>
							<FormItem>
								<Button size="l" mode="destructive" stretched={true} onClick={onReject}>
									Отклонить
								</Button>
							</FormItem>
							<FormItem>
								<Button size="l" mode="secondary" stretched={true} onClick={e => {props.app.setActivePanel('regrequestslist')}} >
									Отмена
								</Button>
							</FormItem>
						</FormLayoutGroup>
					</FormLayout>
				</Div>	
			}
		</Panel>
	)
};

export default AdminRegRequestsDetail;
