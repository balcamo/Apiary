import React from "react";
import SearchList from "../../common/search/SearchList";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";
import DraggableHeader from "../../common/headers/DraggableHeader";
/**
 * 
 * @param {lots,search,setSearch,card,updateCards,errors}
 * @returns {display of lot search matches, or any list of lots}
 */
export default function LotList({
	lots,
	search,
	setSearch,
	card,
	updateCards,
	errors
}) {
	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : null}`}
			id={card.id}
		>
			<DraggableHeader
				card={card}
				updateCards={updateCards}
			/>
			<div id={`collapse${card.id}`} className='card-body collapse show'>
				{/* wait for lots and display error if any */}
				{errors && errors.lots ? (
					<ErrorMessage error={errors.lots} />
				) : !lots ? (
					<LoadingSpinner />
				) : (
					<SearchList
						options={lots}
						search={search}
						setSearch={setSearch}
						type='lot'
					/>
				)}
			</div>
		</div>
	);
}
