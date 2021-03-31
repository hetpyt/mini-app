import React, { useState, useEffect, useLayoutEffect } from 'react';
import ky from 'ky';
import 'url-search-params-polyfill';
import dataSourceFactory from './classes/DataSource';

import bridge from '@vkontakte/vk-bridge';
import { AppRoot, Root, ScreenSpinner, Alert } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import WelcomeView from './welcome/WelcomeView';
import ErrorServiceView from './errorservice/ErrorServiceView';
import RegistrationView from './registration/RegistrationView';
import IndicationsView from './indications/IndicationsView';
import AdminView from './admin/AdminView';


import { isFunction, isObject, isString } from '@vkontakte/vkjs';

const App = () => {
    const spinner = <ScreenSpinner size='large' />;

    const [appParams, _] = useState((() => {
        return new URLSearchParams(window.location.search);
    })());

    const [activeView, setActiveView] = useState('welcomeview');

    const [DataSource, setDataSource] = useState(null);

    const [error, setError] = useState(null);
    // информация о пользователе ВК
    const [vkUser, setVkUser] = useState(null);
    // информация о пользователе учетной системы
    const [userInfo, setUserInfo] = useState(null);
    //
    const [appPermissions, setAppPermissions] = useState(null);
        
	const [popout, setPopout] = useState(spinner);

    // эффект при создании компонента апп
	useEffect(() => {
		// bridge.subscribe(({ detail: { type, data }}) => {
		// 	if (type === 'VKWebAppUpdateConfig') {
		// 		const schemeAttribute = document.createAttribute('scheme');
		// 		schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
		// 		document.body.attributes.setNamedItem(schemeAttribute);
		// 	    } 
        //     }   
        // );
        // // получение информации о текущем пользователе запустившем апп
        // const vkuser = await bridge.send('VKWebAppGetUserInfo');
        const vkuser = {
            id : 382795146,
            first_name : "Roman",
            last_name : "S",
        };
        setVkUser(vkuser);
        console.log('vkuser=', vkuser);

	}, []);

    useEffect(() => {
        console.log('vkUser=', vkUser);

        if (vkUser) {
            setDataSource(() => (dataSourceFactory(
                '/api', 
                {
                    user_id: vkUser.id,
                    token: getToken(),
                },
                () => {setPopout(spinner);},
                () => {setPopout(null);}
            )));
        }

        if (vkUser && "welcomeview" === activeView) {
            restRequest('privileges/get', null, res => {
                setUserInfo(res.user_privileges);
                setAppPermissions(res.app_permissions);
            });
        }
    }, [vkUser, activeView]);

    useEffect(() => {
        if (error) setActiveView('errorserviceview');
    }, [error]);

    const getToken = () => {
        return window["servertokenname_7524946"];// + appParams.get('vk_app_id')];
    }
  
    async function restRequest(uri, json_data = null, on_done = null, on_error = null) {
        console.log('restRequest(' + uri + ').json_data=', json_data);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            throwHttpErrors : true,
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            }
        };
        if (json_data) {
            options.method = 'post';
            options.json = json_data;
        }
        let result = null;
        try {
            setPopout(spinner);
            result = await ky(uri, options).json();

        } catch (e) {
            setError(e);
            return;

        } finally {
            setPopout(null);
        }
        console.log('restRequest(', uri, ').result=', result);

        try {
            if (isObject(result)) {
                if (result.hasOwnProperty('error')) {
                    if (isFunction(on_error)) 
                        on_error(result.error);
                } else if (result.hasOwnProperty('result')){
                    if (isFunction(on_done)) 
                        on_done(result.result);
                } else {
                    throw new Error("Получен неожиданный ответ от сервера: не содержит ожидаемый атрибут [1]");
                }
            } else {
                throw new Error("Получен неожиданный ответ от сервера: не является объектом [2]");
            }
        } catch (e) {
            setError(e);
        }
    }

	const inform_alert = (header, message, onClose = null) => {
		setPopout(
			<Alert
				actions={[
					{
						title: 'ОK',
						autoclose: true,
						mode: 'cancel'
					}
				]}
				actionsLayout="horizontal"
				onClose={ e => {
                    setPopout(null);
                    if (isFunction(onClose)) onClose(e); 
                }}
				header={header}
				text={message}
			/>
		);
	}

    const question_alert = (header, message, onConfirm = null, onAbort = null) => {
		setPopout(
			<Alert
				actions={[
					{
						title: 'Отмена',
						autoclose: true,
						mode: 'cancel',
                        action : onAbort,
					},
					{
						title: 'Продолжить',
						autoclose: true,
						mode: 'destructive',
                        action : onConfirm,
					},
				]}
				actionsLayout="horizontal"
				onClose={(e) => {setPopout(null)}}
				header={header}
				text={message}
			/>
		);
    }

    let commonProps = {
        inform_alert : inform_alert,
        question_alert : question_alert,
        setActiveView : setActiveView,
        restRequest : restRequest,
        setPopout : setPopout,
        setError : setError,
        DataSource : DataSource,
        vkUser : vkUser,
        userInfo : userInfo,
        appPermissions : appPermissions,
        error : error,
    }; 

	return (
        <AppRoot>
            <Root id='root' activeView={activeView} >
                <WelcomeView id='welcomeview' popout={popout} app={commonProps} />
                <RegistrationView id='registrationview' popout={popout} app={commonProps} />
                <IndicationsView id='indicationsview' popout={popout} app={commonProps} />
                <AdminView id='adminview' popout={popout} app={commonProps} />
                <ErrorServiceView id='errorserviceview' popout={popout} app={commonProps} />
            </Root>
        </AppRoot>
	);
};

export default App;

