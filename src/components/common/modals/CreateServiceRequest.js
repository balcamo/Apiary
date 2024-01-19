import React, { useState } from "react";
import {
	Button,
	ButtonToolbar,
	Col,
	CheckPicker,
	DatePicker,
	FlexboxGrid,
	Form,
	Input,
	Modal,
	Schema,
	SelectPicker
} from "rsuite";
import {
	createArcGISRequest,
	updateArcGISRequest,
	deleteArcGISRequest,
	createMeterPoint
} from "../../../utils/api/arcgis";
import {
	createSpryCISRequest,
	getServiceRequestsByAccountSid
} from "../../../utils/api/sprycis";
import LoadingSpinner from "../errors/LoadingSpinner";
import ErrorMessage from "../errors/ErrorMessage";

const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as='textarea' ref={ref} />
));
const DisabledField = React.forwardRef((props, ref) => {
	const { name, label } = props;
	return (
		<Form.Group className='mb-3' controlId={`${name}-10`} ref={ref}>
			<Form.ControlLabel>{label}</Form.ControlLabel>
			<Form.Control name={name} disabled />
		</Form.Group>
	);
});
const Field = React.forwardRef((props, ref) => {
	const { name, message, label, accepter, error, ...rest } = props;
	return (
		<Form.Group
			controlId={`${name}-10`}
			ref={ref}
			className={error ? "has-error" : ""}
		>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<Form.Control
				name={name}
				accepter={accepter}
				errorMessage={error}
				{...rest}
			/>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	);
});

const { ArrayType, DateType, StringType, ObjectType } = Schema.Types;

const model = Schema.Model({
	scheduleDate: DateType().isRequired("This field is required."),
	serviceRequestType: StringType().isRequired("This field is required."),
	status: StringType().isRequired("This field is required."),
	customer: StringType().isRequired("This field is required."),
	meters: ArrayType().isRequired("This field is required."),
	description: StringType().isRequired("This field is required.")
});

