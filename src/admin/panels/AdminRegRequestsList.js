import React, { useState, useEffect} from 'react';
import { Panel, PanelHeader, Header, PanelHeaderBack, Group, SimpleCell, List, Caption, FixedLayout, SubnavigationBar, SubnavigationButton, IconButton, Div } from '@vkontakte/vkui';
import { Icon28DoneOutline, Icon28RecentOutline, Icon28BlockOutline, Icon24Hide, Icon24Delete, Icon24Filter, Icon36ChevronLeftOutline, Icon36ChevronRightOutline } from '@vkontakte/icons';
import { isArray } from '@vkontakte/vkjs';
const AdminRegRequestsList = (props) => {
	const REGREQ_LIST_PAGE_SIZE = 10;

	console.log("AdminRegRequestsList.props=", props);
	const userInfo = props.app.userInfo;

	const [regRequests, setregRequests] = useState([]);
	const [listPage, setListPage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);

	useEffect(() => {
		props.app.restRequest(
            'admin/regrequests/list',
            {
				...props.regRequestsFilters,
				limits : { 
					page_num : listPage,
					page_len : REGREQ_LIST_PAGE_SIZE
				}
			},
            res => {
				setTotalItemsCount(res.total_count);
                setregRequests(res.data);
            },
            err => {
                console.log('err=', err);
            }
        );
	}, [props.regRequestsFilters, listPage]);

	const openFilters = e => {
		props.app.setActiveModal('regrequestsfilters')
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
								selected={true}
								expandable
								onClick={openFilters}
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
							<Div style={{display: 'flex', "justify-content" : 'center', "align-items" : "center"}}>
								<IconButton style={{height : "36px"}} onClick={e => {
									if (listPage > 1) 
										setListPage(listPage - 1);
								}}>
									<Icon36ChevronLeftOutline/>
								</IconButton>
								<Caption level="1" weight="regular">
									{"Страница " + listPage.toString() + "/" + (Math.ceil(totalItemsCount / REGREQ_LIST_PAGE_SIZE)).toString()}
								</Caption>
								<IconButton style={{height : "36px"}} onClick={e => {
									if (REGREQ_LIST_PAGE_SIZE * listPage < totalItemsCount) 
										setListPage(listPage + 1);
								}}>
									<Icon36ChevronRightOutline/>
								</IconButton>
							</Div>
						</List>
					}
				</Div>
			}
		</Panel>
	);
}

export default AdminRegRequestsList;
