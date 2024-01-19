import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getProfile } from "../../utils/api/graph";
import {
	getCustomers,
	getLots,
} from "../../utils/api/sprycis";
import { getEmployees, getWorkOrderSids, getWorkOrders } from "../../utils/api/cityworks";
import Header from "./header/Header";
import SideBar from "./SideBar";
import Customer from "../routes/customers/Customer";
import Reports from "../routes/reports/Reports";
import Home from "../routes/home/Home";
import NotFound from "../common/errors/NotFound";
import LoadingSpinner from "../common/errors/LoadingSpinner";
import ErrorMessage from "../common/errors/ErrorMessage";
import Account from "../routes/accounts/Account";
import Lot from "../routes/lots/Lot";
import Tools from "../routes/tools/Tools";
import Timesheets from "./header/profile/Timesheet";
import ScheduleBoard from "../routes/schedule-board/ScheduleBoard";
import WorkOrder from "../routes/workOrders/WorkOrder";
import { signIn } from "../../utils/auth/authProvider";

export default function PageLayout({ tokens, setIsAuthenticated }) {
	const [defaultCards, setDefaultCards] = useState();
	const [customers, setCustomers] = useState();
	const [employees, setEmployees] = useState();
	const [currentEmployee, setCurrentEmployee] = useState();
	const [lots, setLots] = useState();
	const [profile, setProfile] = useState();
	const [search, setSearch] = useState("");
	const [serviceRequests, setServiceRequests] = useState();
	const [workOrderSids, setWorkOrderSids] = useState();
	
	// created an errors object so they can be passed down to the components they are related to
	// this allows the error to be displayed in the individual component and have multiple errors on the page at once
	const [errors, setErrors] = useState();
	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			alert("You are using the dev environment.");
		}
		const controller = new AbortController();
		// clear errors if any
		setErrors();
		// load profile and cards
		getProfile(tokens.graph, controller.signal)
			.then(response => {
				setProfile(response);
				setDefaultCards(response.role.cards);
			})
			.catch(error => setErrors({ ...errors, profile: error }));
		// load all customers
		getCustomers(tokens.sprycis, controller.signal)
			.then(response => {
				console.log(response);
				setCustomers(response.Customer);
			})
			.catch(error => {console.log(error);setErrors({ ...errors, customers: error })});
		// load all lots
		getLots(tokens.sprycis, controller.signal)
			.then(response => setLots(response.Premise))
			.catch(error => {console.log(error);setErrors({ ...errors, lots: error })});
		// load all employees and set current employee
		getEmployees(tokens.cityworks, controller.signal)
			.then(setEmployees)
			.catch(error => setErrors({ ...errors, employees: error }));
		// load all work order for search
		getWorkOrderSids(tokens.cityworks, controller.signal)
			.then(setWorkOrderSids)
			.catch(error => setErrors({ ...errors, workOrderSids: error }));
		// load all service requests
		// getServiceRequests(tokens.sprycis, controller.signal)
		// 	.then(setServiceRequests)
		// 	.catch(error => setErrors({ ...errors, serviceRequests: error }));
		return () => controller.abort();
		
	}, [tokens]);
	// refresh the tokens every 2 hours to ensure they are up to date
	useEffect(() => {
		const timer = setInterval(() => {
		  signIn();
		}, 7200000);
				   // clearing interval
		return () => clearInterval(timer);
	  });
	useEffect(() => {
		
		if (profile && employees) {
			const employee = employees.filter(
				employee => employee.email.toLowerCase() === profile.email.toLowerCase()
			);
			setCurrentEmployee(employee[0]);
			//console.log(currentEmployee);
		}
	}, [profile, employees]);
	// toggle card display
	const updateCards = newCard => {
		// toggle show
		newCard.show = !newCard.show ? true : false;
		// replace matching card in default cards
		setDefaultCards({ ...defaultCards, [newCard.id]: newCard });
		
	};

	// on change update search
	const handleChange = ({ target }) => setSearch(target.value);
	// wait for default cards and display profile error if any
	console.log(defaultCards)
	return (  
		!defaultCards || !profile ? (
		
				<LoadingSpinner alert={!defaultCards?'loading default cards...' : 'loading profile'} />
			
		
	):
		<>
			<Header
				customers={customers}
				isAuthenticated={setIsAuthenticated}
				lots={lots}
				profile={profile}
				search={search}
				setSearch={setSearch}
				handleChange={handleChange}
			/>
			

			<div id='main-content' className='d-flex flex-column flex-md-row'>
				
				<SideBar profile={profile} setSearch={setSearch} />
				<div id='error-message' >
					{(errors && errors.profile) || (errors && errors.employees) ? (
						<>
							<ErrorMessage
								error={errors.profile ? errors.profile : errors.employees}
							/>
							{errors.profile ? <p>profile error {errors.profile.message}</p> : <p>employee error {errors.employees.message}</p> }
						</>
					) : (errors && errors.customers) || (errors && errors.lots)? (
						<>
						<ErrorMessage
							error={errors.customers ? errors.customers : errors.lots}
						
						/>
						{errors.customers ? <p>customers error {errors.customers.message}</p> : <p>lots error {errors.lots.message}</p> }
						</>
						
					) :<></>}
				</div>
				<div id='routes'>
					<Routes>
					
						<Route
							exact
							path='/'
							element={
								<Home
									customers={customers}
									workOrders={workOrderSids}
									lots={lots}
									search={search}
									setSearch={setSearch}
									handleChange={handleChange}
									cards={defaultCards.search}
									updateCards={updateCards}
									errors={errors}
									tokens={tokens}
								/>
							}
						/>
				
						<Route
							path='/account/:accountSid'
							element={
								<Account
									cards={defaultCards.accounts}
									updateCards={updateCards}
									tokens={tokens}
								/>
							}
						/>
				
						<Route
							path='/customer/:customerSid'
							element={
								<Customer
									cards={defaultCards.customers}
									updateCards={updateCards}
									tokens={tokens}
								/>
							}
						/>
						<Route
							path='/workorder/:workOrderSid'
							element={
								<WorkOrder
									cards={defaultCards.workOrders}
									updateCards={updateCards}
									tokens={tokens}
								/>
							}
						/>
						<Route
							path='/scheduleboard'
							element={
								<ScheduleBoard
									tokens={tokens}
									edit={defaultCards.workOrders.workOrders.edit}
								/>
							}
						/>
						<Route
							path='/lot/:LotSid'
							element={
								<Lot
									cards={defaultCards.lots}
									updateCards={updateCards}
									tokens={tokens}
								/>
							}
						/>
						{ errors && errors.employees ? 
						<Route path='/timesheet'/> :
						<Route
							path='/timesheet'
							element={
								<Timesheets
									profile={profile}
									employee={currentEmployee}
									passedWorkOrders={workOrderSids}
									tokens={tokens}
									errors={errors}
								/>
							}
						/>}
				

						<Route
							path='/reports'
							element={
								<Reports
									cards={defaultCards.reports}
									updateCards={updateCards}
									tokens={tokens}
								/>
							}
						/>
				
						<Route
							path='/tools'
							element={
								<Tools
									employees={employees}
									workOrders={workOrderSids}
									serviceRequests={serviceRequests}
									setServiceRequests={setServiceRequests}
									cards={defaultCards.tools}
									updateCards={updateCards}
									tokens={tokens}
									errors={errors}
									setErrors={setErrors}
								/>
							}
						/>
				
						<Route path='*' exact={true} element={<NotFound />} />
						
					</Routes>
					</div>
			</div>
		</>
	
	);
}
