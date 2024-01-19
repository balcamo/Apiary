import React, { Component, Fragment } from "react"
import { Button, Dropdown, DropdownMenu, DropdownToggle, Input, Label } from "reactstrap"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"
import CustomerCard from "./CustomerCard"
import MeterCard from "./MeterCard"
import LotCard from "./LotCard"
import WorkOrderCard from "./WorkOrderCard"
import AccountDetailsCard from "./accountDetailsCard";
import ServiceRequesrCard from './ServiceRequestCard';
import MeterList from "./meterList"
import ARAccount from "./ARAccount"

/**
 * displayes the results of a seearch 
 * along with options to open other 
 * cards if needed data is available
 */

class SearchResults extends Component {
	constructor(props) {
		super(props)
		this.state = {
			customer:false,
			lot:false,
			meter:false,
			workOrder:false,
			accountDetails:false,
			ar:false,
			arIndex:'',
			customerIndex:'',
			lotIndex:'',
			meterIndex:'',
			customerType:"",
			owner:false,
			ownerIndex:'',
			ownerAvailable:false,
			UBAccountIndex:'',
			UBAccountNumber:'',
			serviceRequest:false,
			reviceRequestAvailable:false,
			arAvailable:false,
			meterList:false,
			meterListAvailable:false,
			dropdownOpen:false
		}
		this.updateCustomerIndex = this.updateCustomerIndex.bind(this);
		this.updateLotIndex = this.updateLotIndex.bind(this);
		this.updateUBAccountIndex = this.updateUBAccountIndex.bind(this);
		this.toggleMeter = this.toggleMeter.bind(this);
		this.toggleCustomer = this.toggleCustomer.bind(this);
		this.toggleLot = this.toggleLot.bind(this);
		this.toggleWorkOrder = this.toggleWorkOrder.bind(this);
		this.toggleAccountDetails = this.toggleAccountDetails.bind(this);
		this.toggleCustomerRefresh=this.toggleCustomerRefresh.bind(this);
		this.toggleServiceRequest=this.toggleServiceRequest.bind(this);
		this.toggleMeterList = this.toggleMeterList.bind(this);
		this.toggleAr=this.toggleAr.bind(this)

	}
	toggle = () => this.setState({dropdownOpen:!this.state.dropdownOpen});

	componentDidMount() {
		this.getDisplay();
		this.props.jqueryCardFunction()
		
	}
	/**
	 * selects what to display and what is available for
	 * display based on the search
	 */
	getDisplay() {
		if(this.props.searchedItem.type === "Customer"){
			this.setState({customerIndex:this.props.searchedItem.value,accountDetails:true,arAvailable:true,arIndex:this.props.searchedItem.value});
		}else if(this.props.searchedItem.type === "Lot"){
			this.setState({lotIndex:this.props.searchedItem.value,lot:true,lotAvailable:true,meterListAvailable:true});
		}else if(this.props.searchedItem.type === "Meter"){
			this.setState({meterIndex:this.props.searchedItem.value,meter:true, meterAvailable:true});
		}
		
		if(!this.state.lotAvailable&&this.state.meterAvailable){
			this.setState({meterListAvailable:false})
		}
	}
	/**
	 * 
	 * @param {bool} fromchild - whether the call is coming from search results
	 * 							or a child card
	 * @param {string} index - new customer index to update the state value
	 * @param {string} type - customer or owner
	 */
	updateCustomerIndex(fromchild,index,type){
		if(type === "Customer"){
			console.log(index);
			this.setState({customerIndex:index, customerAvailable:true});
		}else{
			console.log(index);
			this.setState({ownerIndex:index, ownerAvailable:true});
		}
		this.toggleCustomer(fromchild,true,type);		
		
	}
	/**
	 * 
	 * @param {string} index - new lot index
	 */
	updateLotIndex(index){
		console.log(index)
		this.setState({lotIndex:index,lotAvailable:true})
	}
	/**
	 * 
	 * @param {string} index - new ub account index
	 */
	updateUBAccountIndex(index){
		this.setState({UBAccountIndex:index,reviceRequestAvailable:true});
	}

