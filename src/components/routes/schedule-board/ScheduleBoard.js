import React, { useState, useEffect } from "react";

import TitleHeader from "../../common/headers/TitleHeader";


import { DatePicker, CheckPicker } from "rsuite";

import { getStatuses, getDepartments, getWorkOrdersByFilter, updateWorkOrder} from "../../../utils/api/cityworks";
import SubmitButton from "../../common/buttons/SubmitButton";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import WorkOrderItem from "../../common/modals/WorkOrderItem";
import { getCalendarEventsByEmail } from '../../../utils/api/graph';
import { event } from "jquery";

const columnData = {
    mon:{
        id:"mon",
        name:"Monday",
        calendar:[],
        items:[]
    },
    tues:{
        id:"tues",
        name:"Tuesday",
        calendar:[],
        items:[]
    },
    wed:{
        id:"wed",
        name:"Wednesday",
        calendar:[],
        items:[]
    },
    thurs:{
        id:"thurs",
        name:"Thursday",
        calendar:[],
        items:[]
    },
    fri:{
        id:"fri",
        name:"Friday",
        calendar:[],
        items:[]
    }
 }

export default function ScheduleBoard({   tokens, edit }) {
	const [selectedWorkOrder, setSelectedWorkOrder] = useState([]);
    const [selectedWorkOrderStatus, setSelectedWorkOrderStatus] = useState([]);
    const [selectedWorkOrderDate, setSelectedWorkOrderDate] = useState([]);
	const [selectedStartDate, setSelectedStartDate] = useState(
		new Date().toLocaleDateString()
	);
    const [selectedEndDate, setSelectedEndDate] = useState(
		new Date().toLocaleDateString()
	);
	const [status, setStatus] = useState();
	const [errors, setErrors] = useState();
	const [departments, setDepartments] = useState();
	const [selectedStatus, setSelectedStatus] = useState(['In Progress']);
	const [selectedDepartment, setSelectedDepartment] = useState(['ELECTRIC', 'WATER']);
    const [displayBoard, setDisplayBoard] = useState(false)
    const [columns, setColumns] = useState(columnData);
    
	// load status and departments
	useEffect(() => {
		setErrors();
		const controller = new AbortController();
        // departments
		getDepartments(tokens.cityworks, controller.signal)
			.then(response => {
                var temp = response.map(element => {
                    return {label:element.description,value:element.code}
                });;
				setDepartments(temp);
			})
			.catch(error => setErrors({ ...errors, departments: error }));
		// statuses
			getStatuses(
				tokens.cityworks,
				controller.signal
			)
				.then(response => {
					var temp = response.map(element => {
                        return {label:element.description,value:element.description}
                    });;
                    setStatus(temp)
				})
				.catch(error => setErrors({ ...errors, status: error }));
		
		
		return () => controller.abort();
	}, []);
    // set selected date from the date picker
	const handleDate = date => {
        setDisplayBoard(false);
        setColumns(columnData);
        var tempDate = new Date(date.getTime());
        if(date.getDay() === 1){
            setSelectedStartDate(date);
            columns.mon.name="Monday "+tempDate.toLocaleDateString().slice(0,-5)
            tempDate.setDate(date.getDate()+1)
            columns.tues.name="Tuesday "+tempDate.toLocaleDateString().slice(0,-5)
            tempDate.setDate(date.getDate()+2)
            columns.wed.name="Wednesday "+tempDate.toLocaleDateString().slice(0,-5)
            tempDate.setDate(date.getDate()+3)
            columns.thurs.name="Thursday "+tempDate.toLocaleDateString().slice(0,-5)
            tempDate.setDate(date.getDate()+4)
            columns.fri.name="Friday "+tempDate.toLocaleDateString().slice(0,-5)
            setSelectedEndDate(tempDate);
        } else {
            alert("please select a monday")
        }
    }
    // set the selected statuses from the picker
	const handleStatus = e => {
        setDisplayBoard(false);
        clearColumnItems();
		setSelectedStatus([])
        console.log(e)
        setSelectedStatus(e)
	};
    // set the selected departments from the picker
    const handleDepartment = e => {
        
        setDisplayBoard(false);
        clearColumnItems()
		setSelectedDepartment([])
        console.log(e)
        setSelectedDepartment(e)
	};
	// clear the itmes in a column without clearing the date
    const clearColumnItems = () =>{
        columns.mon.items = [];
        columns.tues.items = [];
        columns.wed.items = [];
        columns.thurs.items = [];
        columns.fri.items = [];
        columns.mon.calendar = [];
        columns.tues.calendar = [];
        columns.wed.calendar = [];
        columns.thurs.calendar = [];
        columns.fri.calendar = [];
    }
	// filter workorders before they are displayed
    // must reset the starting point of all the items so data is not duplicated
	const handleSubmit = () => {
        setDisplayBoard(false);
        
        
        retrieveWorkOrders()
	}
	
    const retrieveWorkOrders = () => {
        clearColumnItems();
        var filters={
            status:selectedStatus,
            startDate:selectedStartDate.toLocaleDateString(),
            endDate:selectedEndDate.toLocaleDateString(),
            department:selectedDepartment
        }
        console.log(filters)
        setErrors();
		const controller = new AbortController();
        getWorkOrdersByFilter(filters,tokens.cityworks,controller.signal)
        .then(response => {
            console.log(response)
            setSelectedWorkOrder(response);
            setWorkOrdersIntoColumns(response);
        }).then(()=>{
            var tempEndDate = new Date(selectedEndDate)
            tempEndDate.setDate(tempEndDate.getDate()+1)
            console.log(tempEndDate)
            var callBody={
                email:'crewcalendar@verawaterandpower.com',
                startDate:selectedStartDate.toLocaleDateString(),
                endDate:tempEndDate.toLocaleDateString()
            }
            getCalendarEventsByEmail(callBody, tokens.graph, controller.signal)
            .then(res=>assignCalanderEvents(res))
            .catch(error => setErrors({ ...errors, calendar: error }));  
        }).then(()=>{
            setDisplayBoard(true);
        })
        .catch(error => setErrors({ ...errors, departments: error }));  
    }
    // assign each work order from the filters to a day of the week
    const assignCalanderEvents =(calendarEvents)=>{
        calendarEvents.forEach(calEvent=>{
            var dateField = new Date(calEvent.startDate)
            const dayOfWeek = dateField.getDay();
            switch (dayOfWeek){
                case 1:
                    columns.mon.calendar.push(calEvent)
                    break
                case 2:
                    columns.tues.calendar.push(calEvent)
                    break
                case 3:
                    columns.wed.calendar.push(calEvent)
                    break
                case 4:
                    columns.thurs.calendar.push(calEvent)
                    break
                case 5:
                    columns.fri.calendar.push(calEvent)
                    break 
            }
    })
    console.log(columns)   
    }

    // assign each work order from the filters to a day of the week
    const setWorkOrdersIntoColumns=(workOrdersFromFilter)=>{
        workOrdersFromFilter.forEach(wo=>{
            var dateField = new Date(wo.projectedStartDate)
            const dayOfWeek = dateField.getDay();
            switch (dayOfWeek){
                case 1:
                    columns.mon.items.push(wo)
                    break
                case 2:
                    columns.tues.items.push(wo)
                    break
                case 3:
                    columns.wed.items.push(wo)
                    break
                case 4:
                    columns.thurs.items.push(wo)
                    break
                case 5:
                    columns.fri.items.push(wo)
                    break 
            }
       })
       console.log(columns)   
     }

     // update projected start date when dropped in new column
     const updateSelectedWorkOrder = (sourceColumn, destinationColumn, workOrderNumber)=>{
        const controller = new AbortController();
        const colId = sourceColumn.id
        const updateDate = new Date(selectedStartDate.getTime())
        switch (destinationColumn.id){
            case "mon":
                break
            case "tues":
                updateDate.setDate(updateDate.getDate()+1)
                break
            case "wed":
                updateDate.setDate(updateDate.getDate()+2)
                break
            case "thurs":
                updateDate.setDate(updateDate.getDate()+3)
                break
            case "fri":
                updateDate.setDate(updateDate.getDate()+4)
                break 

        }
        console.log(sourceColumn)
        columns[colId].items.forEach(wo=>
            {   
                if(wo.index === workOrderNumber){
                    wo.projectedStartDate = updateDate
                    console.log(wo)
                    updateWorkOrder(wo, tokens.cityworks, controller.signal)
                    .then(response => {
                        console.log(response)
                         }).then(()=>{
                            retrieveWorkOrders();
                        })
                    
                    .catch(error => setErrors({ ...errors, status: error }));
        
                }
            })
        // update the work orders with fresh pull
        
           
     }
 
     // use drag and drop to update the projected start date
     const onDragEnd = (result, columns, setColumns) => {
        if(edit){
            if (!result.destination) return;
            const { source, destination } = result;
        
            if (source.droppableId !== destination.droppableId) {
                console.log(result)
                updateSelectedWorkOrder(columns[source.droppableId],columns[destination.droppableId],result.draggableId)
                const sourceColumn = columns[source.droppableId];
                const destColumn = columns[destination.droppableId];
                const sourceItems = [...sourceColumn.items];
                const destItems = [...destColumn.items];
                const [removed] = sourceItems.splice(source.index, 1);
                destItems.splice(destination.index, 0, removed);
                setColumns({
                    ...columns,
                    [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                    },
                    [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                    }
                })          
            } else {
                const column = columns[source.droppableId];
                const copiedItems = [...column.items];
                const [removed] = copiedItems.splice(source.index, 1);
                copiedItems.splice(destination.index, 0, removed);
                setColumns({
                    ...columns,
                    [source.droppableId]: {
                    ...column,
                    items: copiedItems
                    }
                });
            }
        }
        else(alert("You don't have permission to edit"))
      };

	return (
		<div id='page-content' className='container-fluid p-4'>
			<div className='card main-card '>
				<TitleHeader
					title='Work Order Weekly Schedule'
					
				/>
				<div id="scheduleBoard" className='card-body'>
                    { status ?
					<div className='container-fluid'>
						<div className='d-flex row'>
							<div id="boardFilters" className='d-flex align-items-center  mb-3 m-auto'>
								
								<DatePicker
                                label="Monday of Work Week"
									className='mx-4'
									format='MM/dd/yyyy'
									size='lg'
									cleanable={false}
									value={new Date(selectedStartDate)}
									onChange={e =>{
										handleDate(new Date(e));}
									}
								/>
								
								<CheckPicker label="Status" className='mx-4' data={status} defaultValue={selectedStatus} style={{ width: 250 }} onChange={e =>{
										handleStatus(e);}
									} />
							    
								<CheckPicker label="Department" className='mx-4' data={departments}	defaultValue={selectedDepartment} style={{ width: 250 }} onChange={e =>{
										handleDepartment(e);}
									}/>
                                <SubmitButton handleSubmit={handleSubmit} />
							</div>
                            <br/>
                            <div className="flex align-items-center">
                                {displayBoard ?
                                    // {selectedWorkOrder.length>0 ? <></>:<LoadingSpinner alert="Loading work order data" />}
                                     <div style={{ display: "flex", justifyContent: "left", height: "100%" }}>
                                    <DragDropContext
                                        onDragEnd={result => onDragEnd(result, columns, setColumns)}
                                    >
                                        {Object.entries(columns).map(([columnId, column], index) => {
                                        return (
                                            <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}
                                            key={columnId}
                                            >
                                            <div className="calendarItems">
                                                {column.calendar.map((item,index)=>{
                                                            return(
                                                                <p key={index}>{item.subject}</p>
                                                            )
                                                        })}
                                            </div>
                                            <h2>{column.name}</h2>
                                            
                                            <div style={{ margin: 8 }}>
                                                <Droppable droppableId={columnId} key={columnId}>
                                                {(provided, snapshot) => {
                                                    return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                        background: snapshot.isDraggingOver
                                                            ? "lightblue"
                                                            : "white",
                                                        padding: 4,
                                                        width: 250,
                                                        minHeight: 500
                                                        }}
                                                    >
                                                        
                                                        {column.items.map((item, index) => {
                                                        return (
                                                            <Draggable
                                                            key={item.index}
                                                            draggableId={item.sid}
                                                            index={index}
                                                            >
                                                            {(provided, snapshot) => {
                                                                return (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                    userSelect: "none",
                                                                    padding: 16,
                                                                    margin: "0 0 8px 0",
                                                                    minHeight: "50px",
                                                                    backgroundColor: (item.priority==="1"||item.priority==="2")
                                                                        ? "#A30C33"
                                                                        : item.department==="ELECTRIC"
                                                                        ? "#F57F2F"
                                                                        : "#0076BE",
                                                                    color:"white",
                                                                    ...provided.draggableProps.style
                                                                    }}
                                                                >
                                                                    <WorkOrderItem 
                                                                        workOrder={item}
                                                                        tokens={tokens}
                                                                        statuses={status}
                                                                        errors={errors}
                                                                        setErrors={setErrors}
                                                                        updateWorkOrdersOnBoard={retrieveWorkOrders}
                                                                        edit={edit}
                                                                    />
                                                                    {/* this is the display of the card */}
                                                                    
                                                                    
                                                                </div>
                                                                );
                                                            }}
                                                            </Draggable>
                                                        );
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                    );
                                                }}
                                                </Droppable>
                                            </div>
                                            </div>
                                        );
                                        })}
                                    </DragDropContext>
                                    </div>
                                    
                                    :<></>}
                            </div>
						</div>
						
					</div>:
                    <LoadingSpinner alert="Loading filter data"/>}
				</div>
			</div>
		</div>
	);
}
