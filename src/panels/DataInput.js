import React from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';

const DataInput = props => (
    <Panel id={props.id}>
		<PanelHeader left={<PanelHeaderBack onClick={props.go} data-to="begin" />} >
			Ввод показаний
		</PanelHeader>
        {props.tenantData && props.secretCode && props.vkUser && 
        <FormLayout>
            <FormLayoutGroup top="Данные абонента" />
            <Input type="text" top="Код" name="secret_code" value={props.secretCode} disabled />
            <Input type="text" top="Номер ЛС" name="nomer_ls" value={props.tenantData.nomer_ls} disabled />
            <Input type="text" top="ФИО" name="fio_" value={`${props.tenantData.imya} ${props.tenantData.otchestvo} ${props.tenantData.familiya[0]}.`} disabled />
            <Input type="hidden" name="fio" value={`${props.tenantData.familiya} ${props.tenantData.imya} ${props.tenantData.otchestvo}`} disabled />
            <Input type="hidden" name="vk_id" value={props.vkUser.id} disabled />
            <Input type="hidden" name="vk_fio" value={`${props.vkUser.last_name} ${props.vkUser.first_name}`} disabled />

            <FormLayoutGroup top="Показания приборов учета" />
            {props.tenantData.meters.map(({ title, current_count, new_count, meter_id }) => (
                <FormLayoutGroup top={title} key={meter_id} >
                    <Input top={title} type="number" name={'curcount_' + meter_id} value={current_count} disabled />
                    <Input type="number" name={meter_id} placeholder="Введите новые показания" value={new_count === null ? undefined : new_count} onChange={ (e) => {
                        let found= false;
                        let formData= [...props.formData];
                        //console.log('onchange', formData);
                        for (let i= 0; i < formData.length; i++) {
                            //console.log(formData[i].id == e.currentTarget.name);
                            if (formData[i].meter_id === e.currentTarget.name) {
                                formData[i].new_count= e.currentTarget.value;
                                found= true;
                                //console.log('found');
                                break;
                            }
                        }
                        if (!found) {
                            formData.push({
                                meter_id: e.currentTarget.name,
                                new_count: e.currentTarget.value,
                                vk_user_id: props.vkUser.id
                            });
                        }
                        props.setFormData(formData);
                        } } />
                </FormLayoutGroup>
            ))}
            <Button size="xl" mode="primary" onClick={props.go} data-action="confirm" data-to="persik">
                Отправить
            </Button>
        </FormLayout>
        }
	</Panel>
);

DataInput.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    secretCode: PropTypes.string,
    tenantData: PropTypes.object,
    setFormData: PropTypes.func.isRequired,
    formData: PropTypes.array.isRequired,
    vkUser: PropTypes.object,
};

export default DataInput;
