import React, { useState, useEffect } from "react";
import {
	Button,
	ButtonToolbar,
	Modal,
	
} from "rsuite";

import LoadingSpinner from "../errors/LoadingSpinner";
import ErrorMessage from "../errors/ErrorMessage";


export default function TimeConfirmation({
	hours, 
	handleSubmit
}) {
	const [display, setDisplay] = useState(false);
	const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [alert, setAlert] = useState("loading...");
	// on submit create service request

	// toggle modal display
	const toggleDisplay = () => {setDisplay(!display);}
	const handleTimeSubmit = () =>{
		console.log("handle time submit")
		setDisplay(false);
		handleSubmit();
	}
	// display loading spinner while submitting
	// display error if any
	return (
		<>
			<ButtonToolbar>
				<Button onClick={toggleDisplay} className='btn-green'>
					Submit
				</Button>
			</ButtonToolbar>
			<Modal open={display} onClose={toggleDisplay}>
				<Modal.Header>
					<Modal.Title>Confirm Time</Modal.Title>
				</Modal.Header>
				{loading ? (
					<>
						<Modal.Body>
							{/* display error if any if created display success message */}
							{error ? (
								<ErrorMessage error={error} />
							) : loading === "success" ? (
								<h6 className='text-center'>
									Submission successful!
								</h6>
							) : (
								<LoadingSpinner alert={alert} />
							)}
						</Modal.Body>
						{/* only display footer if created */}
						{loading === "success" ? (
							<Modal.Footer className='d-flex justify-content-between'>
								<Button
									className='btn-danger w-25'
									onClick={toggleDisplay}
								>
									Close
								</Button>
							</Modal.Footer>
						) : null}
					</>
				) : (
					<>
						<Modal.Body className='d-flex justify-content-between'>
							{/* {loading ?
								<LoadingSpinner/> :
								<div>
									<h3 >You have entered <b><i>{hours}</i></b></h3>
								</div>} */}
							<div>
								<h3 >You have entered <b><i>{hours}</i></b></h3>
							</div>
						</Modal.Body>
						<Modal.Footer className='d-flex justify-content-between'>
							<Button
								className='btn-danger w-25'
								onClick={toggleDisplay}
							>
								Go Back
							</Button>
							<Button
								className='btn-lt-blue w-25'
								onClick={handleTimeSubmit}
							>
								Confirm
							</Button>
						</Modal.Footer>
					</>
				)}
			</Modal>
		</>
	);
}
