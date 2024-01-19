import React, { useState } from "react";
import { updateMaterial } from "../../../utils/api/cityworks";
// import Table from "../../common/tables/Table";
import { Row,Col, Table, Button, Drawer, Input, InputPicker} from 'rsuite';
import ErrorMessage from "../../common/errors/ErrorMessage";
import TitleHeader from "../../common/headers/TitleHeader";


const { Column, HeaderCell, Cell } = Table;
export default function Material({ workOrder, materials, tokens, gls, refreshMaterials,edit }) {
	const [isEditable, setIsEditable] = useState(false);
	const [error, setError] = useState();
	const [open, setOpen] = useState(false);
	const [drawerData, setDrawerData] = useState();
	const [selectedGL, setSelectedGL] = useState();
	// const [gls, setGls] = useState();
	

	const handleOpenDrawer = ({data}) => {
		setDrawerData(data);
		console.log(data);
		console.log(gls)
		setOpen(true);
	}
	
	// const handleChange = ({ target }) => {
	// 	console.log(target);
	// };
	const assignGL = e => {
		const foundGL = gls.find(gl => gl.sid === e)
		setSelectedGL(foundGL);
	};
	//const handleEdit = () => setIsEditable(true);

	// on submit, update cityworks
	const handleSubmit = () => {
		const controller = new AbortController();

		// clear error if any
		setError();
		updateMaterial(drawerData, tokens.cityworks, controller.signal)
			.then((data) => {
				refreshMaterials()
				setOpen(false);
			})
			.catch(setError);

		return () => controller.abort();
	};
	//console.log(materials)
	// display error if any. otherwise, wait for materials before displaying.
	return (
		<div className='card sub-card'>
			
				<TitleHeader
					title='Materials'
					id={`${workOrder.WorkOrderIndex}-Materials`}
				/>
			

			<div
				id={`collapse${workOrder.WorkOrderIndex}-Materials`}
				className='card-body justify-content-center show'
			>
				{materials.length <= 0 ? (
					<p className='mb-0'>
						There is no material data to display.
					</p>
				) : (
					<>
						{error ? <ErrorMessage error={error} /> : null}
						
						<Table
						height={400}
						data={materials}
						onRowClick={rowData => {
							console.log(rowData);
							setDrawerData(rowData)
						}}
						>
						<Column width={60} align="center" fixed>
							<HeaderCell>Item Id</HeaderCell>
							<Cell dataKey="itemSid" />
						</Column>

						<Column flexGrow={2}>
							<HeaderCell>Description</HeaderCell>
							<Cell dataKey="description" />
						</Column>

						<Column flexGrow={1}>
							<HeaderCell>Quantity</HeaderCell>
							<Cell dataKey="quantity" />
						</Column>

						<Column flexGrow={1}>
							<HeaderCell>Unit Cost</HeaderCell>
							<Cell dataKey="unitCost" />
						</Column>

						<Column flexGrow={1}>
							<HeaderCell>Total Cost</HeaderCell>
							<Cell dataKey="amount" />
						</Column>

						<Column flexGrow={2}>
							<HeaderCell>GL Account</HeaderCell>
							<Cell dataKey="glIndex" />
						</Column>
						{edit?
							<Column width={60} fixed="right">
								<HeaderCell>...</HeaderCell>

								<Cell style={{ padding: '6px' }}>
								{rowData => (
									<Button appearance="link" onClick={() => {setDrawerData(rowData);handleOpenDrawer(rowData)}}>
										Edit
									</Button>
								)}
								</Cell>
							</Column>
							:null
						}
						</Table>
						<Drawer size='md' placement='bottom' open={open} onClose={() => setOpen(false)}>
							<Drawer.Header>
							<Drawer.Title>Drawer Title</Drawer.Title>
							<Drawer.Actions>
								<Button onClick={() => setOpen(false)}>Cancel</Button>
								<Button onClick={() => handleSubmit()} appearance="primary">
								Save
								</Button>
							</Drawer.Actions>
							</Drawer.Header>
							<Drawer.Body>
							{drawerData?
								<>
									<Row>
										<Col>
											<label>Item</label>
											<Input value={drawerData.itemSid} disabled />
										</Col>
										<Col>
											<label>Description</label>
											<Input value={drawerData.description} disabled />
										</Col>
										<Col>
											<label>Quantity</label>
											<Input value={drawerData.quantity} disabled />
										</Col>
									</Row>
									<Row>
										<Col>
											<label>Unit Cost</label>
											<Input value={drawerData.unitCost} disabled />
										</Col>
										<Col>
											<label>Amount</label>
											<Input value={drawerData.amount} disabled />
										</Col>
										<Col>
											<label>GL Cat. Code</label><br/>
											<InputPicker value={selectedGL} defaultValue={drawerData.glIndex} data={gls} onChange={(e)=>{drawerData.glIndex=e;assignGL(e)}} />
										</Col>
									</Row>
									
								</>
								:<p>here will be data to edit</p>
								
							}
							</Drawer.Body>
						</Drawer>
					</>
				)}
			</div>
		</div>
	);
}
