import React, { useState, useEffect } from 'react';
import { FormItem, Input, Div, FormLayoutGroup, Group, Header } from '@vkontakte/vkui';

const FormIndicationsInput = (props) => { 

    //console.log('FormInput.props=', props);
	return (
        <Div>
            <Group
                mode="card"
                header={<Header mode="secondary" >{props.top}</Header>}
                description={props.description}
            >
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="текущие показания">
                        <Input type="text" name={"current_" + props.name} disabled={true} value={props.current_count} />							
                    </FormItem>
                    <FormItem top="новые показания"
                        status={null === props.valid ? 'default' : (props.valid ? 'valid' : 'error')}
                        bottom={false === props.valid ? (props.errMessage ? props.errMessage : 'Указаны некорректные данные') : ""}
                    >
                        <Input type="number" min={0} name={props.name} disabled={false} placeholder={props.new_count} onChange={props.onChange} />							
                    </FormItem>
                </FormLayoutGroup>
            </Group>
        </Div>
    );
}

export default FormIndicationsInput;
