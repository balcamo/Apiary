const initialState = {
	apiaryAuthAccount: null,
	apiaryAuthError: null,
	apiaryAuthIdToken: null,
	apiaryAuthAccessToken: null,
	apiaryAuthIsAuthenticated: false,

	springBrookAuthAccount: null,
	springBrookAuthRrror: null,
	springBrookAuthIdToken: null,
	springBrookAuthAccessToken: null,
	springBrookAuthIsAuthenticated: false,

	icommsAuthAccount: null,
	icommsAuthError: null,
	icommsAuthIdToken: null,
	icommsAuthAccessToken: null,
	icommsAuthIsAuthenticated: false,
	
	igraphAccessToken:null,
	igraphAuthIdToken:null,
	igraphAuthIsAuthenticated:false,

	dynamicsAccessToken:null,
	dynamicsAuthIdToken:null,
	dynamicsAuthIsAuthenticated:false,

	cityworksAccessToken:null,
	cityworksAuthIdToken:null,
	cityworksAuthIsAuthenticated:false,
}

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_APIARY_ACCOUNT":
			return Object.assign({}, state, {
				apiaryAuthAccount: action.payload,
				apiaryAuthIdToken: action.payload.idTokenClaims,
				apiaryAuthAccessToken: action.payload.accessToken,
				apiaryAuthIsAuthenticated: true,
			})

		case "UPDATE_APIARY_ERROR":
			return Object.assign({}, state, {
				apiaryAuthError: action.payload,
				apiaryAuthIsAuthenticated: false,
			})

		case "UPDATE_APIARY_TOKEN":
			return Object.assign({}, state, {
				apiaryAuthAccount: action.payload,
				apiaryAuthIdToken: action.payload.idTokenClaims,
				apiaryAuthAccessToken: action.payload.accessToken,
			})
		case "UPDATE_SPRINGBROOK_ERROR":
			return Object.assign({}, state, {
				springBrookAuthError: action.payload,
				springBrookAuthIsAuthenticated: false,
			})
		case "UPDATE_SPRINGBROOK_ACCOUNT":
			return Object.assign({}, state, {
				springBrookAuthAccount: action.payload,
				springBrookAuthIdToken: action.payload.idTokenClaims,
				springBrookAuthAccessToken: action.payload.accessToken,
				springBrookAuthIsAuthenticated: true,
			})

		case "UPDATE_SPRINGBROOK_TOKEN":
			return Object.assign({}, state, {
				springBrookAuthIdToken: action.payload.idTokenClaims,
				springBrookAuthAccessToken: action.payload.accessToken,
			})
		case "UPDATE_ICOMMS_ACCOUNT":
			return Object.assign({}, state, {
				icommsAuthAccount: action.payload,
				icommsAuthIdToken: action.payload.idTokenClaims,
				icommsAuthAccessToken: action.payload.accessToken,
				icommsAuthIsAuthenticated: true,
			})
		case "UPDATE_ICOMMS_ERROR":
			return Object.assign({}, state, {
				icommsAuthError: action.payload,
				icommsAuthIsAuthenticated: false,
			})

		case "UPDATE_ICOMMS_TOKEN":
			return Object.assign({}, state, {
				icommsAuthIdToken: action.payload.idTokenClaims,
				icommsAuthAccessToken: action.payload.accessToken,
			})

		case "UPDATE_GRAPH_TOKEN":
			return Object.assign({}, state, {
				igraphAuthIdToken: action.payload.idTokenClaims,
				igraphAuthAccessToken: action.payload.accessToken,
				igraphAuthIsAuthenticated:true,
			})

		case "UPDATE_DYNAMICS_TOKEN":
			return Object.assign({}, state, {
				dynamicsAuthIdToken: action.payload.idTokenClaims,
				dynamicsAuthAccessToken: action.payload.accessToken,
				dynamicsAuthIsAuthenticated:true,
			})	
		
		case "UPDATE_CITYWORKS_TOKEN":
			return Object.assign({}, state, {
				cityworksAuthIdToken: action.payload.idTokenClaims,
				cityworksAuthAccessToken: action.payload.accessToken,
				cityworksAuthIsAuthenticated:true,
			})

		case "UPDATE_SPRYCIS_TOKEN":
			return Object.assign({}, state, {
				sprycisAuthIdToken: action.payload.idTokenClaims,
				sprycisAuthAccessToken: action.payload.accessToken,
				sprycisAuthIsAuthenticated:true,
			})
		default:
			return state
	}
}
