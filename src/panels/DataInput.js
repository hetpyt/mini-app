import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import InfoRow from '@vkontakte/vkui/dist/components/InfoRow/InfoRow';
import Cell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import FormField from '@vkontakte/vkui/dist/components/FormField/FormField';
import Input from '@vkontakte/vkui/dist/components/Input/Input';

const DataInput = props => (
    <Panel id={props.id}>
		<PanelHeader left={<PanelHeaderBack onClick={props.go} data-to="begin" />} >
			Ввод показаний
		</PanelHeader>
        {props.tenantData && props.secretCode && 
        <FormLayout>
            <Group top="Данные абонента" bottom="Проверьте данные прежде чем продолжить">
                <FormLayoutGroup top="Код">
                    <Input type="text" top="Код" name="secret_code" value={props.secretCode} disabled ></Input>
                </FormLayoutGroup>   
                <FormLayoutGroup> 
                    <Input type="text" top="Номер ЛС" name="nomer_ls" value={props.tenantData.nomer_ls} disabled />
                </FormLayoutGroup>
                <FormLayoutGroup>
                    <Input type="text" top="ФИО" name="fio_" value={`${props.tenantData.fio.imya} ${props.tenantData.fio.otchestvo} ${props.tenantData.fio.familiya[0]}.`} disabled />
                </FormLayoutGroup>
                    <Input type="hidden" name="fio" value={`${props.tenantData.fio.familiya} ${props.tenantData.fio.imya} ${props.tenantData.fio.otchestvo}`} disabled />
            </Group>
            <Group top="Показания" bottom="Проверьте показания прежде чем продолжить">
                {props.tenantData.schetchiki.map(({ title, cur_value, id }) => (
                        <FormLayoutGroup top={title} key={id}>
                            <Input top="Текущие показания" type="number" name={'cur-count_' + id} value={cur_value} disabled />
                            <Input top="Новые показания" type="number" name={'new-count_' + id} />
                        </FormLayoutGroup>
                ))}
            </Group>
            <Div>
                <Button size="xl" mode="primary" onClick={props.go} data-to="persik">
                    Отправить
                </Button>
            </Div>
        </FormLayout>
        }
	</Panel>
);

DataInput.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    secretCode: PropTypes.string,
    tenantData: PropTypes.object,
    vkuser: PropTypes.object,
};

export default DataInput;
