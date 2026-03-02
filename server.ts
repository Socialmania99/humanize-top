import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("humanize.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    original_text TEXT,
    humanized_text TEXT,
    score INTEGER,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    credits INTEGER DEFAULT 100
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/user/:email", (req, res) => {
    const { email } = req.params;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user) {
      db.prepare("INSERT INTO users (email, credits) VALUES (?, ?)").run(email, 100);
      user = { email, credits: 100 };
    }
    res.json(user);
  });

  app.post("/api/history", (req, res) => {
    const { email, original, humanized, score, type } = req.body;
    db.prepare("INSERT INTO history (user_email, original_text, humanized_text, score, type) VALUES (?, ?, ?, ?, ?)")
      .run(email, original, humanized, score, type);
    res.json({ success: true });
  });

  app.get("/api/history/:email", (req, res) => {
    const { email } = req.params;
    const history = db.prepare("SELECT * FROM history WHERE user_email = ? ORDER BY created_at DESC LIMIT 50").all(email);
    res.json(history);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
