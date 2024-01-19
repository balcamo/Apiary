import { fetchJson, assignHeaders } from ".";

const baseURL = process.env.REACT_APP_DYNAMICS_URL;

export const getAllGLs = async (token, signal) => {
	const url = new URL(`${baseURL}/Account/Accounts`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	const defaultError = "Failed to load gls from Dynamics.";

	return await fetchJson(url, options, {}, defaultError);
};

