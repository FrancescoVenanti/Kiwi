// In your Redux Slices/topLiked.js (or wherever you organize your slices)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor"; // Your setup for a fetch request with authorization

export const fetchTopLikedRecipes = createAsyncThunk(
	"recipes/fetchTopLikedRecipes",
	async (token, { rejectWithValue }) => {
		try {
			const response = await fetchWithToken("https://localhost:7026/api/Recipes/GetMostLikedRecipes", token);
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Could not fetch recipes");
			return data;
		} catch (error) {
			return rejectWithValue(error.message || "Unexpected error occurred");
		}
	}
);

// Continuing in Redux Slices/topLiked.js

export const topLikedSlice = createSlice({
	name: "topLiked",
	initialState: {
		recipes: [],
		isLoading: false,
		isError: false,
		errorMessage: "",
	},
	reducers: {
		// Define any synchronous reducers here, if necessary
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTopLikedRecipes.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(fetchTopLikedRecipes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.recipes = action.payload; // Update the state with the fetched recipes
			})
			.addCase(fetchTopLikedRecipes.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload; // action.payload should be the error message from rejectWithValue
			});
	},
});

export default topLikedSlice.reducer;
