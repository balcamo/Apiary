import React, { useState, useEffect } from "react";
import { getLabor } from "../../../../../utils/api/cityworks";
import CardHeader from "../../../../common/cards/CardHeader";
import Table from "../../../../common/tables/Table";
import LoadingSpinner from "../../../../common/errors/LoadingSpinner";
import ErrorMessage from "../../../../common/errors/ErrorMessage";

export default function Labor({ workOrder, tokens }) {
	const [labor, setLabor] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	// load labor when card is opened
	useEffect(() => {
		if (loading) {
			const controller = new AbortController();

			setError();
			getLabor(workOrder.WorkOrderIndex, tokens.cityworks, controller.signal)
				.then(response => {
					setLabor(response);
					setLoading(null);
				})
				.catch(setError);

			return () => controller.abort();
		}
	}, [loading]);

	const toggleLoading = () => {
		setLoading(true);
	};
	// display error if any. otherwise, wait for labor before displaying.
	return (
		<div className='card sub-card'>
			<CardHeader
				title='Labor'
				id={`${workOrder.WorkOrderIndex}-Labor`}
				toggleLoading={toggleLoading}
			/>
			<div
				id={`collapse${workOrder.WorkOrderIndex}-Labor`}
				className='card-body justify-content-center collapse'
			>
				{error ? (
					<ErrorMessage error={error} />
				) : !labor || loading === true ? (
					<LoadingSpinner />
				) : labor.length <= 0 ? (
					<p className='mb-0'>There is no labor data to display.</p>
				) : (
					<Table
						items={labor}
						headers={[
							"Worker",
							"Hours",
							"Start Date",
							"End Date",
							"GL Account"
						]}
						values={[
							"name",
							"activityHours",
							"startDate",
							"endDate",
							"GLIndex"
						]}
					/>
				)}
			</div>
		</div>
	);
}
