import { ACCESS_TOKEN, TOKEN_TYPE, EXPIRES_IN, logout } from "./common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAccessToken = () => {
	const expires_in = localStorage.getItem(EXPIRES_IN);
	if (Date.now() < expires_in) {
		const accessToken = localStorage.getItem(ACCESS_TOKEN);
		const tokenType = localStorage.getItem(TOKEN_TYPE);
		return { accessToken, tokenType };
	} else {
		logout();
	}
};

const createHeaders = ({ accessToken, tokenType }, method = "GET") => {
	return {
		headers: {
			Authorization: `${tokenType} ${accessToken}`,
		},
		method,
	};
};

export const fetchRequest = async (endpoint) => {
	const url = `${BASE_URL}/${endpoint}`;
	const res = await fetch(url, createHeaders(getAccessToken()));
	return res.json();
};
