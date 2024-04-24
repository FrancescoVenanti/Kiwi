import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.scss";
import Authentication from "./Components/Auth/Authentication";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import SidebarComponent from "./Components/SideBar/SidebarComponent";
import Home from "./Components/MainPage/Home/Home";
import Discover from "./Components/MainPage/Discover/Discover";
import Favourites from "./Components/MainPage/Favourites/Favourites";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import SideContent from "./Components/MainPage/rightSide/SideContent";
import Search from "./Components/MainPage/Search/Search";
import RecipeView from "./Components/MainPage/Home/RecipeView/RecipeView";
import UserProfile from "./Components/MainPage/UserProfile/UserProfile";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import AskKiwi from "./Components/MainPage/Home/AskKiwi/AskKiwi";
import Messages from "./Components/MainPage/Messages/Messages";

function App() {
	const constraintsRef = useRef(null);
	const [isLogged, setIsLogged] = useState(true);
	const [isNavOpen, setIsNavOpen] = useState(false);
	const user = useSelector((state) => state.auth.user);
	return (
		<Router>
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						marginTop: "70px",
					},
				}}
			/>
			<motion.div className={`App divNoBordi ${isLogged && "container"}`} ref={constraintsRef}>
				<div className="row">
					<div className={`${isLogged ? "col flex-grow-0 p-0" : "d-none"} h-100`}>
						<div className="d-flex align-items-center vh-100">
							{user && <SidebarComponent setIsNavOpen={setIsNavOpen} />}
						</div>
					</div>
					<div
						className={`${isLogged ? "col flex-grow-1 mt-0 contentContainer rounded-4" : ""} ${
							isNavOpen && "d-none d-sm-block"
						} `}
					>
						<Routes>
							<Route
								path="/Authentication"
								element={<Authentication isLogged={isLogged} setIsLogged={setIsLogged} />}
							/>
							<Route
								path="/"
								element={
									<ProtectedRoute>
										<Home />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/discover"
								element={
									<ProtectedRoute>
										<Discover />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/search/:query"
								element={
									<ProtectedRoute>
										<Search />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/favourites"
								element={
									<ProtectedRoute>
										<Favourites />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/askkiwi"
								element={
									<ProtectedRoute>
										<AskKiwi />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/messages"
								element={
									<ProtectedRoute>
										<Messages />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/Recipe/:id"
								element={
									<ProtectedRoute>
										<RecipeView />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/User/:id"
								element={
									<ProtectedRoute>
										<UserProfile />
									</ProtectedRoute>
								}
							/>
							{/* Add more routes as needed */}
						</Routes>
					</div>

					<div
						className={`${
							isLogged ? "col flex-grow-0 p-0" : "d-none"
						} col-3 ms-2 overflow-y-auto d-none vh-100 ${
							isNavOpen ? "d-lg-none d-xxl-flex" : "d-lg-flex "
						} `} // Corrected visibility logic
					>
						<div className="h-100">
							<SideContent />
						</div>
					</div>
				</div>
			</motion.div>
		</Router>
	);
}

export default App;
