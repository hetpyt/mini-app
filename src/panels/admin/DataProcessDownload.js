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
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import File from '@vkontakte/vkui/dist/components/File/File';
import List from '@vkontakte/vkui/dist/components/List/List';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon28BlockOutline from '@vkontakte/icons/dist/28/block_outline';
import Icon24Hide from '@vkontakte/icons/dist/24/hide';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';

const DataProcessDownload = ({ id, go, vkUser, userInfo, formData, setFormData}) => {

	return (
		<Panel id={id}>
			<PanelHeader left={<PanelHeaderBack onClick={go} data-to="adminview.lobby" />} >Выгрузка показаний с сервера</PanelHeader>
			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
				<FormLayout>
					<Header mode="primary">Выберите период получения показаний</Header>
					<Input type="date" name="period_begin" top="Начало периода" onChange={e => {
						console.log('period_begin', e.currentTarget.value);
						let fData = [...formData];
						if (fData.length && fData[0].period_end) {
							if (new Date(e.currentTarget.value) > new Date(fData[0].period_end)) e.currentTarget.value = fData[0].period_end;
						}
						fData[0].period_begin = e.currentTarget.value;
						setFormData(fData);
					}}/>
					<Input type="date" name="period_end" top="Конец периода" onChange={e => {
						console.log('period_end', e.currentTarget.value);
						let fData = [...formData];
						if (fData.length && fData[0].period_begin) {
							if (new Date(e.currentTarget.value) < new Date(fData[0].period_begin)) e.currentTarget.value = fData[0].period_begin;
						}
						fData[0].period_end = e.currentTarget.value;
						setFormData(fData);
					}}/>
				</FormLayout>
			}
		</Panel>
	);
};

DataProcessDownload.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.object,
	userInfo: PropTypes.object,
};

export default DataProcessDownload;
