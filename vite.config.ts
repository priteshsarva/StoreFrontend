import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  //hide base vercel or netlify
  base: '/',
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: { port: 5175 },
})