import React, { useState, useEffect } from 'react';
import { FormItem, SimpleCell, Switch, FormLayoutGroup, Group, Header } from '@vkontakte/vkui';
import { isArray, isFunction } from '@vkontakte/vkjs';

const FormMultiCheckInput = (props) => { 

    console.log('FormMultiCheckInput.props=', props);
    const checkers = props.checkers;

    const defaultValue = props.defaultValue ? (isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue]) : [];

    const [value, setValue] = useState([...defaultValue]);

    const isChecked = (val) => {
        //console.log("isChecked.val=", val);
        return defaultValue.indexOf(val) !== -1;
    }

    const onChangeGen = (val) => {
        return function(e) {
            // delete val if exists
            let new_value = value.filter(v => (v !== val));
            // add val if checked
            e.currentTarget.checked && new_value.push(val);
            if (isFunction(props.onChange)) {
                // return fake synthetic event
                
                let tg = {
                    name : props.name,
                    type : props.type,
                    value : new_value,
                };
                props.onChange(
                    {
                        currentTarget : tg,
                        target : tg,
                        current : tg,
                    }
                );
            } 
            setValue(new_value);
        }
    }

	return (
        <React.Fragment>
            <Group
                mode="card"
                header={<Header mode="secondary" >{props.top}</Header>}
                description={props.description}
            >
                <FormLayoutGroup mode="vertical">
                    <FormItem
                        status={null === props.valid ? 'default' : (props.valid ? 'valid' : 'error')}
                        bottom={false === props.valid ? (props.errMessage ? props.errMessage : 'Заполните обязательный реквизит') : ""}
                    >
                        {checkers && checkers.map((ch, i) => {
                            return (
                                <SimpleCell 
                                    key={i}
                                    disabled 
                                    after={
                                        <Switch 
                                            id={ch.id} 
                                            defaultChecked={isChecked(ch.value)} 
                                            onChange={onChangeGen(ch.value)}
                                        />
                                    }
                                >
                                    {ch.top}
                                </SimpleCell>
                            );
                        })}
                    </FormItem>
                </FormLayoutGroup>
            </Group>
        </React.Fragment>
    );
}

export default FormMultiCheckInput;
