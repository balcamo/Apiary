import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchListItem({ index, title, type, setSearch }) {
	const navigate = useNavigate()
	return (
		<div
			className='card sub-card'
			// on click clear search and go to result
			onClick={() => {
				setSearch("");
				navigate(`/${type}/${index}`);
			}}
		>
			<div className='card-header justify-content-start py-1'>
				<div id='card-title' className='d-flex align-items-center'>
					<h6 className='m-0'>{title.match(/\(([^)]+)\)/)[1]}</h6>
				</div>
			</div>
		</div>
	);
}
