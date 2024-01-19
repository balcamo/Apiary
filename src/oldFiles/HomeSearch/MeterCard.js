import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import * as urls from "../../utils/urlsConfig";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import MeterReadModal from "../meters/meterReadModal";

/**
 * displayes meter details of one meter based on asearched meter
 */

class MeterCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			itemDetails: {},
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
			addressDetails: ""
		};
	}

	componentDidMount() {
		this.getMeter();
		this.props.jqueryCardFunction();
	}
	/**
	 * gets the details of the meter based on the meter index
	 */
	getMeter() {
		console.log(this.props.meterIndex);
		fetch(
			this.state.sbURL +
				"Meter/ByIndex?meterIndex=" +
				this.props.meterIndex,
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
				if (data === "No meter found." || data === "No meter found") {
					this.setState({
						dataReturned: false,
						returnrdResults: true
					});
				} else {
					this.setState({
						itemDetails: data
					});
					this.props.updatelotIndex(this.state.itemDetails.LotIndex);
				}
			})
			.then(() => {
				fetch(
					this.state.sbURL +
						"Lot/ByIndex?lotIndex=" +
						this.state.itemDetails.LotIndex,
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
						if (data === "No meter found.") {
							this.setState({
								dataReturned: false,
								returnrdResults: true
							});
						} else {
							this.setState({
								addressDetails: data[0],
								returnrdResults: true,
								dataReturned: true
							});
						}
					})
					.catch(console.log);
			})
			.catch(console.log);
	}

	render() {
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
								Meter Details
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
										this.props.toggleMeter(
											true,
											false,
											this.props.meterIndex
										)
									}
								>
									<i className='fas fa-times'></i>
								</button>
							</div>
						</div>
						{/* /.card-header */}
						{this.state.returnrdResults ? (
							<div className='card-body'>
								{this.state.dataReturned ? (
									<div>
										<p>
											<b>Meter Number:</b>{" "}
											{this.state.itemDetails.MeterIndex}
										</p>
										<p>
											<b>Route Number:</b>{" "}
											{this.state.itemDetails.RouteNumber}
										</p>
										<p>
											<b>Model Number:</b>{" "}
											{this.state.itemDetails.Model}
										</p>
										<p>
											<b>Address:</b>{" "}
											{
												this.state.addressDetails
													.streetNumber
											}{" "}
											{
												this.state.addressDetails
													.streetDirectional
											}{" "}
											{
												this.state.addressDetails
													.streetName
											}
										</p>
										<p>
											<b>Device Type:</b>{" "}
											{this.state.itemDetails.Devicetype}
										</p>

										<p>
											<b>Location:</b>{" "}
											{this.state.itemDetails.Location}
										</p>
										<p>
											<b> Last Read Date: </b>{" "}
											{
												this.state.itemDetails
													.LastReadingDate
											}
										</p>

										<p>
											<b>Read: </b>{" "}
											{this.state.itemDetails.LastReading}
										</p>
										<MeterReadModal
											lot={this.state.addressDetails}
											meter={this.state.itemDetails}
											apiaryAuth={
												this.props.auth
													.apiaryAuthAccessToken
											}
											{...this.props}
										/>
									</div>
								) : (
									<p>
										Meter number{" "}
										{this.props.searchedItem.value} is
										inactive or a duplicate
									</p>
								)}
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
export default MeterCard;
