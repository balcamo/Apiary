import { combineReducers } from "redux"
import auth from "./auth"
import profile from "./profile"
import ui from "./ui"
import search from "./search"

export default combineReducers({
	auth,
	profile,
	ui,
	search,
})
