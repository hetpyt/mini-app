import React, { useState, useEffect } from 'react';
import { FormItem, NativeSelect } from '@vkontakte/vkui';
import { isArray } from '@vkontakte/vkjs';

const FormSelectInput = (props) => { 

    console.log("FormSelectInput.props=", props)

    const renderOptions = (options) => {
        if (isArray(options)) {
            console.log("renderOptions.options=", options)
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
        <FormItem top={props.top}
            status={null === props.valid ? 'default' : (props.valid ? 'valid' : 'error')}
            bottom={false === props.valid ? (props.errMessage ? props.errMessage : 'Выберите значение из списка') : ""}
        >
            <NativeSelect name={props.name} disabled={props.disabled} onChange={props.onChange} >
                {renderOptions(props.options)}
            </NativeSelect>							
        </FormItem>
    );
}

export default FormSelectInput;
