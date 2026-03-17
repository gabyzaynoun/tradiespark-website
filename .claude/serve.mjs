import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
};

const root = process.argv[2] || ".";
const port = parseInt(process.argv[3] || "3000", 10);

createServer(async (req, res) => {
  let filePath = join(root, req.url === "/" ? "index.html" : req.url);
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}).listen(port, () => console.log(`Serving on http://localhost:${port}`));
