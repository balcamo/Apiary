import React from "react";

export default function LinkButton({ options }) {
	return (
		<a
			className='btn btn-dark-blue'
			target='_blank'
			rel='noopener noreferrer'
			href={options.href}
		>
			{options.title}
		</a>
	);
}
