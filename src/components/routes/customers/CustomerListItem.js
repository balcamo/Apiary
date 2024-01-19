import React from "react";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../common/headers/TitleHeader";
// this class displays a card with customer details. it is the display when a customer
// from the serach is selected. all details for this are passed in through the customer param
export default function CustomerListItem({ customer, display }) {
	const navigate = useNavigate();

	return (
		// this section displays the options for the serch list
		<div
			className={`card ${display ? "main-card" : "sub-card"}`}
			// on click clear search and go to result
			onClick={() => {!display ? navigate(`/customer/${customer.sid}`):console.log(display)}}
		>
			<TitleHeader
				title={`${customer.firstName ? `${customer.firstName} ` : ""}${
					customer.lastName
				}`}
				description={`(${customer.index})`}
				id={customer.index}
				status={customer.status}
			/>

			{/* this section displays the customer details card */}
			{display ? (
				<div
					id={`collapse${customer.index}`}
					className='card-body collapse show'
				>
					<div className='container-fluid'>
						<div className='d-flex align-items-center mb-2'>
							<div className='flex-row-center me-2'>
								<h6 className='text-nowrap text-start me-1'>
									<b>Mailing Address:</b>
								</h6>

								<div className='d-flex flex-wrap align-items-start'>
									<p className='text-nowrap'>
										{`${customer.mailingAddress}`}
										{customer.mailingAddress2 ? <>{` ${customer.mailingAddress2}`}</> : ''}
										{` ${customer.mailingCity} ${customer.mailingState}, ${customer.mailingZip}`}
									</p>
								</div>
							</div>
						</div>
						<div className='flex-row-center flex-wrap me-5'>
							<div className='flex-row-center me-3'>
								<span className='badge bg-lt-blue me-2'>
									Home
								</span>
								<p className='me-2'>
									{customer.contactInformation.homePhone
										? customer.contactInformation.homePhone
										: "none"}
								</p>
								{customer.contactInformation.homeExtension ? (
									<h6 className='me-2'>
										<b>Ext: </b>
										{customer.contactInformation.homeExtension}
									</h6>
								) : null}
							</div>
							<div className='flex-row-center me-3'>
								<span className='badge bg-lt-blue me-2'>
									Mobile
								</span>
								<p>
									{customer.contactInformation.mobilePhone
										? customer.contactInformation.mobilePhone
										: "none"}
								</p>
							</div>
							<div className='flex-row-center'>
								<span className='badge bg-lt-blue me-2'>
									Work
								</span>
								<p className='me-2'>
									{customer.contactInformation.busPhone
										? customer.contactInformation.busPhone
										: "none"}
								</p>
								{customer.contactInformation.busExtension ? (
									<h6 className='me-2'>
										<b>Ext: </b>
										{customer.contactInformation.busExtension}
									</h6>
								) : null}
							</div>
							<div className='flex-row-center'>
								<span className='badge bg-lt-blue me-2'>
									Email
								</span>
								<p className='me-2'>
									{customer.contactInformation.email
										? customer.contactInformation.email
										: "none"}
								</p>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
