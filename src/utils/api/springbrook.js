import { fetchJson, assignHeaders } from ".";

const baseURL = process.env.REACT_APP_SPRINGBROOK_URL;

export const getTimesheetByDate = async (date, token, signal) => {
	const url = new URL(`${baseURL}/Payroll/CurrentEmployeeTimeByDate?timeDate=${date}`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load timesheet from Springbrook.";

	return await fetchJson(url, options, {}, defaultError);
};

export const getPayCodes = async (token, signal) => {
	const url = new URL(`${baseURL}/Payroll/PayCodes`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load timesheet from Springbrook.";

	return await fetchJson(url, options, {}, defaultError);
};

export const getCurrentEmployee = async (token, signal) => {
	const url = new URL(`${baseURL}/Payroll/CurrentEmployee`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load timesheet from Springbrook.";

	return await fetchJson(url, options, {}, defaultError);
};