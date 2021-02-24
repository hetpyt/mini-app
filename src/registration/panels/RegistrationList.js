import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, Cell, List, Div, Caption } from '@vkontakte/vkui';


const RegistrationList = (props) => {

	const [regInfo, setRegInfo] = useState(null);

    useEffect(() => {
		props.session.restRequest('regrequests/list', null, res => {
            setRegInfo(res);
        });
    }, []);

	const userInfo = props.session.userInfo;

	const renderCreateButton = () => {
		if (userInfo ) {

			const too_much_waitings = () => {
				let waitingReqs = false;
				if (Array.isArray(regInfo)) {
					for (let i= 0; i < regInfo.length; i++) {
						if (regInfo[i].is_approved === null) waitingReqs++;
					}
				}
				return waitingReqs >= 3;
			};

			if (parseInt(userInfo.is_blocked) !== 0) {
				return (
					<Caption level="1" weight="medium">Пользователь заблокирован! Создание заявок невозможно.</Caption>
				);
			}

			if ( too_much_waitings() ) {
				return (
					<Caption level="1" weight="medium">Достигнуто максимальное число ожидающих заявок! Создание заявок невозможно.</Caption>
				);
			}

			return (
				<Button size="l" mode="primary" stretched={true} onClick={props.session.go} data-to="registration">
					Создать заявку
				</Button>
			);
		}
	}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.session.goBack} data-to="welcomeview.welcome" />}>Список заявок на присоединение лицевого счета</PanelHeader>

			{userInfo && parseInt(userInfo.is_blocked) === 0  &&
			<Div>
				{renderCreateButton()}
			</Div>
			}

			{regInfo &&
				<List>
					{regInfo.map(
						({ id, acc_id, is_approved, rejection_reason }, index) => (
							<Cell 
								key={id} 
								data-index={index}
								data-to='registration'
								multiline={true} 
								expandable={true}
								text={'Номер заявки ' + id}
								description={'Заявка ' + (is_approved === null ? 'ожидает проверки' : (parseInt(is_approved) === 0 ? 'отклонена по причине: ' + (rejection_reason === null ? 'причина не указана' : rejection_reason) : ' одобрена'))}
								onClick={e => {
									console.log('request_index=', e.currentTarget.dataset.index);
									//setActiveRegRequest(regInfo[e.currentTarget.dataset.index]);
									props.session.go(e);
								}}
							>
								Заявка на присоединение лицевого счета №{acc_id}
							</Cell>
						)
					)
					}
				</List>
			}

			<Div>
				<Caption level="2" weight="regular">По всем вопросам Вы можете обратиться используя контактные данные, указанные в Вашей квитанции.</Caption>
			</Div>
		</Panel>
	)
};

export default RegistrationList;
