import React from "react";
import { useLocation } from "react-router-dom";
import { MDBBtn } from "mdb-react-ui-kit";
import Profile from "./profile/Profile";
import SearchBar from "../../common/search/SearchBar";

export default function Header({
	customers,
	lots,
	profile,
	search,
	setIsAuthenticated,
	setSearch,
	handleChange
}) {
	const location = useLocation();

	return (
		<nav
			id='navbar'
			className='flex-row-center justify-content-between w-100 pe-4'
		>
			<div className='flex-row-center w-100'>
				<div id='logo-container' className='bg-dark-blue p-2'>
					<img
						src='/img/ApiaryLogo.png'
						alt='Apiary Logo'
						className='navbar-logo img-circle'
					/>
				</div>
				<MDBBtn
					id='sidebarCollapse'
					className='icon-black mx-3'
					color='link'
					data-bs-toggle='collapse'
					data-bs-target='#sidebar'
				>
					<i className='fas fa-bars'></i>
				</MDBBtn>
				{/* display title on home page otherwise display search bar */}
				{location.pathname === "/" ? (
					<h6 className='text-nowrap me-2'>
						Apiary <b>Development</b>
					</h6>
				) : (
					<div className='flex-row-center w-100'>
						<SearchBar
							customers={customers}
							lots={lots}
							search={search}
							setSearch={setSearch}
							handleChange={handleChange}
						/>
					</div>
				)}
			</div>
			<Profile
				profile={profile}
				setIsAuthenticated={setIsAuthenticated}
			/>
		</nav>
		/* end.navbar */
	);
}
