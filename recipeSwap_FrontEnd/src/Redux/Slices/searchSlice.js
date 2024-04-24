import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor";

export const fetchSearchResults = createAsyncThunk(
	"search/fetchSearchResults",
	async ({ token, searchQuery }, { rejectWithValue }) => {
		try {
			// Ensure the search query is properly encoded for URL use
			const encodedQuery = encodeURIComponent(searchQuery);
			const response = await fetchWithToken(
				`https://localhost:7026/api/Recipes/GetRecipesByName/${encodedQuery}`,
				token
			);
			const recipes = await response.json();
			if (response.ok) {
				return recipes;
			} else {
				console.error("Failed response:", recipes);
				return rejectWithValue(recipes);
			}
		} catch (error) {
			console.error("Error during fetch:", error);
			return rejectWithValue(error.toString());
		}
	}
);

export const searchSlice = createSlice({
	name: "search", // The name of the slice
	initialState: {
		searchResults: [],
		isLoading: false,
		error: null,
	},
	reducers: {
		// Define any reducers you need to modify the state directly
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSearchResults.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.searchResults = [];
			})
			.addCase(fetchSearchResults.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload;
			})
			.addCase(fetchSearchResults.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Failed to fetch search results";
				state.searchResults = [];
			});
	},
});

// Export the reducer
export default searchSlice.reducer;
