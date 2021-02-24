import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, FormLayout, FormLayoutGroup, FormItem, FormStatus, Input, Header } from '@vkontakte/vkui';


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

	const [formError, setFormError] = useState(null);

	const on_change = (e) => {
			let fData= {...formData};
			fData[e.currentTarget.name] = e.currentTarget.value;
			setFormData(fData);
	};

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
				text : "Не заполнен один или несколько обязательных полей"
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
					header : "Ошибка обрботки формы",
					text : err.message
				});
			}
		)
	};

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.session.goBack} data-to="registrationlist" />}>Запрос на присоединение ЛС</PanelHeader>
			<FormLayout>
				<Header mode="secondary">Заполните данные лицевого счета</Header>

				{formError &&
					<FormItem>
						<FormStatus header={formError.header} mode="error">
							{formError.text}
						</FormStatus>
					</FormItem>
				}
				<FormItem top="Номер лицевого счета" 
				status={formData.acc_id ? 'valid' : 'error'}
				bottom={formData.acc_id ? '' : 'Введите номер лицевого счета'}
				>
					<Input type="text" name="acc_id" onChange={on_change} />
				</FormItem>

				<FormItem top="Фамилия"
				status={formData.surname ? 'valid' : 'error'}
				bottom={formData.surname ? '' : 'Введите фамилию ответственного квартиросъемщика'}
				>
					<Input type="text" name="surname" onChange={on_change} />
				</FormItem>

				<FormItem top="Имя"
				status={formData.first_name ? 'valid' : 'error'}
				bottom={formData.first_name ? '' : 'Введите имя ответственного квартиросъемщика'}
				>
					<Input type="text" name="first_name" onChange={on_change} />
				</FormItem>

				<FormItem top="Отчество">
					<Input type="text" name="patronymic" onChange={on_change} />
				</FormItem>

				<FormItem top="Улица"
				status={formData.street ? 'valid' : 'error'}
				bottom={formData.street ? '' : 'Введите улицу'}
				>
					<Input type="text" top="Улица" name="street" onChange={on_change} />
				</FormItem>

				<FormItem top="Дом"
				status={formData.n_dom ? 'valid' : 'error'}
				bottom={formData.n_dom ? '' : 'Введите номер дома'}
				>
					<Input type="text" top="Дом" name="n_dom" onChange={on_change} />
				</FormItem>

				<FormItem top="Квартира">
					<Input type="number" top="Квартира" name="n_kv" onChange={on_change} />
				</FormItem>

				<FormItem top="Проверочный код с квитанции" 
				status={formData.secret_code ? 'valid' : 'error'}
				bottom={formData.secret_code ? '' : 'Введите проверочный код с квитанции'}
				>
					<Input type="number"  name="secret_code" onChange={on_change} />
				</FormItem>

				<FormLayoutGroup mode="horizontal">
					<FormItem>
						<Button size="l" mode="primary" stretched={true} onClick={confirm} data-to="registrationlist">
							Отправить
						</Button>
					</FormItem>
					<FormItem>
						<Button size="l" mode="destructive" stretched={true} onClick={props.session.go} data-to="registrationlist">
							Отмена
						</Button>
					</FormItem>
				</FormLayoutGroup>
			</FormLayout>
		</Panel>
	);
};

export default Registration;
