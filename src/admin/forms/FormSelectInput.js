import React, { useState, useEffect } from 'react';
import { FormItem, Select } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

const FormSelectInput = (props) => { 

    const renderOptions = (options) => {
        if (isArray(options)) {
            return (
                options.map(
                        (option, index) => (
                        <option key={index} value={option.value}>{option.caption}</option>
                    )
                )
            )
        }
    }

	return (
        <FormItem top={props.top}>
            <Select name={props.name} disabled={props.disabled} value={props.staticValue} onChange={props.onChange} >
                {props.options && renderOptions(props.options)}
            </Select>							
        </FormItem>
    );
}

export default FormSelectInput;
