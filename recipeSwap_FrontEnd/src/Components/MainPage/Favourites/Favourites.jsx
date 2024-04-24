import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../../Redux/Slices/favoriteSlice";
import SingleRecipe from "../Home/SingleRecipe/SingleRecipe";

const Favourites = () => {
	const dispatch = useDispatch();
	const { items, status } = useSelector((state) => state.favorites);
	const userId = useSelector((state) => state.auth.user.id);
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		dispatch(fetchFavorites({ userId, token }));
	}, [dispatch, userId, token]);

	if (status === "loading") return <div>Loading...</div>;

	// Check if any recipe meets your specific condition
	// For example, checking if there's any recipe marked as 'isFavourite' or any other condition
	const hasFavouriteRecipes = items.some((item) => item.recipe);

	return (
		<div className="mt-2">
			<h1>Favourites</h1>
			<div className="row g-2">
				{!hasFavouriteRecipes ? (
					<p>Click on the bookmark to keep all your favourite recipes safe.</p>
				) : (
					items.map((item) => (
						<div key={item.recipeId} className="col-12">
							<SingleRecipe recipe={item.recipe} />
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Favourites;
