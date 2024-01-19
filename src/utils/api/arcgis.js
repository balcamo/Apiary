import { fetchJson, assignHeaders } from ".";

const baseURL = process.env.REACT_APP_ARCGIS_URL;

export const createArcGISRequest = async (serviceRequest, token, signal) => {
	const url = new URL(`${baseURL}/ServiceRequest/Create`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(serviceRequest),
		signal
	};
	const defaultError = "Failed to create service request in ArcGIS."

	return await fetchJson(url, options, {}, defaultError);
};

export const updateArcGISRequest = async (serviceRequest, token, signal) => {
	console.log(serviceRequest)
	const url = new URL(`${baseURL}/ServiceRequest/Update`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(serviceRequest),
		signal
	};
	const defaultError = "Failed to update service request in ArcGIS."

	return await fetchJson(url, options, {}, defaultError);
}

export const deleteArcGISRequest = async (serviceRequest, token, signal) => {
	const url = new URL(`${baseURL}/ServiceRequest/Delete`);
	const headers = assignHeaders(token);
	const options = {
		method: "DELETE",
		headers,
		body: JSON.stringify(serviceRequest),
		signal
	};
	const defaultError = "Failed to delete service request in ArcGIS."

	return await fetchJson(url, options, {}, defaultError);
}

export const createMeterPoint = async(meter, token, signal) => {
	const url = new URL(`${baseURL}/ServiceRequest/UpdateMeter`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(meter),
		signal
	};
	const defaultError = "Failed to add meters to ArcGIS map."

	return await fetchJson(url, options, {}, defaultError);
}
