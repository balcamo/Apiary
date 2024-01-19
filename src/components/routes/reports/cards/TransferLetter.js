import React from "react";
import DraggableHeader from "../../../common/headers/DraggableHeader";

export default function TransferLetter({ card, updateCards }) {
	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<DraggableHeader card={card} updateCards={updateCards} />
			<div id={`collapse${card.id}`} className='card-body collapse'>
				<iframe
					className='w-100'
					height='500'
					src='https://app.powerbi.com/rdlEmbed?reportId=b1620cbe-3b32-4f77-8d74-35364dd01819&autoAuth=true&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba'
					frameborder='0'
					allowFullScreen='true'
					title="Transfer Letter"
				/>
			</div>
		</div>
	);
}
