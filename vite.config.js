import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves project sites at https://<user>.github.io/<repo>/,
// so built assets must be prefixed with the repo name. We auto-detect it
// from the GITHUB_REPOSITORY env var (always set in GitHub Actions) and
// fall back to "/" for local dev. For a custom domain, set base: "/".
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const base = repo ? `/${repo}/` : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
