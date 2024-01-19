import React from "react";

export default function TableHeader({ headers }) {
	const displayHeaders = headers.map(header => (
		<th scope='col'>{header}</th>
	));
	return (
		<thead className='thead-dark'>
			<tr>{displayHeaders}</tr>
		</thead>
	);
}
