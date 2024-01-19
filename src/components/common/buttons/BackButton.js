import React from "react";
import { useNavigate } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";

export default function BackButton() {
	const navigate = useNavigate();
	return (
		<MDBBtn
			className='icon-black h6'
			color='link'
			onClick={() => navigate(-1)}
		>
			<i className='fa-solid fa-arrow-left me-2' />
			Go Back
		</MDBBtn>
	);
}
