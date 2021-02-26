import React, { useState, useEffect } from 'react';
import { FormLayout, FormLayoutGroup, FormStatus, FormItem, Button } from '@vkontakte/vkui';

import FormInput from './FormInput';
import { isFunction } from '@vkontakte/vkjs';
import FileSaver from 'file-saver';

const Form = (props) => { 
    console.log('Form.props=', props);

    const [formError, setFormError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
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

    const check_required_field = (field) => {
        if (field.type == "checkbox" && field.itemData) return true;
        if (props.itemData) {
            if (props.minLength) {
                return (props.itemData.toString().length >= props.minLength);
            } 
            return true;
        }
        return false;
    }

	const on_change = (e) => {
		let fields= [...formFields];
        fields.map((field) => {
            if (field.name == e.currentTarget.name) {
                field.value = field.type == "checkbox" ? e.currentTarget.checked : e.currentTarget.value;
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
                if (field.type == "checkbox") {
                    field.valid = (field.value == true);
                } else {
                    field.valid = (
                        (field.minLength && field.value && field.value.toString().length >= field.minLength)
                        || field.value
                    ) == true;
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
                    props.itemComponent 
                    ? <props.itemComponent
                        {...field}
                        readOnly={props.readOnly}
                        onChange={on_change}
                    />
                    : <FormInput
                    {...field}
                    readOnly={props.readOnly}
                    onChange={on_change}
                />
                )
            )}
            <FormLayoutGroup mode="horizontal">
                <FormItem>
                    <Button size="l" mode="primary" stretched={true} onClick={confirm}>
                        Отправить
                    </Button>
                </FormItem>
                <FormItem>
                    <Button size="l" mode="destructive" stretched={true} onClick={props.onCancel} >
                        Отмена
                    </Button>
                </FormItem>
            </FormLayoutGroup>

        </FormLayout>
    );
}

export default Form;
