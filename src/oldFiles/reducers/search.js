const initialState = {
	meters:null,
	lots: null,
	accounts:null
}

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case "UPDATE_METERS":
			return Object.assign({}, state, {
				meters: action.payload,
				
			})

		case "UPDATE_LOTS":
			return Object.assign({}, state, {
				lots: action.payload,
				
			})

		case "UPDATE_ACCOUNTS":
			return Object.assign({}, state, {
				accounts: action.payload,
				
			})

		default:
			return state
	}
}
