import React, { Component, Fragment } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"

/**
 * UB account details display with options to 
 */

class AccountDetailsCard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			itemDetails: {},
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
		}
	}

	componentDidMount() {
		this.getCustomer();
		this.props.jqueryCardFunction()
		
	}
	/**
	 * use the seached item to get ub account info
	 */
    getCustomer() {
		var url;
		if (this.props.CustomerIndex>0){
			url="UBAccount/ByCustomer?customerIndex="+this.props.CustomerIndex
		 }else if(this.props.UBAccountNumber>0) {
			 url = "UBAccount/ByIndex?acctIndex="+this.props.UBAccountNumber
			}
		  else if(this.props.lotIndex > 0){
			url = "UBAccount/ByLotIndex?lotIndex="+this.props.lotIndex
		 } 
		
		fetch(
			this.state.sbURL + url,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer " + this.props.auth.springBrookAuthAccessToken,
				},
			}
		)
			.then(function (response) {
				if (response.ok) {
					return response
				} else if(response.status === 401){
					alert("Your token has expired. Please refresh the page.");
					this.setState({loading:false})
				} else {
					var error = new Error(response.statusText)
					throw error
				}
			})
			.then((res) => res.json())
			.then((data) => {
				//this.state.customers = data;
				console.log(data)
				if (data === "No meter found.") {
					this.setState({
						dataReturned: false,
						returnrdResults: true,
					})
				} else {
					this.setState({
						itemDetails: data,
						returnrdResults: true,
						dataReturned: true,
					})
					this.props.updateUBAccountIndex(this.state.itemDetails[0].UbAccountIndex)
					this.props.updateLotIndex(this.state.itemDetails[0].LotIndex)
				}
			})
			.catch(console.log)
	}

    render(){
        return(
			<div>
            	<div className='col-md-12'>
					<div className='card collapsed-card card-tools'>
                        <div className='card-header btn btn-tool btn-minmax btn-max'  
                                    data-card-widget='collapse'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Collapse Item'>
						<h3 className='card-title'>
							<i className='fas fa-text-width'></i>
                            UB Account Details
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
								onClick={e=>this.props.toggleAccountDetails(true,false)}
                            >
                                <i className='fas fa-times'></i>
                            </button>
                        </div>
                    </div>
                    {/* /.card-header */}
                    {this.state.returnrdResults ? (
                        <div className='card-body'>
                            <button id="customer"className="bg-primary btn color-palette-set" onClick={(e)=>this.props.updateCustomerIndex(true,this.state.itemDetails[0].CustomerIndex, "Customer")}>
									<b>Customer Number:</b>{" "}
									{
									this.state
										.itemDetails[0]
										.CustomerIndex
								}
								</button>
								<br/>
							<button className="bg-primary btn color-palette-set" onClick={(e)=>{this.props.toggleServiceRequest(true,true)}}>
									<b>Open Service Requests</b>
								</button>
							<p>
                                <b>Customer:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .customer.firstName
                                }{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .customer.lastName
                                }
								
                            </p>
							<p>
                                <b>UB Account:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .UbAccountIndex
                                }
                            </p>
							<p>
                                <b>Address:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .customer.address
                                }
                            </p>
							<p>
                                <b>Account Status:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .acctStatus
                                }
                            </p>
							<p>
                                <b>Total Due:</b>{" $"}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .totalAmountDue
                                }
                            </p>
							<p>
                                <b>Past Due:</b>{" $"}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .pastDueTotalAmount
                                }
                            </p>
                            <p>
                                <b>Last Bill Date:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .lastBillDate
                                }
                            </p>
                            <p>
                                <b>Last Payment Amount:</b>
								{" $"}
									{
										this.state
											.itemDetails[0].lastPaymentAmount
									}
                            </p>
							<p>
                                <b>Last Payment Date:</b>
								{this.state.itemDetails[0].lastPaymentDate == null ?
									<Fragment>{" "}No payment date on record</Fragment>:
									<Fragment>
									 {
                                    this.state
                                        .itemDetails[0].lastPaymentDate
                                }</Fragment>
									}
                               
                                
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
        )
    }
}
export default AccountDetailsCard
