// Desc: Interceptor for adding token to fetch requests

/* const fetchWithToken = async (url, options = {}) => {
	const state = store.getState();
	const token = state.auth.token;
	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};
	return fetch(url, { ...options, headers });
};

export default fetchWithToken; */

//import { store } from "./Store/Index";

export default async function fetchWithToken(url, token, options = {}) {
	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
	};
	return fetch(url, { ...options, headers });
}
