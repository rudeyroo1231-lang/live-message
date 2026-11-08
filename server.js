// Tiny live-message server. No dependencies needed: run with `node server.js`
// Open http://localhost:3000 in your browser to send messages to players.

const http = require("http");

const PORT = process.env.PORT || 3000;
// CHANGE THIS, otherwise anyone who finds your server can send messages to your players.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me";

let latest = { id: 0, text: "", duration: 6 };

const adminPage = `<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Send live message</title>
<style>
  body { font-family: sans-serif; max-width: 480px; margin: 40px auto; padding: 0 16px; }
  input, button { width: 100%; padding: 10px; margin: 6px 0; font-size: 16px; box-sizing: border-box; }
  #status { color: #2a7; min-height: 1.5em; }
</style>
<h2>Send live message</h2>
<input id="pw" type="password" placeholder="Admin password">
<input id="text" placeholder="Message to show in game" maxlength="200">
<input id="dur" type="number" value="6" min="1" max="60" placeholder="Seconds on screen">
<button onclick="send()">Send</button>
<div id="status"></div>
<script>
async function send() {
  const res = await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-password": pw.value },
    body: JSON.stringify({ text: text.value, duration: Number(dur.value) })
  });
  status.textContent = res.ok ? "Sent!" : "Failed (" + res.status + ")";
  if (res.ok) text.value = "";
}
text.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
</script>`;

const server = http.createServer((req, res) => {
  // Allow WebGL builds / other origins to read messages
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-password");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  if (req.method === "GET" && req.url === "/latest") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(latest));
  }

  if (req.method === "POST" && req.url === "/send") {
    if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
      res.writeHead(401); return res.end("Unauthorized");
    }
    let body = "";
    req.on("data", chunk => { body += chunk; if (body.length > 5000) req.destroy(); });
    req.on("end", () => {
      try {
        const { text, duration } = JSON.parse(body);
        if (typeof text !== "string" || !text.trim()) throw new Error("empty");
        latest = {
          id: latest.id + 1,
          text: text.trim().slice(0, 200),
          duration: Math.min(Math.max(Number(duration) || 6, 1), 60),
        };
        console.log("Sent:", latest);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(latest));
      } catch {
        res.writeHead(400); res.end("Bad request");
      }
    });
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/admin")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(adminPage);
  }

  res.writeHead(404); res.end("Not found");
});

server.listen(PORT, () => console.log("Live message server on port " + PORT));
