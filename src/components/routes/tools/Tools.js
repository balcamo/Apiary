import React from "react";
import CardToggle from "../../common/buttons/CardToggle";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ServiceRequestList from "../service-requests/ServiceRequestList";

export default function Tools({
	employees,
	meters,
	serviceRequests,
	setServiceRequests,
	workOrders,
	cards,
	updateCards,
	tokens,
	errors,
	setErrors
}) {
	return !cards ? (
		<LoadingSpinner />
	) : (
		<div id='page-content' className='container-fluid'>
			<CardToggle cards={cards} updateCards={updateCards} />
			{/* <ServiceRequestList
				serviceRequests={serviceRequests}
				setServiceRequests={setServiceRequests}
				meters={meters}
				card={cards.serviceRequests}
				updateCards={updateCards}
				tokens={tokens}
				errors={errors}
				setErrors={setErrors}
			/> */}
			{/* <WorkOrderList
				workOrders={workOrders}
				employees={employees}
				card={cards.workOrders}
				updateCards={updateCards}
				tokens={tokens}
				errors={errors}
			/> */}
		</div>
	);
}
