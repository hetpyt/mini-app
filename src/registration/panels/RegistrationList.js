import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, RichCell, List, Div, Caption } from '@vkontakte/vkui';
import { Icon28CheckCircleFill, Icon28CancelCircleFillRed, Icon28ClockCircleFillGray } from '@vkontakte/icons';

const RegistrationList = (props) => {

	const [regInfo, setRegInfo] = useState(null);

    useEffect(() => {
		props.app.restRequest(
			'regrequests/list',
			null,
			res => {
            	setRegInfo(res);
        	},
			err => {
				console.log('err=', err);
			}
		);
    }, []);

	const userInfo = props.app.userInfo;

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
				<Button size="l" mode="primary" stretched={true} onClick={props.app.go} data-to="registration">
					Создать заявку
				</Button>
			);
		}
	}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={props.app.goBack} data-to="welcomeview.welcome" />}>Список заявок на присоединение лицевого счета</PanelHeader>

			{userInfo && parseInt(userInfo.is_blocked) === 0  &&
			<Div>
				{renderCreateButton()}
			</Div>
			}

			{Array.isArray(regInfo) && 
			<Div>
				<List>
					{regInfo.map(
						({ id, acc_id, is_approved, rejection_reason, request_date }, index) => (
							<RichCell 
								key={id} 
								data-index={index}
								data-to='registration'
								multiline={true} 
								disabled={true}
								text={'на присоединение лицевого счета № ' + acc_id}
								caption={''
								+ (is_approved === null 
									? 'ожидает проверки' 
									: (parseInt(is_approved) === 0 
										? 'отклонена по причине: ' 
										+ (rejection_reason === null 
											? 'причина не указана' 
											: rejection_reason) 
										: ' одобрена'))}
								after={(is_approved === null 
									? <Icon28ClockCircleFillGray/> 
									: (parseInt(is_approved) === 1 
										? <Icon28CheckCircleFill/> 
										: <Icon28CancelCircleFillRed/>))}
							>
								Заявка №{id} от {request_date}
							</RichCell>
						)
					)}
				</List>
			</Div>
			}

			<Div>
				<Caption level="2" weight="regular">По всем вопросам Вы можете обратиться используя контактные данные, указанные в Вашей квитанции.</Caption>
			</Div>
		</Panel>
	)
};

export default RegistrationList;
