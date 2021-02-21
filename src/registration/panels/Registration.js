import React, { useState, useEffect } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Header from '@vkontakte/vkui/dist/components/Header/Header';


const Registration = (props) => {

    const [formData, setFormData] = useState({});

	const on_change = (e) => {
			let fData= {...formData};
			fData[e.currentTarget.name] = e.currentTarget.value;
			setFormData(fData);
	};

	const confirm = (e) => {
		console.log('formdata=', formData);
		props.session.restRequest(
			"regrequests/add",
			formData,
			(res) => {
				props.session.go();
			}
		)
	};

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.session.go} data-to="registrationlist" />}>Запрос на присоединение ЛС</PanelHeader>
			<FormLayout>
				<Header mode="secondary">Заполните данные абонента</Header>
				<Input type="text" required top="Номер лицевого счета" name="acc_id" onChange={on_change} />
				<Input type="text" required top="Фамилия" name="surname" onChange={on_change} />
				<Input type="text" required top="Имя" name="first_name" onChange={on_change} />
				<Input type="text" top="Отчество" name="patronymic" onChange={on_change} />
				<Input type="text" required top="Улица" name="street" onChange={on_change} />
				<Input type="text" required top="Дом" name="n_dom" onChange={on_change} />
				<Input type="number" top="Квартира" name="n_kv" onChange={on_change} />
				<Input type="number" required top="Проверочный код с квитанции" name="secret_code" onChange={on_change} />
				<Button size="xl" mode="primary" onClick={confirm} data-to="registrationlist">
					Отправить
				</Button>
			</FormLayout>
		</Panel>
	);
};

export default Registration;
