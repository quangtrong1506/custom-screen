const colors = require('tailwindcss/colors');

module.exports = {
    content: ['./renderer/pages/**/*.{js,ts,jsx,tsx}', './renderer/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                bevietnam: ['be_vietnam_pro', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
