import React from "react";
import CardToggle from "../../common/buttons/CardToggle";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import APCert from "./cards/APCert";
import TransferLetter from "./cards/TransferLetter";
import BasementReadLetter from "./cards/BasementReadLetter";
import PowerBI from "../analysis/cards/PowerBI";

export default function Reports({ cards, updateCards, tokens }) {
	return !cards ? (
		<LoadingSpinner />
	) : (
		<div id='page-content' className='container-fluid'>
			<CardToggle cards={cards} updateCards={updateCards} />
			<APCert card={cards.apCert} updateCards={updateCards} />
			<TransferLetter
				card={cards.transferLetter}
				updateCards={updateCards}
			/>
			<BasementReadLetter
				card={cards.basementRead}
				updateCards={updateCards}
			/>
			<PowerBI card={cards.powerBI} />
		</div>
	);
}
