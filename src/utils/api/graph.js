import { fetchJson, assignHeaders } from ".";
import { defaultCards } from "../config/defaultCards";

const baseURL = process.env.REACT_APP_GRAPH_URL;

// returns profile with role information
export const getProfile = async (token, signal) => {
	const url = new URL(`${baseURL}/user/userInfo`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	// fetch profile info
	const profile = await fetchJson(url, options, {});
	// fetch role info
	const role = await getRole(token, signal);
	// fetch role list
	const roleList = await getRoles(token, signal);
	// assign role
	profile.role = await assignRole(role, roleList);

	return profile;
};

// returns calendar events for a given email
export const getCalendarEventsByEmail = async (filters,token, signal) => {
	const url = new URL(`${baseURL}/Calendar/EventsByFilter`);
	const headers = assignHeaders(token);
	const options = {
		method: "POST",
		headers,
	    body: JSON.stringify(filters),	
		signal
	};
	return await fetchJson(url, options, {});
};

// returns role information
const getRole = async (token, signal) => {
	const url = new URL(`${baseURL}/user/userApiaryRole`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	return await fetchJson(url, options, {});
};
// returns more detailed list of role information
const getRoles = async (token, signal) => {
	const url = new URL(`${baseURL}/user/apiaryRoles`);
	const headers = assignHeaders(token);
	const options = {
		method: "GET",
		headers,
		signal
	};
	return await fetchJson(url, options, []);
};

// return default cards and role name based on role name
const assignRole = (role, roleList) => {
	const foundRole = roleList.find(
		match => {
			if(match.roleSid === role.roleIndex){
				return match
			}}
	);
	let name = foundRole ? foundRole.roleName : null;
	let cards;

	switch (name) {
		case "Super User":
			cards = defaultCards.Super_User;
			break;
		case "Customer Service":
			cards = defaultCards.Customer_Service;
			break;
		case "Billing":
			cards = defaultCards.Billing;
			break;
		case "Credit":
			cards = defaultCards.Credit;
			break;
		case "Operations":
			cards = defaultCards.Operations;
			break;
		case "Finance":
			cards = defaultCards.Finance;
			break;
		case "General Manager":
			cards = defaultCards.GenMan;
			break;
		case "Engineer":
			cards = defaultCards.Engineer;
			break;
		case "Mapping":
			cards = defaultCards.Mapping;
			break;
		case "Communications":
			cards = defaultCards.Communications;
			break;
		default:
			name = "Default User";
			cards = defaultCards.Default_User;
			break;
	}
	return { name, cards };
};
