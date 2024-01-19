import React from "react";
import DraggableHeader from "../../common/headers/DraggableHeader";
import AccountListItem from "./AccountListItem";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";

// displays a list of accounts
export default function AccountList({ accounts, card, updateCards, errors }) {
	// wait for accounts and display error if any
	return (
		<div
			className={`card main-card collapse ${card.show ? "show" : ""}`}
			id={card.id}
		>
			<DraggableHeader card={card} updateCards={updateCards} />
			<div id={`collapse${card.id}`} className='card-body collapse show'>
				{errors && errors.accounts ? (
					<ErrorMessage error={errors.accounts} />
				) : !accounts ? (
					<LoadingSpinner />
				) : (
					<div className='container-fluid'>
						{accounts.length <= 0 || accounts[0] === null ? (
							<h6>No accounts found.</h6>
						) : (
							accounts.map(account => (
								<AccountListItem
									account={account}
									key={account.index}
								/>
							))
						)}
					</div>
				)}
			</div>
		</div>
	);
}
