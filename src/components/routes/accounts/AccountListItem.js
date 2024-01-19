import React from "react";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../common/headers/TitleHeader";

export default function AccountListItem({ account, display }) {
	const navigate = useNavigate();

	return (
		//display account header for list
		<div
			className={`card ${display ? "main-card" : "sub-card"}`}
			// on click clear search and go to result
			onClick={() => {!display ? navigate(`/account/${account.sid}`):console.log(display)}}
		>
			<TitleHeader
				title={`${account.serviceAddress}${
					account.serviceAddress2
						? `, ${account.serviceAddress2}`
						: ''
				}`}
				description={`(${account.index})`}
				id={account.index}
				status={account.status}
				
			/>
			{display ? (
				// display account details
				<div
					id={`collapse${account.index}`}
					className='card-body collapse show'
				>
					<div className='container-fluid'>
						<div className='flex-row-center flex-wrap me-5'>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Type:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									{account.ubAccountType}
								</p>
							</div>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Billing Cycle:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									{account.billingCycle}
								</p>
							</div>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Next Billing Date:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									{account.nextBillDate}
								</p>
							</div>
						</div>

						<div className='flex-row-center flex-wrap me-5'>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Balance:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									{account.balance}
								</p>
							</div>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Last Payment:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									${account.lastPaymentAmount}
								</p>
							</div>
							<div className='flex-row-center me-3'>
								<h6 className='text-sm-nowrap text-start me-2'>
									<b>Last Payment Date:</b>
								</h6>
								<p className='me-1 text-nowrap'>
									{account.lastPaymentDate}
								</p>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
