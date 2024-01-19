import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBarItem({ index, title, type, setSearch }) {
	console.log(title.match(/\(([^)]+)\)/)[1])
	const navigate = useNavigate()
	return (
		<li
			className='dropdown-item text-wrap text-center'
			// on click clear search and go to result
			onClick={() => {
				setSearch("");
				navigate(`/${type}/${index}`);
			}}
		>
			{title.match(/\(([^)]+)\)/)[1]}
		</li>
	);
}
