import React, { useState, useEffect } from "react";
import {
	Button,
	Col,
	DatePicker,
	FlexboxGrid,
	Form,
	Input,
	SelectPicker
} from "rsuite";
import { updateWorkOrder, getEmployees, getStatuses, getWorkOrderBySid } from "../../../utils/api/cityworks";
import LoadingSpinner from "../../common/errors/LoadingSpinner";import { useNavigate } from "react-router-dom";
import TitleHeader from "../../common/headers/TitleHeader";
import ErrorMessage from "../../common/errors/ErrorMessage";


const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as='textarea' ref={ref} />
));

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

export default function WorkOrderListItem({ workOrder, display, tokens, gls,edit }) {
	
	const [formValue, setFormValue] = useState({
		...workOrder,
		projectedStartDate: new Date(workOrder.projectedStartDate),
		completionDate: new Date(),
		assignDate: new Date(workOrder.assignDate)
	});
	const [isEditable, setIsEditable] = useState(false);
	const [loading, setLoading] = useState();
	const formRef = React.useRef();
	const [employees, setEmployees] = useState();
	const [selectedGL, setSelectedGL] = useState();
	const [selectedEmployee, setSelectedEmployee] = useState();
	
	const [error, setError] = useState();
	const [errors, setErrors] = useState();
	const [statuses, setStatuses] = useState();

	const navigate = useNavigate();

	const clearForm = () => {
		
			setFormValue({
				...workOrder,
				projectedStartDate: new Date(workOrder.projectedStartDate),
				completionDate: new Date(),
				assignDate: new Date(workOrder.assignDate)
			});
			
		console.log(formValue)
	};
	// handle edit button toggle
	const toggleIsEditable = () => setIsEditable(!isEditable);
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
			.catch(error => setErrors({ ...errors, employees: error }));
		// employees
		getStatuses(tokens.cityworks, controller.signal)
			.then(response => {
				var temp = response.map(element => {
					return {label:element.description,value:element.code}
				});;
				setStatuses(temp)
			}).then(()=>{
				assignStatus(workOrder.status)
			})
			.catch(error => setErrors({ ...errors, status: error }));
		
		return () => controller.abort();
	}, [tokens]);
	// on submit create service
	const handleSubmit = async () => {
				// display loading spinner
			setLoading(true);
			// clear errors if any
			setError();
			console.log(formValue)
			
			const controller = new AbortController();
			updateWorkOrder(formValue,tokens.cityworks,controller.signal)
				.then(response =>{
					console.log(response)
					refreshWorkOrder()
					setLoading(false);
					toggleIsEditable();
				})
				.catch(error => setErrors({ ...errors, status: error }));
			
			return () => controller.abort();

		
		
	};
	const refreshWorkOrder = async() => {
		const controller = new AbortController();
		getWorkOrderBySid(workOrder.sid,tokens.cityworks,controller.signal)
				.then(response =>{
					setFormValue({
						...response,
						projectedStartDate: new Date(response.projectedStartDate),
						completionDate: new Date(),
						assignDate: new Date(response.assignDate)
					});
				})
				.catch(error => setErrors({ ...errors, status: error }));
			
			return () => controller.abort();
	}
	// on cancel clear form and toggle isEditable
	const handleCancel = () => {
		clearForm();
		toggleIsEditable();
	};
	const assignEmployee = e => {
		const foundEmployee = employees.find(employee => employee.meterSid === e)
		setSelectedEmployee(foundEmployee);
	};
	const assignGL = e => {
		const foundGL = gls.find(gl => gl.sid === e)
		setSelectedGL(foundGL);
	};
	const assignStatus = e => {
		const foundGL = statuses.find(gl => gl.description === e)
		setSelectedGL(foundGL);
	};

	return (
		//display workOrder header for list
		<div
			className={`card ${display ? "main-card" : "sub-card"}`}
			// on click clear search and go to result
			onClick={() => {!display ? navigate(`/workOrder/${workOrder.sid}`):console.log(display)}}
		>
			<TitleHeader
				title={`${workOrder.sid}`}
				description={`(${workOrder.description})`}
				id={workOrder.sid}
				
				
			/>
			{display ? (
				// display workOrder details
				<div
					id={`collapse${workOrder.index}`}
					className='card-body collapse show'
				>
					<div className='flex-row-center justify-content-end mb-4 mx-2'>
						{error ? (
							<ErrorMessage error={error} />
						) : !edit ? null
						: !isEditable ? (
							<i
								className='fa-solid fa-pencil form-icon-black'
								onClick={toggleIsEditable}
							/>
						) : loading ? (
							<LoadingSpinner alert={alert} />
						) : (
							<i
								className='fa-solid fa-x form-icon-red'
								onClick={handleCancel}
							/>
							
						)}
					</div>
						<div className='d-flex justify-content-between align-items-center mb-2'>
							<div className='container-fluid'>

						<Form
							ref={formRef}
							onChange={setFormValue}
							formValue={formValue}
							fluid
						>
							<FlexboxGrid>
								<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										name='address'
										label='Address'
										className='text-center'
										// error={formError.status}
										
										isEditable={isEditable}
										block
									/>
								</FlexboxGrid.Item>
									<FlexboxGrid.Item as={Col} colspan={24} md={8}>
										<Field
											name='location'
											label='Location'
											className='text-center'
											// error={formError.status}
											isEditable={isEditable}
											block
										/>
									</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										name='customerIndex'
										label='Contact'
										className='text-center'
										// error={formError.status}
										
										isEditable={isEditable}
										block
									/>
								</FlexboxGrid.Item>
							</FlexboxGrid>
							<FlexboxGrid className='mt-0'>
							<FlexboxGrid.Item as={Col} colspan={4}></FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={8}>
									<Field
										name='status'
										label='Status'
										accepter={SelectPicker}
										data={statuses}
										searchable={true}
										// error={formError.description}
										isEditable={isEditable}
										onChange={assignStatus}
										block
									/>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										name="assignTo"
										label='Assign To'
										accepter={SelectPicker}
										data={employees}
										searchable={true}
										isEditable={isEditable}
										onChange={assignEmployee}
										block
									/>
								</FlexboxGrid.Item>
							</FlexboxGrid>
							<FlexboxGrid className='mt-0'>
							<FlexboxGrid.Item as={Col} colspan={4}></FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={8}>
									<Field
										name='notes'
										label='Instructions'
										accepter={Textarea}
										// error={formError.description}
										isEditable={isEditable}
									/>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={8}>
									<Field
										name='comments'
										label='Comments'
										accepter={Textarea}
										// error={formError.description}
										isEditable={isEditable}
									/>
								</FlexboxGrid.Item>
							</FlexboxGrid>
							<FlexboxGrid className='mt-0'>
							<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										name="glIndex"
										label='GL Code'
										accepter={SelectPicker}
										data={gls}
										searchable={true}
										isEditable={isEditable}
										onChange={assignGL}
										block
									/>
									{/* <label>GL Cat. Code</label><br/>
											<InputPicker value={selectedGL} data={gls} onChange={(e)=>{drawerData.glSid=e;assignGL(e)}} /> */}
								</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										accepter={DatePicker}
										name='projectedStartDate'
										label='Projected Start Date'
										//error={formError.projectedStartDate}
										format='MM-dd-yyyy'
										isEditable={isEditable}
										block
									/>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item as={Col} colspan={24} md={8}>
									<Field
										accepter={DatePicker}
										name='assignDate'
										label='Assign Date'
										//error={formError.projectedStartDate}
										format='MM-dd-yyyy'
										isEditable={isEditable}
										block
									/>
								</FlexboxGrid.Item>
								{/* <FlexboxGrid.Item as={Col} colspan={24} md={6}>
									{workOrder.completionDate ?
									<Field
									accepter={DatePicker}
									name='completionDate'
									label='Finish Date'
									//error={formError.projectedStartDate}
									format='MM-dd-yyyy'
									isEditable={isEditable}
									block
								/>
									:null}
								</FlexboxGrid.Item> */}
								
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
			) : null}
		</div>
	);
}
