import path from "path"
import tailwindcss from "@tailwindcss/vite"
import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        envDir: "env",
        base: env.VITE_BASE_URL || '/',
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    }
})
