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
        console.log("Form.on_change.e=", e);
        setFormError(null);
		let fields= formFields.map(f => ({...f}));
        fields.map((field) => {
            if (field.name == e.currentTarget.name) {
                switch (field.type) {
                    case "checkbox":
                        field.value = e.currentTarget.checked;
                        break;
                    case "file":
                        field.value = e.target.files[0];
                        break;
                    default:
                        field.value = e.currentTarget.value;
                }
                // сброс невалидности
                field.valid = null;
                if (isFunction(field._onChange)) field._onChange(field);
            }
        });
        if (isFunction(props._onChange)) props._onChange(fields);
		setFormFields(fields);
	}

	const confirm = (e) => {
        // check required fields
        let badFields = 0;
		let fields= formFields.map(f => ({...f}));
        fields.map((field) => {
            if (field.required) {
                switch (field.type) {
                    case "checkbox":
                        // required здесь это обязательность установки флажка
                        field.valid = Boolean(field.value);
                        break;
                    
                    case "file":
                        // файл выбран
                        field.valid = Boolean(e.target.files[0]);
                        break;

                    case "number":
                        field.valid = (Boolean(field.value) && !Number.isNaN(Number(field.value)));
                        break;

                    case "date":
                        field.valid = Boolean(field.value);
                        break;

                    case "text":
                        // text
                        if (field.minLength) {
                            // если задана мин длина поля, то проверяем 
                            field.valid = Boolean(field.value && field.value.toString().length >= field.minLength);
                        } else {
                            // проверяем на длину строки
                            field.valid = Boolean(field.value && field.value.toString().length > 0);
                        }
                        break;

                    default:
                        // поле неизвестного типа - валидно
                        field.valid = true;
                }

                if (!field.valid) {
                    badFields++;
                }
            }
        });
        setFormFields(fields);

        if (badFields) {
            setFormError(
                {
                    header : "Ошибка заполнения формы",
                    text : "Не заполнено одно или несколько обязательных полей"
                }
            );

        } else {
            if (isFunction(props.onConfirm)) {
                let err = props.onConfirm(fields);
                if (err) {
                    // была ошибка извне - нужно обновить fields
                    setFormFields(fields);
                }
                setFormError(err);
            }
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
