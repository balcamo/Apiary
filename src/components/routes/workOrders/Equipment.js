import React, { useState, useEffect } from "react";
import { getEquipment } from "../../../../../utils/api/cityworks";
import CardHeader from "../../../../common/cards/CardHeader";
import Table from "../../../../common/tables/Table";
import LoadingSpinner from "../../../../common/errors/LoadingSpinner";
import ErrorMessage from "../../../../common/errors/ErrorMessage";

export default function Equipment({ workOrder, tokens }) {
	const [equipment, setEquipment] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	// load equipment when card is opened
	useEffect(() => {
		if (loading) {
			const controller = new AbortController();

			setError(null);
			getEquipment(workOrder.WorkOrderIndex, tokens.cityworks, controller.signal)
				.then(response => {
					setEquipment(response);
					setLoading(null);
				})
				.catch(setError);

			return () => controller.abort();
		}
	}, [loading]);

	const toggleLoading = () => {
		setLoading(true);
	};
	// display error if any. otherwise, wait for equipment before displaying.
	return (
		<div className='card sub-card'>
			<CardHeader
				title='Equipment'
				id={`${workOrder.WorkOrderIndex}-Equipment`}
				toggleLoading={toggleLoading}
			/>
			<div
				id={`collapse${workOrder.WorkOrderIndex}-Equipment`}
				className='card-body justify-content-center collapse'
			>
				{error ? (
					<ErrorMessage error={error} />
				) : !equipment || loading === true ? (
					<LoadingSpinner />
				) : equipment.length <= 0 ? (
					<p className='mb-0'>
						There is no equipment data to display.
					</p>
				) : (
					<Table
						items={equipment}
						headers={[
							"Item ID",
							"Description",
							"Units",
							"Total Amount"
						]}
						values={[
							"itemId",
							"description",
							"activityUnits",
							"activityAmount"
						]}
					/>
				)}
			</div>
		</div>
	);
}
