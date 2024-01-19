import React from "react";
import DraggableHeader from "../../common/headers/DraggableHeader";
import WorkOrderListItem from "./WorkOrderListItem";
import SearchList from "../../common/search/SearchList";

import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";


// displays a list of workOrders
export default function WorkOrderList({ 
	workOrders, 
	search,
	tokens,
	setSearch,
	card,
	updateCards,
	 errors }) {
	// wait for workOrders and display error if any
	console.log(card)
	return (
		
		<div
			className={`card main-card collapse ${card.show ? "show" : null}`}
			id={card.id}
		>
			<DraggableHeader 
				card={card} 
				updateCards={updateCards} 
			/>{search ?
			<div id={`collapse${card.id}`}	className={`card-body collapse show `}>
				{/* wait for workOrders and display error if any */}
				{errors && errors.workOrders ? (
					<ErrorMessage error={errors.workOrders} />
				) : !workOrders ? (
					<LoadingSpinner />
				) :(
					<SearchList
						options={workOrders}
						search={search}
						setSearch={setSearch}
						type='workOrder'
					/>
				) }
			</div> :
			<div id={`collapse${card.id}`}	className={`card-body collapse show `}>
				{/* wait for workOrders and display error if any */}
				{errors && errors.workOrders ? (
					<ErrorMessage error={errors.workOrders} />
				) : !workOrders ? (
					<LoadingSpinner />
				) :(
					workOrders.map(workOrder => (
						<WorkOrderListItem
							workOrder={workOrder}
							key={`${workOrder.sid}`}
							tokens={tokens}
						/>
					))
				)}
			</div>
			}
			
		</div>
	);
}
