import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, FormLayout, FormLayoutGroup, FormItem, FormStatus, Input, Header } from '@vkontakte/vkui';

import Form from './../../Form/Form';

import { isObject } from '@vkontakte/vkjs';

const Registration = (props) => {

	const formStruct = () => {
		return [
			{
				name : 'acc_id',
				type : 'text',
				top : 'Номер лицевого счета',
				required : true,
				minLength : 3,
				errMessage : "Заполните обязательный реквизит (мин. 3 символа)",
			},
			{
				name : 'surname',
				type : 'text',
				top : 'Фамилия',
				required : true,
			},
			{
				name : 'first_name',
				type : 'text',
				top : 'Имя',
				required : true,
			},
			{
				name : 'patronymic',
				type : 'text',
				top : 'Отчетство',
				required : false,
			},
			{
				name : 'street',
				type : 'text',
				top : 'Улица',
				required : true,
			},
			{
				name : 'n_dom',
				type : 'text',
				top : 'Дом',
				required : true,
			},
			{
				name : 'n_kv',
				type : 'text',
				top : 'Квартира',
				required : false,
			},
			{
				name : 'secret_code',
				type : 'number',
				top : 'Проверочный код с квитанции',
				required : true,
				minLength : 3,
				errMessage : "Заполните обязательный реквизит (мин. 3 символа)",
			},
			{
				name : 'ppd_confirm',
				type : 'checkbox',
				top : 'Я даю согласие на обработку и хранение передаваемых мною персональных данных, бла бла бла...',
				required : true,
				errMessage : "для продолжения необходимо дать согласие на обработку ПДн"
			},

		];
	}

	const confirm = (formData) => {
		console.log('Registration.formdata=', formData);
		props.session.restRequest(
			"regrequests/add",
			{registration_data : formData},
			(res) => {
				console.log('res=', res);

				props.session.goBack();
			},
			(err) => {
				console.log('err=', err);
				props.session.goBack();
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
				fields={formStruct()}
				readOnly={readOnly}
				itemComponent={null}
				onConfirm={confirm}
				onCancel={props.session.goBack}
			/>

		</Panel>
	);
};

export default Registration;
