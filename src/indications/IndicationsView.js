import React, { useState, useEffect } from 'react';
import { View } from '@vkontakte/vkui';

import AccountsList from './panels/AccountsList';
import IndicationsInput from './panels/IndicationsInput';

const RegistrationView = (props) => { 

    const [account, setAccount] = useState(null);


	return (
        <View id={props.id} activePanel={props.activePanel} popout={props.popout} >
            <AccountsList id='accountslist' setAccount={setAccount} session={props.session} />
            <IndicationsInput id="indicationsinput" account={account} session={props.session} />
        </View>
    );
}

export default RegistrationView;
