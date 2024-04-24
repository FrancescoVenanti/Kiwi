import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "../../../Redux/Slices/searchSlice";
import SingleRecipe from "../Home/SingleRecipe/SingleRecipe";

const Search = () => {
	const { query } = useParams();
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		if (query) {
			dispatch(fetchSearchResults({ token, searchQuery: query }));
		}
	}, [query, dispatch, token]); // Added 'token' to the dependencies array
	const searchResult = useSelector((state) => state.search.searchResults);
	return (
		<div>
			<h1>Search Results for: {query}</h1>
			<div className="row g-2">
				{searchResult.map((recipe) => (
					<SingleRecipe key={recipe.recipeId} recipe={recipe} />
				))}
			</div>
		</div>
	);
};

export default Search;
