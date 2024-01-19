import React from "react";
import TitleHeader from "../../common/headers/TitleHeader";
// this class displays a card with meter details.
// all details for this are passed in through the meter param
export default function MeterListItem({ meter }) {
	console.log(meter)
	return (
		<div className='card sub-card' id={meter.index}>
			<TitleHeader
				// variable is mispelled in backend
				title={
					meter.description.includes("ELECTRIC")
						? "Electric"
						: "Water"
				}
				description={`(${meter.index})`}
				id={meter.index}
				status={meter.status}
			/>
			<div
				id={`collapse${meter.index}`}
				className='card-body collapse'
			>
				<div className='container-fluid'>
					<div className='d-flex justify-content-between align-items-center mb-2'>
						<div className='d-flex flex-column flex-lg-row flex-wrap align-items-lg-center'>
							<div className='flex-row-center me-3 mb-1 mb-lg-0'>
								<h6 className='me-1'>
									<b>Serial Number: </b>
								</h6>
								<p className='text-nowrap'>
									{meter.serialNumber}
								</p>
							</div>
							<div className='flex-row-center me-3 mb-1 mb-lg-0'>
								<h6 className='me-1'>
									<b>Model: </b>
								</h6>
								<p className='text-nowrap'>{meter.model}</p>
							</div>
							<div className='flex-row-center me-3 mb-1 mb-lg-0'>
								<h6 className='me-1'>
									<b>Manufacturer: </b>
								</h6>
								<p className='text-nowrap'>
									{meter.manufacturer}
								</p>
							</div>
							<div className='flex-row-center me-3 mb-1 mb-lg-0'>
								<h6 className='me-1'>
									<b>Installation Date: </b>
								</h6>
								<p className='text-nowrap'>
									{meter.installDate}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
