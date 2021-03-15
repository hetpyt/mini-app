import React, { useState, useEffect } from 'react';
import { FormItem, Input, Checkbox } from '@vkontakte/vkui';

const FormInput = (props) => { 

    //console.log('FormInput.props=', props);
	return (
        <FormItem top={"checkbox" == props.type ? "" : props.top}
            status={null === props.valid ? 'default' : (props.valid ? 'valid' : 'error')}
            bottom={false === props.valid ? (props.errMessage ? props.errMessage : 'Заполните обязательный реквизит') : ""}
        >
            {"checkbox" == props.type 
                ? <Checkbox name={props.name} defaultChecked={props.defaultChecked} onChange={props.onChange} >{props.top}</Checkbox>
                : <Input type={props.type ? props.type : "text"} name={props.name} onChange={props.onChange} />
            }
        </FormItem>
    );
}

export default FormInput;
