import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

export default function SubmitButton({ handleSubmit }) {
	return (
		<MDBBtn className='btn-lt-blue' type="submit" onClick={handleSubmit}>
			Submit
		</MDBBtn>
	);
}
