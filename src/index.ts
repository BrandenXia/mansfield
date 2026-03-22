import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/sw.js": async () =>
      new Response(await Bun.file("./public/sw.js").bytes(), {
        headers: { "Content-Type": "application/javascript" },
      }),
    "/manifest.json": async () =>
      new Response(await Bun.file("./public/manifest.json").bytes(), {
        headers: { "Content-Type": "application/manifest+json" },
      }),
    "/*": index,
    "/public/*.svg": async (req) => {
      const url = new URL(req.url);
      const path = url.pathname.replace("/public/", "");
      const file = await Bun.file(`./public/${path}`).arrayBuffer();
      return new Response(file, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    },
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
