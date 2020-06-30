import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';

const DataInput = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="begin" />}
		>
			Введите показания
		</PanelHeader>
        <FormLayout>
            <Group top="Данные абонента" bottom="Проверьте данные прежде чем продолжить">
                <Cell>
                    <Input top="Код" type="text" name="secret_code" value={props.secretCode} disabled />
                </Cell>   
                <Cell> 
                    <Input type="text" top="Номер ЛС" name="nomer_ls" value={props.tenantData ? props.tenantData.nomer_ls : ''} disabled />
                </Cell>
                <Cell>
                    <Input type="text" top="ФИО" name="fio_" value={props.tenantData ? props.tenantData.fio.imya + ' ' + props.tenantData.fio.otchestvo + ' ' + props.tenantData.fio.familiya[0] + '.' : ''} disabled />
                </Cell>
                <Cell>
                    <Input type="hidden" name="fio" value={props.tenantData ?  props.tenantData.fio.familiya + ' ' + props.tenantData.fio.imya + ' ' + props.tenantData.fio.otchestvo : ''} disabled />
                </Cell>

            </Group>
            <FormLayoutGroup top="Показания" bottom="Проверьте показания прежде чем продолжить">
                {props.tenantData ? props.tenantData.schetchiki.map(({ title, cur_value, id }) => (
                    <Cell>
                        <Input top={title} type="number" name={'counter_' + id} key={id}  />
                    </Cell>
                )) : <Div></Div>}
            </FormLayoutGroup>
            <Div>
                <Button size="xl" mode="primary" onClick={props.go} data-to="persik">
                    Отправить
                </Button>
            </Div>
        </FormLayout>

	</Panel>
);

DataInput.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    secretCode: PropTypes.string,
    tenantData: PropTypes.object,
};

export default DataInput;
