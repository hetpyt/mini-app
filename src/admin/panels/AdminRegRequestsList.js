import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Header, PanelHeaderBack, Group, SimpleCell, List, Counter, FixedLayout, SubnavigationBar, SubnavigationButton, Avatar, Div } from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28RecentOutline, Icon28BlockOutline, Icon24Hide, Icon24Delete, Icon24Filter } from '@vkontakte/icons';
import { isArray } from '@vkontakte/vkjs';

const AdminRegRequestsList = (props) => {

	const userInfo = props.app.userInfo;

	const [regRequests, setregRequests] = useState([]);
	const [filters, setFilters] = useState([]);
	const [filtersCount, setFiltersCount] = useState(0);


	useEffect(() => {
		props.app.restRequest(
            'admin/regrequests/list',
            {
				filters : filters
			},
            res => {
                setregRequests(res);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, []);

	const openModal = e => {

	}

	return (
		<Panel id={props.id}>
			<PanelHeader left={<PanelHeaderBack onClick={e => {props.app.setActivePanel('mainmenu')}} />} >Заявки на присоединение ЛС</PanelHeader>

			{userInfo && ['ADMIN', 'OPERATOR'].indexOf(userInfo.privileges) != -1 &&
				<Div>
					<FixedLayout vertical="top">
						<SubnavigationBar mode="overflow">
							<SubnavigationButton
								before={<Icon24Filter/>}
								selected={filtersCount > 0}
								expandable
								after={filtersCount > 0 && <Counter mode="primary" size="s">{filtersCount}</Counter>}
								onClick={openModal}
							>

							</SubnavigationButton>
						</SubnavigationBar>
					</FixedLayout>
					{isArray(regRequests) &&
						<List style={{ paddingTop: 60 }}>
							{regRequests.map(
								(item, index) => (
									<SimpleCell 
										key={index}
										multiline 
										expandable
										data-request_id={item.id}
										before={item.is_approved === null ? <Icon28RecentOutline/> : (parseInt(item.is_approved) === 1 ? <Icon28DoneOutline/> : <Icon28BlockOutline/>)}
										after={parseInt(item.del_in_app) === 1 ? <Icon24Delete/> : (parseInt(item.hide_in_app) === 1 ? <Icon24Hide/> : null)}
										description={item.is_approved === null ? 
											'Ожидает обработки' : 
											(parseInt(item.is_approved) === 1 ? 
												'Одобрена ' : 
												'Отклонена ') + (props.app.vkUser.id === parseInt(item.processed_by) ? 'вами' : 'пользователем ID' + item.processed_by)}
										onClick={e => {
											console.log('selected ' + e.currentTarget.dataset.request_id);
											props.setRegRequestId(e.currentTarget.dataset.request_id);
											props.app.setActivePanel('regrequestsdetail');
										}}
									>
										{'Заявка №' + item.id + ' от ' + item.request_date}
									</SimpleCell>
								)
							)}
						</List>
					}
				</Div>
			}
		</Panel>
	);
}

export default AdminRegRequestsList;
