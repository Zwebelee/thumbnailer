import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	// relative base: the same build works in any (sub)folder, e.g. an IIS virtual directory
	base: "./",
	plugins: [react(), tailwindcss()],
	resolve: {
		// "@/*" alias comes from tsconfig.app.json
		tsconfigPaths: true,
	},
});
