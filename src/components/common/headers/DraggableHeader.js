import React from "react";
import { useNavigate } from "react-router-dom";

export default function DraggableHeader({ card, updateCards, redirect }) {
	const navigate = useNavigate();

	// if able to updateCards, display icons
	// if given a description display it
	return (
		<div
			className='card-header align-items-center py-1'
			data-bs-toggle='collapse'
			data-bs-target={`#collapse${card.id}`}
		>
			<div className='d-flex p-0 justify-content-between'>
				<div id='card-title' className='d-flex align-items-center'>
					<i className='fa-solid fa-up-down me-3' />
					<h4>{card.title}</h4>
				</div>

				<div className='flex-row-center'>
					{redirect ? (
						<i
							className='fa-solid fa-up-right-and-down-left-from-center header-icon'
							onClick={() => navigate(redirect)}
						/>
					) : null}
					<i
						className='fa-solid fa-xmark header-icon ms-3'
						data-bs-toggle='collapse'
						data-bs-target={`#${card.id}`}
						onClick={() => updateCards(card)}
					/>
				</div>
			</div>
		</div>
	);
}
