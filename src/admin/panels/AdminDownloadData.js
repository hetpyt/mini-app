import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Panel, PanelHeader, PanelHeaderBack, Header, Div, FormLayout, Button, File, Caption} from '@vkontakte/vkui';
import Form from './../../Form/Form';

const AdminDownloadData = (props) => {

	const userInfo = props.app.userInfo;

	const confirm = fields => {
		console.log("confirm.fields=", fields);
		if (fields[0].value && fields[1].value) {
			if (new Date(fields[0].value) > new Date(fields[1].value)) {
				return ({
                    header : "Ошибка заполнения формы",
                    text : "Начало периода должно быть раньше конца периода"
				});
			}
		}
		let filters = [
			fields.reduce((filter, field) => {
				console.log("filter=", filter);
				filter.value.push(field.value ? field.value : null);
				return filter;
			}, {
				field : "indications.recieve_date",
				value : []
			})
		];
		props.app.restRequest(
			"admin/data/get",
			{filters : filters,
			},
			res => {
				console.log("res=", res);

				try {
					let blob = new Blob([JSON.stringify(res, null, 2)], {type: 'text/plain'});
					saveAs(blob, "indications.json");
				} catch (e) {
					props.app.inform_alert("Ошибка", "Не удалось сохранить принятые данные как JSON файл. Причина: " + e.message, props.app.goBack);
				}

			},
			err => {
				console.log('err=', err);
				props.app.inform_alert("Отказ", err.message + " [" + err.code + "]", props.goBack);
			}
		);
	}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />} >Выгрузка показаний с сервера</PanelHeader>
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
				<Form
					header={<Header mode="secondary">Выберите период выгрузки показаний</Header>}
					fields={[
						{
							name : "begin_date",
							top : "Начало периода",
							type : "date",
							required : false,
						},
						{
							name : "end_date",
							top : "Конец периода",
							type : "date",
							required : false,
						},
					]}
					readOnly={false}
					onConfirm={confirm}
					onCancel={props.goBack}
				/>
			}
		</Panel>
	);
};

export default AdminDownloadData;
