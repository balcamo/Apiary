import React from "react";

const LoadingSpinner = ({ alert = "loading..." }) => (
	<div className="d-flex align-items-center justify-content-center h-100">
		<i className='fa-solid fa-spinner fa-pulse me-2' />{alert}
	</div>
)

export default LoadingSpinner
