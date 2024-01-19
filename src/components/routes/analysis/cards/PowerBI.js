import React from "react";
import LinkButton from "../../../common/buttons/LinkButton";
import TitleHeader from "../../../common/headers/TitleHeader";

export default function PowerBI({ card }) {
	return (
		<div
			className={`card main-card collapse mt-5 ${
				card.show ? "show" : ""
			}`}
			id={card.id}
		>
			<TitleHeader title={card.title} id={card.id} />
			<div id={`collapse${card.id}`} className='card-body collapse'> 
				<div className='container-fluid'>
					<div className='d-flex justify-content-start'>
						<LinkButton
							options={{
								href: "https://app.powerbi.com/Redirect?action=OpenApp&appId=57991b2e-3795-4f16-b419-57e5d1450193&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba",
								title: "Billing Analytics"
							}}
						/>&nbsp;
						<LinkButton
							options={{
								href: "https://app.powerbi.com/Redirect?action=OpenApp&appId=384ade8c-e4cd-4acb-910d-c64bf4039916&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba",
								title: "Payroll Analytics"
							}}
						/>&nbsp;
						<LinkButton
							options={{
								href: "https://app.powerbi.com/reportEmbed?reportId=9ff84455-6b02-4ec6-9950-c8cce441d4c2&autoAuth=true&ctid=ebba2929-765b-48f7-8c03-9b450ed099ba",
								title: "Well Levels"
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
