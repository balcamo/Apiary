import React from "react";
import $ from "jquery";

export default function EditHeader({
	title,
	description,
	id,
	toggleLoading,
    editIcon,
	isEditable,
	handleEdit,
	handleSubmit,
	error
}) {
	$(".header-icon").on("click", function (e) {
		e.stopPropagation();
	});
	// if able to updateCards, display icons
	// if given a description display it
	return (
		<div
			className='card-header align-items-center py-1'
			data-bs-toggle='collapse'
			data-bs-target={`#collapse${id}`}
			onClick={toggleLoading ? toggleLoading : null}
		>
			<div className='d-flex p-0 justify-content-between'>
				<div id='card-title' className='d-flex align-items-center'>
					<h4>{title}</h4>
					{description ? (
						<p className='ms-2 mb-0'>{description}</p>
					) : null}
				</div>

				<div className='flex-row-center'>
					{error ? (
						<i
							className='fas fa-rotate-right'
							onClick={handleSubmit}
						/>
					) : isEditable ? (
						<i
							className='fas fa-check header-icon'
							onClick={handleSubmit}
						/>
					) : !isEditable ? (
						<i
							className='fas fa-pencil header-icon'
							onClick={handleEdit}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
}
