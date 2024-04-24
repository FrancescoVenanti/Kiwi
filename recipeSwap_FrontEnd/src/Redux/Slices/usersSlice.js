import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor";

export const fetchUserWithRecipes = createAsyncThunk(
	"user/fetchUserWithRecipes",
	async ({ userId, token }, { rejectWithValue }) => {
		try {
			const response = await fetchWithToken(`https://localhost:7026/api/Users/getUser/${userId}`, token);
			const user = await response.json();
			if (response.ok) {
				return user;
			} else {
				return rejectWithValue(user);
			}
		} catch (error) {
			return rejectWithValue(error.toString());
		}
	}
);

export const userSlice = createSlice({
	name: "user",
	initialState: {
		userDetails: null,
		isLoading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserWithRecipes.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchUserWithRecipes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.userDetails = action.payload;
			})
			.addCase(fetchUserWithRecipes.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Failed to fetch user details";
			});
	},
});

export default userSlice.reducer;
