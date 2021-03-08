import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AccountsList from './panels/AccountsList';
import IndicationsInput from './panels/IndicationsInput';

const RegistrationView = (props) => { 

    const [activePanel, setActivePanel] = useState('accountslist');
    const [account, setAccount] = useState(null);

	return (
        <View id={props.id} activePanel={activePanel} popout={props.popout} >
            <AccountsList id='accountslist' setAccount={setAccount} app={{setActivePanel, ...props.app}} />
            <IndicationsInput id="indicationsinput" account={account} app={{setActivePanel, ...props.app}} />
        </View>
    );
}

export default RegistrationView;
