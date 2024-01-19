import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	getLotByLotSid,
	getAccountsByLotSid
} from "../../../utils/api/sprycis";
import CardToggle from "../../common/buttons/CardToggle";
import ErrorMessage from "../../common/errors/ErrorMessage";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import LotListItem from "./LotListItem";
import AccountList from "../accounts/AccountList";
import BackButton from "../../common/buttons/BackButton";

export default function Lot({ cards, updateCards, tokens }) {
	const [lot, setLot] = useState();
	const [accounts, setAccounts] = useState();
	const [errors, setErrors] = useState();
	// get LotSid from route if any
	const { LotSid } = useParams();
	// load when LotSid changes
	useEffect(() => {
		const controller = new AbortController();
		// clear errors and lot if any
		setErrors();
		setLot();
		// load lot
		getLotByLotSid(LotSid, tokens.sprycis, controller.signal)
			.then(setLot)
			.catch(error => setErrors({ ...errors, lot: error }));
		// load accounts
		getAccountsByLotSid(LotSid, tokens.sprycis, controller.signal)
			.then(response => setAccounts([response]))
			.catch(error => setErrors({ ...errors, accounts: error }));

		return () => controller.abort();
	}, [LotSid]);
	// wait for lot and display error if any
	return (
		<div id='page-content' className='container-fluid p-4'>
			{errors && errors.lot ? (
				<ErrorMessage error={errors.lot} />
			) : !lot ? (
				<LoadingSpinner alert='loading lot....' />
			) : (
				<div className='container-fluid'>
					<div className='d-flex justify-content-between'>
						<BackButton />
						<CardToggle cards={cards} updateCards={updateCards} />
					</div>
					<div className='container-fluid'>
						{/* lot details card */}
						<LotListItem lot={lot} />
						{/* list of accounts the lot is associated with */}
						<AccountList
							accounts={accounts}
							card={cards.accounts}
							updateCards={updateCards}
							errors={errors}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
