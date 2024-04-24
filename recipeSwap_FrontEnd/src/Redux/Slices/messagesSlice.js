import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "../interceptor";

export const fetchMessages = createAsyncThunk("messages/fetch", async ({ userId, token }, { rejectWithValue }) => {
	try {
		const response = await fetchWithToken(`https://localhost:7026/api/Messages/GetMessagesByUser/${userId}`, token);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Could not fetch messages");
		}
		console.log(data);
		return data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const sendMessage = createAsyncThunk("messages/send", async ({ message, token }, { rejectWithValue }) => {
	try {
		const response = await fetchWithToken("https://localhost:7026/api/Messages/SendMessage", token, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Could not send message");
		}
		return data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

export const messagesSlice = createSlice({
	name: "messages",
	initialState: {
		items: [],
		status: "idle",
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMessages.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchMessages.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(sendMessage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(sendMessage.fulfilled, (state) => {
				state.status = "succeeded";
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export default messagesSlice.reducer;
