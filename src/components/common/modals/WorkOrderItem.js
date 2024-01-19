import React, { useState, useEffect } from "react";
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
	SelectPicker,
} from "rsuite";

import LoadingSpinner from "../../common/errors/LoadingSpinner";
import ErrorMessage from "../../common/errors/ErrorMessage";
import $ from "jquery";
import { useLocation } from "react-router-dom";
import { getEmployees, updateWorkOrder } from "../../../utils/api/cityworks";

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
	projectedStartDate: DateType().isRequired("This field is required."),
	status: StringType().isRequired("This field is required."),
	description: StringType().isRequired("This field is required.")
});

export default function WorkOrderItem({
	workOrder,
	statuses,
	tokens,
	errors,
	setErrors,
	updateWorkOrdersOnBoard,
	edit
}) {
	const [formValue, setFormValue] = useState({
		...workOrder,
		projectedStartDate: new Date(workOrder.projectedStartDate),
		scheduleDate: new Date(workOrder.scheduleDate)
	});
	const [formError, setFormError] = useState({});
	const [isEditable, setIsEditable] = useState(false);
	const [alert, setAlert] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	const location = useLocation();
	const formRef = React.useRef();
	const [display, setDisplay] = useState(false);
	const [employees, setEmployees] = useState()
	const [selectedEmployee, setSelectedEmployee] = useState();

	const toggleDisplay = () => {setDisplay(!display);}
	
	const assignEmployee = e => {
		const foundEmployee = employees.find(employee => employee.meterSid === e)
		setSelectedEmployee(foundEmployee);
	};
	// handle edit button toggle
	const toggleIsEditable = () => setIsEditable(!isEditable);
	// get employees for submit
	useEffect(() => {
		setErrors();
		const controller = new AbortController();
        // employees
		getEmployees(tokens.cityworks, controller.signal)
			.then(response => {
                var temp = response.map(element => {
                    return {label:element.firstName+" "+element.lastName,value:element.sid}
                });;
				setEmployees(temp);
			}).then(()=>{
				assignEmployee(workOrder.assignTo)
			})
			.catch(error => setErrors({ ...errors, departments: error }));
		
		
		return () => controller.abort();
	}, []);
	// update alert and create SpryCIS service request
	// const updateSpryCIS = async ({ signal }) => {
	// 	setAlert("updating SpryCIS...");
	// 	return updateSpryCISRequest(formValue, tokens.sprycis, signal).catch(
	// 		error => {
	// 			throw error;
	// 		}
	// 	);
	// };
	// on cancel reset form
	const clearForm = () => {
		setFormValue({
			...workOrder,
			scheduleDate: new Date(workOrder.scheduleDate)
		});
	};
	// on change update service request
	const handleChange = ({ target }) => {
		// target.name === "customer"
		// 	? setCustomerSelect(target.value)
		if(target.name==="projectedStartDate" || target.name==="scheduleDate"){
			setFormValue({ ...formValue, [target.name]: target.value.toLocalDateSring() });
		}else{
			setFormValue({ ...formValue, [target.name]: target.value });
		}
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
			console.log(formValue)
			
			const controller = new AbortController();
			updateWorkOrder(formValue,tokens.cityworks,controller.signal)
				.then(response =>{
					console.log(response)
					setLoading(false);
					toggleIsEditable();
				}).then(()=>{updateWorkOrdersOnBoard()})
				.catch(error => setErrors({ ...errors, status: error }));
			
			return () => controller.abort();

		}
		
	};
	// on cancel clear form and toggle isEditable
	const handleCancel = () => {
		clearForm();
		toggleIsEditable();
	};
	return (
		<>
			<a onClick={toggleDisplay}>
				<p><b>Work Order:</b> {workOrder.index}</p>
                <p><b>Description:</b> {workOrder.description}</p>
				 {workOrder.priority==="5" ? 
					<p><i><b>Scheduled:</b> {workOrder.projectedStartDate}</i></p> 
					: null
				}
			</a>
			<Modal open={display} onClose={toggleDisplay}>
				<Modal.Header>
					<>Work #{workOrder.index}  Status: {workOrder.status}</>

					<div className='flex-row-center justify-content-end mb-4 mx-2'>
						{error ? (
							<ErrorMessage error={error} />
						) : !edit?null
						  : !isEditable ? (
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
							
						)}
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className='container-fluid'>
						<Form
							ref={formRef}
							onChange={setFormValue}
							onCheck={setFormError}
							formValue={formValue}
							model={model}
							fluid
						>
							<FlexboxGrid>
								<FlexboxGrid.Item as={Col} colspan={24} md={12}>
									<Field
										name='address'
										label='Address'
										className='text-center'
										// error={formError.status}
										
										isEditable={isEditable}
										block
									/>
								</FlexboxGrid.Item>
								{workOrder.address === workOrder.location?<></>:
									<FlexboxGrid.Item as={Col} colspan={24} md={12}>
										<Field
											name='location'
											label='Location'
											className='text-center'
											// error={formError.status}
											isEditable={isEditable}
											block
										/>
									</FlexboxGrid.Item>
								}
							</FlexboxGrid>
							<Field
								name='notes'
								label='Instructions'
								accepter={Textarea}
								// error={formError.description}
								isEditable={isEditable}
							/>
							<FlexboxGrid className='mt-0'>
								<FlexboxGrid.Item as={Col} colspan={24} md={12}>
									<Field
										name="assignTo"
										label='Assign To'
										accepter={SelectPicker}
										data={employees}
										searchable={false}
										isEditable={isEditable}
										onChange={assignEmployee}
										block
									/>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={24} md={12}>
								<Field
									accepter={DatePicker}
									name='projectedStartDate'
									label='Projected Start Date'
									error={formError.projectedStartDate}
									format='MM-dd-yyyy'
									isEditable={isEditable}
									block
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
				</Modal.Body>
			</Modal>
		</>
	);
}
