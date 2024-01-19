import React, { Component, Fragment } from "react";
import fetch from "isomorphic-fetch";
import * as urls from "../../utils/urlsConfig";
import $ from "jquery";
import { UncontrolledTooltip } from "reactstrap";
import "jquery-ui/ui/widgets/sortable";
import WorkOrderForm from "../../components/common/modals/CreateWorkOrder";
import ServiceRequestForm from "../../components/common/modals/CreateServiceRequest";

/**
 * displayes lot/address details
 * list of meters associated with a lot also gets displayed
 */

class LotCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemDetails: null,
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false
		};
		this.displayCustomer = this.displayCustomer.bind(this);
	}

	componentDidMount() {
		this.getLot();
		this.props.jqueryCardFunction();
	}
	/**
	 * get lot detils based on lot index
	 */
	getLot() {
		fetch(
			this.state.sbURL + "Lot/ByIndex?lotIndex=" + this.props.lotIndex,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer " + this.props.auth.springBrookAuthAccessToken
				}
			}
		)
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setState({ loading: false });
				} else {
					var error = new Error(response.statusText);
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				//this.state.customers = data;
				console.log(data);
				if (data === "No meter found.") {
					this.setState({
						dataReturned: false,
						returnrdResults: true
					});
				} else {
					this.setState({
						itemDetails: data,
						returnrdResults: true,
						dataReturned: true
					});
				}
			})
			.catch(console.log);
	}
	/**
	 * toggles display of owner details
	 */
	displayCustomer() {
		this.props.updateCustomerIndex(
			true,
			this.state.itemDetails[0].CustomerIndex,
			"Owner"
		);
	}
	render() {
		return (
			<div>
				{this.state.itemDetails != null ? (
					<Fragment>
						<WorkOrderForm
							lot={this.state.itemDetails[0]}
							{...this.props}
						/>
						<ServiceRequestForm
							lot={this.state.itemDetails[0]}
							{...this.props}
						/>
					</Fragment>
				) : null}
				<div className='col-md-12'>
					<div className='card collapsed-card card-tools'>
						<div
							className='card-header btn btn-tool btn-minmax btn-max'
							data-card-widget='collapse'
							data-toggle='tooltip'
							data-placement='top'
							title='Collapse Item'
						>
							<h3 className='card-title'>
								<i className='fas fa-text-width'></i>
								Address and Lot Details
							</h3>
							<div className='card-tools'>
								<button
									type='button'
									className='btn btn-tool btn-minmax btn-max'
									data-card-widget='collapse'
									data-toggle='tooltip'
									data-placement='top'
									title='Collapse Item'
								>
									<i className='fas fa-plus'></i>
								</button>
								<button
									type='button'
									className='btn btn-tool'
									data-card-widget='remove'
									data-toggle='tooltip'
									data-placement='top'
									title='Remove Item'
									onClick={e =>
										this.props.toggleLot(true, false)
									}
								>
									<i className='fas fa-times'></i>
								</button>
							</div>
						</div>
						{/* /.card-header */}
						{this.state.returnrdResults ? (
							<div className='card-body'>
								<button
									id='owner'
									className='bg-primary btn color-palette-set'
									onClick={e => this.displayCustomer(e)}
								>
									<b>Owner Number:</b>{" "}
									{this.state.itemDetails[0].CustomerIndex}
								</button>
								<button
									className='bg-orange btn color-palette-set'
									data-bs-toggle='modal'
									data-bs-target='#modal-CWworkOrder'
									id='AddWO'
								>
									<i className='fas fa-file-alt'></i>
								</button>
								<UncontrolledTooltip
									placement='top'
									target='AddWO'
								>
									Add a Cityworks Work Order
								</UncontrolledTooltip>
								<button
									className='bg-orange btn color-palette-set'
									data-bs-toggle='modal'
									data-bs-target='#modal-CWserviceRequest'
									id='AddSR'
								>
									<i className='fas fa-calendar-plus'></i>
								</button>
								<UncontrolledTooltip
									placement='top'
									target='AddSR'
								>
									Add a Cityworks Service Request
								</UncontrolledTooltip>

								<p>
									<b>Address:</b>{" "}
									{this.state.itemDetails[0].streetNumber}{" "}
									{
										this.state.itemDetails[0]
											.streetDirectional
									}{" "}
									{this.state.itemDetails[0].streetName}
								</p>
								<p>
									<b>City, State, ZIP:</b>{" "}
									{this.state.itemDetails[0].city},{" "}
									{this.state.itemDetails[0].state},{" "}
									{this.state.itemDetails[0].zip}
								</p>
								<p>
									<b>Lot Status:</b>{" "}
									{this.state.itemDetails[0].lotStatus}
								</p>
								<p>
									<b>Parcel Number:</b>{" "}
									{this.state.itemDetails[0].parcel}
								</p>
								<p>
									<b>Description:</b>{" "}
									{this.state.itemDetails[0].description}
								</p>
							</div>
						) : (
							<div className='card-body'>
								<p>Waiting for details</p>
							</div>
						)}
						{/* /.card-body */}
					</div>
					{/* /.card */}
				</div>
			</div>
		);
	}
}
export default LotCard;
