import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Header, FormLayout, FormLayoutGroup, Div, FormItem, Button } from '@vkontakte/vkui';
import { Icon28UserCircleFillBlue } from '@vkontakte/icons';
import Form from './../../Form/Form';
import FormIndicationsInput from './FormIndicationsInput';
import { isObject } from '@vkontakte/vkjs';

const IndicationsInput = (props) => {
 
	const [metersList, setMetersList] = useState(null);
	const [formStruct, setFormStruct] = useState(null);

	useEffect(() => {
		if (metersList) {
			setFormStruct(
				metersList.map((meter) => (
				{
					name : "meter-" + meter.meter_id,
					top : meter.title,
					type : "number",
					required : false,
					staticValue : meter.current_count,
					defaultValue : meter.new_count,
					description : meter.recieve_date ? 'были переданы ' + meter.recieve_date + (props.app.vkUser.id === parseInt(meter.vk_user_id) ? ' вами' : ' другим пользователем') : 'еще не передавались',
					_meter_id : meter.meter_id,
				}))
			);
			console.log('metersList=', metersList);
		}
	}, [metersList]);

    useEffect(() => {
        if (props.account) {
            props.app.restRequest(
                'meters/list',
                {
                    account_id : props.account.acc_id
                },
                res => {
					console.log('res=', res);
                    setMetersList(res);
                },
                err => {
                    console.log('err=', err);
					props.app.inform_alert("Ошибка получения данных", err.message + " [" + err.code + "]");
                }
            );
        }
    }, []);

	const confirm = (formData) => {
		console.log('IndicationsInput.confirm.formdata=', formData);

		// check int 
		for (let i=0; i < formData.length; i++) {
			if ( formData[i].value === null || formData[i].value === "" || (Number.isInteger(Number(formData[i].value)) && Number(formData[i].value) >= 0) ) {}
			else {
				props.app.inform_alert("Введены некорректные данные", 
					'В качестве показаний приборов учета могут выступать только положительные целые числа.');
				return;
			}
		}

		props.app.restRequest(
			"indications/add",
			{	account_id : props.account.acc_id,
				meters : formData.map(
				(field) => (
					{
						meter_id : field._meter_id,
						new_count : field.value,
					}
				)
			)},
			(res) => {
				console.log('res=', res);
				props.app.inform_alert("Успешно", "Показания приборов учета успешно переданы.", e => {props.app.setActivePanel('accountslist')});
			},
			(err) => {
				console.log('err=', err);
				props.app.inform_alert("Ошибка обработки запроса", err.message + " [" + err.code + "]");
				//props.app.goBack();
			}
		)
	}

    return (
        <Panel id={props.id}>
		    <PanelHeader left={<PanelHeaderBack onClick={e => {props.app.setActivePanel('accountslist')}} />} >Ввод показаний</PanelHeader>

            {formStruct &&
				<Form
					header={<Header mode="secondary">{"Введите показания по лицевому счету № " + props.account.acc_id_repr}</Header>}
					fields={formStruct}
					readOnly={false}
					itemComponent={FormIndicationsInput}
					onConfirm={confirm}
					onCancel={e => {props.app.setActivePanel('accountslist')}}
				/>
            }	
  
	    </Panel>

    );
}

export default IndicationsInput;
