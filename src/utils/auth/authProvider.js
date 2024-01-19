import {
	PublicClientApplication,
	InteractionRequiredAuthError
} from "@azure/msal-browser";
import { fetchJson } from "../api";
import { msalConfig, loginRequest, scopes } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export const signIn = async () => {
	let tokens;

	return await msalInstance
		.loginPopup(loginRequest)
		.then(getTokens)
		.then(response => {
			tokens = response;
			return {
				isAuthenticated: true,
				tokens
			};
		});
};

export const signOut = async () => {
	const currentAccounts = await msalInstance.getAllAccounts();
	const account = msalInstance.getAccountByUsername(
		currentAccounts[0].username
	);
	console.log(account);
	return await msalInstance.logoutPopup({
		account: account,
		mainWindowRedirectUri:
			process.env.NODE_ENV === "production"
				? process.env.REACT_APP_BASE_URL
				: "http://localhost:3000/"
	});
};

const getTokens = async () => {
	/**
	 * See here for more info on account retrieval:
	 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
	 */
	const tokens = {};
	console.log("hello from get tokens");

	await acquireToken(scopes.graph).then(
		response => (tokens.graph = response.accessToken)
	);
	await acquireToken(scopes.arcgis).then(
		response => (tokens.arcgis = response.accessToken)
	);
	await acquireToken(scopes.icomms).then(
		response => (tokens.icomms = response.accessToken)
	);
	await acquireToken(scopes.sprycis).then(
		response => (tokens.sprycis = response.accessToken)
	);
	await acquireToken(scopes.springbrook).then(
		response => (tokens.springbrook = response.accessToken)
	);
	await acquireToken(scopes.cityworks).then(
		response => (tokens.cityworks = response.accessToken)
	);
	await acquireToken(scopes.dynamics).then(
		response => (tokens.dynamics = response.accessToken)
	);
	
	return tokens;
};

const acquireToken = async scopes => {
	/**
	 * See here for more info on account retrieval:
	 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
	 */
	const currentAccounts = await msalInstance.getAllAccounts();
	const account = msalInstance.getAccountByUsername(
		currentAccounts[0].username
	);

	const request = { scopes, account };
	// attempt silent token acquisition first and warn console if interactive method is needed
	return await msalInstance.acquireTokenSilent(request).catch(() => {
		console.log(
			"Silent token acquisition failed. Attempting to manually retrieve."
		);
		return msalInstance
			.acquireTokenPopup(request)
			.catch(err => err.errorMessage);
	});
};
