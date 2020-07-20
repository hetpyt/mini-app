import React, { useState, useEffect, useLayoutEffect } from 'react';
import ky from 'ky';

import bridge from '@vkontakte/vk-bridge';
import Root from '@vkontakte/vkui/dist/components/Root/Root';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Welcome from './panels/welcome/Welcome';
import RegistrationRequestActions from './panels/welcome/RegistrationRequestActions';
import Registration from './panels/registration/Registration';
import RegistrationDataSent from './panels/registration/RegistrationDataSent';

import AccountSelection from './panels/main/AccountSelection'
import DataInput from './panels/main/DataInput';
import Persik from './panels/main/Persik';

import Lobby from './panels/admin/Lobby';

import StaticMessage from './panels/StaticMessage';
import ErrorService from './panels/ErrorService';


const App = () => {
    const spinner = <ScreenSpinner size='large' />;
    const [activeView, setActiveView] = useState('welcomeview');
    const [activePanel, setActivePanel] = useState('welcome');

    const [dataFetchig, setDataFetching] = useState(false);
    const [error, setError] = useState(null);
    // информация о пользователе ВК
    const [vkUser, setVkUser] = useState(null);
    // информация о пользователе учетной системы
    const [userInfo, setUserInfo] = useState(null);
    // информация о запросе на регистрацию
    const [regInfo, setRegInfo] = useState(null);
    const [regRequestId, setRegRequestId] = useState(null);
    const [activeAcc, setActiveAcc] = useState(null);
    const [metersInfo, setMetersInfo] = useState(null);
    const [formData, setFormData] = useState([]);
	const [popout, setPopout] = useState(spinner);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			    } 
            }   
	    );
        //fetchUser();
        
	}, []);

    useEffect(() => {
        if (dataFetchig) setPopout(spinner);
        else setPopout(null);
    }, [dataFetchig]);

    useEffect(() => {
        //console.log('effect')
        switch (activePanel) {
            case 'welcome':
                setFormData([]);
                //setPopout(spinner);

                fetchUser();
                break;

            case 'registration':
                const fData = [];
                fData.push({
                    'acc_id': '',
                    'surname': '',
                    'first_name': '',
                    'patronymic': '',
                    'street': '',
                    'n_dom': '',
                    'n_kv': '',
                    'secret_code': ''
                });
                setFormData(fData);
                break;

            case 'account-selection':
                break;

            case 'datainput':
                setFormData([]);
                getMeters(tg => {setActiveTarget(tg);});
                break;

            default:
                break;
    
        }
    }, [activePanel]);

    async function fetchUser() {
        try {
            setDataFetching(true);
            const vkuser = await bridge.send('VKWebAppGetUserInfo')
            console.log('vkuser=', vkuser);
            setVkUser(vkuser);

            let result = await ky.get(`getuser/${vkuser.id}`, {prefixUrl: '/api', mode: 'no-cors'}).json();
            console.log('user=', result);
            if (result.data_len) {
                setUserInfo(result.data[0]);
            } 
            // проверим статус регистрации
            result = await ky.get(`registrationstatus/${vkuser.id}`, {prefixUrl: '/api', mode: 'no-cors'}).json();
            console.log('reg=', result);
            setRegInfo(result.data_len ? result.data : null);
            //setPopout(null);

        } catch (e) {
            console.log('error fetching user info', e);
            setActivePanel('errorservice');
            //setPopout(null);
        } finally {
            setDataFetching(false);
        }

    }
    
    async function sendRegData(on_done = null) {
        setDataFetching(true);

        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            json: {
                result: true
            }
        };
        options['json']['registration_data'] = [...formData][0];
        options['json']['registration_data']['vk_user_id'] = vkUser.id;

        console.log('reg_data', options);

        try {
            const data = await ky.post(`registrationrequest`, options).json();
            console.log(data);
            if (!data['result']) {
                throw 'result not true';
            }
            //setPopout(null);
        } catch (e) {
            //setPopout(null);
            console.log('error sending reg data', e);
            setActivePanel('errorservice');
        } finally {
            setDataFetching(false);
            if (on_done) on_done();
        }
    }

    async function getMeters(on_done = null) {
        setDataFetching(true);

        try {
            //setPopout(spinner);
            let target = '';
            const result = await ky.get(`getmeters/${activeAcc.acc_id}`, {prefixUrl: '/api', mode: 'no-cors'}).json();
            if (result.result && result.data_len) {
                setMetersInfo(result.data[0].meters);
                target = 'datainput';
            } else {
                target = 'no-meters';
            }
            if (on_done) on_done(target);

        } catch (e) {
            console.log('error fetching meters data', e);
            setActivePanel('errorservice');
        } finally {
            //setPopout(null);
            setDataFetching(false);
        }
    }

    async function sendData(on_done = null) {
        setDataFetching(true);

        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            json: {
                result: true,
                vk_user_id: vkUser.id
            }
        };
        options['json']['meters'] = [...formData];
        console.log('datatosend', options);

        try {
            const result = await ky.post(`setmeters`, options).json();
            console.log(result);
            if (!result['result']) {
                console.log('sendData', result);
                throw 'result not true';
            }
            if (on_done) on_done();
        } catch (e) {
            console.log('sendData Exception=', e);
            setActivePanel('errorservice');
        } finally {
            setDataFetching(false);
        }
    }

    async function regRequestAction(action, on_done = null) {
        setDataFetching(true);

        //setPopout(spinner);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            json: {
                result: true,
                vk_user_id: vkUser.id,
                action: action,
                request_id: regRequestId
            }
        };
        try {
            const data = await ky.post(`registrationrequestaction`, options).json();
            console.log(data);
            if (!data['result']) {
                throw 'result not true';
            }
        } catch (e) {
            console.log('regReqAction',e);
            setActivePanel('errorservice');
        } finally {
            console.log('regReqAction finally');
            //setPopout(null);
            setDataFetching(false);
            if (on_done) on_done();
        }
    }

	const go = e => {
        let target = e.currentTarget.dataset.to;
        let {targetView, targetPanel} = parseTo(target);
        console.log('targetView=', targetView);
        console.log('targetPanel=', targetPanel);

        if (activeView === 'welcomeview') {
            switch (activePanel) {
                case 'welcome':
                    if (targetPanel == 'account-selection' && userInfo && !userInfo.accounts.length) {
                        target = 'no-accounts';
                        console.log('set target to welcome.no-accounts');
                    }
                    break;
                
                case 'regrequest-actions':
                    if (e.currentTarget.dataset.action) {
                        regRequestAction(e.currentTarget.dataset.action, () => {setActiveTarget(target);});
                        return;
                    }
                    break;

                default:
                    break; 
            }
        }

        else if (activeView === 'registrationview') {
            switch (activePanel) {
                case 'registration':
                    if (e.currentTarget.dataset.action === "confirm") {
                        console.log('formData', formData);
                        if (formData.length === 0) {
                            return;
                        }
                        if (!formData[0].acc_id || !formData[0].secret_code) {
                            console.log('regdata required fields');
                            return;
                        }
                        //setPopout(spinner);
                        sendRegData(() => {setActiveTarget(target);});
                        return;
                    }
                default:
                    break;
            }
        }

        else if (activeView === 'mainview') {

            switch (activePanel) {
                case 'datainput':
                    console.log('from datainput');
                    if (e.currentTarget.dataset.action == "confirm") {
                        console.log('formdata', formData);
                        sendData(() => {setActiveTarget(target);});
                        return;
                    }
                    break;
                    
                default:
                    break;
            };
        }    
        else if (activeView === 'adminview') {

        }

        //setActiveView(targetView);
        //setActivePanel(targetPanel);
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

	return (
        <Root id='root' activeView={activeView} >
            <View id='welcomeview' activePanel={activePanel}  popout={popout} >
                <Welcome id='welcome' go={go} vkUser={vkUser} userInfo={userInfo} regInfo={regInfo} setRegRequestId={setRegRequestId} />
                <ErrorService id='errorservice' go={go} error={error} />
                <RegistrationRequestActions id='regrequest-actions' go={go} request_id={regRequestId} />
                <StaticMessage id='no-accounts' go={go} message={'К учетной записи не привязано ни одного лицевого счета.'} />
            </View>
            <View id='registrationview' activePanel={activePanel}  popout={popout} >
                <ErrorService id='errorservice' go={go} error={error} />
                <Registration id='registration' go={go}  formData={formData} setFormData={setFormData} />
                <StaticMessage id='registration-data-sent' go={go} message={'Запрос на привязку лицевого счета отправлен.'} />
            </View>
            <View id='mainview' activePanel={activePanel} popout={popout}>
                <AccountSelection id='account-selection' vkUser={vkUser} userInfo={userInfo} setActiveAcc={setActiveAcc} go={go} />
                <DataInput id='datainput' formData={formData} setFormData={setFormData} meters={metersInfo} vkUser={vkUser} go={go} />
                <ErrorService id='errorservice' go={go} error={error} />
                <Persik id='persik' go={go} />
            </View>
            <View id='adminview' activePanel={activePanel} popout={popout}>
                <ErrorService id='errorservice' go={go} error={error} />
                <Lobby id='lobby' go={go} vkUser={vkUser} userInfo={userInfo} />
            </View>
        </Root>
	);
};

export default App;

