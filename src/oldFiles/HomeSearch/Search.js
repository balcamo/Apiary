import React, { Component, Fragment } from "react"
import * as urls from "../../utils/urlsConfig"
import { Input, Form, FormGroup, Row, Col } from "reactstrap"

/**
 * search bar displayed on the home page
 */

class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			customers: [],
			meters: [],
			addresses: [],
			sbURL: urls.springbrook,
			custSugest: [],
			meterSugest: [],
			addressSugest: [],
			suggestion: [
				{
					label: "Customers",
					options: [],
				},
				{
					label: "Meters",
					options: [],
				},
				{
					label: "Lots",
					options: [],
				},
			],
			visibleSearch: "none",
			activeSearch: false,
			selectedItem: "",
			notSubmitted: true,
		}
		this.handleChange = this.handleChange.bind(this)
		this.toggleSearch = this.toggleSearch.bind(this)
		this.handleDoubleClick = this.handleDoubleClick.bind(this)

	}
	/**
	 * This function checks to see if the lots meters and customers
	 * are loaded for the seach bar. If loaded will call to get
	 * those parameters formatted for use
	 */
	componentDidMount() {
		if (this.props.search.lots != null && this.props.search.accounts != null && this.props.search.meters != null) {
			this.getCustomers();
			this.getAddresses();
			this.getMeters();
			this.setState({ activeSearch: true })
			//console.log(this.props.search)
		}
	}
	/**
	 * formats customer json objects for searching
	 */
	getCustomers() {

		for (var i = 0; i < this.props.search.accounts.length; i++) {
			this.state.customers.push({
				value: this.props.search.accounts[i].SearchIndex,
				label: this.props.search.accounts[i].searchValue,
				type: this.props.search.accounts[i].searchCategory,
			})
		}

	}
	/**
	 * formats meters json objects for searching
	 */
	getMeters() {

		for (var i = 0; i < this.props.search.meters.length; i++) {
			this.state.meters.push({
				value: this.props.search.meters[i].SearchIndex,
				label: this.props.search.meters[i].searchValue,
				type: this.props.search.meters[i].searchCategory,
			})
		}
	}
	/**
	 * formats address json objects for searching
	 */
	getAddresses() {

		for (var i = 0; i < this.props.search.lots.length; i++) {
			this.state.addresses.push({
				value: this.props.search.lots[i].SearchIndex,
				label: this.props.search.lots[i].searchValue,
				type: this.props.search.lots[i].searchCategory,
			})
		}

	}
	/**
	 * allows a double click on an item to be selected and seached
	 * without having to click the search button
	 * @param {click event} e 
	 * @param {search item from list} selectedItem 
	 */
	handleDoubleClick(e, selectedItem) {
		this.setState({ selectedItem }, () =>
			console.log(`Option selected:`, this.state.selectedItem)
		);
		this.handleSubmit(e);
	}
	/**
	 * sets the selected state var to the selceted item from the list
	 * @param {search item from list} selectedItem 
	 */
	handleChange = (selectedItem) => {
		this.setState({ selectedItem }, () =>
			console.log(`Option selected:`, this.state.selectedItem)
		)
	}
	/**
	 * submits the click event to set on the home page to toggle the 
	 * view on the main display
	 * @param {event} e 
	 */
	handleSubmit(e) {
		e.preventDefault()
		console.log(this.state.selectedItem)

		this.setState({ notSubmitted: false })
		this.props.setVars(false, this.state.selectedItem)
		this.setState({ visibleSearch: "none", meterSugest: [], addressSugest: [], custSugest: [] })
		console.log("submitted")
	}
	/**
	 * get top 3 matches for all categories based on at least
	 * 3 characters typed
	 * @param {string value} input 
	 * @returns list of possible matches in search items
	 */
	searchfilter(input) {
		this.state.custSugest = this.state.customers
			.filter((cust) => {
				return (
					cust.label.toLowerCase().includes(input.toLowerCase()) ||
					cust.value.toLowerCase().includes(input.toLowerCase())
				)
			})
			.slice(0, 3)
		this.state.meterSugest = []
		this.state.meterSugest = this.state.meters
			.filter((meter) => {
				return (
					meter.label.toLowerCase().includes(input.toLowerCase()) ||
					meter.value.toLowerCase().includes(input.toLowerCase())
				)
			})
			.slice(0, 3)

		this.state.addressSugest = this.state.addresses
			.filter((address) => {
				return (
					address.label.toLowerCase().includes(input.toLowerCase()) ||
					address.value.toLowerCase().includes(input.toLowerCase())
				)
			})
			.slice(0, 3)
		console.log("this is the input " + input)
		this.toggleSearch(input)
		this.setState({ selectedItem: {} })
		return true
	}
	/**
	 * checks to make sure at least 3 charaters have been entered
	 * before displaying possible search results
	 * @param {string vlaue} input 
	 */
	toggleSearch(input) {
		if (input.length >= 3) {
			this.setState({ visibleSearch: "block" })
		} else {
			this.setState({ visibleSearch: "none", meterSugest: [], addressSugest: [], custSugest: [] })
		}
	}

	render() {
		var searchOptions = (
			<ul className='list-unstyled'>
				{this.state.custSugest.length > 0 ? (
					<Fragment>
						<label>UB Accounts</label>
						{this.state.custSugest.map((cust) => (
							<li className="searchList"

								key={cust.value}
								onClick={(e) => this.handleChange(cust)}
								onDoubleClick={(e) => this.handleDoubleClick(e, cust)}
							>
								{cust.label}{" ("}{cust.value}{")"}
							</li>
						))}
						<br />
					</Fragment>
				) : (
					<Fragment>
						<label>UB Accounts</label>
						<p>No matching customers</p>
					</Fragment>
				)}
				{this.state.meterSugest.length > 0 ? (
					<Fragment>
						<label>Meters</label>
						{this.state.meterSugest.map((meter) => (
							<li
								className="searchList"

								key={meter.value}
								onClick={(e) => this.handleChange(meter)}
								onDoubleClick={(e) => this.handleDoubleClick(e, meter)}
							>
								{meter.label}{" ("}{meter.value}{")"}
							</li>
						))}
						<br />
					</Fragment>
				) : (
					<Fragment>
						<label>Meters</label>
						<p>No matching meters</p>
					</Fragment>
				)}
				{this.state.addressSugest.length > 0 ? (
					<Fragment>
						<label>Addresses</label>
						{this.state.addressSugest.map((address) => (
							<li className="searchList"

								key={address.value}
								onClick={(e) => this.handleChange(address)}
								onDoubleClick={(e) => this.handleDoubleClick(e, address)}
							>
								{address.label}{" ("}{address.value}{")"}
							</li>
						))}
					</Fragment>
				) : (
					<Fragment>
						<label>Addresses</label>
						<p>No matching addresses</p>
					</Fragment>
				)}
			</ul>
		)

		return (
			<div>
				<Form
					onSubmit={(e) => {
						if (this.state.selectedItem.type) {
							this.handleSubmit(e)
						} else {
							e.preventDefault();
							window.alert(
								"You have not selected an item. Please try again."
							)
						}
					}}
				>
					<Row>
						<Col>
							{this.state.activeSearch ? (
								<div>
									<FormGroup>
										<Input
											autoFocus={true}
											className='home-search home-search-margin'
											type='text'
											value={this.state.selectedItem.label}
											placeholder='Search...'
											onChange={(e) => {
												this.searchfilter(e.target.value)
											}}
											onClick={this.props.clearSearch}
										/>
										<div
											className='searchBox'
											style={{
												display: this.state.visibleSearch,
											}}
										>
											{searchOptions}
										</div>
									</FormGroup>
								</div>
							) : (
								<h5>Your search options are loading</h5>
							)}
						</Col>
						<Col xs='2'>
							<Input type='submit' value='Search' className="btn-primary home-search-margin" />
						</Col>
					</Row>
				</Form>
			</div>
		)
	}
}
export default Search
