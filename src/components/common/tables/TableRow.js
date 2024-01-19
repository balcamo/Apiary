import React from "react";

export default function TableRow({ item, values, isEditable, handleChange }) {
	const displayValues = values.map(value => item[value]);
	return (
		<tr>
			{displayValues.map(displayItem => (
				<td className='align-middle'>
					<input
						type='text'
						value={displayItem}
						className='text-center'
						onChange={handleChange}
						disabled={!isEditable}
					/>
				</td>
			))}
		</tr>
	);
}
