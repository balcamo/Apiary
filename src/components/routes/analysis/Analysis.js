import React from "react";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import PowerBI from "./cards/PowerBI";

export default function Analysis({ cards }) {
	return !cards ? (
		<LoadingSpinner />
	) : (
		<div id='page-content' className='container-fluid'>
			<PowerBI card={cards.powerBI} />
		</div>
	);
}
