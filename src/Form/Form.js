import React, { useState, useEffect } from 'react';
import { FormLayout, Input } from '@vkontakte/vkui';

import FormInput from './FormInput';
import { isFunction } from '@vkontakte/vkjs';

const Form = (props) => { 

    const setElem = e => (e);
    console.log('Form.props=',props);

	return (
        <FormLayout>
            {props.header && setElem(props.header)}
            {props.status && setElem(props.status)}
            {props.fields && props.fields.map(
                (field) => (
                    props.itemComponent 
                    ? <props.itemComponent
                        {...field}
                        itemData={props.values ? props.values[field.name] : null}
                        readOnly={props.readOnly}
                    />
                    : <FormInput
                    {...field}
                    itemData={props.values ? props.values[field.name] : null}
                    readOnly={props.readOnly}
                />
                )
            )}
            {props.buttons && setElem(props.buttons)}
        </FormLayout>
    );
}

export default Form;
