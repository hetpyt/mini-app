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
                    <FormItem top="текущие">
                        <Input type="text" name={"current_" + props.name} disabled={true} value={props.staticValue} />							
                    </FormItem>
                    <FormItem top="новые">
                        <Input type="number" min={0} name={props.name} disabled={false} placeholder={props.defaultValue} onChange={props.onChange} />							
                    </FormItem>
                </FormLayoutGroup>
            </Group>
        </Div>
    );
}

export default FormIndicationsInput;
