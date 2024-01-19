import React, { useState } from "react";
import { signOut } from '../../../../utils/auth/authProvider';
import { Link } from "react-router-dom";
import { Dropdown } from "rsuite";
import ProfileDetails from "./ProfileDetails";

const MyTimecard = React.forwardRef((props, ref) => {
	const { href, as, ...rest } = props;
	return (
		<Link to='/timesheet' as={as} style={{ textDecoration: "none" }}>
			<a ref={ref} {...rest}>
				Timecard
			</a>
		</Link>
	);
});
const WorkOrderSchedule = React.forwardRef((props, ref) => {
	const { href, as, ...rest } = props;
	return (
		<Link to='/scheduleBoard' as={as} style={{ textDecoration: "none" }}>
			<a ref={ref} {...rest}>
				Work Order Schedule
			</a>
		</Link>
	);
});
export default function Profile({ profile, setIsAuthenticated }) {
	const [dropdown, setDropdown] = useState(false);
	const [modal, setModal] = useState(false);
	// controls dropdown display
	const toggleDropdown = () => setDropdown(!dropdown);
	// controls modal display
	const toggleModal = () => setModal(!modal);

	const handleSignOut = async e => {
		e.preventDefault();
		signOut()
			.then(response => {
				console.log(response);
				setIsAuthenticated(false);
			})
			.catch(error => console.log(error.errorMessage));
	};

	const toggleButton = ref => {
		return (
			<button
				ref={ref}
				className='d-flex align-items-center text-nowrap bg-transparent icon-black shadow-none'
				onClick={toggleDropdown}
				id="profile-button"
			>
				<i className='far fa-user me-2' />
				<h6 className='d-none d-md-inline-block'>
					{profile.displayName}
				</h6>
			</button>
		);
	};

	return (
		<>
			<Dropdown
				id='profile-dropdown'
				renderToggle={toggleButton}
				// title='Filter'
				trigger="click"
				open={dropdown}
				noCaret
			>
				<Dropdown.Item
					as={MyTimecard}
					href='/timesheet'
					className='text-center m-1 mb-0'
				/>
				<Dropdown.Item
					as={WorkOrderSchedule}
					href='/scheduleBoard'
					className='text-center m-1 mb-0'
				/>
				<Dropdown.Item
					onClick={toggleModal}
					className='text-center m-1 mb-0'
				>
					Profile
				</Dropdown.Item>
				<ProfileDetails
					profile={profile}
					modal={modal}
					setModal={setModal}
					toggleModal={toggleModal}
				/>
				<Dropdown.Item
					onClick={e => handleSignOut(e)}
					className='text-center m-1 mb-0 sign-out'
				>
					Sign Out
				</Dropdown.Item>
			</Dropdown>
		</>
	);
}
