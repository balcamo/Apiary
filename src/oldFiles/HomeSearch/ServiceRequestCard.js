import React, { Component, Fragment } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"

/**
 * displayes a list of service  
 * requests associated with an account
 */

class ServiceRequesrCard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			itemDetails: [],
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
		}
	}

	componentDidMount() {
		this.getServiceRequests();
		this.props.jqueryCardFunction()
		
	}
	/**
	 * gets all service requests associated with an account
	 */
    getServiceRequests() {
		fetch(
			this.state.sbURL +
				"ServiceRequest/ByAccount?account=" +
				this.props.UBAccountIndex,
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
				}
			})
			.catch(console.log)
	}

    render(){
        
        var serviceRequestBody=(
            <div className="accordion" id="accordionServiceRequest">
                 {this.state.itemDetails.length===0?
                    <p>There are no service requests for the UB Account.</p>
                    :<Fragment>
                    {
                        this.state.itemDetails.map((sr)=>{
                            return (
                            
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={"heading"+sr.requestSequence}>
                                    <button className="accordion-button collapsed bg-primary color-palette-set" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target={'#collapse'+sr.requestSequence} 
                                            aria-expanded="false" 
                                            aria-controls={"collapse"+sr.requestSequence}>
                                        <b>Service Request #{sr.requestSequence}:{"   "}  </b>{"   "}{sr.requestDescription}
                                    </button>
                                    </h2>
                                    <div id={"collapse"+sr.requestSequence} className="accordion-collapse collapse" aria-labelledby={"heading"+sr.requestSequence} data-bs-parent="#accordionServiceRequest">
                                    <div className="accordion-body">
                                        <p><b> Request Description: </b>{" "}
                                                    {
                                                        sr.requestDescription
                                                    }
                                        </p>
                                        <p><b>Request Date: </b>{" "}
                                                    {
                                                        sr.requestDate
                                                    }
                                        </p>
										<p><b>Status: </b>{" "}
                                                    {
                                                        sr.requestStatus
                                                    }
                                        </p>
										<p><b>Service Description: </b>{" "}
                                                    {
                                                        sr.serviceDescription
                                                    }
                                        </p>
                                    </div>
                                    </div>
                                </div>
                                
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
							Service Requests
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
                                data-card-widget='remove'
                                data-toggle='tooltip'
                                data-placement='top'
                                title='Remove Item'
                                onClick={e=>this.props.toggleServiceRequest(true,false)}
							>
								<i className='fas fa-times'></i>
							</button>
						</div>
					</div>
					{/* /.card-header */}
					{this.state.returnrdResults ? (
						<div className='card-body'>
							{serviceRequestBody}
						</div>
						
					) : (
						<div className='card-body'>
							<p>
								Waiting for details
							</p>
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
export default ServiceRequesrCard
