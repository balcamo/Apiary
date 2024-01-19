import {
	MDBCheckbox,
	MDBDropdown,
	MDBDropdownItem,
	MDBDropdownMenu,
	MDBDropdownToggle,
	MDBIcon
} from "mdb-react-ui-kit";
import React from "react";

export default function CardToggle({ cards, updateCards }) {
	// convert cards to array
	const cardArray = Object.values(cards);
	const cardOptions = cardArray.map(card => (
		<MDBDropdownItem link preventCloseOnClick key={card.id}>
			<div
				className='d-flex w-100 justify-content-between'
				onClick={() => updateCards(card)}
			>
				<h6>{card.title}</h6>

				<MDBCheckbox checked={card.show} />
			</div>
		</MDBDropdownItem>
	));
	return (
		<MDBDropdown animation={false} group>
			<MDBDropdownToggle className='btn-dark-blue'>
				<MDBIcon fas icon='list' />
			</MDBDropdownToggle>
			<MDBDropdownMenu>
				<MDBDropdownItem header className='text-center'>
					Card Options
				</MDBDropdownItem>
				{cardOptions}
			</MDBDropdownMenu>
		</MDBDropdown>
	);
}
