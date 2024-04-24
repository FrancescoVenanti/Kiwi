import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor";
import toast from "react-hot-toast";

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async (token, { rejectWithValue }) => {
	try {
		const response = await fetchWithToken("https://localhost:7026/api/Recipes", token);

		const recipes = await response.json();
		if (response.ok) {
			return recipes;
		} else {
			return rejectWithValue(recipes);
		}
	} catch (error) {
		console.error("Error:", error);
		return rejectWithValue(error.toString());
	}
});

export const postRecipe = createAsyncThunk("recipes/postRecipe", async ({ token, recipeData }, { rejectWithValue }) => {
	try {
		const response = await fetchWithToken("https://localhost:7026/api/Recipes", token, {
			method: "POST",
			body: recipeData, // Directly use the FormData object passed from the component
		});

		const data = await response.json();
		if (response.ok) {
			return data;
		} else {
			return rejectWithValue(data);
		}
	} catch (error) {
		console.error("Error:", error);
		return rejectWithValue(error.toString());
	}
});

export const deleteRecipe = createAsyncThunk(
	"recipes/deleteRecipe",
	async ({ token, recipeId }, { rejectWithValue }) => {
		try {
			const response = await fetchWithToken(`https://localhost:7026/api/Recipes/${recipeId}`, token, {
				method: "DELETE",
			});
			// No need to parse the response, as it will be empty if successful
			if (response.ok) {
				return recipeId;
			} else {
				return rejectWithValue("Failed to delete recipe");
			}
		} catch (error) {
			console.error("Error:", error);
			return rejectWithValue(error.toString());
		}
	}
);

export const RecipesSlice = createSlice({
	name: "recipes",
	initialState: {
		recipes: [],
		isLoading: false,
		isError: false,
		errorMessage: "",
	},
	// Aggiungi reducers qui
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRecipes.pending, (state) => {
				state.isLoading = true;
				state.isError = false;
				state.errorMessage = "";
			})
			.addCase(fetchRecipes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.recipes = action.payload;
			})
			.addCase(fetchRecipes.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			// Handling postRecipe async actions
			.addCase(postRecipe.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(postRecipe.fulfilled, () => {
				toast.success("Recipe posted");
				//state, action
				// Handle successful recipe post
				// You could add the new recipe to your state here if needed
				/* state.recipes.push(action.payload); */
			})
			.addCase(postRecipe.rejected, (state, action) => {
				// Handle failed post
				state.isError = true;
				state.errorMessage = action.payload;
				toast.error("Failed to post recipe");
			})
			// Handling deleteRecipe async actions
			.addCase(deleteRecipe.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteRecipe.fulfilled, (state, action) => {
				// Handle successful recipe deletion
				// Remove the deleted recipe from your state
				state.recipes = state.recipes.filter((recipe) => recipe.recipeId !== action.payload);
				toast.success("Recipe deleted");
			})
			.addCase(deleteRecipe.rejected, (state, action) => {
				// Handle failed deletion
				state.isError = true;
				state.errorMessage = action.payload;
				toast.error("Failed to delete recipe");
			});
	},
});
export default RecipesSlice.reducer;
