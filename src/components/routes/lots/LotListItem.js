import React from "react";
import TitleHeader from "../../common/headers/TitleHeader";

// this class displays a card with lot details. it is the display when a lot
// from the serach is selected. all details for this are passed in through the lot param
export default function LotListItem({ lot }) {
	return (
		<div className='card main-card' id={lot.index}>
			<TitleHeader
				// variable is mispelled in backend
				title={`Lot #${lot.index}`}
				id={lot.sid}
			/>
			<div
				id={`collapse${lot.index}`}
				className='card-body collapse show'
			>
				<div className='container-fluid'>
					<div className='d-flex justify-content-between align-items-center mb-2'>
						<div className='d-flex flex-wrap align-items-lg-center'>
							<div className='flex-row-center me-3 mb-1 mb-lg-0'>
								<h6 className='me-1'>
									<b>Type: </b>
								</h6>
								<p className='text-nowrap'>{lot.LotType}</p>
							</div>

							<div className='flex-row-center me-2'>
								<h6 className='text-nowrap text-start me-1'>
									<b>Address:</b>
								</h6>

								<div className='d-flex flex-wrap align-items-start'>									
									<p className='text-nowrap'>{`${lot.serviceAddress}`}
										{lot.Address2 ? <>{`${lot.serviceAddress2}`}</> : ''}
										{`${lot.serviceCity} ${lot.serviceState}, ${lot.serviceZip}`}</p>
								</div>
							</div>
						</div>
						<div
							className='position-absolute'
							style={{ top: "3.5rem", right: "1rem" }}
						>
							<h6
								// change text color based on status
								className={
									lot.Status === "Active"
										? "text-green"
										: lot.Status === "Former"
										? "text-red"
										: "text-gray"
								}
							>
								{lot.status}
							</h6>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
