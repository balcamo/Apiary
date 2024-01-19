import React from "react";
import { Link } from "react-router-dom";
import Support from "../common/modals/Support";

export default function SideBar({ profile, setSearch }) {
	return (
		<div
			id='sidebar'
			className='flex-md-column collapse align-items-center'
		>
			<ul className='nav-link-wrapper align-items-center flex-md-column '>
				{/* To Do: create defaultLinks variable and map through it */}
				<li
					data-bs-toggle='collapse'
					data-bs-target='#sidebar.show'
					onClick={() => setSearch("")}
				>
					<Link to='/' className='nav-link'>
						<i className='nav-icon fas fa-home p-0'></i>
						<p className='sidebar-text mb-0 ms-2'>Home</p>
					</Link>
				</li>
				<li
					data-bs-toggle='collapse'
					data-bs-target='#sidebar.show'
					onClick={() => setSearch("")}
				>
					<Link to='/reports' className='nav-link'>
						<i className='nav-icon fas fa-print p-0'></i>
						<p className='sidebar-text mb-0 ms-2'>Reports</p>
					</Link>
				</li>
				{/* <li
					data-bs-toggle='collapse'
					data-bs-target='#sidebar.show'
					onClick={() => setSearch("")}
				>
					<Link to='/tools' className='nav-link'>
						<i className='nav-icon fas fa-wrench p-0'></i>
						<p className='sidebar-text mb-0 ms-2'>Tools</p>
					</Link>
				</li> */}
				
				{/* <li
					data-bs-toggle='collapse'
					data-bs-target='#sidebar.show'
					onClick={() => setSearch("")}
				>
					<Link to='/analysis' className='nav-link'>
						<i className='nav-icon fas fa-chart-line p-0'></i>
						<p className='sidebar-text mb-0 ms-2'>Analysis</p>
					</Link>
				</li> */}
				{/* {profile.role.name === "Super User" ? (
					<li
						data-bs-toggle='collapse'
						data-bs-target='#sidebar.show'
						onClick={() => setSearch("")}
					>
						<Link to='/admin' className='nav-link'>
							<i className='nav-icon fas fa-user-cog p-0'></i>
							<p className='sidebar-text mb-0 ms-2'>Admin</p>
						</Link>
					</li>
				) : null} */}
			</ul>
			<Support profile={profile} />
		</div>
	);
}
