import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Header, SimpleCell, Div } from '@vkontakte/vkui';
import { Icon28UserCircleFillBlue } from '@vkontakte/icons';
import Form from './../../Form/Form';
import { isObject } from '@vkontakte/vkjs';

const IndicationsInput = (props) => {
    
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
    const [metersList, setMetersList] = useState(null);
	const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (props.account) {
            props.session.restRequest(
                'meters/list',
                {
                    account_id : props.account.acc_id
                },
                res => {
                    setMetersList(res);
                },
                err => {
                    console.log('err=', err);
                }
            );
        }
    }, []);

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

    return (
        <Panel id={props.id}>
		    <PanelHeader left={<PanelHeaderBack onClick={props.session.goBack} />} >Ввод показаний</PanelHeader>

            {props.account && metersList &&
                <Form 
                    header={<Header mode="secondary">{"Введите показания приборов учета по лицевому счету № " + props.account.acc_id_repr}</Header>}
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
                    readOnly={false}
                />
            }
  
	    </Panel>

    );
}

export default IndicationsInput;
