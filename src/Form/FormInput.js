import React, { useState, useEffect } from 'react';
import { FormItem, Input, Checkbox } from '@vkontakte/vkui';

const FormInput = (props) => { 

    console.log('FormInput.props=', props);
	return (
        <FormItem top={props.type == "checkbox" ? "" : props.top}
            status={props.valid === null ? 'default' : (props.valid ? 'valid' : 'error')}
            bottom={props.valid === false ? (props.errMessage ? props.errMessage : 'Заполните обязательный реквизит') : ""}
        >
            {props.type == "checkbox"
                ? <Checkbox name={props.name} onChange={props.onChange} >{props.top}</Checkbox>
                : <Input type={props.type ? props.type : "text"} name={props.name} onChange={props.onChange} />
            }
        </FormItem>
    );
}

export default FormInput;
