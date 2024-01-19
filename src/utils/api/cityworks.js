import { fetchJson, assignHeaders } from ".";

const baseURL = process.env.REACT_APP_CITYWORKS_URL;

// returns all employees
export const getEmployees = async (token, signal) => {
	const url = new URL(`${baseURL}/Employee/All`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};
// returns service order status options
export const getStatuses = async (token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/Status`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};
// returns service order departments options
export const getDepartments = async (token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/Departments`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};
// returns work orders based on the filter params
export const getWorkOrdersByFilter = async (filters, token, signal)=>{
	const url = new URL(`${baseURL}/WorkOrder/ByFilter`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(filters),
		signal
	};

	return await fetchJson(url, options, {});
};
// returns all work orders
export const getWorkOrders = async (token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/All`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	const workOrders = await fetchJson(url, options, []);

	return sortWorkOrdersBySid(workOrders);
};
// returns Work order sids for a search
export const getWorkOrderSids = async (token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/SearchSids`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);

};
// returns work order for specified WorkOrderIndex
export const getWorkOrderBySid = async (workOrderSid, token, signal) => {
	const url = new URL(
		`${baseURL}/WorkOrder/BySid?workOrderSid=${workOrderSid}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};
// returns all labor for specified WorkOrderIndex
export const getLabor = async (workOrderIndex, token, signal) => {
	const url = new URL(
		`${baseURL}/WorkOrder/Labor?workOrderSid=${workOrderIndex}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};

// Gets labor of a specific employee for a specific date
export const getEmployeeLaborByDate = async (date, email, token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/LaborByEmployee?email=${email}&timeDate=${date}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};
//Update the labor of an individual for a given date takes in an array of labor entries
export const updateLabor = async (updatedMaterial, token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/UpdateLabors`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(updatedMaterial),
		signal
	};

	return await fetchJson(url, options, {});
};

// returns all materials for specified WorkOrderIndex
export const getMaterials = async (workOrderIndex, token, signal) => {
	const url = new URL(
		`${baseURL}/WorkOrder/Material?workOrderSid=${workOrderIndex}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};

export const updateMaterial = async (updatedMaterial, token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/UpdateMaterial`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(updatedMaterial),
		signal
	};

	return await fetchJson(url, options, {});
};

// returns all equipment for specified WorkOrderIndex
export const getEquipment = async (workOrderIndex, token, signal) => {
	const url = new URL(
		`${baseURL}/WorkOrder/Equipment?workOrderSid=${workOrderIndex}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};

	return await fetchJson(url, options, []);
};

// updates specified work order
export const updateWorkOrder = async (updatedWorkOrder, token, signal) => {
	const url = new URL(`${baseURL}/WorkOrder/Update`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(updatedWorkOrder),
		signal
	};

	return await fetchJson(url, options, {});
};

// sort results by ID
export const sortWorkOrdersBySid = array => {
	console.log(array);
	return array.sort(
		(valueA, valueB) => valueA.WorkOrderIndex - valueB.WorkOrderIndex
	);
};
