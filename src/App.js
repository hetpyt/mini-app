import React, { useState, useEffect, useLayoutEffect } from 'react';
import ky from 'ky';
import { saveAs } from 'file-saver';
import 'url-search-params-polyfill';

import bridge from '@vkontakte/vk-bridge';
import Root from '@vkontakte/vkui/dist/components/Root/Root';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Welcome from './panels/welcome/Welcome';
import ErrorService from './panels/ErrorService';


import RegistrationView from './registration/RegistrationView';

const App = () => {
    const spinner = <ScreenSpinner size='large' />;

    const [appParams, _] = useState((() => {
        return new URLSearchParams(window.location.search);
    })());

    const [activeView, setActiveView] = useState('welcomeview');
    const [activePanel, setActivePanel] = useState('welcome');
    const [activeModal, setActiveModal] = useState(null);

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

    // эффект при изменении состояния флага асинхронного запроса к серверу с отображением спиннера
    useEffect(() => {
        if (dataFetchig) setPopout(spinner);
        else setPopout(null);
    }, [dataFetchig]);

    const getToken = () => {
        return window["servertokenname_7524946"];// + appParams.get('vk_app_id')];
    }
  
    async function restRequest(uri, json_data = null, on_done = null) {
        console.log('restRequest(' + uri + ')');
        setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            }
        };
        if (json_data !== null) {
            options.method = 'post';
            options.json = json_data;
        }
        try {
            let result = await ky(uri, options).json();

            console.log('restRequest(', uri, ').result=', result);

            if (typeof on_done == 'function') on_done(result);

        } catch (e) {
            setError(e);
            setActiveTarget('welcomeview.errorservice');

        } finally {
            setDataFetching(false);
        }
    }

	const go = e => {
        let target = e.currentTarget.dataset.to;
        let {targetView, targetPanel} = parseTo(target);
        console.log('targetView=', targetView);
        console.log('targetPanel=', targetPanel);

        setActiveTarget(target);
	};

    const parseTo = valTo => {
        const target = valTo.split('.');
        const result = {};
        result.targetView = activeView;
        result.targetPanel = activePanel;
        if (1 === target.length) {
            result.targetPanel = target[0];
        } else if (target.length > 1) {
            result.targetView = target[0];
            result.targetPanel = target[1];
        }
        return result;
    }

    const setActiveTarget = target => {
        const {targetView, targetPanel} = parseTo(target);
        console.log('setActiveTarget.targetView=', targetView);
        console.log('setActiveTarget.targetPanel=', targetPanel);

        setActiveView(targetView);
        setActivePanel(targetPanel);
    }

    let commonProps = {
        go : go,
        restRequest : restRequest,
        vkUser : vkUser,
        userInfo : userInfo,
    }; 

	return (
        <Root id='root' activeView={activeView} >
            <View id='welcomeview' activePanel={activePanel}  popout={popout} >
                <Welcome id='welcome' go={go} vkUser={vkUser} userInfo={userInfo} restRequest={restRequest} />
                <ErrorService id='errorservice' go={go} error={error} />

            </View>
            <RegistrationView id='registrationview' activePanel={activePanel}  popout={popout} session={commonProps} />
        </Root>
	);
};

export default App;

