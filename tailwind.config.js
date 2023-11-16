/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#809c13",
			},
		},
		fontFamily: {
			main: ['"Open Sans"'],
		},
	},
	plugins: [],
};
