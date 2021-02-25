import React, { useState, useEffect } from 'react';
import { FormItem, Input } from '@vkontakte/vkui';

const FormInput = (props) => { 

    //console.log('FormInput.props=', props);
	return (
        props.readOnly 
        ?
            <FormItem top={props.top} >
                <Input type="text" name={props.name} disabled={true} value={props.itemData} />
            </FormItem>
        :
            <FormItem top={props.top}
                status={props.required ? (props.itemData !== null ? 'valid' : 'error') : null}
                bottom={props.required ? (props.itemData !== null ? '' : 'Заполните обязательный реквизит') : null}
            >
                <Input type={props.type ? props.type : "text"} name={props.name} onChange={props.onChange} />
            </FormItem>
    );
}

export default FormInput;
