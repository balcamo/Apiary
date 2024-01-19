import React, { Component } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import $ from "jquery"
import "jquery-ui/ui/widgets/sortable"

/**
 * displayes customer detials based on a search
 */

class CustomerCard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			itemDetails: {},
			sbURL: urls.springbrook,
			returnrdResults: false,
			selectedItem: "",
			dataReturned: false,
			typeOfPerson:''
		}
		this.getCustomer = this.getCustomer.bind(this)
	}

	componentDidMount() {
		this.getCustomer();
		this.props.jqueryCardFunction()
		
	}
	/**
	 * gets customer details
	 */
    getCustomer() {
		fetch(
			this.state.sbURL +
				"Customer/ByIndex?customerIndex=" +
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
						returnrdResults: true,
						dataReturned: true,
					})
					//this.props.toggleCustomerRefresh();
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
                            {this.props.customerType} {" "}Details
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
								onClick={e=>this.props.toggleCustomer(true,false,this.props.customerType)}
                            >
                                <i className='fas fa-times'></i>
                            </button>
                        </div>
                    </div>
                    {/* /.card-header */}
                    {this.state.returnrdResults ? (
                        <div className='card-body'>
                            <p>
                                <b>Name:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .firstName
                                }{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .lastName
                                }
                            </p>
							<p>
                                <b>{this.props.customerType} Number:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .CustomerIndex
                                }
                            </p>
                            <p>
                                <b>Address:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .address
                                }
                            </p>
                            <p>
                                <b>City, State, ZIP:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0].city
                                }
                                ,{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .state
                                }{" "}
                                {
                                    this.state
                                        .itemDetails[0].zip
                                }
                            </p>
							<p>
                                <b>Cell Phone:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .cellPhone
                                }
                            </p>
							<p>
                                <b>Home Phone:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .homePhone
                                }
                            </p>
							<p>
                                <b>Business Phone:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .busPhone
                                }
                            </p>
							<p>
                                <b>Email:</b>{" "}
                                {
                                    this.state
                                        .itemDetails[0]
                                        .email
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
export default CustomerCard
