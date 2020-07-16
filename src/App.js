import React, { useState, useEffect } from 'react';
import ky from 'ky';

import bridge from '@vkontakte/vk-bridge';
import Root from '@vkontakte/vkui/dist/components/Root/Root';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Begin from './panels/main/Begin'
import DataInput from './panels/main/DataInput';
import ErrorCode from './panels/main/ErrorCode';
import ErrorService from './panels/ErrorService';
import Persik from './panels/main/Persik';

const App = () => {
    const spinner = <ScreenSpinner size='large' />;
	const [activePanel, setActivePanel] = useState('begin');
	const [fetchedUser, setUser] = useState(null);
    const [secretCode, setSecretCode] = useState(null);
    const [tenantData, setTenantData] = useState(null);
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
		async function fetchVkUser() {
            const user = await bridge.send('VKWebAppGetUserInfo')
            setUser(user);
        }
        fetchVkUser();
        getData('getuser')
        setPopout(null);
	}, []);

    useEffect(() => {
        console.log('effect')
        if (activePanel === 'begin') {
            setSecretCode(null);
            setTenantData(null);
            setFormData([]);
        }
    }, [activePanel]);

    async function getData(uri) {
        try {
            const data = await ky.get(`${uri}`, {prefixUrl: '/api', mode: 'no-cors'}).json();
            console.log('fetched data', data);
            if (!data['result']) {
                console.log('result', data['result']);
                throw 'result not true';
            }
            return data['data'];

        } catch (e) {
            console.log('error fetching data', e);
            setActivePanel('errorservice');
            return false;
        }
    }

    async function fetchData() {
        try {
            const data = await ky.get(`getclient/${secretCode}/12345`, {prefixUrl: '/api', mode: 'no-cors'}).json();
            console.log('fetched data', data);
            if (!data['result']) {
                console.log('result', data['result']);
                setActivePanel('errorcode');
                return;
            }
            setTenantData(data['data']);
            setActivePanel('datainput');
        } catch (e) {
            console.log('error fetching data', e);
            setActivePanel('errorservice');
        }
    }

    async function sendData() {
        let options = {
            prefixUrl: '/api',
            mode: 'no-cors',
            json: {
                result: true
            }
        };
        options['json']['meters'] = [...formData];
        console.log('datatosend', options);

        try {
            const data = await ky.post(`setmeters/${secretCode}/12345`, options).json();
            console.log(data);
            if (!data['result']) {
                throw 'result not true';
            }
            setActivePanel('persik');
        } catch (e) {
            setActivePanel('errorservice');
        }
    }


	const go = e => {
        let targetPanel = e.currentTarget.dataset.to;
        switch (activePanel) {
            case 'begin':
                console.log('from begin');
                if ( !secretCode || /[^[0-9]/.test(secretCode) ) {
                    return;
                }
                setPopout(spinner);
                fetchData();
                setPopout(null);
                return;
                
            case 'datainput':
                console.log('from datainput');
                if (e.currentTarget.dataset.action == "confirm") {
                    console.log('formdata', formData);
                    setPopout(spinner);
                    sendData();
                    setPopout(null);
                    return;
                }
                break;
                
            default:
                break;
        };
        setActivePanel(targetPanel);
	};

	return (
        <Root activeView='welcome'>
            <View id='welcome'>
                <ErrorService id='errorservice' go={go} />
            </View>
            <View id='main' activePanel={activePanel} popout={popout}>
                <Begin id='begin' vkUser={fetchedUser} setSecretCode={setSecretCode} go={go} />
                <DataInput id='datainput' formData={formData} setFormData={setFormData} tenantData={tenantData} vkUser={fetchedUser} secretCode={secretCode} go={go} />
                <ErrorCode id='errorcode' go={go} />
                <ErrorService id='errorservice' go={go} />
                <Persik id='persik' go={go} />
            </View>
            <View id='admin'>
                <ErrorService id='errorservice' go={go} />
            </View>
        </Root>
	);
};

export default App;

