import React from "react"
import $ from "jquery"
import "jquery-ui"
import "jquery-ui/ui/widgets/sortable"

class ResizeSandbox extends React.Component {
	componentDidMount() {
		// Make the dashboard widgets sortable Using jquery UI
		this.props.jqueryCardFunction()
		
	}

	render() {
		return (
			<div>
				<section className='content'>
					<h5>Sort and Resize Items Sample</h5>
					<div className='grid'>
						<div className='row connectedSortable'>
							<div className='col-md-4'>
								<div className='card'>
									<div className='card-header'>
										<h3 className='card-title'>
											<i className='fas fa-text-width'></i>
											Item One
										</h3>
										<div className='card-tools'>
											{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
											<button
												type='button'
												className='btn btn-tool btn-compress'
												data-toggle='tooltip'
												data-placement='top'
												title='Reduce Size'
											>
												<i className='fas fa-search-minus'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-expand'
												data-toggle='tooltip'
												data-placement='top'
												title='Increase Size'
											>
												<i className='fas fa-search-plus'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-minmax btn-min'
												data-card-widget='collapse'
												data-toggle='tooltip'
												data-placement='top'
												title='Collapse Item'
											>
												<i className='fas fa-minus'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool'
												data-card-widget='remove'
												data-toggle='tooltip'
												data-placement='top'
												title='Remove Item'
											>
												<i className='fas fa-times'></i>
											</button>
										</div>
									</div>
									{/* /.card-header */}
									<div className='card-body'>
										<img
											className='d-block w-100'
											src='https://placehold.it/900x500/85bace/ffffff&text=One'
											alt='One'
										/>
									</div>
									{/* /.card-body */}
								</div>
								{/* /.card */}
							</div>
							{/* ./col */}
							<div className='col-md-auto'>
								<div className='card collapsed-card'>
									<div className='card-header'>
										<h3 className='card-title'>
											<i className='fas fa-text-width'></i>
											Item Two
										</h3>
										<div className='card-tools'>
											{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
											<button
												type='button'
												className='btn btn-tool btn-compress'
												data-toggle='tooltip'
												data-placement='top'
												title='Reduce Size'
											>
												<i className='fas fa-chevron-down'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-expand'
												data-toggle='tooltip'
												data-placement='top'
												title='Increase Size'
											>
												<i className='fas fa-chevron-up'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-minmax btn-max'
												data-card-widget='collapse'
												data-toggle='tooltip'
												data-placement='top'
												title='Collapse Item'
											>
												<i className='fas fa-plus'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool'
												data-card-widget='remove'
												data-toggle='tooltip'
												data-placement='top'
												title='Remove Item'
											>
												<i className='fas fa-times'></i>
											</button>
										</div>
									</div>
									{/* /.card-header */}
									<div className='card-body'>
										<img
											className='d-block w-100'
											src='https://placehold.it/900x500/008453/ffffff&text=Two'
											alt='Two'
										/>
									</div>
									{/* /.card-body */}
								</div>
								{/* /.card */}
							</div>
							{/* ./col */}
							<div className='col-md-auto'>
								<div className='card collapsed-card'>
									<div className='card-header'>
										<h3 className='card-title'>
											<i className='fas fa-text-width'></i>
											Item Three
										</h3>
										<div className='card-tools'>
											{/* RESIZE BUTTONS NEED TO BE IN card-tools AREA OR LEVEL NEEDS TO BE ADJUSTED IN THE JAVASCRIPT  */}
											<button
												type='button'
												className='btn btn-tool btn-compress'
												data-toggle='tooltip'
												data-placement='top'
												title='Reduce Size'
											>
												<i className='fas fa-chevron-down'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-expand'
												data-toggle='tooltip'
												data-placement='top'
												title='Increase Size'
											>
												<i className='fas fa-chevron-up'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool btn-minmax btn-max'
												data-card-widget='collapse'
												data-toggle='tooltip'
												data-placement='top'
												title='Collapse Item'
											>
												<i className='fas fa-plus'></i>
											</button>
											<button
												type='button'
												className='btn btn-tool'
												data-card-widget='remove'
												data-toggle='tooltip'
												data-placement='top'
												title='Remove Item'
											>
												<i className='fas fa-times'></i>
											</button>
										</div>
									</div>
									{/* /.card-header */}
									<div className='card-body'>
										<img
											className='d-block w-100'
											src='https://placehold.it/900x500/a30c33/ffffff&text=Three'
											alt='Three'
										/>
									</div>
									{/* /.card-body */}
								</div>
								{/* /.card */}
							</div>
							{/* ./col */}
						</div>
						{/* /.row */}
					</div>
				</section>
			</div>
		)
	}
}

export default ResizeSandbox
