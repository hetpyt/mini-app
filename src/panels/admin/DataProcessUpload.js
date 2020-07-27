import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import CellButton from '@vkontakte/vkui/dist/components/CellButton/CellButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import File from '@vkontakte/vkui/dist/components/File/File';
import List from '@vkontakte/vkui/dist/components/List/List';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28BlockOutline from '@vkontakte/icons/dist/28/block_outline';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';

const DataProcessUpload = ({ id, go, vkUser, userInfo, fileData, setFileData}) => {

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="adminview.lobby" />} >Загрузка реестра лицевых счетов на сервер</PanelHeader>
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
				<FormLayout>
					<File top="Выберите файл данных в формате JSON для отправки на сервер" controlSize="xl" mode="primary" onChange={e => {
						e.preventDefault();
						console.log('file=', e.target.files[0]);
						let reader = new FileReader();
						let file = e.target.files[0];

						reader.onloadend = () => {
							try {
								if (!(window.JSON && window.JSON.parse)) throw 'browser do not support JSON.parse';
								let jsonData = JSON.parse(reader.result);
								if (jsonData.data.length !== jsonData.accounts_count) throw 'JSON parsing error, check sum is not correct';
								console.log(jsonData);
								setFileData({
									file: file,
									error: null,
									data: jsonData.data});
							}
							catch (e) {
								console.log(e);
								setFileData({
									file: null,
									error: e.message,
									data: null});
							}
						}
						reader.onerror = () => {
							console.log(reader.error);
							setFileData({
								file: null,
								error: reader.error,
								data: null});
						}
						reader.readAsText(file);
					}}>
						{fileData && fileData.file ? `Выбран "${fileData.file.name}" [${fileData.data.length}]` : "Выбрать файл"}
					</File>
					{fileData && fileData.error &&
						<Div>
							<Caption level="1" weight="heavy" >
								{'Ошибка при чтении файла: ' + fileData.error}
							</Caption>
						</Div>
					}
					{fileData && !fileData.error && fileData.data && 
						<Div>
							<Button size="xl" mode="primary" onClick={go} data-action="confirm" data-to="lobby">
								Загрузить данные
							</Button>
						</Div>
				}
				</FormLayout>
			}
		</Panel>
	);
};

DataProcessUpload.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
};

export default DataProcessUpload;
