import React, { Component, Fragment } from "react"
import LoadingSpinner from "../LoadingSpinner"
import Search from "./Search"
import SearchResults from "./SearchResults";

/**
 * this is the primary landing page when logged in.
 * the user will either be prompted with the search bar
 * or the results of a search
 */
class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			searchedItem: {},
			loading: false,
			activeSearch: true,
			selectedItem: "",
			submitted: true,
			displayHeader:true,
		}
	}
	componentDidMount() {

		if (this.props.clickedHome) {
			this.setState({
				searchedItem: {},
				activeSearch: true,
				selectedItem: "",
			})
		}

	}
	componentDidUpdate() {
		if (this.props.clickedHome) {
			this.setState({
				searchedItem: {},
				activeSearch: true,
				selectedItem: "",
			})
		}
	}
	/**
	 * 
	 * @param {bool param to set if 
	 * 			the search should be 
	 * 			displayed} active 
	 * @param {json object containing
	 * 			the seached item to be 
	 * 			paseed to search results} item 
	 */
	setFromSearch = (active, item) => {
		console.log(item)
		this.setState({ activeSearch: active, searchedItem: item, displayHeader:false})
	}
	clearSearch = () => {
		this.setState({ activeSearch: true, searchedItem: {} })
	}
	render() {
		return (


			<div>
				{this.state.loading ? <LoadingSpinner /> :
					<div>

						<div className='row justify-content-center'>
							{this.state.displayHeader ?
								<div className='App-header col-md-12 text-center'>
									<h2 className='display-4'>Welcome to Apiary <b>Development</b></h2>
								</div> : null}
							<div>
								{this.props.auth.springBrookAuthAccessToken ? (
									
										<Search
											clearSearch={this.clearSearch}
											setVars={this.setFromSearch}
											{...this.props}
										/>
									
								) : (
									<div>Retrieving token</div>
								)}
							</div>
							{this.state.activeSearch ? (
								<div className='col-md-12 text-center'>
									<p className='lead text-center'>
										Enter your search criteria to view information
									</p>
								</div>
							) : (
								<Fragment className='justify-content-center'>
									<br />
									<SearchResults
										setVars={this.setFromSearch}
										searchedItem={this.state.searchedItem}
										{...this.props}
									/>

								</Fragment>

							)}
						</div>



					</div>}
			</div>
		)
	}
}
export default Home
