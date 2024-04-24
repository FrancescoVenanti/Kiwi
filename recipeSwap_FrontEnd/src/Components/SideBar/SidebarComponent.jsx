import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faUtensils,
	faHeart,
	faSearch,
	faBars,
	faXmark,
	faDoorOpen,
	faMessage,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import { logoutUser } from "../../Redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../GlobalComponents/ThemeToggle";
import userPlaceholder from "../../assets/userPlaceholder.png";
import LogoSvg from "../GlobalComponents/LogoSvg";

// eslint-disable-next-line react/prop-types
const SidebarComponent = ({ setIsNavOpen }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = () => {
		dispatch(logoutUser());
		navigate("/Authentication");
	};

	const handleToggleSidebar = () => {
		setIsOpen(!isOpen);
		setIsNavOpen(!isOpen);
	};
	const handleHoverChange = () => setIsHovered(!isHovered);

	const variants = {
		open: { x: 120 }, // Adjust the x value as needed to move it right
		closed: { x: 0 },
	};

	const [searchQuery, setSearchQuery] = useState("");

	const handleInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleKeyDown = (event) => {
		// Check if the Enter key is pressed
		if (event.key === "Enter") {
			// Prevent the default action to avoid submitting a form if there is one
			event.preventDefault();
			// Navigate to the search page with the query
			navigate(`/search/${searchQuery}`);
			setIsOpen(false);
		}
	};

	const user = useSelector((state) => state.auth.user);
	const userProfilePicture = useSelector((state) => state.auth.user.profilePicture);

	return (
		<div className={`ms-2 sidebar   rounded-3 ps-2  ${isOpen ? "sideOpen" : "sideClose"} White`}>
			<div className="py-1 d-flex flex-column justify-content-center align-items-center ">
				{isOpen ? (
					<a className="fs-4 p-3 w-100 " onClick={handleToggleSidebar}>
						<motion.div
							animate={isOpen ? "open" : "closed"}
							variants={variants}
							transition={{ type: "spring", stiffness: 100 }}
						>
							<FontAwesomeIcon className="me-2" icon={faXmark} />
						</motion.div>
					</a>
				) : (
					<a className="fs-4 p-3 w-100" onClick={handleToggleSidebar} aria-label="Toggle search">
						<motion.div
							animate={isOpen ? "open" : "closed"}
							variants={variants}
							transition={{ type: "spring", stiffness: 80 }}
						>
							<FontAwesomeIcon icon={faBars} />
						</motion.div>
					</a>
				)}

				{isOpen ? (
					<a className="fs-4 p-3 w-100 d-flex align-items-center">
						<FontAwesomeIcon className="me-2" icon={faSearch} />
						<input
							type="text"
							className="form-control m-0"
							placeholder="Search a recipe"
							value={searchQuery}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
					</a>
				) : (
					<a className="fs-4 p-3 w-100 " onClick={handleToggleSidebar} aria-label="Toggle search">
						<FontAwesomeIcon icon={faSearch} />
					</a>
				)}

				{/* Convert these to Link */}
				<Link to="/" className="fs-4 p-3 w-100">
					<div
						id="logoKiwi"
						className={`d-flex align-items-center justify-content-start ${isOpen ? "iconSide" : ""}`}
						icon={faHome}
					>
						{/* <img id="logoKiwi" src={logo} alt="logo" className={`me-2 `} /> */}
						<LogoSvg />
						<span className="ms-2">{isOpen && "Home"}</span>
					</div>
				</Link>
				<Link to="/discover" className="fs-4 p-3 w-100">
					<FontAwesomeIcon className={`me-3 ${isOpen ? "iconSide" : ""}`} icon={faUtensils} />
					{isOpen && "Discover"}
				</Link>
				<Link to="/favourites" className="fs-4 p-3 w-100">
					<FontAwesomeIcon className={`me-3 ${isOpen ? "iconSide" : ""}`} icon={faHeart} />
					{isOpen && "Favourites"}
				</Link>
				<Link to="/messages" className="fs-4 p-3 w-100">
					<FontAwesomeIcon className={`me-3 ${isOpen ? "iconSide" : ""}`} icon={faMessage} />
					{isOpen && "messages"}
				</Link>
				<Link to="/askkiwi" className="fs-4 p-3 w-100">
					<FontAwesomeIcon className={`me-3 ${isOpen ? "iconSide" : ""}`} icon={faRobot} />
					{isOpen && "Ask Kiwi"}
				</Link>
				<ThemeToggle isOpen={isOpen} />
				<a className="fs-4 p-3 w-100">
					<FontAwesomeIcon
						className={`me-3 ${isOpen ? "iconSide" : ""}`}
						icon={faDoorOpen}
						onClick={handleLogout}
					/>
					{isOpen && "Logout"}
				</a>
			</div>

			<Link
				//
				to={`/User/${user.id}`}
				className="p-2 w-100 mb-1 ms-auto d-flex align-items-center sideProfile"
				onMouseEnter={handleHoverChange}
				onMouseLeave={handleHoverChange}
			>
				{isOpen && <p className="m-0 fs-5">{user.username}</p>}
				<img
					src={userProfilePicture == null ? userPlaceholder : user.profilePicture}
					alt="profile"
					className={`rounded-circle ms-auto me-2 ${isHovered ? "imgHuge" : "imgSmall"}`}
				/>
			</Link>
		</div>
	);
};

export default SidebarComponent;
