import React, { useState, useEffect } from 'react';
import { FormLayout, Input } from '@vkontakte/vkui';

import FormInput from './FormInput';

const Form = (props) => { 

    const setElem = e => (e);
    console.log('Form.props=',props);
	return (
        <FormLayout>
            {props.header && setElem(props.header)}
            {props.status && setElem(props.status)}
            {props.fields && props.fields.map(
                ({ name, type, top, required, onChange }) => (
                    <FormInput
                        top={top}
                        itemData={props.values ? props.values[name] : null}
                        name={name}
                        required={required}
                        onChange={onChange}
                        type={type}
                        readOnly={props.readOnly}
                    />
                )
            )}
            {props.buttons && setElem(props.buttons)}
        </FormLayout>
    );
}

export default Form;
