import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, FormLayout, FormItem, Input, Header } from '@vkontakte/vkui';


const Registration = (props) => {

    const [formData, setFormData] = useState({
		acc_id : '',
		surname : '',
		first_name : '',
		patronymic : '',
		street : '',
		n_dom : '',
		n_kv : '',
		secret_code : ''
	});

	const on_change = (e) => {
			let fData= {...formData};
			fData[e.currentTarget.name] = e.currentTarget.value;
			setFormData(fData);
	};

	const confirm = (e) => {
		console.log('formdata=', formData);
		if (!(formData.acc_id && formData.secret_code)) {
			return;
		}

		props.session.restRequest(
			"regrequests/add",
			{registration_data : formData},
			(res) => {
				console.log('res=', res);
				//props.session.go();
			}
		)
	};

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.session.go} data-to="registrationlist" />}>Запрос на присоединение ЛС</PanelHeader>
			<FormLayout>
				<Header mode="secondary">Заполните данные абонента</Header>
				<FormItem status={formData.acc_id ? 'valid' : 'error'}>
					<Input type="text" required top="Номер лицевого счета" name="acc_id" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="text" top="Фамилия" name="surname" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="text" top="Имя" name="first_name" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="text" top="Отчество" name="patronymic" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="text" top="Улица" name="street" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="text" top="Дом" name="n_dom" onChange={on_change} />
				</FormItem>
				<FormItem>
					<Input type="number" top="Квартира" name="n_kv" onChange={on_change} />
				</FormItem>
				<FormItem status={formData.secret_code ? 'valid' : 'error'}>
					<Input type="number" required top="Проверочный код с квитанции" name="secret_code" onChange={on_change} />
				</FormItem>
				<Button size="xl" mode="primary" onClick={confirm} data-to="registrationlist">
					Отправить
				</Button>
			</FormLayout>
		</Panel>
	);
};

export default Registration;
