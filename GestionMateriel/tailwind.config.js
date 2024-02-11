/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    './src/components/NavBar.vue',
    './src/components/UserList.vue',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    // require('flowbite/plugin')
  ],
  theme:{}
}

