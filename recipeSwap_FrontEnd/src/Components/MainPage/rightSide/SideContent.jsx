import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopLikedRecipes } from "../../../Redux/Slices/topLiked";
import TopLikedRecipe from "./TopLikedRecipe";

const SideContent = () => {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	// Dispatch fetchTopLikedRecipes action when the component mounts or token changes
	useEffect(() => {
		dispatch(fetchTopLikedRecipes(token));
	}, [dispatch, token]);

	// Use useSelector to access the topLiked recipes from the Redux state
	const topLiked = useSelector((state) => state.topLiked.recipes || []);
	console.log(topLiked);
	return (
		<div className="side-content pt-4">
			<p className="m-0 fs-2 ">Most liked</p>
			<p className="text-green m-0 fs-1 lead mostLikedRecipes">Recipes</p>

			{topLiked.map((recipe, index) => (
				<TopLikedRecipe key={recipe.recipeId} recipeId={recipe.recipeId} recipe={recipe} index={index} />
			))}
		</div>
	);
};

export default SideContent;
