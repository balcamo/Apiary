import React, { Component, Fragment } from "react";
import fetch from "isomorphic-fetch";
import {
	Button,
	Container,
	UncontrolledTooltip,
	Row,
	Col,
	Input,
	InputGroup,
	Form,
	Label,
	FormGroup,
	Table
} from "reactstrap";
import LoadingSpinner from "../LoadingSpinner";
import * as urls from "../../utils/urlsConfig";
import ServiceRequestForm from "../../components/common/modals/CreateServiceRequest";
//import {getToken} from '../urlsConfig';
import ReactPaginate from "react-paginate";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import "jquery-ui";

class ServiceRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 0, //for pagination
			selectedState: "In Progress",
			workOrderNums: [],
			dropdownOpen: false,
			setDropdownOpen: false,
			isHidden: true,
			springbrookworkOrders: [],
			serviceRequest: [],
			loading: true,
			esriEndpoint: "",
			list: true,
			disdata: "",
			googleAPIKey: "",
			statuses: [],
			selectedStatus: "OPEN",
			lot: {
				CustomerIndex: "",
				streetNumber: "",
				streetDirectional: "",
				streetName: ""
			}
		};
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.toggleLoading = this.toggleLoading.bind(this);
		this.getServiceRequests = this.getServiceRequests.bind(this);
	}

	toggleLoading() {
		this.setState({ loading: !this.state.loading });
	}
	setLoading(loadState) {
		this.setState({ loading: loadState });
	}
	toggleDropDown() {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	}
	// this is for pagination
	changePage = ({ selected }) => {
		this.setState({ page: selected });
	};
	componentDidMount() {
		this.getServiceRequests();
		this.getStatuses();
		this.props.jqueryCardFunction();
	}
	getServiceRequests() {
		this.setState({ loading: true });
		//var url = urls.cityWorks+'ServiceRequest/All'
		var url = urls.sprycis + "ServiceOrder/All";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.props.appToken
			}
		})
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setLoading(false);
				} else if (response.status === 500) {
					alert(
						"Service requests are not currently available. Error 500"
					);
					this.setLoading(false);
				} else {
					var error = new Error(response.statusText);
					error.response = response;
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				console.log("we got the service requests");
				console.log(data);
				this.setState({ serviceRequest: [] });
				var tempdata = data;

				tempdata.map(val => this.state.serviceRequest.push(val));
				this.setState({
					serviceRequest: this.state.serviceRequest,
					loading: false
				});
			})
			.catch(console.log);
	}
	getStatuses() {
		fetch(urls.cityWorks + "ServiceRequest/Status", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + this.props.auth.cityworksAuthAccessToken
			}
		})
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
				this.setState({ statuses: data });
			})
			.catch(console.log);
	}
	updateServiceRequest(e, srIndex) {
		e.preventDefault();
		var srToUpdate = this.state.serviceRequest.filter(
			val => val.ServiceRequestIndex == srIndex
		);

		var bodyJSON = JSON.stringify(srToUpdate[0]);

		fetch(urls.cityWorks + "ServiceRequest/Update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + this.props.auth.cityworksAuthAccessToken
			},
			body: bodyJSON
		})
			.then(function (response) {
				if (response.ok) {
					return response;
				} else if (response.status === 401) {
					alert("Your token has expired. Please refresh the page.");
					this.setState({ loading: false });
				} else {
					var error = new Error(response.statusText);
					error.response = response;
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				alert("successful update");
				//this.refreshLabor(e,woIndex);
			})
			.catch(console.log);
	}
	handelStatus(e, srIndex) {
		e.preventDefault();
		for (var i = 0; i < this.state.serviceRequest.length; i++) {
			if (this.state.serviceRequest[i].ServiceRequestIndex === srIndex) {
				this.state.serviceRequest[i].status = e.target.value;
				this.setState({ serviceRequest: this.state.serviceRequest });
			}
		}
	}
	handelCustomerName(e, srIndex) {
		e.preventDefault();
		for (var i = 0; i < this.state.serviceRequest.length; i++) {
			if (this.state.serviceRequest[i].ServiceRequestIndex === srIndex) {
				this.state.serviceRequest[i].CustomerName = e.target.value;
				this.setState({ serviceRequest: this.state.serviceRequest });
			}
		}
	}

	render() {
		// start pagination vars
		const SRPerPage = 10;
		const numberOfSRVistited = this.state.page * SRPerPage;
		const totalPages = Math.ceil(
			this.state.serviceRequest.length / SRPerPage
		);
		// end pagination vars
		var statuses = this.state.statuses.map(item => (
			<option key={item.code} value={item.code}>
				{item.description}
			</option>
		));

		var serviceRequestBody = (
			<div className='accordion' id='accordionServiceRequest'>
				{this.state.serviceRequest.length === 0 ? (
					<h4>
						There are no service requests loaded. Please select a
						status and push submit.
					</h4>
				) : (
					<Fragment>
						{this.state.serviceRequest
							//get the slice of the array for the cooresponding page
							.slice(
								numberOfSRVistited,
								numberOfSRVistited + SRPerPage
							)
							.map(sr => {
								return (
									<div
										className='accordion-item'
										key={sr.ServiceRequestIndex}
									>
										<h2
											className='accordion-header'
											id={
												"heading" +
												sr.ServiceRequestIndex
											}
										>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={
													"#collapse" +
													sr.ServiceRequestIndex
												}
												aria-expanded='false'
												aria-controls={
													"collapse" +
													sr.ServiceRequestIndex
												}
											>
												<b>
													Service Request #
													{sr.ServiceRequestIndex}:
												</b>
												&nbsp;{sr.requestDescription}
											</button>
										</h2>
										<div
											id={
												"collapse" +
												sr.ServiceRequestIndex
											}
											className='accordion-collapse collapse'
											aria-labelledby={
												"heading" +
												sr.ServiceRequestIndex
											}
											data-bs-parent='#accordionServiceRequest'
										>
											<div className='accordion-body'>
												<Form
													autoComplete='off'
													roll='form'
													className='bugForm'
													onSubmit={e =>
														this.updateServiceRequest(
															e,
															sr.ServiceRequestIndex
														)
													}
												>
													<Row xs='2'>
														<Col>
															<b>
																Request Date:{" "}
															</b>
															{sr.requestDate}
														</Col>
														<Col>
															<b>
																Requested By:{" "}
															</b>
															{sr.requestBy}
														</Col>
													</Row>
													<Row xs='2'>
														<Col>
															<b>Customer: </b>
															<Input
																id='customerName'
																type='text'
																className=''
																value={
																	sr.CustomerName
																}
																onChange={e => {
																	this.handelCustomerName(
																		e,
																		sr.ServiceRequestIndex
																	);
																}}
															></Input>
														</Col>
														<Col>
															<b>Status: </b>
															<Input
																required
																id='status'
																type='select'
																className='form-control'
																value={
																	sr.status
																}
																onChange={e => {
																	this.handelStatus(
																		e,
																		sr.ServiceRequestIndex
																	);
																}}
															>
																<option>
																	---
																</option>
																{statuses}
															</Input>
														</Col>
													</Row>
													<FormGroup row>
														<Label sm={2}>
															Status
														</Label>
													</FormGroup>

													{this.state.laborLoad ? (
														<LoadingSpinner />
													) : (
														<Fragment>
															<div
																className='accordion'
																id={
																	"accordionServiceRequest" +
																	sr.ServiceRequestIndex
																}
															>
																<div className='accordion-item'>
																	<h2
																		className='accordion-header'
																		id={
																			"labor" +
																			sr.ServiceRequestIndex
																		}
																	>
																		<button
																			className='accordion-button collapsed'
																			type='button'
																			data-bs-toggle='collapse'
																			data-bs-target={
																				"#collapselabor" +
																				sr.ServiceRequestIndex
																			}
																			aria-expanded='false'
																			aria-controls={
																				"collapselabor" +
																				sr.ServiceRequestIndex
																			}
																		>
																			Devices
																		</button>
																	</h2>
																	<div
																		id={
																			"collapselabor" +
																			sr.ServiceRequestIndex
																		}
																		className='accordion-collapse collapse'
																		aria-labelledby={
																			"labor" +
																			sr.ServiceRequestIndex
																		}
																		data-bs-parent={
																			"#accordionServiceRequest" +
																			sr.ServiceRequestIndex
																		}
																	>
																		<div className='accordion-body'>
																			<Table
																				bordered
																				striped
																				hover
																			>
																				<thead>
																					<tr>
																						<th>
																							headers
																							here
																						</th>
																					</tr>
																				</thead>
																				<tbody>
																					{/*                                                                        
                                                                            {sr.Devices.length > 0?
                                                                                <Fragment>
                                                                                    {sr.Devices.map((device)=>
                                                                                        

                                                                                        
                                                                                         <tr>
                                                                                            <th>
                                                                                               
                                                                                                Data goes here
                                                                                                
                                                                                            </th>
                                                                                            
                                                                                        </tr>
                                                                                        )
                                                                                    }
                                                                                </Fragment>:
                                                                            
                                                                                <tr>No labor data is available at this time. </tr>
                                                                            
                                                                            } */}
																					<Button
																						onClick={e =>
																							this.updateServiceRequest(
																								e,
																								sr.ServiceRequestIndex
																							)
																						}
																					>
																						Save
																						Changes
																					</Button>
																					<Button
																						onClick={e => {
																							this.setState(
																								{
																									loading: true
																								}
																							);
																							this.refreshLabor(
																								e,
																								sr.ServiceRequestIndex
																							);
																						}}
																					>
																						Refresh
																						labor
																						data
																					</Button>
																				</tbody>
																			</Table>
																		</div>
																	</div>
																</div>
															</div>
														</Fragment>
													)}

													<Button
														type='submit'
														onClick={e =>
															this.updateServiceRequest(
																e,
																sr.ServiceRequestIndex
															)
														}
													>
														Update WO#{" "}
														{sr.ServiceRequestIndex}
													</Button>
												</Form>
											</div>
										</div>
									</div>
								);
							})}
					</Fragment>
				)}
			</div>
		);

		return (
			<Fragment>
				<ServiceRequestForm lot={this.state.lot} {...this.props} />

				<div className='col-md-12'>
					<div
						className={
							"card card-tools " +
							this.props.profile.views.tools.serviceRequestExpand
						}
					>
						<div
							className='card-header btn btn-tool btn-minmax btn-max bg-orange'
							data-card-widget='collapse'
							data-toggle='tooltip'
							data-placement='top'
							title='Collapse Item'
						>
							<h3 className='card-title'>
								<i className='fas fa-text-width'></i>
								Service Requests
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
									{this.props.profile.views.tools
										.serviceRequestExpand === "" ? (
										<i className='fas fa-minus'></i>
									) : (
										<i className='fas fa-plus'></i>
									)}
								</button>
								<button
									type='button'
									className='btn btn-tool'
									data-card-widget='remove'
									data-toggle='tooltip'
									data-placement='top'
									title='Remove Item'
									onClick={e =>
										this.props.toggleServiceRequest()
									}
								>
									<i className='fas fa-times'></i>
								</button>
							</div>
						</div>
						{/* /.card-header */}

						<div className='card-body'>
							<Container>
								{this.props.appToken ? (
									<div>
										<header>
											<h1>Service Requests</h1>
											<Row>
												<Col sm={{ size: "3" }}>
													<button
														className='bg-orange btn color-palette-set'
														data-bs-toggle='modal'
														data-bs-target='#modal-CWserviceRequest'
														id='AddSR'
													>
														<i className='fas fa-file-alt'></i>
													</button>
													<UncontrolledTooltip
														placement='top'
														target='AddSR'
													>
														Create a Service Request
													</UncontrolledTooltip>
												</Col>
												<Col sm={{ size: "4" }}>
													<Input
														type='select'
														value={
															this.state
																.selectedStatus
														}
														onChange={e => {
															this.setState({
																selectedStatus:
																	e.target
																		.value
															});
														}}
													>
														<option>----</option>
														{statuses}
													</Input>
												</Col>
												<Col sx='auto'>
													<Button
														secondary
														type='submit'
														onClick={e =>
															this.getCityWorks()
														}
													>
														Submit
													</Button>
												</Col>
											</Row>
										</header>

										<div>
											{this.state.loading ? (
												<LoadingSpinner />
											) : (
												<Fragment>
													{serviceRequestBody}
													{this.state.serviceRequest
														.length > 0 ? (
														<ReactPaginate
															previousLabel={
																"Previous"
															}
															nextLabel={"Next"}
															pageCount={
																totalPages
															}
															onPageChange={
																this.changePage
															}
															containerClassName={
																"paginationButtons"
															}
															previousLinkClassName={
																"previousButton"
															}
															nextLinkClassName={
																"nextButton"
															}
															disabledClassName={
																"paginationDisabled"
															}
															activeClassName={
																"Active"
															}
														/>
													) : null}
												</Fragment>
											)}
										</div>
									</div>
								) : (
									<LoadingSpinner />
								)}
							</Container>
						</div>

						{/* /.card-body */}
					</div>
					{/* /.card */}
				</div>
			</Fragment>
		);
	}
}
export default ServiceRequest;
