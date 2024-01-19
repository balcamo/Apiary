import React, { Component, Fragment, useState } from "react";
import {
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Label,
	Input
} from "reactstrap";
import ElectricReads from "./meters/ElectricReads";
import WaterReads from "./meters/WaterReads";

import MapDisconnects from "./MapDisconnects";
import * as url from "../../utils/urlsConfig";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import "jquery-ui";
import LoadingSpinner from "../LoadingSpinner";
import CityworksWorkOrders from "./WorkOrders";
import CityworksServiceRequest from "./ServiceRequests";
import Payments from "../../components/routes/home/cards/payments/Payments";

class Tools extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appToken: "",
			keyvaultURL: url.keystoreURL,
			icommsToken: "",
			springBrookToken: "",
			igraphToken: "",
			payments: this.props.profile.views.tools.payments,
			electric: this.props.profile.views.tools.electric,
			water: this.props.profile.views.tools.water,
			disconnects: this.props.profile.views.tools.disconnects,
			workOrders: this.props.profile.views.tools.workOrders,
			serviceRequest: this.props.profile.views.tools.serviceRequest,
			dropdownOpen: false
		};
		this.togglePayments = this.togglePayments.bind(this);
		this.toggleElectric = this.toggleElectric.bind(this);
		this.toggleWater = this.toggleWater.bind(this);
		this.toggleDisconnects = this.toggleDisconnects.bind(this);
		this.toggleWorkOrders = this.toggleWorkOrders.bind(this);
		this.toggleServiceRequest = this.toggleServiceRequest.bind(this);
	}

	toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });
	componentDidMount() {
		this.checkToken();
		this.props.jqueryCardFunction();
	}
	checkToken() {
		var expire = new Date(this.props.account.idTokenClaims.exp * 1000);
		var curDate = new Date();
		if (expire < curDate) {
			this.props.isAuthenticated = false;
		}
		this.setState({
			appToken: this.props.auth.apiaryAuthAccessToken,
			icommsToken: this.props.auth.icommsAuthAccessToken,
			springBrookToken: this.props.auth.springBrookAuthAccessToken,
			igraphToken: this.props.auth.igraphAuthAccessToken
		});
	}
	toggleDisconnects() {
		this.setState({ disconnects: !this.state.disconnects });
	}
	toggleElectric() {
		this.setState({ electric: !this.state.electric });
	}
	togglePayments() {
		this.setState({ payments: !this.state.payments });
	}
	toggleWater() {
		this.setState({ water: !this.state.water });
	}
	toggleWorkOrders() {
		this.setState({ workOrders: !this.state.workOrders });
	}
	toggleServiceRequest() {
		this.setState({ serviceRequest: !this.state.serviceRequest });
	}
	render() {
		return (
			<div>
				{this.props.search.meters != null ? (
					<div>
						<div>
							<Dropdown
								isOpen={this.state.dropdownOpen}
								toggle={this.toggle}
							>
								<DropdownToggle className='btn-secondary'>
									<i className='fas fa-tasks'></i>
								</DropdownToggle>
								<DropdownMenu className='dropdownDisplay'>
									<div>
										<Input
											type='checkbox'
											id='Payments'
											checked={this.state.payments}
											onClick={e => this.togglePayments()}
										/>
										{"     "}
										<Label for='Payments' check>
											{"  "}Payments
										</Label>
									</div>
									<div>
										<Input
											type='checkbox'
											id='Electric'
											checked={this.state.electric}
											onClick={e => this.toggleElectric()}
										/>
										{"     "}
										<Label for='Electric' check>
											{"  "}Electric Meters
										</Label>
									</div>
									<div>
										<Input
											type='checkbox'
											id='Water'
											checked={this.state.water}
											onClick={e => this.toggleWater()}
										/>
										{"     "}
										<Label for='Water' check>
											{"  "}Water Meters
										</Label>
									</div>
									<div>
										<Input
											type='checkbox'
											id='Disconnects'
											checked={this.state.disconnects}
											onClick={e =>
												this.toggleDisconnects()
											}
										/>
										{"     "}
										<Label for='Disconnects' check>
											{"  "}Disconnects
										</Label>
									</div>
									<div>
										<Input
											type='checkbox'
											id='WorkOrder'
											checked={this.state.workOrders}
											onClick={e =>
												this.toggleWorkOrders()
											}
										/>
										{"     "}
										<Label for='WorkOrder' check>
											{"  "}Work Orders
										</Label>
									</div>
									<div>
										<Input
											type='checkbox'
											id='ServiceRequest'
											checked={this.state.serviceRequest}
											onClick={e =>
												this.toggleServiceRequest()
											}
										/>
										{"     "}
										<Label for='ServiceRequest' check>
											{"  "}Service Requests
										</Label>
									</div>
								</DropdownMenu>
							</Dropdown>
							<br />
						</div>
						<section className='content'>
							<div className='grid'>
								<div className='row connectedSortable'>
									{this.props.search.meters !== undefined &&
									this.props.search.accounts !== undefined &&
									this.props.search.lots !== undefined ? (
										<Fragment>
											{this.state.payments ? (
												<Payments
													appToken={
														this.state.appToken
													}
													springBrookToken={
														this.state
															.springBrookToken
													}
													icommsToken={
														this.state.icommsToken
													}
													igraphToken={
														this.state.igraphToken
													}
													{...this.props}
													togglePayments={
														this.togglePayments
													}
												/>
											) : null}
											{this.state.electric &&
											this.state.springBrookToken ? (
												<ElectricReads
													appToken={
														this.state.appToken
													}
													toggleElectric={
														this.toggleElectric
													}
													springBrookToken={
														this.state
															.springBrookToken
													}
													icommsToken={
														this.state.icommsToken
													}
													{...this.props}
												/>
											) : null}
											{this.state.water &&
											this.state.appToken ? (
												<WaterReads
													appToken={
														this.state.appToken
													}
													springBrookToken={
														this.state
															.springBrookToken
													}
													toggleWater={
														this.toggleWater
													}
													{...this.props}
												/>
											) : null}
											{this.state.disconnects &&
											this.state.appToken ? (
												<MapDisconnects
													appToken={
														this.state.appToken
													}
													toggleDisconnects={
														this.toggleDisconnects
													}
													sbToken={
														this.state
															.springBrookToken
													}
													{...this.props}
												/>
											) : null}
											{this.state.workOrders &&
											this.state.appToken ? (
												<CityworksWorkOrders
													springBrookToken={
														this.state
															.springBrookToken
													}
													toggleWorkOrders={
														this.toggleWorkOrders
													}
													appToken={
														this.state.appToken
													}
													{...this.props}
												/>
											) : null}
											{this.state.serviceRequest &&
											this.props.auth
												.apiaryAuthAccessToken ? (
												<CityworksServiceRequest
													springBrookToken={
														this.state
															.springBrookToken
													}
													toggleServiceRequest={
														this
															.toggleServiceRequest
													}
													appToken={
														this.state.appToken
													}
													{...this.props}
												/>
											) : null}
										</Fragment>
									) : (
										<LoadingSpinner />
									)}
								</div>
							</div>
						</section>
					</div>
				) : (
					<LoadingSpinner />
				)}
			</div>
		);
	}
}
export default Tools;
