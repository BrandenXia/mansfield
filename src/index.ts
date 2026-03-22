import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,
    "/public/*": async (req) => {
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
