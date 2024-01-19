import React, { useState } from "react";
import { createTicket } from "../../../utils/api";
import {
	MDBBtn,
	MDBInput,
	MDBModal,
	MDBModalBody,
	MDBModalContent,
	MDBModalDialog,
	MDBModalFooter,
	MDBModalHeader,
	MDBModalTitle,
	MDBSelect,
	MDBTextArea,
	MDBValidation,
	MDBValidationItem
} from "mdb-react-ui-kit";
import $ from "jquery";
import LoadingSpinner from "../errors/LoadingSpinner";
import ErrorMessage from "../errors/ErrorMessage";

/**
 * modal to let user submit an
 * issue straight to github
 */

export default function Support({ profile }) {
	// default form
	const initialFormState = {
		email: profile.mail,
		subject: "",
		description: "",
		status: "open",
		priority: 1,
		group: "",
		category: "",
		type: 0
	};
	const [formValue, setFormValue] = useState({
		...initialFormState
	});
	const [loading, setLoading] = useState(false);
	const [display, setDisplay] = useState(false);
	const [error, setError] = useState();
	const [groups, setGroups] = useState([
		{
			text: "Select Team",
			value: "",
			disabled: true,
			defaultSelected: true
		},
		{ text: "Apiary", value: "Apiary", name: "group" },
		{ text: "Help Desk", value: "Help Desk", name: "group" }
	]);
	const [types, setTypes] = useState([
		{
			text: "Select Type",
			value: "",
			disabled: true,
			defaultSelected: true
		},
		{ text: "Bug", value: "Bug", name: "category" },
		{ text: "Feature Request", value: "enhancement", name: "category" }
	]);

	const handleSubmit = e => {
		$("#bugForm").addClass("was-validated");
		if (
			formValue.type !== "" &&
			formValue.subject !== "" 
			// formValue.description !== ""
		) {
			setLoading(true);
			setError();
			const controller = new AbortController();
			createTicket(formValue, controller.signal)
				.then(() => setLoading("success"))
				.catch(setError);
			return () => controller.abort();
		}
	};

	const handleChange = ({ target }) => {
		setFormValue({ ...formValue, [target.name]: target.value });
	};
	// reset form
	const clearForm = async e => {
		e.preventDefault();
		// remove validation classes
		$("#bugForm").removeClass("was-validated");
		// clear select
		// setCodeSelect(codes)
		// $("MDBSelect").attr("value", "");
		// reset form values
		setFormValue({ ...initialFormState });
		setLoading(false);
	};
	// controls modal display
	const toggleDisplay = () => setDisplay(!display);
	// wait for codes before displaying
	return (
		<>
			<MDBBtn onClick={toggleDisplay} className='btn-red w-100 py-2 px-0'>
				<i className='fas fa-bug p-0'></i>
				<span className='sidebar-text ms-2'>Support</span>
			</MDBBtn>
			<MDBModal show={display} setShow={setDisplay} tabIndex='-1'>
				<MDBModalDialog centered scrollable size='md'>
					<MDBModalContent>
						<MDBModalHeader>
							<MDBModalTitle>Contact Support</MDBModalTitle>
							<MDBBtn
								className='btn-close'
								color='none'
								onClick={toggleDisplay}
							></MDBBtn>
						</MDBModalHeader>
						{/* check if loading or submitted */}
						{loading ? (
							<>
								<MDBModalBody>
									{/* if created display success message, otherwise loading spinner */}
									{error ? (
										<ErrorMessage error={error} />
									) : loading === "success" ? (
										<h4>Submission successful!</h4>
									) : (
										<LoadingSpinner />
									)}
								</MDBModalBody>
								{/* only display footer if created */}
								{loading === "success" ? (
									<MDBModalFooter className='justify-content-end'>
										<MDBBtn
											type='button'
											onClick={clearForm}
										>
											New
										</MDBBtn>
									</MDBModalFooter>
								) : null}
							</>
						) : (
							<MDBValidation id='bugForm' onSubmit={handleSubmit}>
								<MDBModalBody className='g-3'>
									<MDBValidationItem>
										<MDBSelect
											data={groups}
											onValueChange={e =>
												handleChange({
													target: e
												})
											}
											validation
											required
										/>
									</MDBValidationItem>
									{formValue.group === "Apiary" ? (
										<MDBValidationItem>
											<MDBSelect
												data={types}
												onValueChange={e =>
													handleChange({
														target: e
													})
												}
												validation
											/>
										</MDBValidationItem>
									) : null}
									<MDBValidationItem>
										<MDBInput
											type='text'
											id='subject'
											name='subject'
											label={
												formValue.type === "bug"
													? "Issue"
													: "Subject"
											}
											value={formValue.subject}
											onChange={handleChange}
											required
										/>
									</MDBValidationItem>
									<MDBValidationItem>
										<MDBTextArea
											id='description'
											name='description'
											label={
												formValue.type === "bug"
													? "Recreation Steps"
													: "Description"
											}
											value={formValue.description}
											onChange={handleChange}
											required
										/>
									</MDBValidationItem>
								</MDBModalBody>

								<MDBModalFooter className='justify-content-around'>
									<MDBBtn type='button' onClick={clearForm}>
										Clear
									</MDBBtn>
									<MDBBtn type='submit'>Submit</MDBBtn>
								</MDBModalFooter>
							</MDBValidation>
						)}
					</MDBModalContent>
					{/* end .modal-content */}
				</MDBModalDialog>
				{/* end .modal-dialog */}
			</MDBModal>
		</>
	);
}
