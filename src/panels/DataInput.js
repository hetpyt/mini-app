import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import PanelHeaderBack from '@vkontakte/vkui/dist/components/PanelHeaderBack/PanelHeaderBack';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
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
            <FormLayoutGroup top="Данные абонента" bottom="Проверьте данные прежде чем продолжить">
                <Cell multiline>
                    <InfoRow header="Код">{props.secretCode}</InfoRow>
                </Cell>
                <Cell>
                    <InfoRow header="Номер ЛС">{props.tenantData ? props.tenantData.nomer_ls : ''}</InfoRow>
                </Cell>
            </FormLayoutGroup>
            <FormLayoutGroup top="Показания" bottom="Проверьте показания прежде чем продолжить">
                <Input top="Счетчик 1" type="number" />
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
    secretCode: PropTypes.string.isRequired,
    tenantData: PropTypes.object.isRequired,
};

export default DataInput;
