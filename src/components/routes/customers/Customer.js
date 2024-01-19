import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
	getCustomerByCustomerSid,
	getAccountsByCustomerSid
} from "../../../utils/api/sprycis";
import CardToggle from "../../common/buttons/CardToggle";
import ErrorMessage from "../../common/errors/ErrorMessage";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import BackButton from "../../common/buttons/BackButton";
import AccountList from "../accounts/AccountList";
import CustomerListItem from "./CustomerListItem";

export default function Customer({ cards, updateCards, tokens }) {
	const [customer, setCustomer] = useState();
	const [accounts, setAccounts] = useState();
	const [errors, setErrors] = useState();
	// get CustomerSid from route if any
	const { customerSid } = useParams();
	// load customer when index changes
	useEffect(() => {
		const controller = new AbortController();
		// clear errors and customer if any
		setErrors();
		setCustomer();
		setAccounts();
		console.log("customer by sid")
		// load customer
		getCustomerByCustomerSid(customerSid, tokens.sprycis, controller.signal)
			.then(setCustomer)
			.catch(error => setErrors({ ...errors, customer: error }));
		// load accounts
		console.log("account by sid")
		getAccountsByCustomerSid(customerSid, tokens.sprycis, controller.signal)
			.then(response => setAccounts(response))
			.catch(error => setErrors({ ...errors, accounts: error }));

		return () => controller.abort();
	}, [customerSid]);

	return (
		// wait for customer and display error if any
		<div id='page-content' className='container-fluid p-4'>
			{errors && errors.customer ? (
				<ErrorMessage error={errors.customer} />
			) : !customer ? (
				<LoadingSpinner />
			) : (
				<div className='container-fluid'>
					<div className='d-flex justify-content-between'>
						<BackButton />
						<CardToggle cards={cards} updateCards={updateCards} />
					</div>
					<div className='container-fluid'>
						{/* customer details card */}
						<CustomerListItem customer={customer} display={true} />
						{/* list of account the customer is associated with */}
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
