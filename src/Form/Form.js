import React, { useState, useEffect } from 'react';
import { FormLayout, FormLayoutGroup, FormStatus, FormItem, Button } from '@vkontakte/vkui';

import FormInput from './FormInput';
import { isFunction } from '@vkontakte/vkjs';
import FileSaver from 'file-saver';

const Form = (props) => { 
    console.log('Form.props=', props);

    const [formError, setFormError] = useState(null);
    const [formFields, setFormFields] = useState(
        (() => (
            props.fields.map((field) => {
                let f = {...field};
                f.value = null;
                f.valid = null;
                return f;
            })
        ))()
    );

	const on_change = (e) => {
        setFormError(null);
		let fields= [...formFields];
        fields.map((field) => {
            if (field.name == e.currentTarget.name) {
                field.value = "checkbox" == field.type ? e.currentTarget.checked : e.currentTarget.value;
            }
        });
		setFormFields(fields);
	}

	const confirm = (e) => {
        // check required fields
        let badFields = [];
		let fields= [...formFields];
        fields.map((field) => {
            if (field.required) {
                if ("checkbox" == field.type) {
                    field.valid = Boolean(field.value);
                } else {
                    console.log('field=', field);
                    if (field.minLength) {
                        field.valid = Boolean(field.value && field.value.toString().length >= field.minLength);
                    } else {
                        field.valid = Boolean(field.value && field.value.toString().length > 0);
                    }
                }
                if (!field.valid) {
                    badFields.push({...field});
                }
            }
        });
        setFormFields(fields);

        if (badFields.length) {
            setFormError(
                {
                    header : "Ошибка заполнения формы",
                    text : "Не заполнено одно или несколько обязательных полей"
                }
            );

        } else {
            setFormError(null);
            if (isFunction(props.onConfirm)) props.onConfirm([...fields]);
        }
    }

    const setElem = e => (e);

    const renderFormField = (field) => {
        if (field.itemComponent) {
            return (
                <field.itemComponent
                    {...field}
                    readOnly={props.readOnly}
                    onChange={on_change}
                />
            );
        } else if (props.itemComponent) {
            return (
                <props.itemComponent
                    {...field}
                    readOnly={props.readOnly}
                    onChange={on_change}
                />
            );
        } else {
            return (
                <FormInput
                    {...field}
                    readOnly={props.readOnly}
                    onChange={on_change}
                />
            );
        }
    }

	return (
        <FormLayout>
            {props.header && setElem(props.header)}
            {formError &&
                <FormItem>
                    <FormStatus header={formError.header} mode="error">
                        {formError.text}
                    </FormStatus>
                </FormItem>
			}
            {formFields && formFields.map(
                (field) => (
                    renderFormField(field)
                )
            )}
            <FormLayoutGroup mode="horizontal">
                <FormItem>
                    <Button size="l" mode="primary" stretched={true} onClick={confirm}>
                        Отправить
                    </Button>
                </FormItem>
                <FormItem>
                    <Button size="l" mode="secondary" stretched={true} onClick={props.onCancel} >
                        Отмена
                    </Button>
                </FormItem>
            </FormLayoutGroup>
        </FormLayout>
    );
}

export default Form;
