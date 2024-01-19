import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	getWorkOrderBySid,
	getMaterials
} from "../../../utils/api/cityworks";
import { getAllGLs } from "../../../utils/api/dynamics";

import CardToggle from "../../common/buttons/CardToggle";
import ErrorMessage from "../../common/errors/ErrorMessage";
import LoadingSpinner from "../../common/errors/LoadingSpinner";
import WorkOrderListItem from "./WorkOrderListItem";
import BackButton from "../../common/buttons/BackButton";
import Material from "./Materials";

export default function WorkOrder({ cards, updateCards, tokens }) {
	const [workOrder, setWorkOrder] = useState();
	const [customers, setCustomers] = useState();
	const [meters, setMeters] = useState([]);
	const [serviceRequests, setServiceRequests] = useState();
	const [errors, setErrors] = useState();
	const [material, setMaterial] = useState();
	const [gls, setGls ] = useState();
	// get AccountSid from route if any
	const { workOrderSid } = useParams();
	// load when AccountSid changes
	useEffect(() => {
		const controller = new AbortController();
		console.log(cards)
		// clear errors if any
		// clear workOrder so loading spinner displays when page is changed
		setErrors();
		setWorkOrder();
		// load workOrder, materials, 
		getWorkOrderBySid(workOrderSid, tokens.cityworks, controller.signal)
			.then(setWorkOrder)
			.catch(error => setErrors({ ...errors, workOrder: error }));
		getMaterials(workOrderSid, tokens.cityworks, controller.signal)
			.then(setMaterial)
			.catch(error => setErrors({ ...errors, material: error }));
			// GLs
		getAllGLs(tokens.dynamics, controller.signal)
			.then(response => {
				console.log(response)
                var temp = response.map(element => {
                    return {label:element.name,value:element.sid}
                });;
				setGls(temp);
			})
			// .then(()=>{
			// 	assignGL(workOrder.assignTo)
			// })
			.catch(error => setErrors({ ...errors, gls: error }));
		return () => controller.abort();
	}, [workOrderSid]);
	
	const refreshMaterials = () => {
		const controller = new AbortController();
		getMaterials(workOrderSid, tokens.cityworks, controller.signal)
			.then(setMaterial)
			.catch(error => setErrors({ ...errors, material: error }));
	}
	
	// wait for workOrder and display error if any
	return (
		<div id='page-content' className='container-fluid p-4'>
			{errors && errors.workOrder ? (
				<ErrorMessage error={errors.workOrder} />
			) : !workOrder ? (
				<LoadingSpinner alert='loading work order...' />
			) : (
				<div className='container-fluid'>
					<div className='d-flex justify-content-between'>
						<BackButton />
						<CardToggle cards={cards} updateCards={updateCards} />
					</div>
					{/* display all items loaded for the workOrder */}
					<div className='container-fluid'>
						<WorkOrderListItem workOrder={workOrder} display={true} tokens={tokens} gls={gls} edit={cards.workOrders.edit}/>
						<Material workOrder={workOrder} edit={cards.material.edit} materials={material} tokens={tokens} gls={gls} refreshMaterials={refreshMaterials} />
					</div>
				</div>
			)}
		</div>
	);
}
