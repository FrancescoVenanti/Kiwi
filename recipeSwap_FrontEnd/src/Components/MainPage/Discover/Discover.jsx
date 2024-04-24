import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../../../Redux/Slices/RecipesSlice";

import SingleRecipe from "../Home/SingleRecipe/SingleRecipe";
import FakeAdComponent from "../../GlobalComponents/FakeAdComponent";

const Discover = () => {
	const dispatch = useDispatch();
	const [orderRecipes, setOrderRecipes] = useState("popular");
	const [displayedRecipes, setDisplayedRecipes] = useState([]);

	const user = useSelector((state) => state.auth.user);
	const token = useSelector((state) => state.auth.token);
	const recipes = useSelector((state) => state.recipes.recipes);
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchRecipes(token));
	}, [user, token, dispatch, navigate, orderRecipes]);

	useEffect(() => {
		if (recipes.length) {
			const sortedRecipes = [...recipes].sort((a, b) => {
				if (orderRecipes === "newest") {
					return new Date(b.creationDate) - new Date(a.creationDate);
				} else if (orderRecipes === "popular") {
					return (b.likesCount || 0) - (a.likesCount || 0);
				}
			});
			setDisplayedRecipes(sortedRecipes);
		}
	}, [recipes, orderRecipes]);

	return (
		<div className="mb-2">
			<div className="h-100">
				<div className="d-flex justify-content-center flex-column align-items-start my-3">
					<h1 className="display-5">
						Discover new <span className="text-green">recipes</span>
					</h1>
					<button
						className="btn btn-outline-green"
						onClick={() => setOrderRecipes((prev) => (prev === "newest" ? "popular" : "newest"))}
					>
						{orderRecipes === "newest" ? "Switch to Popular" : "Switch to Newest"}
					</button>
				</div>
				<div className="row g-4 overflow-x-hidden">
					{displayedRecipes.map((recipe, index) => (
						<React.Fragment key={index}>
							<SingleRecipe recipe={recipe} />
							{(index + 1) % 3 === 0 && (
								<div className="w-100">
									<FakeAdComponent width="100%" height="150px" />
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default Discover;
