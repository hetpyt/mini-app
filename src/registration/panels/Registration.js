import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, FormLayout, FormLayoutGroup, FormItem, FormStatus, Input, Header } from '@vkontakte/vkui';

import Form from './../../Form/Form';

import { isObject } from '@vkontakte/vkjs';

const Registration = (props) => {

	const on_change = (e) => {
		let fData= {...formData};
		fData[e.currentTarget.name] = e.currentTarget.value;
		setFormData(fData);
	};


	const formStruct = () => {
		return [
			{
				name : 'acc_id',
				type : 'text',
				top : 'Номер лицевого счета',
				required : true,
				onChange : on_change
			},
			{
				name : 'surname',
				type : 'text',
				top : 'Фамилия',
				required : true,
				onChange : on_change
			},
			{
				name : 'first_name',
				type : 'text',
				top : 'Имя',
				required : true,
				onChange : on_change
			},
			{
				name : 'patronymic',
				type : 'text',
				top : 'Отчетство',
				required : false,
				onChange : on_change
			},
			{
				name : 'street',
				type : 'text',
				top : 'Улица',
				required : true,
				onChange : on_change
			},
			{
				name : 'n_dom',
				type : 'text',
				top : 'Дом',
				required : true,
				onChange : on_change
			},
			{
				name : 'n_kv',
				type : 'text',
				top : 'Квартира',
				required : false,
				onChange : on_change
			},
			{
				name : 'secret_code',
				type : 'text',
				top : 'Проверочный код с квитанции',
				required : true,
				onChange : on_change
			},


		];
	}

    const [formData, setFormData] = useState(((struct) => {
		let data = {};
		for(let i=0; i < struct.length; i++) {
			data[struct[i].name] = null;
		}
		return data;
	})(formStruct())
	);

	const [formError, setFormError] = useState(null);

	const confirm = (e) => {
		console.log('formdata=', formData);
		if (formData.acc_id 
		&& formData.surname
		&& formData.first_name
		&& formData.street
		&& formData.n_dom
		&& formData.secret_code) {
			setFormError(null);
		} else {
			setFormError({
				header : "Ошибка заполнения формы",
				text : "Не заполнено одно или несколько обязательных полей"
			});
			return;
		}

		props.session.restRequest(
			"regrequests/add",
			{registration_data : formData},
			(res) => {
				console.log('res=', res);

				props.session.goBack();
			},
			(err) => {
				console.log('err=', err);
				setFormError({
					header : "Ошибка обработки формы",
					text : err.message
				});
			}
		)
	};

	const regInfo = props.regrequest;
	const readOnly = isObject(regInfo);

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.session.goBack} />}>Заявка на присоединение ЛС</PanelHeader>
				
			<Form 
				header={<Header mode="secondary">{regInfo ? "Заявка №" + regInfo.id + " от " + regInfo.request_date : "Заполните данные лицевого счета"}</Header>}
				status={formError &&
					<FormItem>
						<FormStatus header={formError.header} mode="error">
							{formError.text}
						</FormStatus>
					</FormItem>
				}
				buttons={
					<FormLayoutGroup mode="horizontal">
						<FormItem>
							<Button size="l" mode="primary" stretched={true} onClick={confirm}>
								Отправить
							</Button>
						</FormItem>
						<FormItem>
							<Button size="l" mode="destructive" stretched={true} onClick={props.session.goBack} >
								Отмена
							</Button>
						</FormItem>
					</FormLayoutGroup>
				}
				fields={formStruct()}
				values={regInfo ? regInfo : formData}
				readOnly={readOnly}
				itemComponent={null}
			/>

		</Panel>
	);
};

export default Registration;
