import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Input from '@vkontakte/vkui/dist/components/Input/Input';

const Begin = ({ id, go, setSecretCode, vkUser }) => (
	<Panel id={id}>
		<PanelHeader>Введите код с квитанции</PanelHeader>
		{vkUser &&
		<Group title="VK User Data">
			<Cell
				before={vkUser.photo_200 ? <Avatar src={vkUser.photo_200}/> : null}
				description={vkUser.city && vkUser.city.title ? vkUser.city.title : ''}
			>
				{`${vkUser.first_name} ${vkUser.last_name} ({vkUser.id})`}
			</Cell>
		</Group>}

        <FormLayout>
            <Input top="Код" type="text" pattern="[0-9]*" required onChange={ (e) => {setSecretCode(e.currentTarget.value);}}/>
			<Div>
				<Button size="xl" mode="primary" onClick={go} data-to="datainput">
					Отправить
				</Button>
			</Div>
        </FormLayout>
	</Panel>
);

Begin.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	vkUser: PropTypes.shape({
        id: PropTypes.number,
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
    setSecretCode: PropTypes.func.isRequired,
};

export default Begin;
