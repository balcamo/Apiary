import React from "react";
import CustomerListItem from "./CustomerListItem";
import SearchList from "../../common/search/SearchList";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";
import DraggableHeader from "../../common/headers/DraggableHeader";

/**
 * 
 * @param {customers,search,setSearch,card,updateCards,errors}
 * @returns {display of customer search matches}
 */
export default function CustomerList({
	customers,
	search,
	setSearch,
	card,
	updateCards,
	errors
}) {
	console.log(customers)
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
				{/* wait for customers and display error if any */}
				{errors && errors.customers ? (
					<ErrorMessage error={errors.customers} />
				) : !customers ? (
					<LoadingSpinner />
				) :(
					<SearchList
						options={customers}
						search={search}
						setSearch={setSearch}
						type='customer'
					/>
				) }
			</div> :
			<div id={`collapse${card.id}`}	className={`card-body collapse show `}>
				{/* wait for customers and display error if any */}
				{errors && errors.customers ? (
					<ErrorMessage error={errors.customers} />
				) : !customers ? (
					<LoadingSpinner />
				) :(
					customers.map(customer => (
						<CustomerListItem
							customer={customer}
							key={`${customer.sid}`}
						/>
					))
				)}
			</div>
			}
			
		</div>
	);
}
