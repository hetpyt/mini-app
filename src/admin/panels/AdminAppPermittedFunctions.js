import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { Panel, PanelHeader, PanelHeaderBack, Header, Div, FormLayout, Button, File, Caption} from '@vkontakte/vkui';
import Form from './../../Form/Form';

const AdminAppPermittedFunctions = (props) => {

    const [appPermissions, setAppPermissions] = useState(null);

    const confirm = (fields) => {
        console.log("confirm.fields=", fields);
        let changed = fields.reduce((c, f) => {
            if (f.value === null) return c;
            return c || (Number(f.value) !== Number(appPermissions[f.name]));
        }, false);

        if (changed) {
            props.app.restRequest(
                'admin/apppermissions/set',
                fields.reduce((o, f) => {
                    o[f.name] = f.value === null ? Number(f.defaultChecked) : Number(f.value);
                    return o;
                }, {}),
                res => {
                    console.log('res=',res);
                    props.app.inform_alert("Успех", "Параметры доступности функций приложения установлены", props.app.goBack);
                },
                err => {
                    console.log('err=', err);
                    props.app.inform_alert("Отказ", err.message + " [" + err.code + "]", props.app.goBack);
                }
            );
        } else {
            props.app.goBack();
        }
    }

    useEffect(() => {
		props.app.restRequest(
			'apppermissions/get',
			null,
			res => {
            	setAppPermissions(res);
        	},
			err => {
				console.log('err=', err);
                props.app.inform_alert("Отказ", err.message + " [" + err.code + "]", props.app.goBack);
			}
		);
    }, []);

    return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.app.goBack} />} >Функции приложения</PanelHeader>
            {appPermissions &&
                <Form
                    header={<Header mode="secondary">Выберите активные функции</Header>}
                    fields={[
                        {
                            name : "indications",
                            top : "Прием показаний",
                            type : "checkbox",
                            required : false,
                            defaultChecked : Number(appPermissions.indications),
                        },
                        {
                            name : "registration",
                            top : "Прием заявок на присоединение ЛС",
                            type : "checkbox",
                            required : false,
                            defaultChecked : Number(appPermissions.registration),
                        },
                    ]}
                    readOnly={false}
                    onConfirm={confirm}
                    onCancel={props.app.goBack}
                />
            }
		</Panel>
    );
}

export default AdminAppPermittedFunctions;