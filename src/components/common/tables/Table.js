import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
// template for tables, requires item list, headers, and values to function
export default function Table({
	items,
	headers,
	values,
	isEditable,
	handleChange
}) {
	const [currentPage, setCurrentPage] = useState(0);

	// pagination functionality
	function handlePageClick({ selected: selectedPage }) {
		setCurrentPage(selectedPage);
	}
	// items per page
	const itemCount = 5;
	// starting index
	const index = currentPage * itemCount;
	// current items
	const currentPageData = items
		.slice(index, index + itemCount)
		.map(item => (
			<TableRow
				item={item}
				values={values}
				isEditable={isEditable}
				handleChange={handleChange}
				key={item.ActivityIndex}
			/>
		));
	// total number of pages
	const pageCount = Math.ceil(items.length / itemCount);
	// end pagination functionality
	return (
		<>
			<table className='table table-striped border text-center'>
				<TableHeader headers={headers} />
				<tbody>{currentPageData}</tbody>
			</table>
			{pageCount > 1 ? (
				<ReactPaginate
					previousLabel={"← Previous"}
					nextLabel={"Next →"}
					pageCount={pageCount}
					onPageChange={handlePageClick}
					containerClassName={"pagination"}
					previousLinkClassName={"pagination-prev"}
					nextLinkClassName={"pagination-next"}
					disabledClassName={"pagination-default"}
					activeClassName={"pagination-active"}
				/>
			) : null}
		</>
	);
}
