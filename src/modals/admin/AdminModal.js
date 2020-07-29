import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ModalPageHeader, ModalRoot, ModalPage, ANDROID, IOS, usePlatform } from '@vkontakte/vkui';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Caption from '@vkontakte/vkui/dist/components/Typography/Caption/Caption';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import SimpleCell from '@vkontakte/vkui/dist/components/SimpleCell/SimpleCell';
import Switch from '@vkontakte/vkui/dist/components/Switch/Switch';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';


const AdminModal = ({ activeModal, setActiveModal, regRequestsFilters, setRegRequestsFilters, onModalDone }) => {

    const platform = usePlatform();

    const modalHeader = (title, on_done, on_cancel) => {
        return (
            <ModalPageHeader
                left={(
                <Fragment>
                    {platform === ANDROID && <PanelHeaderButton onClick={on_cancel}><Icon24Cancel /></PanelHeaderButton>}
                </Fragment>
                )}
                right={(
                <Fragment>
                    {platform === ANDROID && <PanelHeaderButton onClick={on_done}><Icon24Done /></PanelHeaderButton>}
                    {platform === IOS && <PanelHeaderButton onClick={on_done}>Готово</PanelHeaderButton>}
                </Fragment>
                )}
            >
                {title}
            </ModalPageHeader>        
        );
    };

    const onFiltersPageClose = id => {
        console.log('onFiltersPageClose.', id);
        setActiveModal(null);
    }

    const onFiltersPageDone = e => {
        console.log('onFiltersPageDone.elem=', e);
        setActiveModal(null);
        //onModalDone();
    }

    const onFiltersSwitchCanged = e => {
        const id = e.currentTarget.id;
        const field = id.slice(0, id.indexOf('-'));
        const value = id.slice(id.indexOf('-') + 1);
        console.log('field=',field, ' value=', value, ' checked=', e.currentTarget.checked);

        let filters = [... regRequestsFilters];
        for (let i=0; i < filters.length; i++) {
            if (filters[i].field === field) {
                if (Array.isArray(filters[i].value)) {
                    const index = filters[i].value.indexOf(value);
                    if (e.currentTarget.checked) {
                        if (index === -1) filters[i].value.push(value); 
                    } else {
                        if (index >= 0) filters[i].value.splice(index, 1);
                    }
                } else {
                    if (e.currentTarget.checked) {
                        if (filters[i].value) {
                            if (filters[i].value !== value) {
                                filters[i].value = [filters[i].value, value];
                            }
                        } else filters[i] = value;
                    } else {
                        filters.splice(i, 1);
                    }
                }
                setRegRequestsFilters(filters);
                return;
            } 
        }
        // not found
        filters.push({
            field: field,
            value: value
        });
        setRegRequestsFilters(filters);
    }

    const onFiltersInputChanged = e => {
        const field = e.currentTarget.name;
        const value = e.currentTarget.value;
        let filters = [... regRequestsFilters];

        for (let i=0; i < filters.length; i++) {
            if (filters[i].field === field) {
                if (value) {
                    filters[i].value = value;
                } else {
                    filters.splice(i, 1);
                }
                setRegRequestsFilters(filters);
                return;
            }
        }
        // not found
        filters.push({
            field: field,
            value: value
        });
        setRegRequestsFilters(filters);
    }

    const isFiltersSwitchChecked = id => {
        let field = id.slice(0, id.indexOf('-'));
        let value = id.slice(id.indexOf('-') + 1);

        let filters = [... regRequestsFilters];
        for (let i=0; i < filters.length; i++) {
            if (filters[i].field === field) {
                if (Array.isArray(filters[i].value)) {
                    return (filters[i].value.indexOf(value) >= 0);
                } else {
                    return (filters[i].value === value);
                }
            }
        }
        return false;
    }

    const getFiltersValue = id => {
        let filters = [... regRequestsFilters];
        for (let i=0; i < filters.length; i++) {
            if (filters[i].field === id) {
                console.log('getFiltersValue.id=', id, 'value=', filters[i].value);
                return filters[i].value;
            }
        }
        return null;
    }

    const resetFiltes = e => {
        setRegRequestsFilters([{
            field: "is_approved",
            value: ['null']
        }]);
        setActiveModal(null);
    }

    return (
        <ModalRoot activeModal={activeModal} onClose={onFiltersPageClose}>
            <ModalPage id="regrequests-filters" header={modalHeader('Фильтры', onFiltersPageDone, onFiltersPageClose)}>
                <FormLayout>
                    <Header mode="secondary">Статус заявки</Header> 
                    <SimpleCell disabled after={<Switch id="is_approved-null" defaultChecked={isFiltersSwitchChecked('is_approved-null')} onChange={onFiltersSwitchCanged} />}>Ожидает обработки</SimpleCell>
                    <SimpleCell disabled after={<Switch id="is_approved-1" defaultChecked={isFiltersSwitchChecked('is_approved-1')} onChange={onFiltersSwitchCanged} />}>Одобрена</SimpleCell>
                    <SimpleCell disabled after={<Switch id="is_approved-0" defaultChecked={isFiltersSwitchChecked('is_approved-0')} onChange={onFiltersSwitchCanged} />}>Отклонена</SimpleCell>
                </FormLayout>
                <FormLayout>
                    <Header mode="secondary">Номер заявки</Header> 
                    <Input type="number" top="можно указать часть номера" name="id" defaultValue={getFiltersValue('id')} onChange={onFiltersInputChanged}/>
                    <Header mode="secondary">Ид пользователя ВК</Header> 
                    <Input type="number" top="можно указать часть Ид" name="vk_user_id" defaultValue={getFiltersValue('vk_user_id')} onChange={onFiltersInputChanged}/>
                    <Header mode="secondary">Дата подачи заявки</Header> 
                    <Input type="date" top="" name="request_date" defaultValue={getFiltersValue('request_date')} onChange={onFiltersInputChanged}/>
					<Button size="xl" mode="primary" onClick={resetFiltes}>
						Сбросить
					</Button>
                </FormLayout>
            </ModalPage>
        </ModalRoot>
    );
};

AdminModal.propTypes = {
};

export default AdminModal;