export default function CreateServiceRequest({
	account,
	customers,
	meters,
	setServiceRequests,
	statuses,
	tokens,
	types
}) {
	// default form
	const initialFormState = {
		gisGlobalSid: "",
		gisObjectSid: "",
		ubAccountSid: account.ubAccountSid,
		ubAccountNumber: account.ubAccountNumber,
		lotSid: account.lotSid,
		meters: [],
		customer: "",
		serviceAddress: account.serviceAddress,
		serviceAddress2: account.serviceAddress2,
		serviceCity: account.serviceCity,
		serviceState: account.serviceState,
		serviceZip: account.serviceZip,
		serviceRequestType: "",
		status: "",
		description: "",
		comments: "",
		scheduleDate: new Date()
	};
	const [formValue, setFormValue] = useState({
		...initialFormState
	});
	const [selectedCustomer, setSelectedCustomer] = useState();
	const [selectedMeters, setSelectedMeters] = useState();
	const [display, setDisplay] = useState(false);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState("loading...");
	const [error, setError] = useState();
	const [formError, setFormError] = useState({});
	const formRef = React.useRef();

	// create meter select list
	const meterSelect = meters.map(meter => {
		return {
			label: meter.description,
			value: meter
		};
	});

	const customerSelect = customers.map(customer => {
		if (customer.status == "Current")
			return {
				label: `${customer.firstName ? `${customer.firstName} ` : ""}${
					customer.lastName
				} (${customer.customerNumber})`,
				value: customer.customerSid,
				customer: customer
			};
	});

	// update alert and create ESRI service request
	const createArcGIS = async ({ signal }) => {
		setAlert("sending to Esri...");
		return createArcGISRequest(formValue, tokens.arcgis, signal).catch(
			error => {
				throw error;
			}
		);
	};
	// update alert and create SpryCIS service request
	const createSpryCIS = async (gisValues, { signal }) => {
		setAlert("sending to SpryCIS...");
		return (
			createSpryCISRequest(formValue, tokens.sprycis, signal)
				.then(spryValues => {
					// add ESRI values from ESRI create - required to update
					spryValues.gisGlobalSid = gisValues.gisGlobalSid;
					spryValues.gisObjectSid = gisValues.gisObjectSid;
					// add customer data - must be included in update to prevent being overwritten
					spryValues.contactName = selectedCustomer.name;
					spryValues.contactPhone = selectedCustomer.contact;
					// save to formValue in case a retry is needed
					setFormValue(spryValues);
					return spryValues;
				})
				// if create fails, delete request from ESRI
				.catch(error => {
					deleteArcGISRequest(gisValues, tokens.arcgis, signal);
					throw error;
				})
		);
	};
	// update alart and update ESRI request with values from SpryCIS
	const updateArcGIS = async (spryValues, { signal }) => {
		setAlert("updating Esri...");
		return updateArcGISRequest(spryValues, tokens.arcgis, signal).catch(
			error => {
				throw error;
			}
		);
	};
	// if meters are selected, update alert and add meter points to ESRI map
	const createMeters = async ({ signal }) => {
		setAlert("creating meter points...");
		return selectedMeters.forEach(meter => {
			createMeterPoint(meter.meterSid, tokens.arcgis, signal).catch(
				error => {
					throw error;
				}
			);
		});
	};
	// update alert and refresh service request list
	// when done mark create as success
	const updateRequestList = async ({ signal }) => {
		setAlert("updating request list...");
		getServiceRequestsByAccountSid(
			account.ubAccountSid,
			tokens.sprycis,
			signal
		)
			.then(setServiceRequests)
			.then(() => setLoading("success"))
			.catch(error => {
				throw error;
			});
	};

	// on change replace the matching form value
	// const handleChange = (e) => {
	// 	console.log(formValue, e)
	// 	if (e.name === "customer") setSelectedCustomer(e.value);
	// 	if (e.name === "meters") handleMultiSelectChange(e);
	// 	setFormValue({ ...formValue, [e.name]: e.value });
	// };

	// on submit create service request
	const handleSubmit = async () => {
		if (!formRef.current.check()) {
			return;
		}
		if (
			formValue.scheduleDate !== "" &&
			formValue.serviceRequestType !== "" &&
			formValue.status !== "" &&
			selectedCustomer &&
			selectedMeters &&
			formValue.description !== ""
		) {
			// display loading spinner
			setLoading(true);
			// clear errors if any
			setError();
			setSelectedMeters(formValue.meters);
			// add selected meters and customer to description
			formValue.description = `${
				formValue.description
			}\nMeter(s):${selectedMeters
				.map(meter => meter.meterNumber)
				.join(", ")}\nCustomer: ${selectedCustomer.name}`;
			formValue.contactName = selectedCustomer.name;
			formValue.contactNumber = selectedCustomer.contact;
			const controller = new AbortController();
			// create ESRI request
			createArcGIS(controller)
				// add gisGloabSid and gisObjectSid to form value for updating later
				.then(gisValues => createSpryCIS(gisValues, controller))
				// update ESRI request
				.then(spryValues => updateArcGIS(spryValues, controller))
				// add meter points to map
				.then(() => createMeters(controller))
				// update service request list
				.then(() => updateRequestList(controller))
				.catch(setError);

			return () => controller.abort();
		}
	};
	// on clear reset form
	const clearForm = () => {
		const selectEls = document.querySelectorAll(".select-input");
		const resetButtonEl = document.querySelector("#resetButton");

		// selectEls.forEach(selectEl => {
		// 	// console.log($(selectEl))
		// 	console.log($(selectEl)[0])
		// 	$(selectEl)[0].setVal("")
		// });

		// setCustomerSelect(customers);
		// setMeterSelect(meters);
		// setStatusSelect(statuses);

		// reset form values
		setFormValue({ ...initialFormState });
		// remove loading spinner
		setLoading(false);
	};
	const assignCustomer = e => {
		const foundCustomer = customers.find(
			customer => customer.customerSid === e
		);
		setSelectedCustomer({
			name: `${
				foundCustomer.firstName ? `${foundCustomer.firstName} ` : ""
			}${foundCustomer.lastName}`,
			contact: foundCustomer.contactMethods.mobilePhone
				? foundCustomer.contactMethods.mobilePhone
				: foundCustomer.contactMethods.homePhone
				? foundCustomer.contactMethods.homePhone
				: ""
		});
	};
	// toggle modal display
	const toggleDisplay = () => setDisplay(!display);
	// display loading spinner while submitting
	// display error if any
	return (
		<>
			<ButtonToolbar>
				<Button onClick={toggleDisplay} className='btn-green'>
					{" "}
					<i className='fa-solid fa-plus me-1' />
					Create
				</Button>
			</ButtonToolbar>
			<Modal open={display} onClose={toggleDisplay}>
				<Modal.Header>
					<Modal.Title>Create Service Request</Modal.Title>
				</Modal.Header>
				{loading ? (
					<>
						<Modal.Body>
							{/* display error if any if created display success message */}
							{error ? (
								<ErrorMessage error={error} />
							) : loading === "success" ? (
								<h6 className='text-center'>
									Submission successful!
								</h6>
							) : (
								<LoadingSpinner alert={alert} />
							)}
						</Modal.Body>
						{/* only display footer if created */}
						{loading === "success" ? (
							<Modal.Footer className='d-flex justify-content-between'>
								<Button
									className='btn-danger w-25'
									onClick={toggleDisplay}
								>
									Close
								</Button>
								<Button
									className='btn-lt-blue w-25'
									onClick={clearForm}
								>
									New
								</Button>
							</Modal.Footer>
						) : null}
					</>
				) : (
					<>
						<Modal.Body>
							<Form
								ref={formRef}
								onChange={setFormValue}
								onCheck={setFormError}
								formValue={formValue}
								model={model}
								fluid
							>
								<FlexboxGrid>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={12}
									>
										<DisabledField
											name='ubAccountNumber'
											label='Account'
										/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={12}
									>
										<DisabledField
											name='serviceAddress'
											label='Service Address'
										/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
								<FlexboxGrid>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={8}
									>
										<Field
											accepter={DatePicker}
											name='scheduleDate'
											label='Service Date'
											errorMessage={
												formError.scheduleDate
											}
											format='MM-dd-yyyy'
											shouldDisableDate={e => {
												const isSaturday =
													e.getDay() === 6;
												const isSunday =
													e.getDay() === 0;

												if (isSaturday || isSunday) {
													return true;
												}
											}}
											block
										/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={8}
									>
										<Field
											name='serviceRequestType'
											label='Type'
											accepter={SelectPicker}
											error={formError.serviceRequestType}
											data={types}
											searchable={false}
											block
										/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={8}
									>
										<Field
											name='status'
											label='Status'
											accepter={SelectPicker}
											error={formError.status}
											data={statuses}
											searchable={false}
											block
										/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
								<FlexboxGrid>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={12}
									>
										<Field
											name='customer'
											label='Customer'
											accepter={SelectPicker}
											error={formError.customer}
											data={customerSelect}
											searchable={false}
											onChange={assignCustomer}
											block
										/>
									</FlexboxGrid.Item>
									<FlexboxGrid.Item
										as={Col}
										colspan={24}
										md={12}
									>
										<Field
											name='meters'
											label='Meters'
											accepter={CheckPicker}
											error={formError.meters}
											data={meterSelect}
											searchable={false}
											onChange={setSelectedMeters}
											block
										/>
									</FlexboxGrid.Item>
								</FlexboxGrid>
								<Field
									name='description'
									label='Description'
									accepter={Textarea}
									error={formError.description}
								/>
							</Form>
						</Modal.Body>
						<Modal.Footer className='d-flex justify-content-between'>
							<Button
								className='btn-danger w-25'
								onClick={clearForm}
							>
								Clear
							</Button>
							<Button
								className='btn-lt-blue w-25'
								onClick={handleSubmit}
							>
								Submit
							</Button>
						</Modal.Footer>
					</>
				)}
			</Modal>
		</>
	);
}
