import React from "react";

export default function TitleHeader({ title, description, id, status }) {
	// if given a description display it
	return (
		<div
			className='card-header align-items-center py-1'
			data-bs-toggle='collapse'
			data-bs-target={`#collapse${id}`}
		>
			<div
				className={`d-flex p-0 ${
					status ? "justify-content-between" : "justify-content-start"
				}`}
			>
				<div id='card-title' className='d-flex align-items-center'>
					<h4 >{title}</h4>
					{description ? (
						<h6 className='ms-3 mb-0'>{description}</h6>
					) : null}
				</div>

				{status ? (
					<div className='flex-row-center'>
						<p>{status}</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
