import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { getWaterMeters } from "../../utils/api/arcgis";
import CardHeader from "../common/cards/CardHeader";
import LoadingSpinner from "../common/errors/LoadingSpinner";
import ErrorMessage from "../common/errors/ErrorMessage";
// import ActionButton from "../../../../common/buttons/ActionButton";

const columns = [
	{
		dataField: "MeterIndex",
		text: "Meter Num",
		sort: true
	},
	{
		dataField: "Reading",
		text: "Reading"
	},
	{
		dataField: "ReadingDate",
		text: "Reading Date",
		sort: true
	}
];

export default function WaterMeters({
	currentMeters,
	card,
	updateCards,
	tokens
}) {
	const [waterMeters, setWaterMeters] = useState(currentMeters);
	const [error, setError] = useState();

	useEffect(() => {
		const controller = new AbortController();

		if (!currentMeters) {
			getWaterMeters(tokens.arcgis, controller.signal)
				.then(setWaterMeters)
				.catch(setError);
		}
		return () => controller.abort();
	}, [tokens]);

	// const handleSubmit = () => {
	// 	const controller = new AbortController();

	// 	updateWaterMeters(waterMeters, tokens.springbrook, controller.signal)
	// 		.then(alert("Water meter reads sent successfully."))
	// 		.catch(err => console.log(err));

	// 	return () => controller.abort();
	// };

	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<CardHeader
				title='Water Meters'
				card={card}
				updateCards={updateCards}
			/>
			<div id={`collapse${card.id}`} className='card-body collapse'>
				<div className='container-fluid'>
					{/* <div className='d-flex align-self-start mb-2'>
						<ActionButton
							label='Update Springbrook'
							action={handleSubmit}
						/>
					</div> */}
					{error ? (
						<ErrorMessage error={error} />
					) : !waterMeters ? (
						<LoadingSpinner />
					) : (
						<div className='table-responsive'>
							<BootstrapTable
								keyField='MeterIndex'
								data={waterMeters}
								columns={columns}
								striped
								hover
								responsive
								pagination={paginationFactory()}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
