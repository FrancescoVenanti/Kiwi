/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../../../Redux/Slices/RecipesSlice";
import NewRecipe from "./NewRecipe/NewRecipe";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import SingleRecipe from "./SingleRecipe/SingleRecipe";
/* import AdComponent from "../../GlobalComponents/AdComponent"; */
import FakeAdComponent from "../../GlobalComponents/FakeAdComponent";
import { fetchUserWithRecipes } from "../../../Redux/Slices/usersSlice";

const Home = () => {
	const dispatch = useDispatch();

	const [openRecipe, setOpenRecipe] = useState(false);
	const user = useSelector((state) => state.auth.user);
	console.log(user);

	const token = useSelector((state) => state.auth.token);
	const navigate = useNavigate();
	const containerVariants = {
		hidden: { opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.5 } },
		visible: {
			opacity: 1,
			height: "auto",
			transition: {
				duration: 0.8,
				when: "beforeChildren",
				staggerChildren: 0.3,
			},
		},
	};
	const recipes = useSelector((state) => state.recipes.recipes);
	useEffect(() => {
		if (user == null) {
			navigate("/Authentication");
		} else if (token) {
			dispatch(fetchRecipes(token));
		}
	}, [user, token, dispatch, navigate]);

	useEffect(() => {
		if (user) {
			dispatch(fetchUserWithRecipes({ userId: user.id, token }));
		}
	}, [user, token, dispatch]);

	// Access follower information safely using optional chaining
	const userFollowers = useSelector((state) => state.user.userDetails?.follower);
	const followedUserIds = userFollowers?.map((follower) => follower.followedUserId) || [];

	// Filter recipes based on followed user IDs
	const filteredRecipes = recipes.filter((recipe) => followedUserIds.includes(recipe.user.userId));

	// Redirect if no recipes are available from followed users
	if (filteredRecipes.length === 0 && recipes.length > 0) {
		navigate("/Discover");
	}

	return (
		<>
			<div className=" h-100">
				<h1 className="display-4">
					Hello, <span className="text-green">{user.username}</span>
				</h1>
				<div className="row g-4  overflow-x-hidden pb-3">
					<div className="col-12">
						<div className=" p-2 rounded-2">
							<div className="col my-2">
								<button
									onClick={() => setOpenRecipe(!openRecipe)}
									className="btn btn-outline-green rounded-2 shadow"
								>
									{openRecipe ? (
										<FontAwesomeIcon icon={faMinus} />
									) : (
										<>
											Add a recipe <FontAwesomeIcon icon={faAdd} />
										</>
									)}
								</button>
							</div>

							<AnimatePresence>
								{openRecipe && (
									<motion.div
										initial="hidden"
										animate="visible"
										exit="hidden"
										variants={containerVariants}
										className="shadow"
									>
										<NewRecipe setOpenRecipe={setOpenRecipe} />
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
					{filteredRecipes.map((recipe, index) => (
						<React.Fragment key={index}>
							<SingleRecipe key={recipe.recipeId} recipe={recipe} />
							{/* todo forse togliere adcomponent */}
							{(index + 1) % 3 === 0 && (
								<div className="w-100">
									{/* todo change */}
									<FakeAdComponent width="100%" height="150px" />
									{/* <AdComponent /> */}
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</>
	);
};
export default Home;
