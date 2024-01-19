// For a full list of MSAL.js configuration parameters,
// visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
export const msalConfig = {
	auth: {
		clientId: process.env.REACT_APP_MSAL_CLIENTID,
		authority: process.env.REACT_APP_MSAL_AUTHORITY,
		redirectUri:
			process.env.NODE_ENV === "production"
				? process.env.REACT_APP_BASE_URL
				: "http://localhost:3000/"
	},
	cache: {
		cacheLocation: "localStorage",
		storeAuthStateInCookie: false
	}
};

export const scopes = {
	arcgis: ["openid", "profile", process.env.REACT_APP_ARCGIS_KEY],
	cityworks: ["openid", "profile", process.env.REACT_APP_CITYWORKS_KEY],
	dynamics: ["openid", "profile", process.env.REACT_APP_DYNAMICS_KEY],
	graph: ["openid", "profile", process.env.REACT_APP_GRAPH_KEY],
	icomms: ["openid", "profile", process.env.REACT_APP_ICOMMS_KEY],
	springbrook: ["openid", "profile", process.env.REACT_APP_SPRINGBROOK_KEY],
	sprycis: ["openid", "profile", process.env.REACT_APP_SPRYCIS_KEY]
};

// Coordinates and required scopes for your web API
export const loginRequest = {
	scopes: ["openid", "profile", "offline_access"],
	apiScopes: [
		scopes.arcgis,
		scopes.icomms,
		scopes.springbrook,
		scopes.graph,
		scopes.dynamics,
		scopes.cityworks,
		scopes.sprycis
	]
};
