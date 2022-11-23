export const ACCESS_TOKEN = "accessToken";
export const EXPIRES_IN = "expiresIn";
export const TOKEN_TYPE = "tokenType";
export const LOADED_TRACKS = "loadedTracks";
export const NOW_PLAYING = "nowPlaying";

const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINT = {
	userInfo: "me",
	featuredPlaylist: "browse/featured-playlists?limit=5",
	toplists: "browse/categories/toplists/playlists?limit=10",
	playlist: "playlists",
	userPlaylist: "me/playlists",
};

export const SECTIONTYPE = {
	dashboard: "DASHBOARD",
	playlist: "PLAYLIST",
};

export const logout = () => {
	localStorage.removeItem(ACCESS_TOKEN);
	localStorage.removeItem(EXPIRES_IN);
	localStorage.removeItem(TOKEN_TYPE);
	window.location.href = APP_URL;
};

export const getItemFromLocalStorage = (key) => {
	return JSON.parse(localStorage.getItem(key));
};

export const setItemInLocalStorage = (key, value) => {
	return localStorage.setItem(key, JSON.stringify(value));
};
