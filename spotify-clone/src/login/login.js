import { ACCESS_TOKEN, TOKEN_TYPE, EXPIRES_IN } from "../common";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const APP_URL = import.meta.env.VITE_APP_URL;
const SCOPES =
	"playlist-read-private user-follow-read user-top-read user-library-read";
const IMG_SRC = "../assets/logos_icons/Spotify_Icon_RGB_";

const authorizeUser = () => {
	const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scopes=${SCOPES}&show_dialog=true`;
	window.open(url, "login", "width=800, height=500");
};

document.addEventListener("DOMContentLoaded", () => {
	const loginButton = document.getElementById("login");
	const buttonIcon = document.getElementById("buttonIcon");
	loginButton.addEventListener("click", authorizeUser);
	loginButton.addEventListener("mouseover", () => {
		buttonIcon.setAttribute("src", `${IMG_SRC}White.png`);
	});
	loginButton.addEventListener("mouseout", () => {
		buttonIcon.setAttribute("src", `${IMG_SRC}Black.png`);
	});
});

window.setItemsInLocalStorage = (accessToken, expiresIn, tokenType) => {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
	localStorage.setItem(EXPIRES_IN, Date.now() + expiresIn * 1000);
	localStorage.setItem(TOKEN_TYPE, tokenType);
	window.location.href = `${APP_URL}/`;
};

window.addEventListener("load", () => {
	if (localStorage.getItem("accessToken")) {
		window.location.href = `${APP_URL}/dashboard/dashboard.html`;
	}

	if (window.opener != null && !window.opener.closed) {
		window.focus();
		if (window.location.href.includes("error")) {
			window.close();
			alert("there was an error!! Try again ...");
		}
		const params = new URLSearchParams(window.location.hash);
		const accessToken = params.get("#access_token");
		const expiresIn = params.get("expires_in");
		const tokenType = params.get("token_type");

		if (accessToken) {
			window.close();
			window.opener.setItemsInLocalStorage(
				accessToken,
				expiresIn,
				tokenType
			);
		} else {
			window.close();
			alert("there was an error!! Try again ...");
		}
	}
});
