import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBarItem from "./SearchBarItem";
import LoadingSpinner from "../errors/LoadingSpinner";

export default function SearchBar({
	customers,
	lots,
	search,
	setSearch,
	handleChange
}) {
	const navigate = useNavigate();
	const [suggestions, setSuggestions] = useState();
	// updates search suggestions as input changes and data loads
	useEffect(() => {
		// wait for customers
		if (customers && lots) {
			// find first 3 customers that match by name or index
			const foundCustomers = filterList(customers).slice(0, 2);
			const foundLots = filterList(lots).slice(0, 2);
			// only overwrites the corresponding suggestions, if any
			setSuggestions({
				...suggestions,
				customers: foundCustomers,
				lots: foundLots
			});
		}
	}, [search, customers]);

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

	return (
		<div className='container-fluid py-1 px-2'>
			<div id='search-bar' className='flex-row-center'>
				<input
					className='form-control'
					type='text'
					placeholder='Enter a search'
					onChange={handleChange}
					value={search}
				/>
			</div>
			{/* only display if user has entered a search term*/}
			{search.length >= 3 ? (
				<div id='search-dropdown' className='dropdown'>
					<ul className='dropdown-menu show d-flex flex-column'>
						{/* only display if there are suggestions */}
						{!suggestions ? (
							<LoadingSpinner />
						) : (
							<>
								{suggestions.customers &&
								suggestions.customers.length > 0 ? (
									<>
										<li className='text-center'>
											<h6 className='dropdown-header'>
												Customers
											</h6>
										</li>
										{suggestions.customers.map(customer => (
											<SearchBarItem
												key={customer.searchIndex}
												index={customer.searchIndex}
												title={customer.searchResult}
												type='customer'
												setSearch={setSearch}
											/>
										))}
									</>
								) : null}
								{suggestions.lots &&
								suggestions.lots.length > 0 ? (
									<>
										<li className='text-center'>
											<h6 className='dropdown-header'>
												Lots
											</h6>
										</li>
										{suggestions.lots.map(lot => (
											<SearchBarItem
												key={lot.searchIndex}
												index={lot.searchIndex}
												title={lot.searchResult}
												type='lot'
												setSearch={setSearch}
											/>
										))}
									</>
								) : null}
								<li
									className='dropdown-item text-center'
									onClick={() => navigate(`/`)}
								>
									<h6>Show More</h6>
								</li>
							</>
						)}
					</ul>
				</div>
			) : null}
		</div>
	);
}
