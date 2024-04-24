import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor";

// Async thunk for fetching favorites

// Async thunk for fetching favorites
export const fetchFavorites = createAsyncThunk("favorites/fetch", async ({ userId, token }, { rejectWithValue }) => {
	try {
		const response = await fetchWithToken(
			`https://localhost:7026/api/Favorites/getUserFavorites/?userId=${userId}`,
			token
		);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Could not fetch wishlist");
		}
		return data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

// slice to add favorites
export const addFavorite = createAsyncThunk(
	"favorites/add",
	async ({ userId, ProductId, token }, { rejectWithValue }) => {
		try {
			const response = await fetchWithToken(
				`https://localhost:7026/api/Favorites/addFavorite/?userId=${userId}&ProductId=${ProductId}`,
				token,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Could not add to wishlist");
			}
			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const favoriteSlice = createSlice({
	name: "favorites",
	initialState: {
		// Corrected from nitialState to initialState
		items: [],
		status: "idle",
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFavorites.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchFavorites.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchFavorites.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(addFavorite.pending, (state) => {
				state.status = "loading";
			})
			.addCase(addFavorite.fulfilled, (state) => {
				state.status = "succeeded";
			})
			.addCase(addFavorite.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export default favoriteSlice.reducer;
