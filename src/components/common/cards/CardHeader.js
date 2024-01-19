import React from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

export default function CardHeader({
	title,
	description,
	id,
	card,
	updateCards,
	toggleLoading,
	draggable,
	redirect,
	isEditable,
	handleEdit,
	handleSubmit,
	editIcon,
	error
}) {
	const navigate = useNavigate();
	$(".header-icon").on("click", function (e) {
		e.stopPropagation();
	});
	// if able to updateCards, display icons
	// if given a description display it
	return (
		<div
			className='card-header align-items-center py-1'
			data-bs-toggle='collapse'
			data-bs-target={`#collapse${card ? card.id : id}`}
			onClick={toggleLoading ? toggleLoading : null}
		>
			<div
				className={`d-flex p-0 ${
					updateCards || redirect || editIcon
						? "justify-content-between"
						: "justify-content-start"
				}`}
			>
				<div id='card-title' className='d-flex align-items-center'>
					{draggable ? (
						<i className='fa-solid fa-up-down me-3' />
					) : null}
					<h4>{card ? card.title : title}</h4>
					{description ? (
						<p className='ms-2 mb-0'>{description}</p>
					) : null}
				</div>

				{updateCards || redirect || editIcon ? (
					<div className='flex-row-center'>
						{redirect ? (
							<i
								className='fa-solid fa-up-right-and-down-left-from-center header-icon'
								onClick={() => navigate(redirect)}
							/>
						) : editIcon && error ? (
							<i
								className='fas fa-rotate-right'
								onClick={handleSubmit}
							/>
						) : editIcon && isEditable ? (
							<i
								className='fas fa-check header-icon'
								onClick={handleSubmit}
							/>
						) : editIcon && !isEditable ? (
							<i
								className='fas fa-pencil header-icon'
								onClick={handleEdit}
							/>
						) : null}
						{updateCards ? (
							<i
								className='fa-solid fa-xmark header-icon ms-3'
								data-bs-toggle='collapse'
								data-bs-target={`#${card.id}`}
								onClick={() => updateCards(card)}
							/>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
}
