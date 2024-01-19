import React from "react";
import {
    MDBBtn,
	MDBCol,
	MDBInput,
	MDBModal,
	MDBModalBody,
	MDBModalContent,
	MDBModalDialog,
	MDBModalFooter,
	MDBModalHeader,
	MDBModalTitle,
	MDBRow
} from "mdb-react-ui-kit";
import {
	Button,
	Row,
	Col,
	CheckPicker,
	DatePicker,
	FlexboxGrid,
	Input,
	Modal,
	
	SelectPicker,
} from "rsuite";

export default function ProfileDetails({profile, modal, setModal, toggleModal}) {
	console.log(profile)
	return (
		<Modal open={modal} onClose={toggleModal} tabIndex='-1'>
			
					<Modal.Header>
						<h4>{profile.displayName}</h4>
						
					</Modal.Header>

					<Modal.Body className='g-2 justify-content-center'>
						<Row>
							
							<Col>
							<label>Email:</label>
								<Input
									type='text'
									id='email'
									label='Email'
									className='text-center'
									value={profile.email ? profile.email : ""}
									disabled
								/>
							</Col>
							
							<Col>
							<label>Phone: </label>
								<Input
									type='text'
									id='number'
									label='Work Number'
									className='text-center'
									value={
										profile.mobilePhone
											? profile.mobilePhone
											: ""
									}
									disabled
								/>
							</Col>
						</Row>
						<Row>
						
							<Col>
							<label>Title:</label>
								<Input
									type='text'
									id='jobTitle'
									label='Job Title'
									className='text-center'
									value={
										profile.title ? profile.title : ""
									}
									disabled
								/>
							</Col>
							
							<Col>
							<label>Location:</label>
								<Input
									type='text'
									id='location'
									label='Office Location'
									className='text-center'
									value={
										profile.officeLocation
											? profile.officeLocation
											: "TBD"
									}
									disabled
								/>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer className='allign-items-center'>
						<h6>{`View: ${
							profile.role.name ? profile.role.name : ""
						}`}</h6>
					</Modal.Footer>
				
		</Modal>
	);
}
