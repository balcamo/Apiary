import React, { Component } from "react"
import fetch from "isomorphic-fetch"
import * as urls from "../../utils/urlsConfig"
import { Form, Input,Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import LoadingSpinner from "../LoadingSpinner"

/**
 * allows user to send meter reads
 * of a given lot straight to esri
 */

class MeterReadModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modal:false,
			Comments:"",
			Completed:"",
			Issues:"",
			Read:"",
			Read_Date:null,
			displayDate:null,
			loading:false,
			
		
		}
		this.sendToEsri = this.sendToEsri.bind(this);

	}
	
	componentDidMount() {
		
	}

	sendToEsri(e) {
		e.preventDefault();
		this.setState({loading:true})
		var readBody={
			"MeterIndex":this.props.meter.MeterIndex,
			"Comments":this.state.Comments,
			"Completed":this.state.Completed,
			"Issuses":this.state.Issues,
			"Read":this.state.Read,
			"Read_Date":this.state.Read_Date

		}
		console.log("what the body should be ")
		console.log(readBody)
		if (this.props.auth.apiaryAuthAccessToken) {
			fetch(urls.meterReads +this.props.meter.BillType, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization:
						"Bearer " + this.props.apiaryAuth,
				},
				body:JSON.stringify(readBody)
			})
				.then(function (response) {
					if (response.ok) {
						console.log("response is ok")
						return response
					} else if(response.status === 401){
						alert("Your token has expired. Please refresh the page.");
						this.setState({loading:false})
					} else {
						console.log("response error")
						var error = new Error(response.statusText)
						throw error
					}
				})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					if(data.length === 0){
						alert("this meter dosn't need to be read")
						this.setState({Comments:"",Issues:"",Completed:"No",Read:"",loading:false})
					}else if(data.error){
						alert("Error. "+data.error.toString())
						this.setState({Comments:"",Issues:"",Completed:"No",Read:"",loading:false})
					}else{
						alert("success "+data.updateResults[0].success)
						this.setState({Comments:"",Issues:"",Completed:"No",Read:"",loading:false})
					}
					
				})
				.catch(console.log)
		} else {
			console.log("got to wait for token")
		}
	}
	toggle = () => this.setState({modal:!this.state.modal});

	render() {
		
		return (
			<div >
				 <Button color="btn btn-default text-center bg-primary" onClick={this.toggle}><i className="fas fa-glasses"></i></Button>
				 <Modal keyboard="true" isOpen={this.state.modal} toggle={this.toggle}>
					<Form autoComplete="off"
							roll='form'
							className='bugForm'
							onSubmit={e=>this.sendToEsri(e)}
							
						>
							 <ModalHeader toggle={this.toggle}>
								<h4 className='modal-title'>
									Submit a meter read for meter {this.props.meter.MeterIndex}
								</h4>
							</ModalHeader>
							<ModalBody>
								{this.state.loading ? <LoadingSpinner/>:
								<div className='form-group'>


									<div className='row bg-light text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Address</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<p>{this.props.lot.streetNumber} {this.props.lot.streetDirectional} {this.props.lot.streetName}</p>
										</div>
									</div>
									<div className='row bg-gray text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Comments</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<Input 
												type="text"
												
												id='Comments'
												className='form-control'
												placeholder='Any helpful information'
												value={this.state.Comments}
												onChange={e=>this.setState({Comments:e.target.value})}></Input>
										</div>
									</div>
									<div className='row bg-light text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Completed</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<Input 
												type="select"
												required
												id='Completed'
												className='form-control'
												value={this.state.Copmleted}
												// value={this.state.Completed}
												onChange={e => this.setState({Copmleted:e.target.value})}>
													<option value={""}>---</option>
													<option value={"No"}>No</option>
													<option value={"Yes"}>Yes</option>
												</Input>
										</div>
									</div>
									<div className='row bg-gray text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Issues</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<Input 
												
												id='Issues'
												type='text'
												className='form-control'
												placeholder="Were there any issues"
												value={this.state.Issues}
												onChange={e=>this.setState({Issues:e.target.value})}>
												
												</Input>
										</div>
									</div>
									<div className='row bg-light text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Location</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<p>{this.props.meter.Location}</p>
										</div>
									</div>
									<div className='row bg-gray text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Meter_Num</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<p>{this.props.meter.MeterIndex}</p>
										</div>
									</div>
									<div className='row bg-light text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Last Read</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<p>{this.props.meter.lastReading}</p>
										</div>
									</div>
									<div className='row bg-gray text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Read</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<Input 
												required
												id='Read'
												type="text"
												className='form-control'
												value={this.state.Read}
												placeholder='Current meter reading'
												onChange={e=>{
													this.setState({Read:e.target.value}) }
													}>
													
												</Input>
										</div>
									</div>
									<div className='row bg-light text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Read_Date</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<Input 
												required
												id='Read'
												type="date"
												className='form-control'
												value={this.state.Read_Date}
												placeholder='Current meter reading'
												onChange={e=>{
													this.setState({Read_Date:e.target.value}) }
													}>
													
												</Input>
										</div>
									</div>
									<div className='row bg-gray text-center p-2'>
										
										<div className='col-sm-6'>
											{/*text input */}
											<p>Route</p>
										</div>
										<div className='col-sm-6'>
											{/*text input */}
											<p>{this.props.meter.routeNumber}</p>
										</div>
									</div>
								</div>
								}
							</ModalBody>
							{/* end .modal-body */}

							<ModalFooter className='justify-content-between'>
								{/* <Input type='submit' className='btn btn-info' /> */}
								<button
									type='button'
									className='btn btn-default text-center bg-secondary'
									onClick={this.toggle}
								>
									Close
								</button>
								<button
									type='submit'
									className='btn btn-default text-center bg-primary'
									// data-bs-dismiss='modal'
								>
									Submit
								</button>
							
							</ModalFooter>
						</Form>
					</Modal>
					{/* end .modal-content */}
				
				{/* end .modal-dialog */}
			</div>
			// end.modal
		)
	}
}
export default MeterReadModal
