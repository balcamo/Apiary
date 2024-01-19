import React, { Component } from "react"
import { Container,DropdownToggle,DropdownMenu,
	Input,Label,Dropdown, } from "reactstrap"
import WorkOrderPrint from "./WorkOrders"
import LoadingSpinner from "../LoadingSpinner"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"
import "jquery-ui"
import InventoryPickList from "./InventoryPickList"
import * as urls from '../../utils/urlsConfig';
/**
 * landing page for all printed reports
 */

class Reports extends Component {
	constructor(props) {
		super(props);	
		this.state = {
			baseURL:urls.springbrook+'Inventory/PickList',
			serviceType:"",
			loading: false,
			woPrint:this.props.profile.views.reports.woPrint,
			pickList:this.props.profile.views.reports.pickList,
			apCert:this.props.profile.views.reports.apCert,
			rentToOwn:this.props.profile.views.reports.rentToOwn,
			disabled:true,
			basementWater:this.props.profile.views.reports.basementWater,
			dropdownOpen:false

		}

		this.toggleWOPrint =this.toggleWOPrint.bind(this);
		this.togglePickList = this.togglePickList.bind(this);
		this.toggleApCert = this.toggleApCert.bind(this);
		this.toggleRenterToOwner = this.toggleRenterToOwner.bind(this);
		this.toggleBasementWater=this.toggleBasementWater.bind(this);
	}
	toggle = () => this.setState({dropdownOpen:!this.state.dropdownOpen});

	componentDidMount() {
		this.props.jqueryCardFunction()
		
	}
	toggleWOPrint(fromChild){
		if(fromChild){
			this.setState({woPrint:false})
		}else{
		this.setState({woPrint:!this.state.woPrint})}
	}
	togglePickList(fromChild){
		if(fromChild){
			this.setState({pickList:false})
		}else{
		this.setState({pickList:!this.state.pickList})}
	}
	toggleApCert(fromChild){
		if(fromChild){
			this.setState({apCert:false})
		}else{
		this.setState({apCert:!this.state.apCert})}
	}
	toggleRenterToOwner(fromChild){
		if(fromChild){
			this.setState({rentToOwn:false})
		}else{
		this.setState({rentToOwn:!this.state.rentToOwn})}
	}
	toggleBasementWater(fromChild){
		if(fromChild){
			this.setState({basementWater:false})
		}else{
		this.setState({basementWater:!this.state.basementWater})}
	}

