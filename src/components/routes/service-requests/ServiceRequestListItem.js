import React, { useState, useEffect } from "react";
import {
	Button,
	Col,
	DatePicker,
	FlexboxGrid,
	Form,
	Input,
	Schema,
	SelectPicker
} from "rsuite";

import TitleHeader from "../../common/headers/TitleHeader";
import { updateArcGISRequest } from "../../../utils/api/arcgis";
import {
	updateSpryCISRequest,
	getMetersByLotSid,
	createMeterRead
} from "../../../utils/api/sprycis";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";
import { useLocation } from "react-router-dom";
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
	const { name, message, label, accepter, error, isEditable, ...rest } =
		props;
	return (
		<Form.Group
			controlId={`${name}-10`}
			ref={ref}
			className={error ? "has-error" : ""}
		>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<Form.Control
				name={name}
				appearance='default'
				accepter={accepter}
				errorMessage={error}
				disabled={!isEditable}
				{...rest}
			/>
			<Form.HelpText>{message}</Form.HelpText>
		</Form.Group>
	);
});

const { StringType, DateType } = Schema.Types;

const model = Schema.Model({
	scheduleDate: DateType().isRequired("This field is required."),
	status: StringType().isRequired("This field is required."),
	description: StringType().isRequired("This field is required.")
});

