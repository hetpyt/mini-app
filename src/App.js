import React, { useState, useEffect, useLayoutEffect } from 'react';
import ky from 'ky';
import { saveAs } from 'file-saver';
import 'url-search-params-polyfill';

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

    const [route, setRoute] = useState([]);

    const [activeView, setActiveView] = useState('welcomeview');
    const [targetPanel, setTargetPanel] = useState('welcome');

    const [dataFetchig, setDataFetching] = useState(false);
    const [error, setError] = useState(null);
    // информация о пользователе ВК
    const [vkUser, setVkUser] = useState(null);
    // информация о пользователе учетной системы
    const [userInfo, setUserInfo] = useState(null);
    // информация о запросе на регистрацию
    const [regInfo, setRegInfo] = useState(null);
    //const [regRequestId, setRegRequestId] = useState(null);
    // admin
    const [regRequests, setRegRequests] = useState([]);
    const [regRequestsFilters, setRegRequestsFilters] = useState([
        {
            field: "is_approved",
            value: ['null']
        }
    ]);
    const [activeRegRequest, setActiveRegRequest] = useState(null);
    // file data
	const [fileData, setFileData] = useState(null);
        
    const [activeItem, setActiveItem] = useState(null);

    const [metersInfo, setMetersInfo] = useState(null);
    const [formData, setFormData] = useState([]);
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
            restRequest('users/privileges/get', null, res => {
                setUserInfo(res);
            });
        }
    }, [vkUser]);

    useEffect(() => {
        if (error) go('errorserviceview.errorservice');
    }, [error]);

    const getToken = () => {
        return window["servertokenname_7524946"];// + appParams.get('vk_app_id')];
    }
  
    async function restRequest(uri, json_data = null, on_done = null, on_error = null) {
        console.log('restRequest(' + uri + ').json_data=', json_data);
        //setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            throwHttpErrors : true,
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            }
        };
        if (json_data !== null) {
            options.method = 'post';
            options.json = json_data;
        }
        let result = null;
        try {
            setPopout(spinner);
            result = await ky(uri, options).json();

        } catch (e) {
            setError(e);
            //setActiveTarget('errorserviceview.errorservice');
            return;

        } finally {
            //setDataFetching(false);
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
                    throw new Error("Получен неожиданный ответ от сервера [1]");
                }
            } else {
                throw new Error("Получен неожиданный ответ от сервера [2]");
            }
        } catch (e) {
            setError(e);
            //setActiveTarget('errorserviceview.errorservice');
        }
    }

	const inform_alert = (header, message, onClose) => {
		setPopout(
			<Alert
				actions={[
					{
						title: 'ОK',
						autoclose: true,
						mode: 'cancel'
					}
				]}
				actionsLayout="vertical"
				onClose={isFunction(onClose) ? onClose : ((e) => {setPopout(null)})}
				header={header}
				text={message}
			/>
		);
	}

	const go = e => {
        let target = null;
        if (isString(e)) 
            target = e;
        else 
            target = e.currentTarget.dataset.to;
        let {tgView, tgPanel} = parseTo(target);
        console.log('targetView=', tgView);
        console.log('targetPanel=', tgPanel);

        setRoute([...route, "" + activeView + "." + targetPanel]);
        setActiveTarget(target);
	}

    const goBack = e => {
        let r = [...route];
        let target = r.pop();
        setRoute([...r]);
        if (target) setActiveTarget(target);
    }

    const parseTo = valTo => {
        const target = valTo.split('.');
        const result = {};
        result.targetView = activeView;
        result.targetPanel = targetPanel;
        if (1 === target.length) {
            result.targetPanel = target[0];
        } else if (target.length > 1) {
            result.targetView = target[0];
            result.targetPanel = target[1];
        }
        return result;
    }

    const setActiveTarget = target => {
        const {tgView, tgPanel} = parseTo(target);
        console.log('setActiveTarget.targetView=', tgView);
        console.log('setActiveTarget.targetPanel=', tgPanel);

        setTargetPanel(tgPanel);
        setActiveView(tgView);
    }

    let commonProps = {
        inform_alert : inform_alert,
        setActiveView : setActiveView,
        restRequest : restRequest,
        setPopout : setPopout,
        vkUser : vkUser,
        userInfo : userInfo,
        error : error,
    }; 

	return (
        <AppRoot>
            <Root id='root' activeView={activeView} >
                <WelcomeView id='welcomeview' targetPanel={targetPanel} popout={popout} app={commonProps} />
                <RegistrationView id='registrationview' targetPanel={targetPanel} popout={popout} app={commonProps} />
                <IndicationsView id='indicationsview' targetPanel={targetPanel} popout={popout} app={commonProps} />
                <AdminView id='adminview' targetPanel={targetPanel} popout={popout} app={commonProps} />
                <ErrorServiceView id='errorserviceview' targetPanel={targetPanel} popout={popout} app={commonProps} />
            </Root>
        </AppRoot>
	);
};

export default App;

