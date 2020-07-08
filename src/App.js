import React, { useState, useEffect } from 'react';
import ky from 'ky';

import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import {stub_getData} from './stub';
import Begin from './panels/Begin'
import DataInput from './panels/DataInput';
import ErrorCode from './panels/ErrorCode';
import ErrorService from './panels/ErrorService';
import Persik from './panels/Persik';

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
            setPopout(null);
        }
        fetchVkUser();
	}, []);

    useEffect(() => {
        console.log('effect')
        if (activePanel === 'begin') {
            setSecretCode(null);
            setTenantData(null);
            setFormData([]);
        }
    }, [activePanel]);

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
        } catch(e) {
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

        const result = await ky.post(`setmeters`, options).json();
        console.log(result);
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
                }
                break;
                
            default:
                break;
        };
        setActivePanel(targetPanel);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Begin id='begin' vkUser={fetchedUser} setSecretCode={setSecretCode} go={go} />
			<DataInput id='datainput' formData={formData} setFormData={setFormData} tenantData={tenantData} vkUser={fetchedUser} secretCode={secretCode} go={go} />
			<ErrorCode id='errorcode' go={go} />
			<ErrorService id='errorservice' go={go} />
			<Persik id='persik' go={go} />
		</View>
	);
};

export default App;

