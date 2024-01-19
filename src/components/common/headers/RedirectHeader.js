import React from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectHeader({ title, description, id, redirect }) {
	const navigate = useNavigate();

	// if able to updateCards, display icons
	// if given a description display it
	return (
		<div
			className='card-header align-items-center py-1'
			data-bs-toggle='collapse'
			data-bs-target={`#collapse${id}`}
		>
			<div className='d-flex p-0 justify-content-between'>
				<div id='card-title' className='d-flex align-items-center'>
					<h4>{title}</h4>
					{description ? (
						<p className='ms-2 mb-0'>{description}</p>
					) : null}
				</div>

				<div className='flex-row-center'>
					<i
						className='fa-solid fa-up-right-and-down-left-from-center header-icon'
						onClick={() => navigate(redirect)}
					/>
				</div>
			</div>
		</div>
	);
}
