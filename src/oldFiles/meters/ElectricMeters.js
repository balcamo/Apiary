// waiting for new funcitonality

// import React, { useState, useEffect } from "react";
// // import SubmitButton from "../../common/buttons/SubmitButton";
// import LoadingSpinner from "../../../common/errors/LoadingSpinner";
// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import {
// 	getBillingCycles,
// 	getMetersForCycle,
// 	getCommandCenterMeters,
// 	getMasterMeters
// } from "../../../../utils/api/springbrook";
// import { getElectricMeters } from "../../../../utils/api/icomms";
// import ActionButton from "../../../common/buttons/ActionButton";

// export default function ElectricMeters({ tokens }) {
// 	const [billingCycles, setBillingCycles] = useState();
// 	const [selectedCycle, setSelectedCycle] = useState();
// 	const [electricMeters, setElectricMeters] = useState();
// 	const [commandCenterMeters, setCommandCenterMeters] = useState();
// 	const [masterMeters, setMasterMeters] = useState();

// 	useEffect(() => {
// 		const controller = new AbortController();

// 		getBillingCycles(tokens.springbrook, controller.signal)
// 			.then(cycles => {
// 				setBillingCycles(cycles);
// 				setSelectedCycle(cycles[0]);
// 			})
// 			.then(() => getElectricMeters(tokens.icomms, controller.signal))
// 			.then(electricMeters =>
// 				getMetersForCycle(
// 					electricMeters,
// 					selectedCycle,
// 					tokens.springbrook,
// 					controller.signal
// 				)
// 			)
// 			.then(setElectricMeters);
// 		getCommandCenterMeters(tokens.springbrook, controller.signal).then(
// 			setCommandCenterMeters
// 		);
// 		getMasterMeters(tokens.springbrook, controller.signal)
// 			.then(setMasterMeters)
// 			.catch(err => console.log(err.errorMessage));

// 		return () => controller.abort();
// 	}, [tokens]);

// 	const columns = [
// 		{
// 			dataField: "MeterIndex",
// 			text: "Meter Num",
// 			sort: true
// 		},
// 		{
// 			dataField: "Reading",
// 			text: "Reading"
// 		},
// 		{
// 			dataField: "ReadingDate",
// 			text: "Reading Date",
// 			sort: true
// 		}
// 	];

// 	return !electricMeters ? (
// 		<LoadingSpinner />
// 	) : (
// 		<div className='d-flex flex-column align-items-center'>
// 			<div className='d-flex align-self-start mb-2'>
// 				{/* <ActionButton
// 					label='Update Springbrook'
// 					action={handleSubmit}
// 				/> */}
// 			</div>
// 			{console.log(electricMeters, commandCenterMeters, masterMeters)}
// 			<div className='table-responsive'>
// 				<BootstrapTable
// 					keyField='MeterIndex'
// 					data={electricMeters}
// 					columns={columns}
// 					striped
// 					hover
// 					responsive
// 					pagination={paginationFactory()}
// 				/>
// 			</div>
// 		</div>
// 	);
// 	// const handleSubmit = () => {
// 	// 	const controller = new AbortController();

// 	// 	updateWaterMeters(waterMeters, tokens.springbrook, controller.signal)
// 	// 		.then(alert("Water meter reads sent successfully."))
// 	// 		.catch(err => console.log(err));

// 	// 	return () => controller.abort();
// 	// };
// }
