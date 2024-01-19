import React, { Component, Fragment } from "react";
import fetch from "isomorphic-fetch";
import * as urls from "../../utils/urlsConfig";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import MeterReadModal from "../meters/meterReadModal";

/**
 * displayes a list of meters associated with a lot
 */

class MeterList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemDetails: [],
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
			lot: []
		};
	}

	componentDidMount() {
		this.getMeters();
		this.getLot();
		this.props.jqueryCardFunction();
	}
	/**
	 * gets lot details
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
					alert("Your token has expired. Please refresh the page");
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
						lot: data[0]
					});
				}
			})
			.catch(console.log);
	}
	/**
	 * gets all meters associated with a lot
	 */
	getMeters() {
		fetch(
			this.state.sbURL +
				"Meter/ByLotIndex?lotIndex=" +
				this.props.lotIndex,
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
					var temp = data;

					this.setState({
						itemDetails: temp,
						returnrdResults: true,
						dataReturned: true
					});
				}
			})
			.catch(console.log);
	}
	openMeterCard() {
		this.props.toggleMeter(true, true);
	}

	render() {
		var meterBody = (
			<div className='accordion' id='accordionMeters'>
				{this.state.itemDetails.length === 0 ? (
					<p>There are no meters for the property.</p>
				) : (
					<Fragment>
						{this.state.itemDetails.map(meter => {
							return (
								<Fragment>
									<div className='accordion-item'>
										<h2
											className='accordion-header'
											id={"heading" + meter.MeterIndex}
										>
											<button
												className='accordion-button collapsed bg-primary color-palette-set'
												type='button'
												data-bs-toggle='collapse'
												data-bs-target={
													"#collapse" +
													meter.MeterIndex
												}
												aria-expanded='false'
												aria-controls={
													"collapse" +
													meter.MeterIndex
												}
											>
												Meter #{meter.MeterIndex}:{" "}
												<b>&nbsp;{meter.deviceType}</b>
											</button>
										</h2>
										<div
											id={"collapse" + meter.MeterIndex}
											className='accordion-collapse collapse'
											aria-labelledby={
												"heading" + meter.MeterIndex
											}
											data-bs-parent='#accordionMeters'
										>
											<div className='accordion-body'>
												<div>
													<p>
														<b>Meter Number:</b>{" "}
														{meter.MeterIndex}
													</p>
													<p>
														<b>Route Number:</b>{" "}
														{meter.RouteNumber}
													</p>
													<p>
														<b>Model Number:</b>{" "}
														{meter.Model}
													</p>
													<p>
														<b>Address:</b>{" "}
														{
															this.state.lot
																.streetNumber
														}{" "}
														{
															this.state.lot
																.streetDirectional
														}{" "}
														{
															this.state.lot
																.streetName
														}
													</p>
													<p>
														<b>Device Type:</b>{" "}
														{meter.Devicetype}
													</p>

													<p>
														<b>Location:</b>{" "}
														{meter.Location}
													</p>
													<p>
														<b> Last Read Date: </b>{" "}
														{meter.LastReadingDate}
													</p>

													<p>
														<b>Read: </b>{" "}
														{meter.LastReading}
													</p>
												</div>
												<MeterReadModal
													meter={meter}
													lot={this.state.lot}
													apiaryAuth={
														this.props.auth
															.apiaryAuthAccessToken
													}
													{...this.props}
												/>
											</div>
										</div>
									</div>
								</Fragment>
							);
						})}
					</Fragment>
				)}
			</div>
		);
		return (
			<div>
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
								Meter List
							</h3>
							<div className='card-tools'>
								{/* <button
                                type='button'
                                className='btn btn-tool btn-compress'
                                data-toggle='tooltip'
                                data-placement='top'
                                title='Reduce Size'
                            >
                                <i className='fas fa-search-minus'></i>
                            </button>
                            <button
                                type='button'
                                className='btn btn-tool btn-expand'
                                data-toggle='tooltip'
                                data-placement='top'
                                title='Increase Size'
                            >
                                <i className='fas fa-search-plus'></i>
                            </button> */}
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
									// data-card-widget='remove'
									data-toggle='tooltip'
									data-placement='top'
									title='Remove Item'
									onClick={e =>
										this.props.toggleMeterList(true, false)
									}
								>
									<i className='fas fa-times'></i>
								</button>
							</div>
						</div>
						{/* /.card-header */}
						{this.state.returnrdResults ? (
							<div className='card-body'>{meterBody}</div>
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
export default MeterList;
