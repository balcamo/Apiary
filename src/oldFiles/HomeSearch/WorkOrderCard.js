import React, { Component, Fragment } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"

/**
 * displayes a list of work orders
 * associated with a lot
 */

class WorkOrderCard extends Component {
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
		this.getWorkOrders();
		this.props.jqueryCardFunction()
	}
	/**
	 * get all the work orders associated with the searched lot
	 */
    getWorkOrders() {
		fetch(
			this.state.sbURL +
				"WorkOrder/ByLotIndex?lotIndex=" +
				this.props.lotIndex,
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
        
        var workOrderBody=(
            <div className="accordion" id="accordionWorkOrder">
                 {this.state.itemDetails.length===0?
                    <p>There are no work orders for the property.</p>
                    :<Fragment>
                    {
                        this.state.itemDetails.map((wo)=>{
                            return (
                            
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={"heading"+wo.WorkOrderIndex}>
                                    <button className="accordion-button collapsed bg-primary color-palette-set" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target={'#collapse'+wo.WorkOrderIndex} 
                                            aria-expanded="false" 
                                            aria-controls={"collapse"+wo.WorkOrderIndex}>
                                        <b>Work Order #{wo.WorkOrderIndex}:</b>&nbsp;{wo.Description}
                                    </button>
                                    </h2>
                                    <div id={"collapse"+wo.WorkOrderIndex} className="accordion-collapse collapse" aria-labelledby={"heading"+wo.WorkOrderIndex} data-bs-parent="#accordionWorkOrder">
                                    <div className="accordion-body">
									<p><b>Status</b>:{" "}{wo.Status}</p>

                                        <p><b> WorkOrder Description: </b>{" "}
                                                    {
                                                        wo.Description
                                                    }
                                        </p>
                                        
										<p><b>Comments</b>:{" "}{wo.Comments}</p>
										<p><b>Notes</b>:{" "}{wo.Notes}</p>
										<p><b>Creation Date: </b>{" "}
                                                    {
                                                        wo.CreationDate
                                                    }
                                        </p>
										<p><b>Completion Date</b>:{" "}{wo.CompletionDate}</p>
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
							Work Orders
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
                                onClick={e=>this.props.toggleWorkOrder(true,false)}
							>
								<i className='fas fa-times'></i>
							</button>
						</div>
					</div>
					{/* /.card-header */}
					{this.state.returnrdResults ? (
						<div className='card-body'>
							{workOrderBody}
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
export default WorkOrderCard
