import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../rootReduces";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
	key: "root",
	storage,
	// This is where you can specify which parts of your state you want to persist
	// You might also want to specify `whitelist` or `blacklist` to choose specific reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER"],
			},
		}),
});

export const persistor = persistStore(store);
