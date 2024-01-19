import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	getAccountBySid,
	getCustomersByAccountSid,
	getMetersByLotSid,
	getServiceRequestsByAccountSid
} from "../../../utils/api/sprycis";
import CardToggle from "../../common/buttons/CardToggle";
import ErrorMessage from "../../common/errors/ErrorMessage";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import CustomerList from "../customers/CustomerList";
import MeterList from "../meters/MeterList";
import AccountListItem from "./AccountListItem";
import ServiceRequestList from "../service-requests/ServiceRequestList";
import BackButton from "../../common/buttons/BackButton";

export default function Account({ cards, updateCards, tokens }) {
	const [account, setAccount] = useState();
	const [customers, setCustomers] = useState();
	const [meters, setMeters] = useState([]);
	const [serviceRequests, setServiceRequests] = useState();
	const [errors, setErrors] = useState();
	// get AccountSid from route if any
	const { accountSid } = useParams();
	// load when AccountSid changes
	useEffect(() => {
		const controller = new AbortController();
		// clear errors if any
		// clear account so loading spinner displays when page is changed
		setErrors();
		setAccount();
		// load account, meters, customers, and service requests
		loadAccount(controller)
			.then(() => loadCustomers(controller))
			.then(() => loadServiceRequests(controller))
			.catch(error => console.log(error));
		return () => controller.abort();
	}, [accountSid]);
	// load meters when account has value
	useEffect(() => {
		if (account) {
			const controller = new AbortController();
			loadMeters(controller).catch(error => console.log(error));
			return () => controller.abort();
		}
	}, [account]);
	// load the account
	const loadAccount = async ({ signal }) => {
		getAccountBySid(accountSid, tokens.sprycis, signal)
			.then(setAccount)
			.catch(error => setErrors({ ...errors, account: error }));
	};
	// load customers associated with the account
	const loadCustomers = async ({ signal }) => {
		getCustomersByAccountSid(accountSid, tokens.sprycis, signal)
			.then(setCustomers)
			.catch(error => setErrors({ ...errors, customers: error }));
	};
	// load meters on the account
	const loadMeters = async ({ signal }) => {
		getMetersByLotSid(account.lotSid, tokens.sprycis, signal)
			.then(setMeters)
			.catch(error => setErrors({ ...errors, meters: error }));
	};
	// load service requests on the account
	const loadServiceRequests = async ({ signal }) => {
		getServiceRequestsByAccountSid(accountSid, tokens.sprycis, signal)
			.then(setServiceRequests)
			.catch(error => setErrors({ ...errors, serviceRequests: error }));
	};
	console.log(customers)
	// wait for account and display error if any
	return (
		<div id='page-content' className='container-fluid p-4'>
			{errors && errors.account ? (
				<ErrorMessage error={errors.account} />
			) : !account ? (
				<LoadingSpinner alert='loading account...' />
			) : (
				<div className='container-fluid'>
					<div className='d-flex justify-content-between'>
						<BackButton />
						<CardToggle cards={cards} updateCards={updateCards} />
					</div>
					{/* display all items loaded for the account */}
					<div className='container-fluid'>
						<AccountListItem account={account} display={true} />
						<CustomerList
							customers={customers}
							card={cards.customers}
							updateCards={updateCards}
							errors={errors}
						/>
						<MeterList
							meters={meters}
							card={cards.meters}
							updateCards={updateCards}
							errors={errors}
						/>
						{/* <ServiceRequestList
							account={account}
							customers={customers}
							meters={meters}
							serviceRequests={serviceRequests}
							setServiceRequests={setServiceRequests}
							card={cards.serviceRequests}
							updateCards={updateCards}
							tokens={tokens}
							errors={errors}
							setErrors={setErrors}
						/> */}
					</div>
				</div>
			)}
		</div>
	);
}
