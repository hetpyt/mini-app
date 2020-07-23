import React from 'react';
import PropTypes, { func } from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Header from '@vkontakte/vkui/dist/components/Header/Header';

const DataInput = props => (
    <Panel id={props.id}>
		<PanelHeader left={<PanelHeaderBack onClick={props.go} data-to="account-selection" />} >
			Ввод показаний
		</PanelHeader>
        {props.vkUser && props.activeAcc && props.meters &&

        <Group header={<Header mode="primary">Показания приборов учета по лицевому счету №{props.activeAcc.acc_id_repr}</Header>}>
            {
                props.meters.map(
                    ({ title, current_count, new_count, meter_id, recieve_date, vk_user_id }) => (
                        <FormLayout key={meter_id} >
                            <Header mode="secondary">{title}</Header>
                            <Input top="текущие показания" type="number" name={'curcount_' + meter_id} value={current_count} disabled />
                            <Input top="новые показания" 
                            type="number" name={meter_id} 
                            bottom={recieve_date ? 'были переданы ' + recieve_date + (props.vkUser.id === parseInt(vk_user_id) ? ' вами' : ' другим пользователем') : 'еще не передавались'}
                            placeholder={new_count}
                            onChange={ (e) => {
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
                                        new_count: e.currentTarget.value
                                        //vk_user_id: props.vkUser.id,
                                        //vk_user_familiya: props.vkUser.last_name,
                                        //vk_user_imya: props.vkUser.first_name
                                    });
                                }
                                props.setFormData(formData);
                                } } />
                                <Separator />
                        </FormLayout>
                    )
                )
            }
                <FormLayout>
                    <Button size="xl" mode="primary" onClick={props.go} data-action="confirm" data-to="persik">
                        Отправить
                    </Button>
                </FormLayout>
            </Group>
        }
	</Panel>
);

DataInput.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    meters: PropTypes.array,
    activeAcc: PropTypes.object,
    setFormData: PropTypes.func.isRequired,
    formData: PropTypes.array.isRequired,
    vkUser: PropTypes.object,
};

export default DataInput;
