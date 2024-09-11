// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  plugins: [require("daisyui")],
}

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Add paths to components
    './node_modules/shadcn-ui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
