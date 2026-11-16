import { defineConfig } from "vite"; import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()],
server: { proxy: { "/rksport": { target: "https://rksport8x8.ru", changeOrigin: true, secure: false,
    rewrite: (path) =>
      path.replace(/^\/rksport/, ""),

    headers: {
      Referer: "https://rksport8x8.ru/",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language":
        "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    },
  },
},}, });