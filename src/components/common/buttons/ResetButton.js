import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

export default function ResetButton({ handleReset }) {
	return (
		<MDBBtn className='btn-danger' type="reset" onClick={handleReset}>
			Reset
		</MDBBtn>
	);
}
