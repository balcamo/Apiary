import React, { useState } from "react";
import {
	MDBBtn,
	MDBCheckbox
} from "mdb-react-ui-kit";
import { Dropdown, DateRangePicker } from "rsuite";

export default function Sort({ sortBy, setSortBy, sortOrder, setSortOrder }) {
	const [selectedSortBy, setSelectedSortBy] = useState(sortBy);
	const [selectedSortOrder, setSelectedSortOrder] = useState(sortOrder);
	const [display, setDisplay] = useState(false);

	const handleSubmit = () => {
		setSortBy(selectedSortBy);
		setSortOrder(selectedSortOrder);
		setDisplay(false);
	};
	const toggleDisplay = () => setDisplay(!display);
	const toggleButton = ref => {
		return (
			<button
				ref={ref}
				className='btn btn-dark-blue'
				onClick={toggleDisplay}
			>
				Sort
			</button>
		);
	};
	return (
		<Dropdown
			// id='filter-dropdown'
			renderToggle={toggleButton}
			// title='Filter'
			style={{
				zIndex: "5",
				position: "absolute",
				display: "flex"
			}}
			open={display}
			noCaret
		>
			<div className='p-1' style={{ width: "18rem" }}>
				<div className='d-flex justify-content-end m-3 mb-0'>
					<MDBBtn type='submit' onClick={handleSubmit}>
						Apply
					</MDBBtn>
				</div>

				<div className='flex-row-center'>
					<div className='d-flex flex-column col-12 col-md-6'>
						<Dropdown.Item panel className='text-center m-1'>
							Sort By
						</Dropdown.Item>
					</div>
					<div className='d-flex flex-column col-12 col-md-6'>
						<Dropdown.Item panel className='text-center m-1'>
							Order
						</Dropdown.Item>
					</div>
				</div>
			</div>
		</Dropdown>
	);
}
