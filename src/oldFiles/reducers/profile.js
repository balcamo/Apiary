//import {defaultView} from "../utils/roles"
const initialState = {
	id: null,
	userPrincipalName: null,
	givenName: null,
	surname: null,
	jobTitle: null,
	mobilePhone: null,
	preferredLanguage: null,
	firstLogin: true,
	officeLocation:null,
	views:null,
	viewName:null,
}

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_PROFILE":
			return Object.assign({}, state, {
				id: action.payload.id,
				userPrincipalName: action.payload.userPrincipalName,
				givenName: action.payload.givenName,
				surname: action.payload.surname,
				jobTitle: action.payload.jobTitle,
				mobilePhone: action.payload.mobilePhone,
				preferredLanguage: action.payload.preferredLanguage,
				firstLogin: false,
				officeLocation:action.payload.officeLocation,
				
			})
		case "UPDATE_VIEW":
			return Object.assign({}, state, {
				views:action.payload.view,
				viewName:action.payload.displayName
			})
		
		default:
			return state
	}
}
