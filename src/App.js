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
import RegistrationRequestActions from './panels/welcome/RegistrationRequestActions';
import Help from './panels/welcome/Help';
import Registration from './panels/registration/Registration';

import AccountSelection from './panels/main/AccountSelection'
import DataInput from './panels/main/DataInput';
import Persik from './panels/main/Persik';

import Lobby from './panels/admin/Lobby';
import RegRequestsList from './panels/admin/RegRequestsList';
import RegRequestDetail from './panels/admin/RegRequestDetail';
import DataProcessUpload from './panels/admin/DataProcessUpload';
import DataProcessDownload from './panels/admin/DataProcessDownload';
import AdminModal from './modals/admin/AdminModal';

import StaticMessage from './panels/StaticMessage';
import ErrorService from './panels/ErrorService';

import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';

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

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			    } 
            }   
        );
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

            case 'regrequests-list':
                processRegRequests('getall', 'list', regRequestsFilters);
                break;

            case 'regrequest-detail':
                // processRegRequests('detail', null, [{
                //     field: 'id',
                //     value: formData.request_id
                // }]);
                break;

            case 'dataprocess-upload':
                setFileData(null);
                break;

            case 'dataprocess-download':
                setFileData(null);
                setFormData([{
                    period_begin: '',
                    period_end: ''
                }])
                break;
    
            default:
                break;
    
        }
    }, [activePanel]);

    useEffect(() => {
        console.log('regRequestsFilters=', regRequestsFilters);
    }, [regRequestsFilters]);

    useEffect(() => {
        if (!activeModal) {
            switch (activePanel) {
                case 'regrequests-list':
                    processRegRequests('getall', 'list', regRequestsFilters);
                    break;
            }
        }
    }, [activeModal]);

    const getToken = () => {
        return window["servertokenname_" + appParams.get('vk_app_id')];
    }

    async function fetchUser() {
        try {
            setDataFetching(true);
            const vkuser = await bridge.send('VKWebAppGetUserInfo');
            console.log('vkuser=', vkuser);
            setVkUser(vkuser);

            const options = {
                prefixUrl: '/api',
                //mode: 'no-cors',
                searchParams: {
                    user_id: vkuser.id,
                    token: getToken(),
                }
            };

            let result = await ky.get(`getuser`, options).json();
            console.log('user=', result);
            if (result.data_len) {
                setUserInfo(result.data[0]);
            } 
            // проверим статус регистрации
            result = await ky.get(`registrationstatus`, options).json();
            console.log('reg=', result);
            setRegInfo(result.data_len ? result.data : null);
            //setPopout(null);

        } catch (e) {
            console.log('error fetching user info', e);
            setError(e);
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
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            },
            json: {
                registration_data: [...formData][0]
            }
        };

        console.log('sendRegData.options=', options);

        try {
            let target = 'registration-data-sent';
            const result = await ky.post(`registrationrequest`, options).json();
            console.log('sendRegData.result=', result);
            if (!result['result']) {
                if (result.error.name === 'CODE_CHECK_FAIL') target = 'registration-data-code-incorrect';
                else throw result.error.message;
            }
            if (on_done) on_done(target);
        } catch (e) {
            console.log('error sending reg data', e);
            setError(e);
            setActivePanel('errorservice');
        } finally {
            setDataFetching(false);
        }
    }

    async function getMeters(on_done = null) {
        setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            }
        };
        try {
            //setPopout(spinner);
            let target = '';
            const result = await ky.get(`getmeters/${activeItem.acc_id}`, options).json();
            if (result.result && result.data_len) {
                setMetersInfo(result.data);
                setFormData(result.data);
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

    async function processRegRequests(action, option, filters, on_done = null) {
        setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            },
            json: {
                action: action,
                options: option, 
                filters: filters
            }
        };

        console.log('processRegRequests.options=', options);
        try {
            const result = await ky.post(`adminprocessregistrationrequests`, options).json();
            if (result.result) {
                if (action === 'getall') setRegRequests(result.data);
                else if (action === 'detail' && result.data.length) {
                    try {
                        let token = appParams.get('access_token');
                        if (!token) {
                            const tokenData = await bridge.send("VKWebAppGetAuthToken", {"app_id": parseInt(appParams.get('vk_app_id')), "scope": ""});
                            console.log('token=', tokenData);
                            token = tokenData.access_token;
                            appParams.set('access_token', token);
                        }
                        const userData = await bridge.send('VKWebAppCallAPIMethod', {
                            "method": "users.get", 
                            "request_id": 'get_user_info', 
                            "params": {
                                "user_ids": "" + result.data[0].vk_user_id, 
                                "fields" : "city,photo_200",
                                "access_token": token,//tokenData.access_token,
                                "v":"5.120"
                            }
                        });
                        console.log('requserdata=', userData);
                        result.data[0].vk_user_data = userData.response[0];
                    } catch (e) {
                        result.data[0].vk_user_data = null;
                        console.log('cant get vk user data', e);
                    }
                    setActiveRegRequest(result.data[0]);
                }
            } else {
                throw 'result not true';
            }
            console.log('processRegRequests.result=', result);
            if (on_done) on_done();

        } catch (e) {
            console.log('error fetching regrequests', e);
            setError(e);
            setActivePanel('errorservice');
        } finally {
            setDataFetching(false);
        }
    }

    async function sendData(on_done = null) {
        setDataFetching(true);

        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            },
            json: {
                meters: formData
            }
        };
        console.log('datatosend', options);

        try {
            const result = await ky.post(`setmeters`, options).json();
            if (!result['result']) {
                console.log('sendData.result=', result);
                throw 'result not true';
            }
            if (on_done) on_done();
        } catch (e) {
            console.log('sendData Exception=', e);
            setError(e);
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
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            },
            json: {
                action: action,
                request_id: activeRegRequest.id
            }
        };
        try {
            const data = await ky.post(`registrationrequestaction`, options).json();
            console.log(data);
            if (!data['result']) {
                throw 'result not true';
            }
            if (on_done) on_done();
        } catch (e) {
            console.log('regReqAction',e);
            setActivePanel('errorservice');
        } finally {
            console.log('regReqAction finally');
            //setPopout(null);
            setDataFetching(false);
        }
    }

    async function uploadAccountData(on_done = null) {
        setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            },
            json: {
                action: 'upload',
                data: fileData.data
            }
        };
        try {
            const result = await ky.post(`adminprocessdata`, options).json();
            console.log(result);
            if (!result['result']) {
                console.log('uploadAccountData', result);
                throw result.error.message;
            }
            if (on_done) on_done();
        } catch (e) {
            console.log('uploadAccountData Exception=', e);
            setError(e);
            setActivePanel('errorservice');
        } finally {
            setDataFetching(false);
        }
    }

    async function restRequest(rest_action, json_data = null, on_done = null) {
        setDataFetching(true);
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            searchParams: {
                user_id: vkUser.id,
                token: getToken(),
            }
        };
        try {
            let result = null;
            if (json_data){
                options.json = json_data;
                result = await ky.post(rest_action, options).json();
            } else {
                result = await ky.get(rest_action, options).json();
            }
            console.log('restRequest(', rest_action, ').result=', result);
            if (typeof on_done == 'function') on_done(result);

        } catch (e) {
            setError(e);
            setActivePanel('errorservice');

        } finally {
            setDataFetching(false);
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
                    if (targetPanel === 'account-selection' && userInfo && !userInfo.accounts.length) {
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
                        if (!(formData[0].acc_id 
                            && formData[0].secret_code
                            && formData[0].surname
                            && formData[0].first_name
                            && formData[0].street
                            && formData[0].n_dom)) {
                            console.log('regdata required fields');
                            return;
                        }
                        //setPopout(spinner);
                        sendRegData((t) => {setActiveTarget(t);});
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
                    if (e.currentTarget.dataset.action === "confirm") {
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
            switch (activePanel) {
                case 'regrequests-list':
                    if (targetPanel === 'regrequest-detail') {
                        processRegRequests('detail', null, 
                            [{
                                field: 'id',
                                value: e.currentTarget.dataset.request_id
                            }], 
                            () => {setActiveTarget(target)}
                        );
                        return;
                    }
                    break;

                case 'regrequest-detail':
                    if (target === 'regrequest-action') {
                        let action = e.currentTarget.dataset.action;
                        if (action === 'approve' && !formData.account_id) return;
                        processRegRequests(action,
                            formData, [
                                {field: "id",
                                 value: formData.request_id}
                            ], () => {setActiveTarget('regrequests-list')});
                        return;
                    }
                    break;

                case 'dataprocess-upload':
                    if (e.currentTarget.dataset.action === 'confirm') {
                        uploadAccountData(() => {
                            console.log('go to after upload');
                            setActiveTarget(target)});
                        return;
                    }
                    break;

                case 'dataprocess-download':
                    if (e.currentTarget.dataset.action === 'confirm') {
                        restRequest(
                            'adminprocessdata', 
                            {
                                action: 'download',
                                data: formData[0]
                            },
                            (result) => {
                                console.log('go.adminprocessdata.download.on_done ', result);
                                if (result.result){
                                    if (!result.data_len) {
                                        setActivePanel('no-indications');
                                        return;
                                    }
                                    //setFileData(result.data[0]);
                                    try {
                                        let blob = new Blob([JSON.stringify(result.data, null, 2)], {type: 'text/plain'});
                                        saveAs(blob, "indications.json");
                                    } catch (e) {
                                        setError(e);
                                        setActivePanel('errorservice');
                                    }
                                } else {
                                    setError(result.error.message);
                                    setActivePanel('errorservice');
                                }
                            });
                        return;
                    }
                    break;
            }

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

    const showModal = () => {
        if (activeView === 'adminview') {
            switch (activePanel) {
                case 'regrequests-list':
                    setActiveModal('regrequests-filters');
                    break;
            }
        }
    }

    const onModalDone = () => {
    }

	return (
        <Root id='root' activeView={activeView} >
            <View id='welcomeview' activePanel={activePanel}  popout={popout} >
                <Welcome id='welcome' go={go} vkUser={vkUser} userInfo={userInfo} regInfo={regInfo} setActiveRegRequest={setActiveRegRequest} />
                <ErrorService id='errorservice' go={go} error={error} />
                <RegistrationRequestActions id='regrequest-actions' go={go} activeRegRequest={activeRegRequest} />
                <Help id='help' go={go}/>
                <StaticMessage id='no-accounts' go={go} message={'К учетной записи не привязано ни одного лицевого счета.'} />
            </View>
            <View id='registrationview' activePanel={activePanel}  popout={popout} >
                <ErrorService id='errorservice' go={go} error={error} />
                <Registration id='registration' go={go}  formData={formData} setFormData={setFormData} regInfo={regInfo} />
                <StaticMessage id='registration-data-sent' go={go} message={'Запрос принят в обработку.'} />
                <StaticMessage id='registration-data-code-incorrect' go={go} message={'Запрос не принят. Введен неверный номер лицевого счета или проверочный код.'}
                    to={'registration'} 
                />
            </View>
            <View id='mainview' activePanel={activePanel} popout={popout}>
                <AccountSelection id='account-selection' vkUser={vkUser} userInfo={userInfo} setActiveAcc={setActiveItem} go={go} />
                <DataInput id='datainput' formData={formData} setFormData={setFormData} activeAcc={activeItem} meters={metersInfo} vkUser={vkUser} go={go} />
                <ErrorService id='errorservice' go={go} error={error} />
                <Persik id='persik' go={go} />
            </View>
            <View id='adminview' activePanel={activePanel} popout={popout} 
                modal={<AdminModal activeModal={activeModal} setActiveModal={setActiveModal} regRequestsFilters={regRequestsFilters} setRegRequestsFilters={setRegRequestsFilters} onModalDone={onModalDone}/>}
            >
                <ErrorService id='errorservice' go={go} error={error} />
                <Lobby id='lobby' go={go} vkUser={vkUser} userInfo={userInfo} />
                <RegRequestsList id='regrequests-list' go={go} vkUser={vkUser} userInfo={userInfo} setFormData={setFormData} regRequests={regRequests} 
                    regRequestsFilters={regRequestsFilters} setRegRequestsFilters={setRegRequestsFilters} showModal={showModal} processRegRequests={processRegRequests}
                />
                <RegRequestDetail id='regrequest-detail' go={go} vkUser={vkUser} userInfo={userInfo} activeRegRequest={activeRegRequest} formData={formData} setFormData={setFormData} />
                <DataProcessUpload id='dataprocess-upload' go={go} vkUser={vkUser} userInfo={userInfo} fileData={fileData} setFileData={setFileData}/>
                <DataProcessDownload id='dataprocess-download' go={go} vkUser={vkUser} userInfo={userInfo} formData={formData} setFormData={setFormData}/>
                <StaticMessage id='no-indications' go={go} message={'За выбранный период показания отсутствуют.'} to={'lobby'} />
            </View>
        </Root>
	);
};

export default App;

