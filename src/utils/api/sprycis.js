import { fetchJson, assignHeaders } from ".";

const baseURL = process.env.REACT_APP_SPRYCIS_URL;

/* ACCOUNT */
export const getAccountBySid = async (AccountSid, token, signal) => {
	const url = new URL(`${baseURL}/Account/BySid?accountSid=${AccountSid}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load account from SpryCIS.";

	return await fetchJson(url, options, {}, defaultError);
};

export const getAccountsByCustomerSid = async (CustomerSid, token, signal) => {
	const url = new URL(
		`${baseURL}/Account/ByCustomerSid?customerSid=${CustomerSid}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load accounts from SpryCIS.";

	const accounts = await fetchJson(url, options, [], defaultError);
	return await sortAccountsBySid(accounts);
};

export const getAccountsByLotSid = async (LotIndex, token, signal) => {
	const url = new URL(`${baseURL}/Account/ByLotSid?lotSid=${LotIndex}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load accounts from SpryCIS.";

	return await fetchJson(url, options, [], defaultError);
};

/* CUSTOMERS */

export const getCustomers = async (token, signal) => {
	const url = new URL(`${baseURL}/Search/Person`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load customers from SpryCIS.";
	
	return await fetchJson(url, options, [], defaultError);
};

export const getCustomersByAccountSid = async (AccountSid, token, signal) => {
	const url = new URL(`${baseURL}/Customer/ByUbAccount?index=${AccountSid}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load customers from SpryCIS.";
	const customers = await fetchJson(url, options, [], defaultError);
	const sortedCustomers = await sortCustomersBySid(customers);
	return await formatZipAndPhone(sortedCustomers);
};

export const getCustomerByCustomerSid = async (CustomerSid, token, signal) => {

	const url = new URL(`${baseURL}/Customer/ByIndex?index=${CustomerSid}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load customer from SpryCIS.";
	const object = await fetchJson(url, options, {}, defaultError);
	return await formatZipAndPhone(object);
};

/* LOT */
// returns lot search options
export const getLots = async (token, signal) => {
	console.log("in the api call for lots")
	const url = new URL(`${baseURL}/Search/Place`);
	console.log(url)
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load lots from SpryCIS.";
	
	return await fetchJson(url, options, [], defaultError);
};
// returns data for specified CustomerSid
export const getLotByLotSid = async (LotSid, token, signal) => {
	const url = new URL(`${baseURL}/Premise/ByIndex?index=${LotSid}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load lot from SpryCIS.";

	const object = await fetchJson(url, options, {}, defaultError);
	return await formatZipAndPhone(object);
};

/* METERS */
// returns meters for specified AccountSid
export const getMetersByLotSid = async (AccountSid, token, signal) => {
	const url = new URL(`${baseURL}/Meter/ByLotIndex?index=${AccountSid}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load meters from SpryCIS.";

	return await fetchJson(url, options, [], defaultError);
};

export const createMeterRead = async (meterRead, token, signal) => {
	const url = new URL(`${baseURL}/Meter/CreateReading`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(meterRead),
		signal
	};
	const defaultError = "Failed to create meter read in SpryCIS.";

	return await fetchJson(url, options, {}, defaultError);
};

/* SERVICE REQUESTS */
// returns all service orders
export const getServiceRequests = async (token, signal) => {
	const url = new URL(`${baseURL}/ServiceOrder/All`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load service requests from SpryCIS.";
	 
	const requests = await fetchJson(url, options, [], defaultError);
	return await sortRequestsBySid(requests)
};

// returns service orders for specified AccountSid
export const getServiceRequestsByAccountSid = async (
	AccountSid,
	token,
	signal
) => {
	const url = new URL(
		`${baseURL}/ServiceOrder/ByAccount?index=${AccountSid}`
	);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load service requests from SpryCIS.";

	const requests = await fetchJson(url, options, [], defaultError);
	return await sortRequestsBySid(requests);
};

// returns service order statuses
export const getServiceRequestStatuses = async (token, signal) => {
	const url = new URL(`${baseURL}/ServiceOrder/Status`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load statuses from SpryCIS.";

	return await fetchJson(url, options, [], defaultError);
};

// returns service order types
export const getServiceRequestTypes = async (token, signal) => {
	const url = new URL(`${baseURL}/ServiceOrder/Types`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load types from SpryCIS.";

	return await fetchJson(url, options, [], defaultError);
};

export const getSkipReasons = async (token, signal) => {
	const url = new URL(`${baseURL}/Meter/SkipReasons`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load skip reasons from SpryCIS.";
	return await fetchJson(url, options, [], defaultError);
};

// create a new service request
export const createSpryCISRequest = async (serviceRequest, token, signal) => {
	const url = new URL(`${baseURL}/ServiceOrder/Create`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(serviceRequest),
		signal
	};
	const defaultError = "Failed to create service request in SpryCIS.";

	return await fetchJson(url, options, {}, defaultError);
};

// update an existing service request
export const updateSpryCISRequest = async (serviceRequest, token, signal) => {
	const url = new URL(`${baseURL}/ServiceOrder/Update`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
		body: JSON.stringify(serviceRequest),
		signal
	};
	const defaultError = "Failed to update service request in SpryCIS.";

	return await fetchJson(url, options, {}, defaultError);
};

/* FORMATTING */
const formatZipAndPhone = object => {
	if (object.zip && object.zip.length > 5) {
		const firstHalf = object.zip.slice(0, 5);
		const secondHalf = object.zip.slice(5, object.zip.length);
		object.zip = `${firstHalf}-${secondHalf}`;
	}
	if (object.Zip && object.Zip.length > 5) {
		const firstHalf = object.Zip.slice(0, 5);
		const secondHalf = object.Zip.slice(5, object.Zip.length);
		object.Zip = `${firstHalf}-${secondHalf}`;
	}
	if (object.homePhone && object.homePhone) {
		const beginning = object.homePhone.slice(2, 5);
		const middle = object.homePhone.slice(5, 8);
		const end = object.homePhone.slice(8, object.homePhone.length);
		object.homePhone = `(${beginning}) ${middle}-${end}`;
	}
	if (object.cellPhone & object.cellPhone) {
		const beginning = object.cellPhone.slice(2, 5);
		const middle = object.cellPhone.slice(5, 8);
		const end = object.cellPhone.slice(8, object.cellPhone.length);
		object.cellPhone = `(${beginning}) ${middle}-${end}`;
	}
	if (object.busPhone && object.busPhone) {
		const beginning = object.busPhone.slice(2, 5);
		const middle = object.busPhone.slice(5, 8);
		const end = object.busPhone.slice(8, object.busPhone.length);
		object.busPhone = `(${beginning}) ${middle}-${end}`;
	}
	return object;
};

// sort results by Sid
const sortAccountsBySid = array => {
	return array.sort(
		(valueA, valueB) =>
			valueB.ubAccountNumber.substring(1) -
			valueA.ubAccountNumber.substring(1)
	);
};

const sortCustomersBySid = array => {
	return array.sort(
		(valueA, valueB) =>
			valueB.customerNumber.substring(1) -
			valueA.customerNumber.substring(1)
	);
};

const sortRequestsBySid = array => {
	return array.sort(
		(valueA, valueB) =>
			valueB.serviceRequestNumber.substring(3) -
			valueA.serviceRequestNumber.substring(3)
	);
};