	render() {

		return (
			<div>
				{this.props.search.meters!=null ?
				<div>	
					<div>
						<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
								<DropdownToggle className="btn-secondary">
									<i className='fas fa-tasks'></i>
								</DropdownToggle>
								<DropdownMenu className="dropdownDisplay">
									<div >
										<Input type="checkbox" id="Payments"checked={this.state.woPrint} onClick={e=>this.toggleWOPrint(false)} />{'     '}
										<Label for="WOPrint" check>
										{"  "}Work Order Printing
										</Label>
									</div>
									<div> 
										<Input type="checkbox" id="PickList" checked={this.state.pickList} onClick={e=>this.togglePickList(false)} />{'     '}
										<Label for="PickList" check>
										{"  "}Pick Lists
										</Label>
									</div>	
									<div > 
										<Input type="checkbox" id="ApCert" checked={this.state.apCert} onClick={e=>this.toggleApCert(false)} />{'     '}
										<Label for="ApCert" check>
										{"  "}AP Cert
										</Label>
									</div>	
									<div > 
										<Input type="checkbox" id="RentToOwn" checked={this.state.rentToOwn} onClick={e=>this.toggleRenterToOwner(false)} />{'     '}
										<Label for="RentToOwn" check>
										{"  "}Renter To Owner
										</Label>
									</div>	
									<div > 
										<Input type="checkbox" id="BasementWater" checked={this.state.basementWater} onClick={e=>this.toggleBasementWater(false)} />{'     '}
										<Label for="BasementWater" check>
										{"  "}Basement Water Meter
										</Label>
									</div>		
								</DropdownMenu>
						</Dropdown> 
						<br />
					</div>
					<section className='content'>
						<div className='grid'>
							<div className='row connectedSortable'>
							{this.state.woPrint ?
								<div className='col-md-12'>
									<div className={'card card-tools '+this.props.profile.views.reports.workOrderExpand}>
										<div className='card-header btn btn-tool btn-minmax btn-max'  
										data-card-widget='collapse'
										data-toggle='tooltip'
										data-placement='top'
										title='Collapse Item'>
											<h3 className='card-title'>
												<i className='fas fa-text-width'></i>
												Work Order Printing
											</h3>
											<div className='card-tools'>
												{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
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
													{this.props.profile.views.reports.workOrderExpand===''?
														<i className='fas fa-minus'></i>:
														<i className='fas fa-plus'></i>
														
													}
												</button>
												<button
													type='button'
													className='btn btn-tool'
													data-card-widget='remove'
													data-toggle='tooltip'
													data-placement='top'
													title='Remove Item'
													onClick={e=>this.toggleWOPrint(true)}
												>
													<i className='fas fa-times'></i>
												</button>
											</div>
										</div>
										{/* /.card-header */}

										<div className='card-body'>
											
											<Container>
												{this.props.auth.springBrookAuthAccessToken ? (
													<WorkOrderPrint
														token={
															this.props.auth
																.springBrookAuthAccessToken
														}
														
														{...this.props}
													/>
												) : (
													<LoadingSpinner />
												)}
											</Container>
										</div>

										{/* /.card-body */}
									</div>
									{/* /.card */}

								</div>
								:null}

							
								{this.state.pickList?
								<div className='col-md-12'>
									<div className={'card card-tools '+this.props.profile.views.reports.pickListExpand}>
										<div className='card-header btn btn-tool btn-minmax btn-max'  
											data-card-widget='collapse'
											data-toggle='tooltip'
											data-placement='top'
											title='Collapse Item'>
											<h3 className='card-title'>
												<i className='fas fa-text-width'></i>
												Inventory Pick List
											</h3>
											<div className='card-tools'>
												{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
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
													{this.props.profile.views.reports.pickListExpand===''?
														<i className='fas fa-minus'></i>:
														<i className='fas fa-plus'></i>
														
													}
												</button>
												<button
													type='button'
													className='btn btn-tool'
													data-card-widget='remove'
													data-toggle='tooltip'
													data-placement='top'
													title='Remove Item'
													onClick={e=>this.togglePickList(true)}
												>
													<i className='fas fa-times'></i>
												</button>
											</div>
										</div>
										{/* /.card-header */}

										<div className='card-body'>
											
											<Container>
												{this.props.auth.springBrookAuthAccessToken ? (
													<InventoryPickList
														token={this.props.auth.springBrookAuthAccessToken}
														
														// electricInventory={this.state.electricInventory}
														// waterInventory={this.state.waterInventory}
													/>
												) : (
													<LoadingSpinner />
												)}
											</Container>
										</div>


										{/* /.card-body */}
									</div>
									{/* /.card */}

								</div>
								:null}
								{this.state.apCert ?
								<div className='col-md-12'>
									<div className={'card card-tools '+ this.props.profile.views.reports.apCertExpand}>
										<div className='card-header btn btn-tool btn-minmax btn-max'  
										data-card-widget='collapse'
										data-toggle='tooltip'
										data-placement='top'
										title='Collapse Item'>
											<h3 className='card-title'>
												<i className='fas fa-text-width'></i>
												AP Cert Report
											</h3>
											<div className='card-tools'>
												{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
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
													{this.props.profile.views.reports.apCertExpand===''?
														<i className='fas fa-minus'></i>:
														<i className='fas fa-plus'></i>
														
													}
												</button>
												<button
													type='button'
													className='btn btn-tool'
													data-card-widget='remove'
													data-toggle='tooltip'
													data-placement='top'
													title='Remove Item'
													onClick={e=>this.toggleApCert(true)}
												>
													<i className='fas fa-times'></i>
												</button>
											</div>
										</div>
										{/* /.card-header */}

										<div className='card-body'>
											
										<iframe width="1000" height="700" src="https://app.powerbi.com/rdlEmbed?reportId=9563212b-0f7c-4b99-b194-37f7d397906c&autoAuth=true&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba" frameborder="0" allowFullScreen="true"></iframe>
										</div>

										{/* /.card-body */}
									</div>
									{/* /.card */}

								</div>
								:null}
								{this.state.rentToOwn ?
								<div className='col-md-12'>
									<div className={'card card-tools '+this.props.profile.views.reports.rentToOwnExpand}>
										<div className='card-header btn btn-tool btn-minmax btn-max'  
										data-card-widget='collapse'
										data-toggle='tooltip'
										data-placement='top'
										title='Collapse Item'>
											<h3 className='card-title'>
												<i className='fas fa-text-width'></i>
												Renter to Owner Transfer Letter
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
													{this.props.profile.views.reports.rentToOwnExpand===''?
														<i className='fas fa-minus'></i>:
														<i className='fas fa-plus'></i>
														
													}
												</button>
												<button
													type='button'
													className='btn btn-tool'
													data-card-widget='remove'
													data-toggle='tooltip'
													data-placement='top'
													title='Remove Item'
													onClick={e=>this.toggleRenterToOwner(true)}
												>
													<i className='fas fa-times'></i>
												</button>
											</div>
										</div>
										{/* /.card-header */}

										<div className='card-body'>
											<iframe width="1000" height="700" src="https://app.powerbi.com/rdlEmbed?reportId=b1620cbe-3b32-4f77-8d74-35364dd01819&autoAuth=true&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba" frameborder="0" allowFullScreen="true"></iframe>
										</div>

										{/* /.card-body */}
									</div>
									{/* /.card */}

								</div>
								:null}

								{this.state.basementWater ?
								<div className='col-md-12'>
									<div className={'card card-tools '+this.props.profile.views.reports.basementWaterExpand}>
										<div className='card-header btn btn-tool btn-minmax btn-max'  
										data-card-widget='collapse'
										data-toggle='tooltip'
										data-placement='top'
										title='Collapse Item'>
											<h3 className='card-title'>
												<i className='fas fa-text-width'></i>
												Basement Water Meter Read Letter
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
													{this.props.profile.views.reports.basementWaterExpand===''?
														<i className='fas fa-minus'></i>:
														<i className='fas fa-plus'></i>
														
													}
												</button>
												<button
													type='button'
													className='btn btn-tool'
													data-card-widget='remove'
													data-toggle='tooltip'
													data-placement='top'
													title='Remove Item'
													onClick={e=>this.toggleRenterToOwner(true)}
												>
													<i className='fas fa-times'></i>
												</button>
											</div>
										</div>
										{/* /.card-header */}

										<div className='card-body'>
										<iframe width="1000" height="700" src="https://app.powerbi.com/rdlEmbed?reportId=7b5f73ad-7c05-4e3b-a26d-2e76960fae99&autoAuth=true&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba" frameborder="0" allowFullScreen="true"></iframe>										</div>

										{/* /.card-body */}
									</div>
									{/* /.card */}

								</div>
								:null}

							</div>
						</div>
					</section>
					
				</div>
				:<LoadingSpinner/>}

			</div>
		)
	}
}
export default Reports
