import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Button } from "rsuite";
import {
	getServiceRequestStatuses,
	getServiceRequestTypes,
	getSkipReasons
} from "../../../utils/api/sprycis";
import CardHeader from "../../common/cards/CardHeader";
import CreateServiceRequest from "../../common/modals/CreateServiceRequest";
import ServiceRequestListItem from "./ServiceRequestListItem";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";
import Filter from "../../common/buttons/Filter";
import Sort from "../../common/buttons/Sort";
import { updateArcGISRequest } from "../../../utils/api/arcgis";
import TitleHeader from "../../common/headers/TitleHeader";
import MapDisplay from "./MapDisplay";


export default function ServiceRequestList({
	account,
	customers,
	meters,
	serviceRequests,
	setServiceRequests,
	tokens,
	card,
	updateCards,
	errors,
	setErrors
}) {
	const [searchResults, setSearchResults] = useState(serviceRequests);
	const [statuses, setStatuses] = useState();
	const [sortBy, setSortBy] = useState("Request Number");
	const [sortOrder, setSortOrder] = useState("Descending");
	const [statusFilters, setStatusFilters] = useState([]);
	const [typeFilters, setTypeFilters] = useState([]);
	const [serviceDates, setServiceDates] = useState();
	const [requestDates, setRequestDates] = useState();
	const [types, setTypes] = useState();
	const [skipReasons, setSkipReasons] = useState();
	const [accountSelect, setAccountSelect] = useState();
	const [alert, setAlert] = useState();
	const [loading, setLoading] = useState();
	const [currentPage, setCurrentPage] = useState(0);
	

	const location = useLocation();

	
	useEffect(() => {
		const controller = new AbortController();
		// clear status and type errors if any
		setErrors({ ...errors, type: "", statuses: "" });
		// load status and type options
		loadStatuses(controller)
			.then(() => loadTypes(controller))
			.then(() => loadSkipReasons(controller))
			.catch(error => console.log(error));

		return () => controller.abort();
	}, [tokens]);
	// when filters or service requests change, find matching search results
	useEffect(() => {
		if (serviceRequests) filterRequests(serviceRequests);
	}, [
		sortOrder,
		sortBy,
		statusFilters,
		typeFilters,
		serviceDates,
		requestDates,
		serviceRequests
	]);
	
	const loadStatuses = async ({ signal }) => {
		getServiceRequestStatuses(tokens.sprycis, signal)
			.then(response => {
				const statusList = response.map(status => {
					return {
						label: status.name,
						value: status.name,
						text: status.name,
						name: "status"
					};
				});
				setStatuses(statusList);
			})
			.catch(error =>
				setErrors({
					...errors,
					statuses: error
				})
			);
	};

	const loadTypes = async ({ signal }) => {
		getServiceRequestTypes(tokens.sprycis, signal)
			.then(response => {
				const typeList = response.map(type => {
					return {
						label: type.name,
						value: type.id,
						text: type.name,
						name: "serviceRequestType"
					};
				});
				setTypes(typeList);
			})
			.catch(error => setErrors({ ...errors, type: error }));
	};

	const loadSkipReasons = async ({ signal }) => {
		getSkipReasons(tokens.sprycis, signal)
			.then(response => {
				const reasonList = response.map(reason => {
					return {
						label: reason,
						value: reason
					}
				})
				setSkipReasons(reasonList)
			})
			.catch(error =>
				setErrors({
					...errors,
					skipReasons: error
				})
			);
	};

	const sortRequests = async requests => {
		switch (sortBy) {
			case "Service Date":
				if (sortOrder === "Ascending") {
					return await requests.sort((requestA, requestB) => {
						const requestDateA = new Date(requestA.scheduleDate);
						const requestDateB = new Date(requestB.scheduleDate);
						return requestDateA - requestDateB;
					});
				} else if (sortOrder === "Descending") {
					return await requests.sort((requestA, requestB) => {
						const requestDateA = new Date(requestA.scheduleDate);
						const requestDateB = new Date(requestB.scheduleDate);
						return requestDateB - requestDateA;
					});
				}
				break;
			case "Request Number":
				if (sortOrder === "Ascending") {
					return await requests.sort(
						(requestA, requestB) =>
							requestA.serviceRequestNumber.substring(3) -
							requestB.serviceRequestNumber.substring(3)
					);
				} else if (sortOrder === "Descending") {
					return await requests.sort(
						(requestA, requestB) =>
							requestB.serviceRequestNumber.substring(3) -
							requestA.serviceRequestNumber.substring(3)
					);
				}
				break;
			default:
				break;
		}
	};
	const filterRequests = async () => {
		let requests = serviceRequests;

		if (statusFilters && statusFilters.length > 0) {
			requests = requests.filter(serviceRequest =>
				statusFilters.some(status => serviceRequest.status === status)
			);
		}
		if (typeFilters && typeFilters.length > 0) {
			requests = requests.filter(serviceRequest =>
				typeFilters.some(
					type => serviceRequest.serviceRequestType === type
				)
			);
		}
		if (serviceDates && serviceDates.length > 0) {
			requests = requests.filter(
				serviceRequest =>
					serviceRequest.scheduleDate >=
						serviceDates[0].toLocaleDateString() &&
					serviceRequest.scheduleDate <=
						serviceDates[1].toLocaleDateString()
			);
		}
		if (requestDates && requestDates.length > 0) {
			requests = requests.filter(
				serviceRequest =>
					serviceRequest.createDate >=
						requestDates[0].toLocaleDateString() &&
					serviceRequest.createDate <=
						requestDates[1].toLocaleDateString()
			);
		}
		const sortedRequests = await sortRequests(requests);
		setSearchResults([...sortedRequests]);
	};
	const handleSync = async () => {
		const controller = new AbortController();
		// clear status and type errors if any
		setLoading(true);
		setErrors({ ...errors, sync: "" });
		setAlert("updating Esri service requests...");
		// load status and type options
		try {
			for (const serviceRequest of serviceRequests) {
				await updateArcGISRequest(
					serviceRequest,
					tokens.arcgis,
					controller.signal
				);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
			setErrors({ ...errors, sync: error });
		}

		return () => controller.abort();

		setLoading(false);
	};
	/* pagination functionality */
	function handlePageClick({ selected: selectedPage }) {
		setCurrentPage(selectedPage);
	}
	// items per page
	const itemCount = 10;
	// starting index
	const index = currentPage * itemCount;
	// page display
	const currentPageData =
		// if no search results display message
		!searchResults || searchResults.length <= 0 ? (
			<h6>There are no matching service requests to display.</h6>
		) : (
			searchResults
				.slice(index, index + itemCount)
				.map(serviceRequest => (
					<ServiceRequestListItem
						customers={customers}
						meters={meters}
						serviceRequest={serviceRequest}
						setServiceRequests={setServiceRequests}
						statuses={statuses}
						skipReasons={skipReasons}
						errors={errors}
						tokens={tokens}
						key={serviceRequest.serviceRequestSid}
					/>
				))
		);
	// total number of pages
	const pageCount =
		!searchResults || searchResults.length <= 0
			? 0
			: Math.ceil(searchResults.length / itemCount);
	/* end pagination functionality */
	// wait for statuses, filters, and types. display error if any


	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<CardHeader
				card={card}
				updateCards={updateCards}
				draggable={true}
			/>
			<div id={`collapse${card.id}`} className='card-body collapse'>
				{errors && errors.serviceRequests ? (
					<ErrorMessage error={errors.serviceRequests} />
				) : 
				!serviceRequests ? (
					<LoadingSpinner />
				) : 
				(
					<div className='container-fluid'>
						{location.pathname === "/tools" ? (
							<div className='card sub-card mb-3' id='requestMap'>
								<TitleHeader
									title='ArcGIS Map'
									id='requestMap'
								/>
								<div
									id='collapserequestMap'
									className='card-body collapse show'
								>
									<MapDisplay
										statusFilter={statusFilters}
										typeFilter={typeFilters} />
								</div>
							</div>
						) : null}
						<div className='d-flex justify-content-between align-items-center mb-4'>
							<div className='flex-row-center'>
								{/* wait for statuses and display error if any */}
								{(errors && errors.statuses) ||
								(errors && errors.types) ? (
									<ErrorMessage
										error={
											errors.statuses
												? errors.statuses
												: errors.types
										}
									/>
								) : !statuses || !types ? (
									<LoadingSpinner />
								) : (
									<Filter
										sortBy={sortBy}
										setSortBy={setSortBy}
										sortOrder={sortOrder}
										setSortOrder={setSortOrder}
										statuses={statuses}
										types={types}
										setStatusFilters={setStatusFilters}
										setTypeFilters={setTypeFilters}
										setRequestDates={setRequestDates}
										setServiceDates={setServiceDates}
									/>
								)}
							</div>
							{/* only display create button on account page. wait for meters before displaying. */}
							{errors && errors.sync ? (
								<ErrorMessage error={errors.sync} />
							) : loading === true ? (
								<LoadingSpinner alert={alert} />
							) : location.pathname === "/tools" ? (
								<Button
									onClick={handleSync}
									className='btn-danger'
								>
									<i class='fa-solid fa-rotate me-2' />
									Sync
								</Button>
							) : (errors && errors.statuses) ||
							  (errors && errors.type) ||
							  (errors && errors.meters) ||
							  (errors && errors.customers) ? (
								<ErrorMessage
									error={
										errors.statuses
											? errors.statuses
											: errors.type
											? errors.type
											: errors.meters
											? errors.meters
											: errors.customers
									}
								/>
							) : !statuses || !types || !meters || !customers ? (
								<LoadingSpinner />
							) : (
								<CreateServiceRequest
									account={account}
									customers={customers}
									meters={meters}
									statuses={statuses}
									setServiceRequests={setServiceRequests}
									tokens={tokens}
									types={types}
								/>
							)}
						</div>
						<div className='container-fluid'>
							{currentPageData}
							{pageCount > 1 ? (
								<ReactPaginate
									previousLabel='←'
									nextLabel='→'
									pageCount={pageCount}
									onPageChange={handlePageClick}
									className='pagination'
									previousLinkClassName={"pagination-prev"}
									nextLinkClassName={"pagination-next"}
									pageClassName={"pagination-item"}
									activeClassName={"pagination-active"}
								/>
							) : null}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