export default function ServiceRequestListItem({
	customers,
	meters,
	serviceRequest,
	setServiceRequests,
	statuses,
	skipReasons,
	errors,
	setErrors,
	tokens
}) {
	const [formValue, setFormValue] = useState({
		...serviceRequest,
		scheduleDate: new Date(serviceRequest.scheduleDate)
	});
	const [meterSelect, setMeterSelect] = useState([]);
	const [selectedMeter, setSelectedMeter] = useState();
	const [meterRead, setMeterRead] = useState("");
	const [foundMeters, setFoundMeters] = useState();
	const [formError, setFormError] = useState({});
	const [isEditable, setIsEditable] = useState(false);
	const [alert, setAlert] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	const location = useLocation();
	const formRef = React.useRef();

	const assignMeter = e => {
		const foundMeter = meters ? meters.find(meter => meter.meterSid === e) : foundMeters.find(meter => meter.meterSid === e)
		setSelectedMeter(foundMeter);
	};
	useEffect(() => {
		if (!meters) {
			const controller = new AbortController();
			getMetersByLotSid(
				serviceRequest.lotSid,
				tokens.sprycis,
				controller.signal
			)
				.then(setFoundMeters)
				.catch(error => setErrors({ ...errors, meters: error }));
			return () => controller.abort();
		}
	}, [serviceRequest]);
	useEffect(() => {
		let formattedMeters;
		if (meters) {
			formattedMeters = meters.map(meter => {
				return {
					label: meter.description,
					value: meter.meterSid
				};
			});
		}
		if (foundMeters) {
			formattedMeters = foundMeters.map(meter => {
				return {
					label: meter.description,
					value: meter.meterSid
				};
			});
		}
		setMeterSelect(formattedMeters);
	}, [meters, foundMeters]);
	// handle edit button toggle
	const toggleIsEditable = () => setIsEditable(!isEditable);
	const handleMeterRead = async ({ signal }) => {
		console.log(meterRead, selectedMeter)
		if (meterRead && selectedMeter) {
			formValue.description = `Field Read: ${meterRead} (${selectedMeter.description})\n${formValue.description}`;
			const newRead = {
				meterSid: selectedMeter.meterSid,
				reading: meterRead,
				readingType: "NORMAL",
				readingMethod: "RADIO"
			};
			return createMeterRead(
				newRead,
				tokens.sprycis,
				signal
			).catch(error => {
				throw error;
			});
		}
	};
	// update alert and update arcgis request
	const updateArcGIS = async ({ signal }) => {
		setAlert("updating Esri...");
		return updateArcGISRequest(formValue, tokens.arcgis, signal).catch(
			error => {
				throw error;
			}
		);
	};
	// update alert and create SpryCIS service request
	const updateSpryCIS = async ({ signal }) => {
		setAlert("updating SpryCIS...");
		return updateSpryCISRequest(formValue, tokens.sprycis, signal).catch(
			error => {
				updateArcGISRequest(serviceRequest, tokens.arcgis, signal);
				throw error;
			}
		);
	};
	// on cancel reset form
	const clearForm = () => {
		setFormValue({
			...serviceRequest,
			scheduleDate: new Date(serviceRequest.scheduleDate)
		});
	};
	// on change update service request
	const handleChange = ({ target }) => {
		// target.name === "customer"
		// 	? setCustomerSelect(target.value)
		setFormValue({ ...formValue, [target.name]: target.value });
	};
	// when meter select is changed update meter form value
	// const handleMultiSelectChange = e => {
	// 	const selectedMeters = e.map(meter => {
	// 		return meter.value;
	// 	});
	// 	setMeterSelect(selectedMeters);
	// };
	// on submit create service
	const handleSubmit = async () => {
		if (
			formValue.scheduleDate !== "" &&
			formValue.status !== "" &&
			formValue.description !== ""
		) {
			// display loading spinner
			setLoading(true);
			// clear errors if any
			setError();
			if (formValue.skipReason)
				formValue.description = `Skip Reason: ${formValue.skipReason}\n\n${formValue.description}`;
			const controller = new AbortController();
			// update ESRI request
			handleMeterRead(controller)
				.then(() => updateArcGIS(controller))
				.then(() => updateSpryCIS(controller))
				// update service request list
				.then(response => {
					console.log(response);
					setIsEditable(false);
					setLoading(false);
				})
				.catch(setError);

			return () => controller.abort();
		}
	};
	// on cancel clear form and toggle isEditable
	const handleCancel = () => {
		clearForm();
		toggleIsEditable();
	};
	return (
		<div className='card sub-card'>
			<TitleHeader
				title={serviceRequest.serviceRequestType}
				description={`(${serviceRequest.serviceRequestNumber})${
					location.pathname === "/tools"
						? ` - ${serviceRequest.serviceAddress}${
								serviceRequest.serviceAddress2
									? ` ${serviceRequest.serviceAddress2}`
									: ""
						  }`
						: ""
				}`}
				id={serviceRequest.serviceRequestNumber}
				status={serviceRequest.status}
			/>
			<div
				id={`collapse${serviceRequest.serviceRequestNumber}`}
				className='card-body collapse'
			>
				<div className='flex-row-center justify-content-end mb-4 mx-2'>
					{error ? (
						<ErrorMessage error={error} />
					) : !isEditable ? (
						<i
							className='fa-solid fa-pencil form-icon-black'
							onClick={toggleIsEditable}
						/>
					) : loading ? (
						<LoadingSpinner alert={alert} />
					) : (
						<i
							class='fa-solid fa-x form-icon-red'
							onClick={handleCancel}
						/>
						// <MDBBtn className='btn-danger' onClick={clearForm}>
						// 	Cancel
						// </MDBBtn>
						// <MDBBtn
						// 	type='button'
						// 	className='btn-lt-blue'
						// 	onClick={handleSubmit}
						// >
						// 	Submit
						// </MDBBtn>
					)}
				</div>
				<div className='container-fluid'>
					<Form
						ref={formRef}
						onChange={setFormValue}
						onCheck={setFormError}
						formValue={formValue}
						model={model}
						fluid
					>
						{serviceRequest.status !== "Completed" ? (
							<Field
								name='skipReason'
								label='Skip Reason (if applicable)'
								accepter={SelectPicker}
								data={skipReasons}
								searchable={false}
								isEditable={isEditable}
								block
							/>
						) : null}
						<FlexboxGrid>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<Field
									label='Meter Read'
									accepter={Input}
									value={meterRead}
									isEditable={isEditable}
									onChange={setMeterRead}
								/>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<Field
									label='Meter'
									accepter={SelectPicker}
									data={meterSelect}
									searchable={false}
									isEditable={isEditable}
									onChange={assignMeter}
									block
								/>
							</FlexboxGrid.Item>
						</FlexboxGrid>

						<FlexboxGrid>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<Field
									name='status'
									label='Status'
									className='text-center'
									accepter={SelectPicker}
									// error={formError.status}
									data={statuses}
									searchable={false}
									isEditable={isEditable}
									block
								/>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<Field
									accepter={DatePicker}
									name='scheduleDate'
									label='Service Date'
									error={formError.scheduleDate}
									format='MM-dd-yyyy'
									shouldDisableDate={e => {
										const isSaturday = e.getDay() === 6;
										const isSunday = e.getDay() === 0;

										if (isSaturday || isSunday) {
											return true;
										}
									}}
									isEditable={isEditable}
									block
								/>
							</FlexboxGrid.Item>
						</FlexboxGrid>
						<Field
							name='description'
							label='Description'
							accepter={Textarea}
							// error={formError.description}
							isEditable={isEditable}
						/>
						<FlexboxGrid className='mt-0'>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<DisabledField
									name='createBy'
									label='Requested By'
								/>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<DisabledField
									name='createDate'
									label='Request Date'
								/>
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</Form>
					{isEditable ? (
						<div className='flex-row-center justify-content-between mx-4 mt-5'>
							<Button
								className='btn-danger w-25'
								onClick={clearForm}
							>
								Reset
							</Button>
							<Button
								className='btn-lt-blue w-25'
								onClick={handleSubmit}
							>
								Submit
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
