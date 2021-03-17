import React, { useState } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Header, Div, FormLayout, Button, File, Caption} from '@vkontakte/vkui';
import Form from './../../Form/Form';
import FormFileInput from './../forms/FormFileInput';
import { isObject } from '@vkontakte/vkjs';

const AdminUploadData = (props) => {

	const userInfo = props.app.userInfo;

	const confirm = fields => {
		let file = fields[0].value;
		console.log('file=', file);

		if (!file) return;

		let reader = new FileReader();

		reader.onloadend = () => {
			try {
				if (!(window.JSON && window.JSON.parse)) throw new Error('Браузер не поддерживает метод "JSON.parse". Отправка данных невозможна.');
				let jsonData = JSON.parse(reader.result);
				if (isObject(jsonData)
				&& jsonData.hasOwnProperty('clients')  
				&& jsonData.hasOwnProperty('meters') 
				&& jsonData.hasOwnProperty('clients_count')  
				&& jsonData.hasOwnProperty('meters_count')) {
					if (jsonData.meters.length == jsonData.meters_count 
					&& jsonData.clients.length == jsonData.clients_count) {
						props.app.question_alert("Требуется подтверждение",
						"При загрузке будет произведена очистка данных о принятых показаниях. Продолжить?",
						e => {
							props.app.restRequest(
								"admin/data/set",
								jsonData,
								res => {
									props.app.inform_alert("Успех", 
									"Данные загружены: \n"
									+ `клиенты : ${res.clients_count},\n`
									+ `счетчики : ${res.meters_count}`, 
									props.goBack);
								},
								err => {
									console.log('err=', err);
									props.app.inform_alert("Отказ", err.message + " [" + err.code + "]", props.goBack);
								}
							);
						},
						props.goBack);
					} else {
						throw new Error("Не совпадают контрольные суммы.");
					}
				} else {
					throw new Error("Неверный формат файла");
				}
			}
			catch (e) {
				console.log(e);
				props.app.inform_alert("Ошибка при чтении файла", e.message);
			}
		}

		reader.onerror = () => {
			console.log("reader.error=", reader.error);
		}

		reader.readAsText(file);
	}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.goBack} />} >Загрузка реестра ЛС на сервер</PanelHeader>
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&

				<Form 
					fields={[
						{
							name : "fileName",
							top : "Выберите файл в формате JSON",
							type : "file",
							required : true,
							itemComponent : FormFileInput,
						}
					]}
					readOnly={false}
					onConfirm={confirm}
					onCancel={props.goBack}
				/>

			}
		</Panel>
	);
};

export default AdminUploadData;
