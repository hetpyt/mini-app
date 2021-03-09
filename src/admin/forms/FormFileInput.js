import React, { useState, useEffect } from 'react';
import { FormItem, File } from '@vkontakte/vkui';

const FormFileInput = (props) => { 

    console.log("FormFileInput.props=", props)

	return (
        <FormItem 
            top={props.top}
            status={null === props.valid ? 'default' : (props.valid ? 'valid' : 'error')}
            bottom={false === props.valid ? (props.errMessage ? props.errMessage : 'Выберите файл') : ""}
        >
            <File name={props.name} disabled={props.disabled}
                controlSize="l"
                onChange={props.onChange}
            >
                {props.value ? `Выбран "${props.value.name}"` : "Выбрать файл"}
			</File>
        </FormItem>
    );
}

export default FormFileInput;
