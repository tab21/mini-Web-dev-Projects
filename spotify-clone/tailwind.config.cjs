/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		colors: {
			green: "#1DB954",
			dark: "#191414",
			swhite: "#FFFFFF",
			darker: "#131010",
			grey: "#808080",
			"dark-grey": "#5A5A5A",
			"light-black": "#2E2E2E",
		},
		gridTemplateColumns: {
			"auto-fill-cards": "repeat(auto-fill, minmax(170px,1fr))",
		},
	},
	plugins: [require("@tailwindcss/line-clamp")],
};