	toggleCustomerRefresh(){
		this.setState({refreshCustomer:false})

	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 * @param {string} custType - owner or customer 
	 */
	toggleCustomer(fromChild,setting,custType){
		if(custType==="Customer"){
			if(fromChild){
				this.setState({customer:setting});
			}else{
				this.setState({customer:!this.state.customer})
			}
		} else {
			if(fromChild){
				this.setState({owner:setting});
			}else{
				this.setState({owner:!this.state.owner})
			}
		}
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 * @param {string} meterIndex - new meter index 
	 */
	toggleMeter(fromChild,setting,meterIndex){
		if(fromChild){
			this.setState({meter:setting,meterIndex:meterIndex});

		}else{
			this.setState({meter:!this.state.meter})
		}
		
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleLot(fromChild,setting){
		if(fromChild){
			this.setState({lot:setting,meterListAvailable:true});
		}else{
			this.setState({lot:!this.state.lot,meterListAvailable:true})
		}
		
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleWorkOrder(fromChild,setting){
		if(fromChild){
			this.setState({workOrder:setting});
		}else{
			this.setState({workOrder:!this.state.workOrder})
		}
		
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleAccountDetails(fromChild,setting){
		if(fromChild){
			this.setState({accountDetails:setting});
		}else{
			this.setState({accountDetails:!this.state.accountDetails})
		}
	
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleServiceRequest(fromChild,setting){
		if(fromChild){
			this.setState({serviceRequest:setting});
		}else{
			this.setState({serviceRequest:!this.state.serviceRequest})
		}
	
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleAr(fromChild,setting){
		if(fromChild){
			this.setState({ar:setting});
		}else{
			this.setState({ar:!this.state.ar})
		}
	
	}
	/**
	 * 
	 * @param {boolean} fromChild - whether the call is coming from 
	 * 							search results or a child card
	 * @param {boolean} setting - whether or not the card should be displayed
	 */
	toggleMeterList(fromChild,setting){
		if(fromChild){
			this.setState({meterList:setting});
		}else{
			this.setState({meterList:!this.state.meterList})
		}
	
	}
	render() {
		return (
			<Fragment >
				<div>
					 <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
						<DropdownToggle className="btn-secondary">
							<i className='fas fa-tasks'></i>
						</DropdownToggle>
						<DropdownMenu className="dropdownDisplay">
							<div > 
								<Input type="checkbox" id="Customer" checked={this.state.customer} onClick={e=>this.toggleCustomer(false,true,"Customer")} disabled={!this.state.customerAvailable}/>{'     '}
								<Label for="Customer" check>
								{"  "} Customer Details
								</Label>
							</div>
							<div > 
								<Input type="checkbox" id="Owner" checked={this.state.owner} onClick={e=>this.toggleCustomer(false,true,"Owner")} disabled={!this.state.ownerAvailable}/>{'     '}
								<Label for="Owner" check>
								{"  "} Owner Details
								</Label>
							</div>
							<div>
							
								<Input type="checkbox" id="Meter"checked={this.state.meter} onClick={e=>this.toggleMeter(false,true)} disabled={!this.state.meterAvailable}/>{'     '}
								<Label for="Meter" check>
								{"  "}Meter {this.state.meterIndex}
								</Label>
							</div>
							<div >
							
								<Input type="checkbox" id="MeterList"checked={this.state.meterList} onClick={e=>this.toggleMeterList(false,true)} disabled={!this.state.meterListAvailable}/>{'     '}
								<Label for="MeterList" check>
								{"  "}Meter List
								</Label>
							</div>
							<div >
							<Input type="checkbox" id="Lot"checked={this.state.lot} onClick={e=>this.toggleLot(false,true)} disabled={!this.state.lotAvailable}/>{'     '}
								<Label for="Lot" check>
								{"  "}Lot
								</Label>
							</div>
							<div >
								<Input type="checkbox" id="WorkOrder"checked={this.state.workOrder} onClick={e=>this.toggleWorkOrder(false,true)} disabled={!this.state.lotAvailable}/>{'     '}
								<Label for="WorkOrder" check>
								{"  "}Work Order
								</Label>
							</div>
							<div>
								<Input type="checkbox" id="AccountDetails"checked={this.state.accountDetails} onClick={e=>this.toggleAccountDetails(false,true)} disabled={!this.state.lotAvailable}/>{'     '}
								<Label for="AccountDetails" check>
								{"  "}Account Details
								</Label>
							</div>
							<div >
								<Input type="checkbox" id="ServiceRequests"checked={this.state.serviceRequest} onClick={e=>this.toggleServiceRequest(false,true)} disabled={!this.state.reviceRequestAvailable}/>{'     '}
								<Label for="ServiceRequests" check>
								{"  "}Service Request
								</Label>
							</div>
							<div > 
								<Input type="checkbox" id="ArAccount"checked={this.state.ar} onClick={e=>this.toggleAr(false,true)} disabled={!this.state.arAvailable}/>{'     '}
								<Label for="ArAccount" check>
								{"  "}AR Account
								</Label>
							</div>
						</DropdownMenu>
					</Dropdown> 
					<br/>
				</div>
				<section className='content'>
					<div className='grid'>
						<div className='row connectedSortable'>
							{/* card one cusomer */}
							{this.state.customer ? 
								<CustomerCard 	customerType="Customer" 
												customerIndex={this.state.customerIndex} 
												toggleCustomer={this.toggleCustomer} 
												{...this.props} />
								:null}
								{this.state.owner ? 
								<CustomerCard 	customerType="Owner" 
												customerIndex={this.state.ownerIndex} 
												toggleCustomer={this.toggleCustomer} 
												{...this.props} />
								:null}
							{this.state.accountDetails ? 
								<AccountDetailsCard lotIndex={this.state.lotIndex} 
													CustomerIndex={this.state.customerIndex}
													UBAccountIndex={this.state.UBAccountIndex}
													updateLotIndex={this.updateLotIndex}
													updateCustomerIndex={this.updateCustomerIndex} 
													updateUBAccountIndex={this.updateUBAccountIndex}
													toggleServiceRequest={this.toggleServiceRequest}
													toggleAccountDetails={this.toggleAccountDetails} {...this.props} />
								:null}
							{this.state.serviceRequest ? 
								<ServiceRequesrCard UBAccountIndex={this.state.UBAccountIndex} 
													toggleServiceRequest={this.toggleServiceRequest} 
													{...this.props} />
								:null}
							{this.state.meter ? 
								<MeterCard 	toggleMeter={this.toggleMeter} 
											meterIndex={this.state.meterIndex} 
											updatelotIndex={this.updateLotIndex} 
											{...this.props} />
								 : null}
							{this.state.lot ?
									<LotCard 	lotIndex={this.state.lotIndex} 
												toggleLot={this.toggleLot} 
												updateCustomerIndex={this.updateCustomerIndex} 
												{...this.props} />
									: null}
							{this.state.meterList ?
									<MeterList 	toggleMeterList={this.toggleMeterList} 
												lotIndex={this.state.lotIndex} 
												toggleMeter={this.toggleMeter} 
												{...this.props}/>
									:null}
							{this.state.workOrder ? 
								<WorkOrderCard 	lotIndex={this.state.lotIndex} 
												toggleWorkOrder={this.toggleWorkOrder} 
												{...this.props} />
								 : null}
							{this.state.ar ? 
								<ARAccount 	customerIndex={this.state.customerIndex} 
											toggleAr={this.toggleAr} 
											customerName={this.props.searchedItem.label}
											{...this.props} />
								 : null}
						</div>
					</div>
				</section>
			</Fragment>
		)
	}
}
export default SearchResults
