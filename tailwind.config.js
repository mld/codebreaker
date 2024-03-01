/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
    content: [
        "./index.html",
        "./main.js",
        "./src/**/*.js",
    ],
    theme: {
        extend: {
            fontFamily: {
                emoji: ['"Noto Emoji"', ...defaultTheme.fontFamily.sans]
            }
        },
    },
    plugins: [],
}

