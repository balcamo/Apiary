import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { MDBSelect } from "mdb-react-ui-kit";
import DraggableHeader from "../../common/headers/DraggableHeader";
import MeterListItem from "./MeterListItem";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";

/**
 * 
 * @param {meters,card,updateCards,errors}
 * @returns {display of meters }
 */
export default function MeterList({ meters, card, updateCards, errors }) {
	console.log(meters)
	const [searchResults, setSearchResults] = useState(meters);
	const [filter, setFilter] = useState("All");
	const [filters, setFilters] = useState([
		{
			text: "All",
			value: "All",
			defaultSelected: true
		},
		{ text: "Electric", value: "ELECTRIC" },
		{ text: "Water", value: "WATER" }
	]);
	const [currentPage, setCurrentPage] = useState(0);
	// when filter or meters change, filter search results
	useEffect(() => {
		const results =
			filter === "All"
				? meters
				: meters.filter(meter => meter.description.includes(filter));
		setSearchResults(results);
	}, [filter, meters]);
	// on change update filter
	const handleChange = ({ target }) => setFilter(target.value);
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
			<h4>
				There are no
				{!filter || filter === "All"
					? " "
					: ` ${filter.toLowerCase()} `}
				meters to display.
			</h4>
		) : (
			searchResults
				.slice(index, index + itemCount)
				.map(meter => <MeterListItem meter={meter} key={meter.id} />)
		);
	// total number of pages
	const pageCount =
		!searchResults || searchResults.length <= 0
			? 0
			: Math.ceil(searchResults.length / itemCount);
	/* end pagination functionality */
	// wait for meters and display error if any
	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<DraggableHeader card={card} updateCards={updateCards} />
			<div id={`collapse${card.id}`} className='card-body collapse'>
				{errors && errors.meters ? (
					<ErrorMessage error={errors.meters} />
				) : !meters ? (
					<h4>No meters curently available</h4>
				) : (
					<div className='container-fluid'>
						<div className='flex-row-center mb-4'>
							{/* filter meters by type */}
							<MDBSelect
								data={filters}
								label='Filter Type'
								onValueChange={e =>
									handleChange({
										target: e
									})
								}
							/>
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
