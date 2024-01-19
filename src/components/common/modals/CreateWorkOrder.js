import React, { Component, Fragment } from "react";
import fetch from "isomorphic-fetch";
import * as urls from "../../utils/urlsConfig";
import { Form, Input, FormFeedback } from "reactstrap";
import { WorkOrder } from "../../../oldFiles/classes/WorkOrder";
import LoadingSpinner from "../LoadingSpinner";

/**
 * creates new work order in cityworks
 */

class CityWorksWorkOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: [],
			taigaURL: urls.taiga,
			templatesOps: [],
			templatesCsr: [],
			invalidGL: false,
			priority: String,
			assignedTo: String,
			creator: String,
			glNumbers: [],
			taigaAuth: "",
			clientAzureToken: "",
			vaultToken: "",
			azureKeyStoreURL: urls.keystoreURL,
			customer: null,
			workOrder: new WorkOrder(),
			loading: false,
			employees: [],
			entityGroups: [],
			status: [],
			priorities: []
		};
		this.getOwnerDetails = this.getOwnerDetails.bind(this);
		this.sendToCityworks = this.sendToCityworks.bind(this);
		this.getTemplates = this.getTemplates.bind(this);
		this.getEmployees = this.getEmployees.bind(this);
		this.getGLs = this.getGLs.bind(this);
		this.getGroups = this.getGroups.bind(this);
		this.getStatuses = this.getStatuses.bind(this);
		this.getPriorities = this.getPriorities.bind(this);
	}

	componentDidMount() {
		this.getOwnerDetails();
		this.getTemplates();
		this.getEmployees();
		this.getGroups();
		this.getPriorities();
		this.getStatuses();
		this.getGLs();
		this.state.workOrder.setCreationDate(new Date());
		this.state.workOrder.setAssignDate(new Date());
		console.log(this.state.workOrder.getWO());
		if (this.props.profile.viewName != "Operations") {
			this.state.workOrder.setCode("CAPACITORBANK");
			this.state.workOrder.setTemplateId("59");
			this.state.workOrder.setAssignedTo("35");
			this.state.workOrder.setWOStatus("OPEN");
		}

		//console.log(this.props.auth.apiaryAuthAccount.account)
	}

	sendToCityworks(e) {
		e.preventDefault();
		this.setState({ loading: true });
		console.log(this.state.workOrder.getWO());
		var WO = this.state.workOrder.getWO();
		console.log(JSON.stringify(WO));

		fetch(urls.cityWorks + "WorkOrder/Create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + this.props.auth.cityworksAuthAccessToken
			},
			body: JSON.stringify(WO)
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

				console.log(this.state.workOrder);
				this.setState({ loading: false });
				alert(
					"Work order " +
						data[0].workOrderSid +
						" successfully added to Cityworks"
				);
				this.state.workOrder.clearWO();
			})
			.catch(console.log);
	}
	getTemplates() {
		fetch(urls.cityWorks + "WorkOrder/Templates", {
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
				this.setState({ templatesOps: data });
			})
			.then(() => {
				fetch(urls.cityWorks + "WorkOrder/CustomerServiceTemplates", {
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
							alert(
								"Your token for Cityworks has expired. Please refresh the page."
							);
							this.setState({ loading: false });
						} else {
							var error = new Error(response.statusText);
							throw error;
						}
					})
					.then(res => res.json())
					.then(data => {
						this.setState({ templatesCsr: data });
					})
					.catch(console.log);
			})
			.catch(console.log);
	}
	getEmployees() {
		fetch(urls.cityWorks + "Employee/All", {
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
				this.setState({ employees: data });
			})
			.catch(console.log);
	}
	getStatuses() {
		fetch(urls.cityWorks + "WorkOrder/Status", {
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
				this.setState({ status: data });
			})
			.catch(console.log);
	}
	getPriorities() {
		fetch(urls.cityWorks + "WorkOrder/Priority", {
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
				this.setState({ priorities: data });
			})
			.catch(console.log);
	}
	getGroups() {
		fetch(urls.cityWorks + "Entity/Groups?domainid=1", {
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
				this.setState({ entityGroups: data });
			})
			.catch(console.log);
	}
	getOwnerDetails() {
		if (this.props.lot.CustomerIndex.length > 0) {
			fetch(
				urls.springbrook +
					"Customer/ByIndex?customerIndex=" +
					this.props.lot.CustomerIndex,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							"Bearer " +
							this.props.auth.springBrookAuthAccessToken
					}
				}
			)
				.then(function (response) {
					if (response.ok) {
						return response;
					} else if (response.status === 401) {
						alert(
							"Your token has expired. Please refresh the page."
						);
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

					this.setState({ customer: data });
					this.state.workOrder.setCustomer(data);
					this.state.workOrder.setLot(this.props.lot);
				})
				.catch(console.log);
		}
	}
	getCode(templateList, templateID) {
		let temp = templateList.filter(
			template => template.woTemplateId === templateID
		);
		this.state.workOrder.setCode(temp[0].applyToEntity);
	}
	getGLs() {
		fetch(urls.dynamics + "Account/Accounts", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer " + this.props.auth.dynamicsAuthAccessToken
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
				this.setState({ glNumbers: data });
			})
			.catch(console.log);
	}
	render() {
		var templates = this.state.templatesOps.map(item => (
			<option
				key={item.woTemplateId}
				value={item.woTemplateId}
				onClick={e => {
					this.state.workOrder.setCode(item.applyToEntity);
				}}
			>
				{item.description} - {item.applyToEntity}{" "}
			</option>
		));
		var templatesCsr = this.state.templatesCsr.map(item => (
			<option
				key={item.woTemplateId}
				value={item.woTemplateId}
				onClick={e => {
					this.state.workOrder.setCode(item.applyToEntity);
				}}
			>
				{item.description} - {item.applyToEntity}{" "}
			</option>
		));

		var assignedOptions = this.state.employees.map(item => (
			<option key={item.employeeSid} value={item.employeeSid}>
				{item.firstName} {item.lastName}{" "}
			</option>
		));

		var employee = this.state.employees.map(item => (
			<option key={item.employeeSid} value={item.employeeSid}>
				{item.firstName} {item.lastName}{" "}
			</option>
		));
		var glOptions = [];

		var groups = this.state.entityGroups.map(item => (
			<option key={item.Module} value={item.Module}>
				{item.ModuleName}
			</option>
		));

		var statuses = this.state.status.map(item => (
			<option key={item.code} value={item.code}>
				{item.description}
			</option>
		));

		var priorities = this.state.priorities.map(item => (
			<option key={item.code} value={item.code}>
				{item.description}
			</option>
		));
		var glOptions = this.state.glNumbers.map(item => (
			<option
				key={item.DynamicsId}
				value={item.GLIndex}
				onClick={e => {
					this.state.workOrder.setGL(item.GLIndex);
				}}
			>
				{item.Name}{" "}
			</option>
		));

		return (
			<div className='modal fade' id='modal-CWworkOrder' tabIndex='-1'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<Form
							autoComplete='off'
							roll='form'
							className='bugForm'
							onSubmit={e => this.sendToCityworks(e)}
						>
							<div className='modal-header bg-orange color-palette'>
								<h4 className='modal-title'>
									Create <b>Cityworks</b> Work Order
								</h4>
								<button
									type='button'
									className='close'
									data-bs-dismiss='modal'
									aria-label='Close'
								>
									<span aria-hidden='true'>&times;</span>
								</button>
							</div>
							{this.state.loading ? (
								<LoadingSpinner />
							) : (
								<div className='modal-body'>
									{/*text input */}
									{this.state.customer != null ? (
										<div className='row'>
											<div className='col-sm-12'>
												<p>
													<b>Lot: </b>
													{
														this.props.lot
															.streetNumber
													}{" "}
													{
														this.props.lot
															.streetDirectional
													}{" "}
													{this.props.lot.streetName}
													<b>Customer: </b>
													{
														this.state.customer[0]
															.firstName
													}{" "}
													{
														this.state.customer[0]
															.lastName
													}
												</p>
											</div>
										</div>
									) : (
										<div>
											<div className='row'>
												<div className='col-sm-6'>
													<div className='form-group'>
														<label>
															Customer Name
														</label>
														<Input
															required
															id='customer'
															type='input'
															className='form-control'
															placeholder='Customer Name'
															value={
																this.state
																	.workOrder
																	.CustomerName
															}
															onChange={e =>
																this.state.workOrder.setCustomerName(
																	e.target
																		.value
																)
															}
														></Input>
													</div>
												</div>
												<div className='col-sm-6'>
													<div className='form-group'>
														<label>Location</label>
														<Input
															required
															id='location'
															type='input'
															className='form-control'
															placeholder='Location'
															value={
																this.state
																	.workOrder
																	.Location
															}
															onChange={e =>
																this.state.workOrder.setLocation(
																	e.target
																		.value
																)
															}
														></Input>
													</div>
												</div>
											</div>
											<div className='row'>
												<div className='col-sm-12'>
													<div className='form-group'>
														<label>Address</label>
														<Input
															required
															id='address'
															type='input'
															className='form-control'
															placeholder='Address'
															value={
																this.state
																	.workOrder
																	.Address
															}
															onChange={e =>
																this.state.workOrder.setAddress(
																	e.target
																		.value
																)
															}
														></Input>
													</div>
												</div>
											</div>
										</div>
									)}
									<div className='row'>
										{this.state.employees.length > 0 ? (
											<div className='col-sm-4'>
												{/*text input */}
												<div className='form-group'>
													<label>Creator</label>
													<Input
														required
														id='creator'
														type='select'
														className='form-control'
														placeholder='Enter WO creator'
														value={
															this.state.workOrder
																.creator
														}
														onChange={
															e =>
																this.state.workOrder.setCreator(
																	e.target
																		.value
																)
															// this.setState({
															// 	creator: e.target.value,
															// })
														}
													>
														<option>---</option>
														{employee}
													</Input>
												</div>
											</div>
										) : null}

										<div className='col-sm-4'>
											{/*text input */}
											{this.props.profile.viewName ===
												"Operations" ||
											this.props.profile.viewName ===
												"Super User" ? (
												<Fragment>
													{this.state.entityGroups
														.length > 0 ? (
														<div className='form-group'>
															<label>
																Type of Work
																Order
															</label>
															<Input
																required
																id='dep'
																type='select'
																className='form-control'
																value={
																	this.state
																		.workOrder
																		.Type
																}
																onChange={e => {
																	this.state.workOrder.setType(
																		e.target
																			.value
																	);
																}}
															>
																<option>
																	---
																</option>

																{groups}
															</Input>
														</div>
													) : null}
												</Fragment>
											) : (
												<Fragment>
													{this.state.entityGroups
														.length > 0 ? (
														<div className='form-group'>
															<label>
																Type of Work
																Order
															</label>
															<Input
																required
																id='dep'
																type='select'
																className='form-control'
																value={
																	this.state
																		.workOrder
																		.Type
																}
																onChange={e => {
																	this.state.workOrder.setTemplateId(
																		e.target
																			.value
																	);
																	this.getCode(
																		this
																			.state
																			.templatesOps,
																		e.target
																			.value
																	);
																}}
															>
																<option>
																	---
																</option>

																{templatesCsr}
															</Input>
														</div>
													) : null}
												</Fragment>
											)}
										</div>
										<div className='col-sm-4'>
											{/*text input */}

											{this.state.priorities.length >
											0 ? (
												<div className='form-group'>
													<label>Priority</label>
													<Input
														required
														id='dep'
														type='select'
														className='form-control'
														value={
															this.state.workOrder
																.Type
														}
														onChange={e => {
															this.state.workOrder.setPriority(
																e.target.value
															);
														}}
													>
														<option>---</option>

														{priorities}
													</Input>
												</div>
											) : null}
										</div>
									</div>
									{this.props.profile.viewName ===
										"Operations" ||
									this.props.profile.viewName ===
										"Super User" ? (
										<div className='row'>
											<div className='col-sm-3'>
												{/* text input */}
												<div className='form-group'>
													<label>Assigned To</label>
													<Input
														id='assignedTo'
														type='select'
														className='form-control'
														placeholder='Who is doing the work'
														value={
															this.state.workOrder
																.assignedTo
														}
														onChange={e => {
															this.state.workOrder.setAssignedTo(
																e.target.value
															);
															// this.setState({
															// 	assignedTo: e.target.value,
															// })
														}}
													>
														<option>---</option>
														{assignedOptions}
													</Input>
												</div>
											</div>
											<div className='col-sm-3'>
												{/*text input */}
												{this.state.entityGroups
													.length > 0 ? (
													<div className='form-group'>
														<label>Status</label>
														<Input
															required
															id='dep'
															type='select'
															className='form-control'
															value={
																this.state
																	.workOrder
																	.Status
															}
															onChange={e => {
																this.state.workOrder.setWOStatus(
																	e.target
																		.value
																);
															}}
														>
															<option>---</option>

															{statuses}
														</Input>
													</div>
												) : null}
											</div>
											{this.state.glNumbers.length > 0 ? (
												<div className='col-sm-3'>
													<div className='form-group'>
														<label>
															GL Account
														</label>
														<Input
															id='glAccount'
															type='select'
															className='form-control'
															placeholder=''
															value={
																this.state
																	.workOrder
																	.glAccount
															}
															invalid={
																this.state
																	.invalidGL
															}
															onChange={e =>
																this.state.workOrder.setGL(
																	e.target
																		.value
																)
															}
														>
															<option>---</option>
															{glOptions}
														</Input>
														<FormFeedback
															invalid={
																this.state
																	.invalidGL
															}
														></FormFeedback>
													</div>
												</div>
											) : null}

											{this.state.templatesOps.length >
											0 ? (
												<div className='col-sm-3'>
													<div className='form-group'>
														<label>
															Entity Group
														</label>
														<Input
															required
															id='dep'
															type='select'
															className='form-control'
															value={
																this.state
																	.workOrder
																	.templateId
															}
															onChange={e => {
																this.state.workOrder.setTemplateId(
																	e.target
																		.value
																);
																this.getCode(
																	this.state
																		.templatesOps,
																	e.target
																		.value
																);
															}}
														>
															<option>---</option>

															{templates}
														</Input>
													</div>
												</div>
											) : null}
										</div>
									) : null}

									<div className='row'>
										<div className='col-sm-12'>
											{/* textarea */}
											<div className='form-group'>
												<label>Instructions</label>
												<Input
													required
													id='des'
													type='textarea'
													className='form-control'
													rows='5'
													placeholder='Enter instructions for the work order'
													value={
														this.state.workOrder
															.Notes
													}
													onChange={e =>
														this.state.workOrder.setNotes(
															e.target.value
														)
													}
												></Input>
											</div>
										</div>
									</div>
								</div>
							)}
							{/* end .modal-body */}

							<div className='modal-footer justify-content-between'>
								<Input type='submit' className='btn btn-info' />
								<button
									type='button'
									className='btn btn-default'
									data-bs-dismiss='modal'
								>
									Close
								</button>
							</div>
						</Form>
					</div>
					{/* end .modal-content */}
				</div>
				{/* end .modal-dialog */}
			</div>
			// end.modal
		);
	}
}
export default CityWorksWorkOrder;
