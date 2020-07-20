import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';


const Registration = ({ id, go, setFormData, formData }) => {

	const on_change = (e) => {
			let fData= [...formData];
			if (fData.length === 0) fData.push({});
			fData[0][e.currentTarget.name] = e.currentTarget.value;
			console.log('onchange', formData);
			setFormData(fData);
	};

	return (
		<Panel id={id}>
		<PanelHeader left={<PanelHeaderBack onClick={go} data-to="welcomeview.welcome" />}>Регистрация</PanelHeader>
        <FormLayout>
            <FormLayoutGroup top="Заполните данные абонента" />
            <Input type="text" required top="Номер лицевого счета" name="acc_id" onChange={on_change} />
            <Input type="text" top="Фамилия" name="surname" onChange={on_change} />
            <Input type="text" top="Имя" name="first_name" onChange={on_change} />
            <Input type="text" top="Отчество" name="patronymic" onChange={on_change} />
            <Input type="text" top="Улица" name="street" onChange={on_change} />
            <Input type="text" top="Дом" name="n_dom" onChange={on_change} />
            <Input type="number" top="Квартира" name="n_kv" onChange={on_change} />
            <Input type="number" required top="Проверочный код с квитанции" name="secret_code" onChange={on_change} />
            <Button size="xl" mode="primary" onClick={go} data-action="confirm" data-to="registration-data-sent">
                Отправить
            </Button>
		</FormLayout>
	</Panel>
	);
};

Registration.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	formData: PropTypes.any
};

export default Registration;
