import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import {stub_getData} from './stub';
import Begin from './panels/Begin'
import DataInput from './panels/DataInput';
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
                console.log(data);
            }
            
		});
		(async () => {
			const user = await bridge.send('VKWebAppGetUserInfo');
            //const contact_info = await bridge.send('VKWebAppGetPersonalCard');
			setUser(user);
            //setUserContacts(contact_info);
			setPopout(null);
		})();
	}, []);

    async function fetchData() {
        setPopout(spinner);
        const data = await stub_getData();
        setTenantData(data);
        setPopout(null);
    }

	const go = e => {
        switch (activePanel) {
            case 'begin':
                console.log('from begin');
                if ( !secretCode || /[^[0-9]/.test(secretCode) ) {
                    return;
                }
                fetchData();
                console.log(tenantData);
                break;
                
            case 'persik':
                console.log('from persik');
                break;
                
            default:
                break;
        };
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Begin id='begin' fetchedUser={fetchedUser} setSecretCode={setSecretCode} go={go} />
			<DataInput id='datainput' fetchedUser={fetchedUser} tenantData={tenantData} secretCode={secretCode} go={go} />
			<Persik id='persik' go={go} />
		</View>
	);
}

export default App;

