import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Header, FormLayout, FormLayoutGroup, Div, FormItem, Button } from '@vkontakte/vkui';
import { Icon28UserCircleFillBlue } from '@vkontakte/icons';
import Form from './../../Form/Form';
import FormDblItem from './../../Form/FormDblInput';
import { isObject } from '@vkontakte/vkjs';

const IndicationsInput = (props) => {
 
	const [metersList, setMetersList] = useState(null);
	const [formStruct, setFormStruct] = useState(null);
	const [formError, setFormError] = useState(null);

	const on_change = (e) => {
		console.log('formdata=', formData);

		let fData= [...formData];
		for (let i= 0; i < fData.length; i ++) {
			if (fData[i].name == e.currentTarget.name) {
				fData[i].new_count = e.currentTarget.value;
				break;
			}
		}
		setFormData(fData);
	};


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
					description : meter.recieve_date ? 'были переданы ' + meter.recieve_date + (props.session.vkUser.id === parseInt(meter.vk_user_id) ? ' вами' : ' другим пользователем') : 'еще не передавались',
					onChange : on_change
				}))
			);
			console.log('metersList=', metersList);
			setFormData(
				metersList.map((meter) => (
				{
					name : "meter-" + meter.meter_id,
					meter_id : meter.meter_id,
					new_count : null
				}))
			);
		}
	}, [metersList]);

    useEffect(() => {
        if (props.account) {
            props.session.restRequest(
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
                }
            );
        }
    }, []);

	const [formData, setFormData] = useState(null);

	const confirm = (e) => {
		console.log('formdata=', formData);
	}

    return (
        <Panel id={props.id}>
		    <PanelHeader left={<PanelHeaderBack onClick={props.session.goBack} />} >Ввод показаний</PanelHeader>

            {props.account && metersList &&
				<Form
					header={<Header mode="secondary">{"Введите показания по лицевому счету № " + props.account.acc_id_repr}</Header>}
					status={null}
					buttons={
						<FormLayoutGroup mode="horizontal">
							<FormItem>
								<Button size="l" mode="primary" stretched={true} onClick={confirm}>
									Передать
								</Button>
							</FormItem>
							<FormItem>
								<Button size="l" mode="destructive" stretched={true} onClick={props.session.goBack} >
									Отмена
								</Button>
							</FormItem>
						</FormLayoutGroup>
					}
					fields={formStruct}
					values={formData}
					readOnly={false}
					itemComponent={FormDblItem}
				/>
            }	
  
	    </Panel>

    );
}

export default IndicationsInput;
