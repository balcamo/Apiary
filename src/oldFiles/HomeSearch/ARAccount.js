import React, { Component, Fragment } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"

/**
 * displays list of AR accounts associated with a customer
 */

class ARAccount extends Component {
	constructor(props) {
		super(props)
		this.state = {
			itemDetails: [],
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
			ar:[]
		}
	}

	componentDidMount() {
		this.getAR();
		this.props.jqueryCardFunction()
		
	}
	/**
	 * retrieves AR details based on customer number
	 */
	getAR() {
		fetch(
			this.state.sbURL +
				"Ar/ByCustomer?customerIndex=" +
				this.props.customerIndex,
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
                        dataReturned: true,
						returnrdResults: true,
					})
					
				}
			})
			.catch(console.log)
	}

   

    render(){
        
        var invoiceBody=(
            <div className="accordion" id="accordionInvoices">
                 {this.state.itemDetails.length===0?
                    <p>There are no associated AR invoices for the account.</p>
                    :<Fragment>
                    {
                        this.state.itemDetails.map((invoice)=>{
                            return (
								<Fragment>
									
									<div className="accordion-item">
										<h2 className="accordion-header" id={"heading"+invoice.ArAccountIndex}>
										<button className="accordion-button collapsed bg-primary color-palette-set" 
												type="button" 
												data-bs-toggle="collapse" 
												data-bs-target={'#collapse'+invoice.ArAccountIndex} 
												aria-expanded="false" 
												aria-controls={"collapse"+invoice.ArAccountIndex}>
										AR Account #{invoice.ArAccountIndex}
										</button>
										</h2>
										<div id={"collapse"+invoice.ArAccountIndex} className="accordion-collapse collapse" aria-labelledby={"heading"+invoice.ArAccountIndex} data-bs-parent="#accordionInvoices">
										<div className="accordion-body">
										<div>
											<p>
												<b>	AR Account Number:</b>{" "}{invoice.ArAccountIndex}
											</p>
											<p>
												<b>Transaction Date:</b>{" "}{invoice.transactionDate}
											</p>
											<p>
												<b>Billing Cycle:</b>{" "}{invoice.billingCycle}
											</p>
											<p>
												<b>Balance :</b>{" "}{invoice.balance}
											</p>
											<p>
												<b>Description </b>{" "}{invoice.description}
											</p>
											
											<p>
												<b>Payment Date :</b>{" "}{invoice.paymentDate}
											</p>
											<p>
                                                <b> Payment Details: </b>{" "}{invoice.paymentDetails}
																
											</p>											
										</div>
										
													
										</div>
										</div>
									</div>
								</Fragment>
                                
                        )})}
                        </Fragment>
                        } 
                    </div>

            )
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
							AR Account Details
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
                                // data-card-widget='remove'
                                data-toggle='tooltip'
                                data-placement='top'
                                title='Remove Item'
                                onClick={e=>this.props.toggleAr(true,false)}
							>
								<i className='fas fa-times'></i>
							</button>
						</div>
					</div>
					{/* /.card-header */}
					{this.state.returnrdResults ? (
						<div className='card-body'>
                            <p><b>Customer Name:</b>{" "} {this.props.customerName} </p>
                            <p><b>Customer Number:</b>{" "} {this.props.customerIndex} </p>
							{invoiceBody}
						</div>
						
					) : <div className='card-body'>
                            Results not returned
                        </div>}
					{/* /.card-body */}
				</div>
				{/* /.card */}
			</div>
			</div>
        )
    }
}
export default ARAccount
