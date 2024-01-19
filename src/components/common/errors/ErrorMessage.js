import React from "react";

export default function ErrorMessage({ error, refresh }) {
	return (
		<div className='alert alert-danger mb-0' role='alert'>
			<p>{!error ? "Unknown error occured" : error.message ? error.message : error}</p>
			{refresh ? (
				<button
					className='btn btn-secondary p-0 ml-2'
					onClick={refresh}
				>
					<i className='fa-sharp fa-solid fa-rotate-right'></i>
					Refresh
				</button>
			) : null}
		</div>
	);
}
