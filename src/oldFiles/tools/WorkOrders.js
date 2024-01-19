import React, { Component, Fragment } from "react";
import fetch from "isomorphic-fetch";
import {
	Container,
	UncontrolledTooltip,
	InputGroupText,
	Input,
	Row,
	Col,
	Form,
	Label,
	FormGroup,
	Table
} from "reactstrap";
import LoadingSpinner from "../LoadingSpinner";
import * as urls from "../../utils/urlsConfig";
import WorkOrderForm from "../../components/common/modals/CreateWorkOrder";
import { WorkOrder } from "../classes/WorkOrder";
import { WorkOrderLEMS } from "../classes/WorkOrderLEMS";
import ReactPaginate from "react-paginate";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import "jquery-ui";
import { Button, InputGroup } from "react-bootstrap";

class CityworksWorkOrders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: urls.springbrook + "WorkOrder/ByStatus?status=in progress",
			selectedStatus: "OPEN",
			workOrderNums: [],
			dropdownOpen: false,
			status: [],
			isHidden: true,
			springbrookworkOrders: [],
			cityworksWorkOrders: [],
			glNumbers: [],
			employees: [],
			loading: false,
			page: 0,
			disabled: true,
			labor: [],
			laborLoad: false,
			lot: {
				CustomerIndex: "",
				streetNumber: "",
				streetDirectional: "",
				streetName: ""
			}
		};
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.toggleLoading = this.toggleLoading.bind(this);
		this.getStatuses = this.getStatuses.bind(this);
		this.getCityWorks = this.getCityWorks.bind(this);
		this.refreshLabor = this.refreshLabor.bind(this);
		this.refreshMaterial = this.refreshMaterial.bind(this);
		this.refreshEquipment = this.refreshEquipment.bind(this);
		this.getGLs = this.getGLs.bind(this);
		this.getEmployees = this.getEmployees.bind(this);
		this.handelDescription = this.handelDescription.bind(this);
		this.handelEndDate = this.handelEndDate.bind(this);
		this.handelGL = this.handelGL.bind(this);
		this.handelStartDate = this.handelStartDate.bind(this);
		this.handelStatus = this.handelStatus.bind(this);
		this.handelTime = this.handelTime.bind(this);
	}

	toggleLoading() {
		this.setState({ loading: !this.state.loading });
	}
	toggleDropDown() {
		this.setState({ dropdownOpen: !this.state.dropdownOpen });
	}

	componentDidMount() {
		if (
			this.props.profile.viewName === "Operations" ||
			this.props.profile.viewName === "Super User"
		) {
			this.setState({ disabled: false });
		}
		this.getStatuses();
		this.getGLs();
		this.getEmployees();

		this.props.jqueryCardFunction();
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
				this.setState({ employees: data });
			})
			.catch(console.log);
	}
	getCityWorks() {
		this.setState({ loading: true, cityworksWorkOrders: [] });
		console.log("Selected Staus is" + this.state.selectedStatus);
		fetch(
			urls.cityWorks +
				"WorkOrder/SearchByStatus?status=" +
				this.state.selectedStatus,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer " + this.props.auth.cityworksAuthAccessToken
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
					error.response = response;
					throw error;
				}
			})
			.then(res => res.json())
			.then(data => {
				console.log("we got the city works work orders");
				this.setState({ cityworksWorkOrders: [] });
				var tempdata = data;

				tempdata
					.sort((a, b) => {
						return a.WorkOrderIndex - b.WorkOrderIndex;
					})
					.map(wo => {
						var tempwo = new WorkOrderLEMS();
						tempwo.setWO(wo);
						// tempwo.workorder.Labor=[]
						this.state.cityworksWorkOrders.push(tempwo.workorder);
					});
				console.log("sorted WO");
				console.log(this.state.cityworksWorkOrders);

				this.setState({
					cityworksWorkOrders: this.state.cityworksWorkOrders
				});
			})
			.finally(() => this.setState({ loading: false }))
			.catch(console.log);
	}

	refreshLabor(e, woIndex) {
		e.preventDefault();
		this.setState({ laborLoad: true, loading: true });
		var temp;
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				temp = this.state.cityworksWorkOrders[i];
				fetch(
					urls.cityWorks + "WorkOrder/Labor?workOrderSid=" + woIndex,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " +
								this.props.auth.cityworksAuthAccessToken
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
							error.response = response;
							throw error;
						}
					})
					.then(res => res.json())
					.then(data => {
						temp.Labor = data;
					})
					.then(() => {
						this.state.cityworksWorkOrders[i] = temp;
						this.setState({
							cityworksWorkOrders: this.state.cityworksWorkOrders
						});
						var time = 0;
						while (time < 100) {
							time++;
						}
					})
					.catch(console.log);

				this.setState({ loading: false, laborLoad: false });
			}
		}
	}
	refreshMaterial(e, woIndex) {
		e.preventDefault();
		this.setState({ loading: true });
		var temp;
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				temp = this.state.cityworksWorkOrders[i];
				fetch(
					urls.cityWorks +
						"WorkOrder/Material?workOrderSid=" +
						woIndex,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " +
								this.props.auth.cityworksAuthAccessToken
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
							error.response = response;
							throw error;
						}
					})
					.then(res => res.json())
					.then(data => {
						temp.Material = data;
					})
					.then(() => {
						this.state.cityworksWorkOrders[i] = temp;
						this.setState({
							cityworksWorkOrders: this.state.cityworksWorkOrders
						});
						var time = 0;
						while (time < 100) {
							time++;
						}
					})
					.catch(console.log);

				this.setState({ loading: false });
			}
		}
	}
	refreshEquipment(e, woIndex) {
		e.preventDefault();
		this.setState({ loading: true });
		var temp;
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				temp = this.state.cityworksWorkOrders[i];
				fetch(
					urls.cityWorks +
						"WorkOrder/Equipment?workOrderSid=" +
						woIndex,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization:
								"Bearer " +
								this.props.auth.cityworksAuthAccessToken
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
							error.response = response;
							throw error;
						}
					})
					.then(res => res.json())
					.then(data => {
						temp.Equipment = data;
					})
					.then(() => {
						this.state.cityworksWorkOrders[i] = temp;
						this.setState({
							cityworksWorkOrders: this.state.cityworksWorkOrders
						});
						var time = 0;
						while (time < 100) {
							time++;
						}
					})
					.catch(console.log);

				this.setState({ loading: false });
			}
		}
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
	updateWorkOrder(e, woIndex) {
		e.preventDefault();
		var woLEMS = this.state.cityworksWorkOrders.filter(
			val => val.WorkOrderIndex == woIndex
		);
		var wo = new WorkOrder();
		wo.setWO(woLEMS[0]);
		console.log(wo.getWOForUpdate());
		var bodyJSON = JSON.stringify(wo.getWOForUpdate());
		fetch(urls.cityWorks + "WorkOrder/Update", {
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
				console.log(data);
			})
			.catch(console.log);
	}
	updateWorkOrderLEMS(e, woIndex, LEM) {
		e.preventDefault();
		var woLEMS = this.state.cityworksWorkOrders.filter(
			val => val.WorkOrderIndex == woIndex
		);
		console.log(woLEMS);
		var bodyJSON;
		var url;
		switch (LEM) {
			case "Labor":
				bodyJSON = JSON.stringify(woLEMS[0].Labor);
				url = urls.cityWorks + "WorkOrder/UpdateLabors";
			case "Material":
				bodyJSON = JSON.stringify(woLEMS[0].Material);
				url = urls.cityWorks + "WorkOrder/UpdateMaterials";
			case "Equipment":
				bodyJSON = JSON.stringify(woLEMS[0].Equipment);
				url = urls.cityWorks + "WorkOrder/UpdateEquipments";
		}
		fetch(url, {
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
				this.refreshLabor(e, woIndex);
			})
			.catch(console.log);
	}
	// for pagination
	changePage = ({ selected }) => {
		this.setState({ page: selected });
	};
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
	handelEmployee(e, woIndex, activityIndex) {
		console.log("in handelEmployee");
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				console.log("if statement for WO match");
				for (
					var j = 0;
					j < this.state.cityworksWorkOrders[i].Labor.length;
					j++
				) {
					if (
						this.state.cityworksWorkOrders[i].Labor[j]
							.ActivityIndex === activityIndex
					) {
						console.log(
							"in handelEmployee if statement for labor match"
						);
						console.log(this.state.cityworksWorkOrders[i].Labor[j]);
						this.state.cityworksWorkOrders[i].Labor[j].name =
							e.target.value;
						this.setState({
							cityworksWorkOrders: this.state.cityworksWorkOrders
						});
						console.log(this.state.cityworksWorkOrders[i].Labor);
					}
				}
			}
		}
	}
	handelStatus(e, woIndex) {
		e.preventDefault();
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				this.state.cityworksWorkOrders[i].Status = e.target.value;
				this.setState({
					cityworksWorkOrders: this.state.cityworksWorkOrders
				});
			}
		}
	}
	handelTime(e, woIndex, activityIndex, type) {
		e.preventDefault();
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				if (type === "Labor") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Labor.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Labor[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Labor[
								j
							].activityHours = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				} else if (type === "Equipment") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Equipment.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Equipment[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Equipment[
								j
							].activityHours = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				} else {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Material.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Material[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Material[
								j
							].activityHours = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				}
			}
		}
	}
	handelDescription(e, woIndex, activityIndex, type) {
		e.preventDefault();
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				if (type === "Labor") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Labor.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Labor[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Labor[
								j
							].description = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				} else if (type === "Equipment") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Equipment.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Equipment[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Equipment[
								j
							].description = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				} else {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Material.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Material[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Material[
								j
							].description = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(this.state.cityworksWorkOrders[i]);
						}
					}
				}
			}
		}
	}
	handelGL(e, woIndex, activityIndex, type) {
		e.preventDefault();
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				if (type === "Labor") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Labor.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Labor[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Labor[j].GLIndex =
								e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(
								this.state.cityworksWorkOrders[i].Labor
							);
						}
					}
				} else if (type === "Equipment") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Equipment.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Equipment[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Equipment[
								j
							].GLIndex = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(
								this.state.cityworksWorkOrders[i].Equipment
							);
						}
					}
				} else {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Material.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Material[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Material[
								j
							].GLIndex = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(
								this.state.cityworksWorkOrders[i].Material
							);
						}
					}
				}
			}
		}
	}
	handelStartDate(e, woIndex, activityIndex, type) {
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				if (type === "Labor") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Labor.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Labor[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Labor[
								j
							].startDate = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(
								this.state.cityworksWorkOrders[i].Labor
							);
						}
					}
				} else if (type === "Equipment") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Equipment.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Equipment[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Equipment[
								j
							].startDate = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
						}
					}
				} else {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Material.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Material[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Material[
								j
							].startDate = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
						}
					}
				}
			}
		}
	}
	handelEndDate(e, woIndex, activityIndex, type) {
		for (var i = 0; i < this.state.cityworksWorkOrders.length; i++) {
			if (this.state.cityworksWorkOrders[i].WorkOrderIndex === woIndex) {
				if (type === "Labor") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Labor.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Labor[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Labor[j].endDate =
								e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
							console.log(
								this.state.cityworksWorkOrders[i].Labor
							);
						}
					}
				} else if (type === "Equipment") {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Equipment.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Equipment[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Equipment[
								j
							].endDate = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
						}
					}
				} else {
					for (
						var j = 0;
						j < this.state.cityworksWorkOrders[i].Material.length;
						j++
					) {
						if (
							this.state.cityworksWorkOrders[i].Material[j]
								.ActivityIndex === activityIndex
						) {
							this.state.cityworksWorkOrders[i].Material[
								j
							].endDate = e.target.value;
							this.setState({
								cityworksWorkOrders:
									this.state.cityworksWorkOrders
							});
						}
					}
				}
			}
		}
	}
	render() {
		// start pagination vars
		const WOPerPage = 10;
		const numberOfWOVistited = this.state.page * WOPerPage;
		const totalPages = Math.ceil(
			this.state.cityworksWorkOrders.length / WOPerPage
		);
		// end pagination vars
		var statuses = this.state.status.map(item => (
			<option key={item.code} value={item.code}>
				{item.description}
			</option>
		));
		var gls = this.state.glNumbers.map(item => (
			<option key={item.GLIndex} value={item.GLIndex}>
				{item.Name}{" "}
			</option>
		));
		var employee = this.state.employees.map(item => (
			<option key={item.employeeSid} value={item.fullName}>
				{item.fullName}{" "}
			</option>
		));
		var workOrderBody = (
			<div className='accordion' id='accordionWorkOrder'>
				{!workOrders ? (
					<h4>
						There are no work orders loaded. Please select a status
						and push submit.
					</h4>
				) : (
					<Fragment>
						{this.state.cityworksWorkOrders
							.slice(
								numberOfWOVistited,
								numberOfWOVistited + WOPerPage
							)
							.map(wo => {
								return (
									<div
										className='accordion-item'
										key={wo.WorkOrderIndex}
									>
										<h2
											className='accordion-header'
											id={"heading" + wo.WorkOrderIndex}
										>
											<button
												className='accordion-button collapsed'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={
													"#collapse" +
													wo.WorkOrderIndex
												}
												aria-expanded='false'
												aria-controls={
													"collapse" +
													wo.WorkOrderIndex
												}
											>
												<b>
													Work Order #
													{wo.WorkOrderIndex}:
												</b>
												&nbsp;{wo.Description}
											</button>
										</h2>
										<div
											id={"collapse" + wo.WorkOrderIndex}
											className='accordion-collapse collapse'
											aria-labelledby={
												"heading" + wo.WorkOrderIndex
											}
											data-bs-parent='#accordionWorkOrder'
										>
											<div className='accordion-body'>
												<Form
													autoComplete='off'
													roll='form'
													className='bugForm'
													onSubmit={e =>
														this.updateWorkOrderLEMS(
															e,
															wo.WorkOrderIndex
														)
													}
												>
													<FormGroup row>
														<Label sm={2}>
															Status
														</Label>
														<Input
															sm={2}
															required
															id='dep'
															type='select'
															className='form-control'
															value={wo.Status}
															onChange={e => {
																this.handelStatus(
																	e,
																	wo.WorkOrderIndex
																);
															}}
														>
															<option>---</option>

															{statuses}
														</Input>
													</FormGroup>

													{this.state.laborLoad ? (
														<LoadingSpinner />
													) : (
														<Fragment>
															<div
																className='accordion'
																id={
																	"accordionWorkOrder" +
																	wo.WorkOrderIndex
																}
															>
																<div className='accordion-item'>
																	<h2
																		className='accordion-header'
																		id={
																			"labor" +
																			wo.WorkOrderIndex
																		}
																	>
																		<button
																			className='accordion-button collapsed'
																			type='button'
																			data-bs-toggle='collapse'
																			data-bs-target={
																				"#collapselabor" +
																				wo.WorkOrderIndex
																			}
																			aria-expanded='false'
																			aria-controls={
																				"collapselabor" +
																				wo.WorkOrderIndex
																			}
																		>
																			Labor
																		</button>
																	</h2>
																	<div
																		id={
																			"collapselabor" +
																			wo.WorkOrderIndex
																		}
																		className='accordion-collapse collapse'
																		aria-labelledby={
																			"labor" +
																			wo.WorkOrderIndex
																		}
																		data-bs-parent={
																			"#accordionWorkOrder" +
																			wo.WorkOrderIndex
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
																							Worker
																						</th>
																						<th>
																							Description
																						</th>
																						<th>
																							Hours
																						</th>
																						<th>
																							Start
																							Date
																						</th>
																						<th>
																							End
																							Date
																						</th>
																						<th>
																							GL
																							Account
																						</th>
																					</tr>
																				</thead>
																				<tbody>
																					{wo
																						.Labor
																						.length >
																					0 ? (
																						<Fragment>
																							{wo.Labor.map(
																								labor => (
																									<tr
																										key={
																											labor.ActivityIndex
																										}
																									>
																										<th>
																											<Input
																												required
																												id='laborWorker'
																												type='select'
																												className='form-control'
																												value={
																													labor.name
																												}
																												onChange={e => {
																													this.handelEmployee(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex
																													);
																													console.log(
																														e
																															.target
																															.value
																													);
																												}}
																											>
																												<option>
																													{
																														labor.name
																													}
																												</option>

																												{
																													employee
																												}
																											</Input>
																										</th>
																										<th>
																											<Input
																												required
																												id='laborDescription'
																												type='text'
																												className='form-control'
																												value={
																													labor.description
																												}
																												onChange={e => {
																													this.handelDescription(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex,
																														"Labor"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='laborHours'
																												type='number'
																												className='form-control'
																												value={
																													labor.activityHours
																												}
																												onChange={e => {
																													this.handelTime(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex,
																														"Labor"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='laborStart'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													labor.startDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelStartDate(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex,
																														"Labor"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='laborEnd'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													labor.endDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelEndDate(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex,
																														"Labor"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='laborGL'
																												type='select'
																												className='form-control'
																												value={
																													labor.GLIndex
																												}
																												onChange={e => {
																													this.handelGL(
																														e,
																														labor.WorkOrderIndex,
																														labor.ActivityIndex,
																														"Labor"
																													);
																												}}
																											>
																												<option>
																													---
																												</option>

																												{
																													gls
																												}
																											</Input>
																										</th>
																									</tr>
																								)
																							)}
																						</Fragment>
																					) : (
																						<tr>
																							No
																							labor
																							data
																							is
																							available
																							at
																							this
																							time.{" "}
																						</tr>
																					)}
																					<Button
																						onClick={e =>
																							this.updateWorkOrderLEMS(
																								e,
																								wo.WorkOrderIndex,
																								"Labor"
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
																								wo.WorkOrderIndex
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
																<div className='accordion-item'>
																	<h2
																		className='accordion-header'
																		id={
																			"material" +
																			wo.WorkOrderIndex
																		}
																	>
																		<button
																			className='accordion-button collapsed'
																			type='button'
																			data-bs-toggle='collapse'
																			data-bs-target={
																				"#collapsematerial" +
																				wo.WorkOrderIndex
																			}
																			aria-expanded='false'
																			aria-controls={
																				"collapsematerial" +
																				wo.WorkOrderIndex
																			}
																		>
																			Material
																		</button>
																	</h2>
																	<div
																		id={
																			"collapsematerial" +
																			wo.WorkOrderIndex
																		}
																		className='accordion-collapse collapse'
																		aria-labelledby={
																			"material" +
																			wo.WorkOrderIndex
																		}
																		data-bs-parent={
																			"#accordionWorkOrder" +
																			wo.WorkOrderIndex
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
																							Description
																						</th>
																						<th>
																							Hours
																						</th>
																						<th>
																							Start
																							Date
																						</th>
																						<th>
																							End
																							Date
																						</th>
																						<th>
																							GL
																							Account
																						</th>
																					</tr>
																				</thead>
																				<tbody>
																					{wo
																						.Material
																						.length >
																					0 ? (
																						<Fragment>
																							{wo.Material.map(
																								material => (
																									<tr
																										key={
																											material.ActivityIndex
																										}
																									>
																										<th>
																											<Input
																												required
																												id='materialDescription'
																												type='text'
																												className='form-control'
																												value={
																													material.description
																												}
																												onChange={e => {
																													this.handelDescription(
																														e,
																														material.WorkOrderIndex,
																														material.ActivityIndex,
																														"Material"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='materialHours'
																												type='number'
																												className='form-control'
																												value={
																													material.activityHours
																												}
																												onChange={e => {
																													this.handelTime(
																														e,
																														material.WorkOrderIndex,
																														material.ActivityIndex,
																														"Material"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='materialStart'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													material.startDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelStartDate(
																														e,
																														material.WorkOrderIndex,
																														material.ActivityIndex,
																														"Material"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='materialEnd'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													material.endDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelEndDate(
																														e,
																														material.WorkOrderIndex,
																														material.ActivityIndex,
																														"Material"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='materialGL'
																												type='select'
																												className='form-control'
																												value={
																													material.gl
																												}
																												onChange={e => {
																													this.handelGL(
																														e,
																														material.WorkOrderIndex,
																														material.ActivityIndex,
																														"Material"
																													);
																												}}
																											>
																												<option>
																													---
																												</option>

																												{
																													gls
																												}
																											</Input>
																										</th>
																									</tr>
																								)
																							)}
																						</Fragment>
																					) : (
																						<tr>
																							No
																							material
																							data
																							is
																							available
																							at
																							this
																							time.{" "}
																						</tr>
																					)}
																					<Button
																						onClick={e =>
																							this.updateWorkOrderLEMS(
																								e,
																								wo.WorkOrderIndex,
																								"Material"
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
																							this.refreshMaterial(
																								e,
																								wo.WorkOrderIndex
																							);
																						}}
																					>
																						Refresh
																						material
																						data
																					</Button>
																				</tbody>
																			</Table>
																		</div>
																	</div>
																</div>
																<div className='accordion-item'>
																	<h2
																		className='accordion-header'
																		id={
																			"equipment" +
																			wo.WorkOrderIndex
																		}
																	>
																		<button
																			className='accordion-button collapsed'
																			type='button'
																			data-bs-toggle='collapse'
																			data-bs-target={
																				"#collapseequipment" +
																				wo.WorkOrderIndex
																			}
																			aria-expanded='false'
																			aria-controls={
																				"collapseequipment" +
																				wo.WorkOrderIndex
																			}
																		>
																			Equipment
																		</button>
																	</h2>
																	<div
																		id={
																			"collapseequipment" +
																			wo.WorkOrderIndex
																		}
																		className='accordion-collapse collapse'
																		aria-labelledby={
																			"equipment" +
																			wo.WorkOrderIndex
																		}
																		data-bs-parent={
																			"#accordionWorkOrder" +
																			wo.WorkOrderIndex
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
																							Description
																						</th>
																						<th>
																							Hours
																						</th>
																						<th>
																							Start
																							Date
																						</th>
																						<th>
																							End
																							Date
																						</th>
																						<th>
																							GL
																							Account
																						</th>
																					</tr>
																				</thead>
																				<tbody>
																					{wo
																						.Equipment
																						.length >
																					0 ? (
																						<Fragment>
																							{wo.Equipment.map(
																								equipment => (
																									<tr
																										key={
																											equipment.ActivityIndex
																										}
																									>
																										<th>
																											<Input
																												required
																												id='equipmentDescription'
																												type='text'
																												className='form-control'
																												value={
																													equipment.description
																												}
																												onChange={e => {
																													this.handelDescription(
																														e,
																														equipment.WorkOrderIndex,
																														equipment.ActivityIndex,
																														"Equipment"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='equipmentHours'
																												type='number'
																												className='form-control'
																												value={
																													equipment.activityHours
																												}
																												onChange={e => {
																													this.handelTime(
																														e,
																														equipment.WorkOrderIndex,
																														equipment.ActivityIndex,
																														"Equipment"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='equipmentStart'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													equipment.startDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelStartDate(
																														e,
																														equipment.WorkOrderIndex,
																														equipment.ActivityIndex,
																														"Equipment"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='equipmentEnd'
																												type='text'
																												placeholder='mm/dd/yyyy'
																												value={
																													equipment.endDate
																												}
																												className='form-control'
																												onChange={e => {
																													this.handelEndDate(
																														e,
																														equipment.WorkOrderIndex,
																														equipment.ActivityIndex,
																														"Equipment"
																													);
																												}}
																											/>
																										</th>
																										<th>
																											<Input
																												required
																												id='equipmentGL'
																												type='select'
																												className='form-control'
																												value={
																													equipment.gl
																												}
																												onChange={e => {
																													this.handelGL(
																														e,
																														equipment.WorkOrderIndex,
																														equipment.ActivityIndex,
																														"Equipment"
																													);
																												}}
																											>
																												<option>
																													---
																												</option>

																												{
																													gls
																												}
																											</Input>
																										</th>
																									</tr>
																								)
																							)}
																						</Fragment>
																					) : (
																						<tr>
																							No
																							equipment
																							data
																							is
																							available
																							at
																							this
																							time.{" "}
																						</tr>
																					)}
																					<Button
																						onClick={e =>
																							this.updateWorkOrderLEMS(
																								e,
																								wo.WorkOrderIndex,
																								"Equipment"
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
																							this.refreshEquipment(
																								e,
																								wo.WorkOrderIndex
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
															this.updateWorkOrder(
																e,
																wo.WorkOrderIndex
															)
														}
													>
														Update WO#{" "}
														{wo.WorkOrderIndex}
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
		var statuses = this.state.status.map(item => (
			<option key={item.code} value={item.code}>
				{item.code}
			</option>
		));

		return (
			<Fragment>
				<WorkOrderForm lot={this.state.lot} {...this.props} />

				<div className='col-md-12'>
					<div
						className={
							"card card-tools " +
							this.props.profile.views.tools.workOrdersExpand
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
								Work Orders
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
										.workOrdersExpand === "" ? (
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
									onClick={e => this.props.toggleWorkOrders()}
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
											<h1>Work Orders</h1>
											<Row>
												<Col sm={{ size: "3" }}>
													<button
														className='bg-orange btn'
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
														Create a Work Order
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
													{workOrderBody}
													{this.state
														.cityworksWorkOrders
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
																"navigationDisabled"
															}
															activeClassName={
																"paginationActive"
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
export default CityworksWorkOrders;
