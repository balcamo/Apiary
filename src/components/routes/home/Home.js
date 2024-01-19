import React from "react";
import { MDBContainer, MDBIcon, MDBInput } from "mdb-react-ui-kit";
import CardToggle from "../../common/buttons/CardToggle";
import CustomerList from "../customers/CustomerList";
import LotList from "../lots/LotList";
import WorkOrderList from "../workOrders/WorkOrderList";

export default function Home({
	customers,
	workOrders,
	lots,
	search,
	setSearch,
	handleChange,
	cards,
	updateCards,
	errors,
	tokens
}) {
	return (
		<MDBContainer id='page-content' className='p-5' fluid>
			<div className='d-flex align-items-center justify-content-end mb-4'>
				<h1 className='w-50'>
					Apiary <b>Development</b>
				</h1>
				<div className='w-25 d-flex justify-content-end'>
					<CardToggle cards={cards} updateCards={updateCards} />
				</div>
			</div>

			{/* search bar */}
			<MDBInput
				id="main-search"
				wrapperClass='d-flex align-items-center bg-white'
				label='Search'
				type='text'
				value={search}
				onChange={handleChange}
				autoFocus
			>
				{/* if search has value display reset icon */}
				{search.length > 0 ? (
					<MDBIcon
						fas
						icon='times'
						className='icon-black me-2'
						onClick={() => setSearch("")}
					/>
				) : null}
			</MDBInput>

			{/* if search is longer than 3 characters display results */}
			{search.length >= 3 ? (
				<MDBContainer fluid>
					<CustomerList
						customers={customers}
						search={search}
						setSearch={setSearch}
						card={cards.customers}
						updateCards={updateCards}
						errors={errors}
					/>
					<LotList
						lots={lots}
						search={search}
						setSearch={setSearch}
						card={cards.lots}
						updateCards={updateCards}
						errors={errors}
					/>
					<WorkOrderList 
						workOrders={workOrders}
						search={search}
						setSearch={setSearch}
						card={cards.workOrders}
						updateCards={updateCards}
						errors={errors}
						tokens={tokens}
					/>
				</MDBContainer>
			) : null}
		</MDBContainer>
	);
}
