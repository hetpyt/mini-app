import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import {stub_getData} from './stub';
import Begin from './panels/Begin'
import DataInput from './panels/DataInput';
import ErrorCode from './panels/ErrorCode';
import Persik from './panels/Persik';

const App = () => {
    const spinner = <ScreenSpinner size='large' />;
	const [activePanel, setActivePanel] = useState('begin');
	const [fetchedUser, setUser] = useState(null);
    const [secretCode, setSecretCode] = useState(null);
    const [tenantData, setTenantData] = useState(null);
	const [popout, setPopout] = useState(spinner);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			} else if (type === 'VKWebAppGetPersonalCardFailed') {
                //console.log(data);
            }
            
		});
		async function fetchVkUser() {
			const user = await bridge.send('VKWebAppGetUserInfo');
            //const contact_info = await bridge.send('VKWebAppGetPersonalCard');
            //console.log(user);
			setUser(user);
            //setUserContacts(contact_info);
			setPopout(null);
        }
        fetchVkUser();
	}, []);

    useEffect(() => {
        if (activePanel === 'begin') {
            setSecretCode(null);
            setTenantData(null);
        }
    }, [activePanel]);

    function fetchData(code) {
        setPopout(spinner);
        const data = stub_getData(code);
        setTenantData(data);
        setPopout(null);
        if (data === null) {
            console.log('data=null');
            setActivePanel('errorcode');
            return true;
        }
        return false;
    }

	const go = e => {
        let panelSetted = false;
        switch (activePanel) {
            case 'begin':
                console.log('from begin');
                if ( !secretCode || /[^[0-9]/.test(secretCode) ) {
                    return;
                }
                panelSetted = fetchData(secretCode);
                console.log('tenantdata', tenantData);
                break;
                
            case 'persik':
                console.log('from persik');
                break;
                
            default:
                break;
        };
        if (!panelSetted) setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Begin id='begin' fetchedUser={fetchedUser} setSecretCode={setSecretCode} go={go} />
			<DataInput id='datainput' fetchedUser={fetchedUser} tenantData={tenantData} secretCode={secretCode} go={go} />
			<ErrorCode id='errorcode' go={go} />
			<Persik id='persik' go={go} />
		</View>
	);
};

export default App;

