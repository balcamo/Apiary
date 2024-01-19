import React, { useState, useEffect } from "react";
import { getPayCodes, getTimesheetByDate, getCurrentEmployee } from "../../../../utils/api/springbrook";
import ErrorMessage from "../../../common/errors/ErrorMessage";
import TitleHeader from "../../../common/headers/TitleHeader";
import LoadingSpinner from "../../../common/errors/LoadingSpinner";

import { Button, DatePicker, Table, Row, InputNumber, SelectPicker, IconButton } from "rsuite";
import { getEmployeeLaborByDate, updateLabor,getWorkOrderSids } from "../../../../utils/api/cityworks";
import TimeConfirmation from "../../../common/modals/TimeConfirmation.js";



const { Column, HeaderCell, Cell } = Table;

export default function Timesheets({ profile, passedWorkOrders, employee, tokens }) {
	const [timesheetForm, setTimesheetForm] = useState();
	const [dailyLaborForm, setDailyLaborForm] = useState();
	const [workOrderPicker, setWorkOrderPicker] = useState();
	const [selectedDate, setSelectedDate] = useState(
		new Date().toLocaleDateString()
	);
	const [timesheet, setTimesheet] = useState();
	const [dailyLabor, setDailyLabor] = useState();
	const [combinedTime, setCombinedTime] = useState([]);
	const [hours, setHours] = useState(0.00);
	const [errors, setErrors] = useState();
	const [loading, setLoading] = useState();
	const [isEditable, setIsEditable] = useState(false);
	const [payCodeOptions, setPayCodeOptions] = useState();
	const [payCodes,setPayCodes] = useState();
	const [payrollEmployee, setPayrollEmployee] = useState();
	const [workOrders, setWorkOrders] = useState();
	// load timesheet
	useEffect(() => {
		setErrors();
		const controller = new AbortController();
		getTimesheetByDate(selectedDate, tokens.springbrook, controller.signal)
			.then(response => {
				setTimesheetForm(response);
				setTimesheet(response);
			})
			.catch(error => setErrors({ ...errors, timesheet: error }));
		// if (employee) {
			getEmployeeLaborByDate(
				selectedDate,
				employee.email,
				tokens.cityworks,
				controller.signal
			)
				.then(response => {
					setDailyLaborForm(response);
					setDailyLabor(response);
				})
				.catch(error => setErrors({ ...errors, labor: error }));
		//}
		
		return () => controller.abort();
	}, [selectedDate]);
	// load paycodes
	useEffect(()=>{
		const controller = new AbortController();
		getPayCodes(
			tokens.springbrook,
			controller.signal
		).then((res)=>{
			setPayCodes(res)
			var tempPC = res.map(paycode => {
						return {
							label: paycode.description,
							value: paycode.code
						};
		})
			setPayCodeOptions(tempPC)
			console.log(payCodes)
		})
		.catch(error => setErrors({ ...errors, labor: error }));
		getCurrentEmployee(tokens.springbrook,controller.signal)
			.then((res)=>{
				setPayrollEmployee(res);
				console.log(payrollEmployee);
			}).catch(error => setErrors({ ...errors, labor: error }));
		
		return () => controller.abort();
	},[])
	// format workorder for a input picker
	useEffect(()=>{
		const controller = new AbortController();
		if(passedWorkOrders== undefined){
			getWorkOrderSids(tokens.cityworks, controller.signal)
			.then((res)=>{
				setWorkOrders(res)
				const tempWO = workOrders.map(workorder => {
					return {
						label: workorder.searchIndex,
						value: workorder.searchIndex
					};})
					setWorkOrderPicker(tempWO)
			})
			.catch(error => setErrors({ ...errors, workOrders: error }));
		}else{
			setWorkOrders(passedWorkOrders)
			const tempWO = passedWorkOrders.map(workorder => {
				return {
					label: workorder.searchIndex,
					value: workorder.searchIndex
				};})
			setWorkOrderPicker(tempWO)
			
		}
	},[passedWorkOrders])
	// make combined array for time entries
	useEffect(() =>{
		setCombinedTimeEntries();
	},[timesheet, dailyLabor])
	// calculate total hours when combined time changes
	useEffect(() => {
		calcHours()
	}, [combinedTime]);
	// toggle edit
	const toggleIsEditable = () => setIsEditable(!isEditable);
	// make array of all time entries from payment system and wo system
	const setCombinedTimeEntries = ()=>{
		setCombinedTime([])
		var tempcombined =[]
		if(timesheet==null){
			console.log("null error");
			
		} else {
		if (timesheet && timesheet.length > 0)
				timesheet.forEach(entry =>{tempcombined.push(entry);});
				
		if (dailyLabor && dailyLabor.length > 0)
				dailyLabor.forEach(entry => {tempcombined.push(entry)});
		}
		if(tempcombined && tempcombined.length > 0 && payrollEmployee){
			tempcombined.forEach(entry=>{
				entry.payrollEmployeeSid = payrollEmployee.employeeIndex.toString();
				entry.laborEmployeeSid=employee.employeeSid.toString();
			})
		}
		
		setCombinedTime(tempcombined)
		console.log(combinedTime)
	}
	// calculate hours
	const calcHours=()=>{
		let currentHours = 0;
		if(timesheet==null){
			console.log("null error");
			console.log(currentHours);
			console.log(dailyLabor);
		} else {
			if(combinedTime)
				combinedTime.forEach(entry => currentHours += parseFloat(entry.hours)); 
		} 
		setHours(currentHours);
		console.log(combinedTime);
	}
	
	// reset form and toggle edit
	const handleCancel = () => {
		setCombinedTimeEntries();
		toggleIsEditable();
	};
	const handleChange = e => {
		console.log(e);
		// target.name === "customer"
		// 	? setCustomerSelect(target.value)
		// setFormValue({ ...formValue, [target.name]: target.value });
	};
	// handle calendar changes
	const nextDate = () => {
		const day = new Date(selectedDate);
		const nextDay = new Date(selectedDate);
		nextDay.setDate(day.getDate() + 1);
		setSelectedDate(nextDay.toLocaleDateString());
	};

	const prevDate = () => {
		const day = new Date(selectedDate);
		const prevDay = new Date(selectedDate);
		prevDay.setDate(day.getDate() - 1);
		setSelectedDate(prevDay.toLocaleDateString());
	};
	// submit time to appropriate systems
	const handleSubmit = () => {
		const controller = new AbortController();
		setLoading(true);
		updateLabor(combinedTime, tokens.cityworks, controller.signal)
		.then(()=>{
			const tempDate=selectedDate;
			setSelectedDate(null);
			setSelectedDate(tempDate)
			
		}).finally(()=>{
			setLoading(false);
			setIsEditable(false)
		})
		.catch(error => {setErrors({ ...errors, workOrders: error }); alert(`${error}`);setIsEditable(true)});
			
	}
	// update hours based on changes
	const updateHours=(rowIndex,hours)=>{
		combinedTime[rowIndex].hours = hours;
		calcHours();
	}
	const addTimeEntry = () =>{
		var entry={
			payrollEmployeeSid:payrollEmployee.employeeIndex.toString(),
			laborEmployeeSid:employee.employeeSid.toString(),
			glNumber:"",
			hours:"1.00",
			payCode:"",
			payCodeDescription:"",
			timeDate:selectedDate,
			workOrderNumber:0
		}
		const tempTime = combinedTime;
		tempTime.push(entry);
		if(!isEditable){
		
			setIsEditable(true);
		}
		setCombinedTime(tempTime);
		calcHours();
		
	}
	const setPayCodeFromDropDown=(rowIndex,payCode)=>{
		console.log(`selected payCode${payCode}`)
		const matchedPayCode = payCodes.find(match => match.code === payCode)
		combinedTime[rowIndex].payCode = matchedPayCode.code;
		combinedTime[rowIndex].payCodeDescription = matchedPayCode.description
	}
	const setWorkOrderFromDropDown=(rowIndex,workOrder)=>{
		combinedTime[rowIndex].workOrderNumber = workOrder
	}
	const DropDownCell = ({ rowData,rowIndex, dataKey, handeChange,selectOptions, ...props }) => {
		
		return (
		  <Cell {...props} className={isEditable ? 'table-content-editing' : ''}>
			{isEditable ? (
				
			  <SelectPicker
			  	data={selectOptions} 
				defaultValue={rowData[dataKey]}
				onChange={event => {console.log(event)
				  handeChange(rowIndex,event);
				}}
			  />
			) : (
			  <span className="table-content-edit-span">{rowData[dataKey]}</span>
			)}
		  </Cell>
		);
	  };
	  const NumberCell = ({ rowData,rowIndex, dataKey,selectOptions, ...props }) => {
		
		return (
		  <Cell {...props} className={isEditable ? 'table-content-editing ' : ''}>
			{isEditable ? (
			
			  <InputNumber
			  	step={0.25}
				defaultValue={rowData[dataKey]}
				onChange={event => {
					if(event===''){
					console.log(event);
					updateHours(rowIndex,0.0);
					}
					else{console.log(event);
						updateHours(rowIndex,event);}
					} 
				}
			  />
			  
	
			) : (
			  <span className="table-content-edit-span">{rowData[dataKey]}</span>
			)}
		  </Cell>
		);
	  };

	return (
		<div id='page-content' className='container-fluid p-4'>
			<div className='card main-card '>
				<TitleHeader
					title='Daily Timesheet: '
					description={`${profile.displayName}`}
				/>
				<div className='card-body'>
					<div className='container-fluid'>
						<div className='d-flex'>
							<div className='d-flex align-items-center justify-content-around mb-3 m-auto'>
								<i
									class='fa-solid fa-arrow-left'
									onClick={prevDate}
								/>
								<DatePicker
									className='mx-4'
									format='MM/dd/yyyy'
									size='lg'
									cleanable={false}
									value={new Date(selectedDate)}
									onChange={e =>
										setSelectedDate(e.toLocaleDateString())
									}
								/>
								<i
									class='fa-solid fa-arrow-right'
									onClick={nextDate}
								/>
							</div>
							<div className='d-flex align-items-center '>
								{!isEditable ? (
									<i
										className='fa-solid fa-pencil form-icon-black me-3'
										onClick={toggleIsEditable}
									/>
								) : loading ? (
									<LoadingSpinner alert={alert} />
								) : (
									<i
										className='fa-solid fa-x form-icon-red me-3'
										onClick={handleCancel}
									/>
								)}
								<IconButton
									appearance="subtle"
									className='fa-solid fa-plus me-1' 
									onClick={addTimeEntry}	
								/>
							</div>
						</div>
						{errors && errors.timesheet ? (
							<ErrorMessage error={errors.timesheet} />
						) : 				
							(
							<Row>
								<Table
									data={combinedTime? combinedTime:[]}
									// onRowClick={rowData => {
									// 	console.log(rowData);
									// }}
									rowHeight={57}
									height={(combinedTime.length*60)+50}
									loading={!timesheet}
									onChange={e => console.log(e)}
								>
									<Column flexGrow align='center'>
										<HeaderCell>Paycode</HeaderCell>
										<DropDownCell
											dataKey='payCodeDescription'
											selectOptions={payCodeOptions}
											handeChange={setPayCodeFromDropDown}
										/>
									</Column>
									<Column flexGrow align='center'>
										<HeaderCell>Work Order #</HeaderCell>
										<DropDownCell
											dataKey='workOrderNumber'
											selectOptions={workOrderPicker}
											handeChange={setWorkOrderFromDropDown}
										/>
									</Column>
									<Column flexGrow align='center'>
										<HeaderCell>Hours</HeaderCell>
										<NumberCell
											dataKey='hours'
											
											//onChange={handleChange}
										/>
									</Column>
								</Table>
								{/* {dailyLabor ? (
								<Table
									data={combinedTime? []:dailyLabor}
									onRowClick={rowData => {
										console.log(rowData);
									}}
									loading={!dailyLabor}
									onChange={e => console.log(e)}
								>
									<Column flexGrow align='center'>
										<HeaderCell></HeaderCell>
										<DropDownCell
											dataKey='payCodeDescription'
											selectOptions={payCodes}
											//onKeyDown={setPayCodeFromDropDown}
										/>
									</Column>
									<Column flexGrow align='center'>
										<HeaderCell></HeaderCell>
										<DropDownCell
											dataKey='workOrderNumber'
											selectOptions={workOrderPicker}
											//onChange={handleChange}
										/>
									</Column>
									<Column flexGrow align='center'>
										<HeaderCell></HeaderCell>
										<NumberCell
											dataKey='hours'
											
											//onChange={handleChange}
										/>
									</Column>
								</Table>)
								:null} */}
								
							</Row>
							
						
						)}

						{/* only display work order table if employee exists in cityworks */}
						{/* {errors && errors.employee ? (
							<ErrorMessage error={errors.employee} />
						) : employee ? (
							<Row>
								{dailyLabor ? (
								<Table
									data={dailyLabor}
									onRowClick={rowData => {
										console.log(rowData);
									}}
									loading={!dailyLabor}
								>
									<Column flexGrow align='center'>
										<HeaderCell>Work Order #</HeaderCell>
										<Cell
											dataKey='workOrderNumber'
											contentEditable={isEditable}
											onChange={handleChange}
										/>
									</Column>
									<Column flexGrow align='center'>
										<HeaderCell>Hours</HeaderCell>
										<Cell
											dataKey='hours'
											contentEditable={isEditable}
											onChange={handleChange}
										/>
									</Column>
								</Table>):<></>}
							</Row> */}
						{/* ) : null} */}

						<div className='d-flex align-items-center justify-content-end'>
							<h6>Total Hours: {hours}</h6>
						</div>
						{isEditable ? (
							<div className='d-flex justify-content-center'>
								<div className='flex-row-center justify-content-between mt-5 w-75'>
									<Button
										className='btn-danger w-25'
										onClick={handleCancel}
									>
										Reset
									</Button>
									<TimeConfirmation hours={hours} handleSubmit={handleSubmit}/>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
