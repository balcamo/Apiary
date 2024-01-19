import React, { useState } from "react";
import { MDBBtn, MDBCheckbox } from "mdb-react-ui-kit";
import {
	Dropdown,
	DateRangePicker,
	RadioGroup,
	Radio,
	SelectPicker
} from "rsuite";

export default function Filter({
	sortBy,
	setSortBy,
	sortOrder,
	setSortOrder,
	statuses,
	types,
	setStatusFilters,
	setTypeFilters,
	setRequestDates,
	setServiceDates
}) {
	const [selectedSortBy, setSelectedSortBy] = useState(sortBy);
	const [selectedSortOrder, setSelectedSortOrder] = useState(sortOrder);
	const [selectedStatuses, setSelectedStatuses] = useState();
	const [selectedTypes, setSelectedTypes] = useState();
	const [selectedServiceDates, setSelectedServiceDates] = useState();
	const [selectedRequestDates, setSelectedRequestDates] = useState();
	const [display, setDisplay] = useState(false);
	const handleFilter = ({ target }) => {
		// if selected, add to filter array
		if (target.name === "status") {
			if (selectedStatuses) {
				if (selectedStatuses.includes(target.value)) {
					const statusList = selectedStatuses.filter(
						selectedStatus => {
							// only return filters that don't match
							return selectedStatus !== target.value;
						}
					);
					setSelectedStatuses(statusList);
				}
				// if deselected, remap filter array
				else {
					const statusList = [...selectedStatuses, target.value];
					setSelectedStatuses(statusList);
				}
			} else setSelectedStatuses([target.value]);
		}
		if (target.name === "type") {
			if (selectedTypes) {
				if (selectedTypes.includes(target.value)) {
					const typeList = selectedTypes.filter(selectedType => {
						// only return filters that don't match
						return selectedType !== target.value;
					});
					setSelectedTypes(typeList);
				}
				// if deselected, remap filter array
				else {
					const typeList = [...selectedTypes, target.value];
					setSelectedTypes(typeList);
				}
			} else setSelectedTypes([target.value]);
		}
	};
	const toggleDisplay = () => setDisplay(!display);
	const clearForm = e => {
		console.log(e);
		setSelectedSortOrder("Descending");
		setSelectedSortBy("Request Number");
		setSelectedStatuses();
		setSelectedTypes();
		setSelectedRequestDates([]);
		setSelectedServiceDates([]);
	};
	const handleSubmit = () => {
		setSortOrder(selectedSortOrder);
		setSortBy(selectedSortBy);
		setStatusFilters(selectedStatuses);
		setTypeFilters(selectedTypes);
		setServiceDates(selectedServiceDates);
		setRequestDates(selectedRequestDates);
		setDisplay(false);
	};
	const sortByOptions = ["Service Date", "Request Number"].map(item => ({
		label: item,
		value: item
	}));
	const sortOrderOptions = ["Ascending", "Descending"].map(item => ({
		label: item,
		value: item
	}));

	const statusOptions = statuses.map(status => (
		<div className='d-flex justify-content-center w-50 px-1'>
			<MDBCheckbox
				value={status.value}
				id='flexCheckDefault'
				name='status'
				checked={
					!selectedStatuses
						? false
						: selectedStatuses.includes(status.value)
				}
				onClick={handleFilter}
			/>
			<p className='w-75'>{status.text}</p>
		</div>
	));
	const typeOptions = types.map(type => (
		<div className='d-flex justify-content-center w-50 px-1'>
			<MDBCheckbox
				value={type.text}
				id='flexCheckDefault'
				name='type'
				checked={
					!selectedTypes ? false : selectedTypes.includes(type.text)
				}
				onClick={handleFilter}
			/>
			<p className='w-75'>{type.text}</p>
		</div>
	));
	const toggleButton = ref => {
		return (
			<button
				ref={ref}
				className='btn btn-dark-blue'
				onClick={toggleDisplay}
			>
				Filter
			</button>
		);
	};
	console.log(display);
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
				<div className='d-flex justify-content-between m-3 mb-0'>
					<MDBBtn id='formReset' onClick={clearForm}>
						Clear
					</MDBBtn>
					<MDBBtn type='submit' onClick={handleSubmit}>
						Apply
					</MDBBtn>
				</div>
				<div className='flex-row-center'>
					<div className='d-flex flex-column col-12 mb-1'>
						<Dropdown.Item panel className='text-center m-1 mb-0'>
							Sort By
						</Dropdown.Item>
						<RadioGroup
							inline
							className='justify-content-around'
							value={selectedSortOrder}
							onChange={setSelectedSortOrder}
						>
							<Radio value='Ascending'>Ascending</Radio>
							<Radio value='Descending'>Descending</Radio>
						</RadioGroup>
						<SelectPicker
							value={selectedSortBy}
							data={sortByOptions}
							searchable={false}
							onChange={setSelectedSortBy}
						/>
					</div>
				</div>
				<Dropdown.Item panel className='text-center m-1'>
					Statuses
				</Dropdown.Item>
				<div className='d-flex flex-wrap'>{statusOptions}</div>
				<Dropdown.Item panel header className='text-center m-1'>
					Types
				</Dropdown.Item>
				<div className='d-flex flex-wrap'>{typeOptions}</div>
				<Dropdown.Item panel header className='text-center m-1'>
					Request Date
				</Dropdown.Item>

				<DateRangePicker
					appearance='default'
					placement='auto'
					placeholder='Select Dates'
					className='w-100'
					style={{ zIndex: "9" }}
					onChange={setSelectedRequestDates}
					value={selectedRequestDates}
				/>

				<Dropdown.Item panel header className='text-center m-1'>
					Service Date
				</Dropdown.Item>
				<DateRangePicker
					appearance='default'
					placement='auto'
					placeholder='Select Dates'
					className='w-100'
					onChange={setSelectedServiceDates}
					value={selectedServiceDates}
				/>
			</div>
		</Dropdown>
	);
}
