import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { getSpringbrookDisconnects } from "../../utils/api/springbrook";
import {
	updateDisconnect,
	getDisconnects,
	clearDisconnects
} from "../../utils/api/arcgis";
import ActionButton from "../common/buttons/ActionButton";
import LinkButton from "../common/buttons/LinkButton";
import LoadingSpinner from "../common/errors/LoadingSpinner";
import CardHeader from "../common/cards/CardHeader";
import ErrorMessage from "../common/errors/ErrorMessage";

const columns = [
	{
		dataField: "cust_name",
		text: "Name",
		sort: true
	},
	{
		dataField: "ADDRESS",
		text: "Address"
	},
	{
		dataField: "MeterIndex",
		text: "Meter #",
		sort: true
	},
	{
		dataField: "total_amount_due",
		text: "Balance",
		sort: true
	},
	{
		dataField: "UbAccountIndex",
		text: "UB Account",
		sort: true
	}
];

export default function Disconnects({ card, updateCards, tokens }) {
	const [disconnects, setDisconnects] = useState();
	const [loading, setLoading] = useState();
	const [alert, setAlert] = useState();
	const [init, setInit] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		const controller = new AbortController();
		// loads disconnects from Esri each time the tokens change
		setAlert("loading...");
		getDisconnects(tokens.arcgis, controller.signal)
			.then(setDisconnects)
			.catch(setError);

		return () => controller.abort();
	}, [tokens]);

	useEffect(() => {
		const controller = new AbortController();
		// prevent from running on page load by checking loading variable
		if (loading === true) {
			// clear esri if indicated and update disconnects
			if (init === true) {
				setAlert("clearing Esri...");
				clearDisconnects(tokens.arcgis, controller.signal)
					.then(() => handleUpdate(controller.signal))
					.catch(setError);
			} else handleUpdate(controller.signal).catch(setError);
		}

		return () => controller.abort();
	}, [loading]);

	const handleUpdate = async signal => {
		setAlert("loading Springbrook...");
		getSpringbrookDisconnects(tokens.springbrook, signal)
			.then(disconnects => {
				setAlert("updating Esri...");
				return disconnects;
			})
			.then(disconnects => updateDisconnects(disconnects, signal))
			.then(() => {
				setAlert("loading Esri...");
				return getDisconnects(tokens.arcgis, signal);
			})
			.then(disconnects => {
				setDisconnects(disconnects);
				// reset default values
				setLoading(false);
				setAlert();
				setInit(false);
			})
			.catch(setError);
	};

	const updateDisconnects = (disconnects, signal) => {
		// iterate through disconnects
		disconnects.forEach(disconnect => {
			// format disconnect for Esri
			const formattedDisconnect = { meters: [disconnect] };
			// send to Esri
			updateDisconnect(formattedDisconnect, tokens.arcgis, signal);
		});
	};

	const toggleLoading = () => {
		// triggers useEffect
		return window.confirm(
			"Are you sure you want to clear the map? This can't be undone."
		)
			? setLoading(true)
			: null;
	};

	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<CardHeader
				title='Disconnects'
				card={card}
				updateCards={updateCards}
			/>
			<div id={`collapse${card.id}`} className='card-body collapse'>
				<div className='container-fluid'>
					<div className='d-flex align-self-start mb-2'>
						<ActionButton
							label='Initialize Map'
							action={() => {
								setInit(true);
								toggleLoading(true);
							}}
						/>
						<ActionButton
							label='Refresh Map'
							action={() => toggleLoading()}
						/>
						<LinkButton
							options={{
								href: "arcgis-collector://?itemID=3b603af45ac34d0091ea9c011fe230d7",
								title: "Open Collector"
							}}
						/>
					</div>
					{error ? (
						<ErrorMessage error={error} />
					) : !disconnects || loading === true ? (
						<LoadingSpinner alert={alert} />
					) : disconnects.length <= 0 ? (
						<h4>Please initialize the map</h4>
					) : (
						<div className='table-responsive'>
							<BootstrapTable
								keyField='MeterIndex'
								data={disconnects}
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
