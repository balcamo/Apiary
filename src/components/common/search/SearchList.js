import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import SearchListItem from "./SearchListItem";

export default function SearchList({ options, search, type, setSearch }) {
	const [searchResults, setSearchResults] = useState();
	const [currentPage, setCurrentPage] = useState(0);
	// updates results as search and options change
	useEffect(() => {
		if (search && options) {
			setSearchResults(filterList(options));
		}
	}, [search, options]);

	const filterList = options => {
		const lowercaseOptions = options.map(option => {
			option.searchValue = option.searchValue.map(value =>
				value.toLowerCase()
			);
			return option;
		});
		// find options that match by value or result
		return lowercaseOptions.filter(option =>
			option.searchValue.some(value =>
				value.includes(search.toLowerCase())
			)
		);
	};
	// pagination functionality
	function handlePageClick({ selected: selectedPage }) {
		setCurrentPage(selectedPage);
	}
	// items per page
	const itemCount = 5;
	// starting index
	const index = currentPage * itemCount;
	// page display
	const currentPageData =
		// wait for options and search results
		// if no search results display message
		!options || !searchResults ? null : searchResults.length <= 0 ? (
			<h6>No results</h6>
		) : (
			searchResults
				.slice(index, index + itemCount)
				.map(result => (
					<SearchListItem
						key={result.searchIndex}
						index={result.searchIndex}
						title={result.searchResult}
						type={type}
						setSearch={setSearch}
					/>
				))
		);

	// total number of pages
	const pageCount = !searchResults
		? 0
		: Math.ceil(searchResults.length / itemCount);
	// end pagination functionality
	return (
		<div className='mt-2'>
			{currentPageData}
			{/* only display pagination if more than 1 page */}
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
	);
}
