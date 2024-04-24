import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const updateUserProfilePicture = createAsyncThunk(
	"user/updateUserProfilePicture",
	async (formData, { getState, rejectWithValue }) => {
		const { token } = getState().auth; // Extract the token from your auth state
		const userId = getState().auth.user.id; // Assuming you store the user's ID in the auth state
		try {
			const response = await fetch(`https://localhost:7026/api/Users/updateProfilePicture/${userId}`, {
				method: "POST",
				body: formData, // Directly use formData which includes the file
				headers: {
					// Don't set "Content-Type": "application/json" for FormData
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const updatedUser = await response.json();
			return updatedUser.profilePic; // Adjust according to what your backend actually returns
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// Async thunk per la registrazione
export const registerUser = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
	try {
		const response = await fetch("https://localhost:7026/api/Users/Register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		let data = await response.json();

		if (response.status === 200) {
			return { ...data };
		} else {
			return thunkAPI.rejectWithValue(data);
		}
	} catch (e) {
		return thunkAPI.rejectWithValue(e.response.data);
	}
});

export const loginUser = createAsyncThunk("auth/login", async ({ username, pswHash }, { rejectWithValue }) => {
	try {
		const response = await fetch("https://localhost:7026/api/Users/Login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, pswHash }),
		});

		let data = await response.json();

		if (response.ok) {
			// Puoi decidere di salvare il token JWT ricevuto in localStorage qui

			return data;
		} else {
			return rejectWithValue(data);
		}
	} catch (error) {
		console.error("Error:", error);
		return rejectWithValue(error.toString());
	}
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
	try {
		const response = await fetch("https://localhost:7026/api/Users/Logout", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
		});
		let data = await response.json();
		if (response.ok) {
			// Puoi decidere di salvare il token JWT ricevuto in localStorage qui

			return data;
		} else {
			return rejectWithValue(data);
		}
	} catch (error) {
		console.error("Error:", error);
		return rejectWithValue(error.toString());
	}
});

// Slice per la gestione dell'autenticazione
export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		token: null,
		isError: false,
		isSuccess: false,
		isLoading: false,
		message: "",
	},
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = "";
		},
		updateUserProfilePicture: (state, action) => {
			state.user.profilePicture = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
				toast.success("Registered successfully");
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload ? action.payload : "Registration failed";
				state.user = null;
			})
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload; // Assumi che l'action ritorni i dettagli dell'utente
				state.token = action.payload.token;
				toast.success("logged in successfully");
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload ? action.payload : "Login failed";
				state.user = null;
				toast.error("Login failed");
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.token = null;
				toast.success("Logged out successfully");
			})
			.addCase(updateUserProfilePicture.fulfilled, (state, action) => {
				state.user = { ...state.user, profilePicture: action.payload };
				toast.success("Profile picture updated");
			});
	},
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
