const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 1. Load Resume Data
const resumePath = path.join(__dirname, "resumeData.json");
let resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));

// 🎵 Music Library Metadata
const library = [
  { id: "vS3_7V99VEE", title: "Aakaasam Nee Haddhu Ra", artist: "G.V. Prakash Kumar", banner: "https://img.youtube.com/vi/vS3_7V99VEE/maxresdefault.jpg" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", banner: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
  { id: "Y-N0V0X1B4k", title: "Resilience Protocol", artist: "Mahesh Systems", banner: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400" }
];

// 2. Setup Fuzzy Search for AI
const corpus = [
  { key: "education", value: resumeData.education },
  { key: "internships", value: (resumeData.internships || []).join(" • ") },
  { key: "skills", value: (resumeData.skills || []).join(", ") },
  { key: "projects", value: (resumeData.projects || []).join(" • ") },
  { key: "achievements", value: (resumeData.achievements || []).join(" • ") },
];
const fuse = new Fuse(corpus, { keys: ["key", "value"], threshold: 0.4 });

// --- ROUTES ---

// ✅ AI Assistant Endpoint (restored)
app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing query" });

  const results = fuse.search(question);
  if (results.length > 0) {
    return res.json({ answer: results[0].item.value });
  }
  res.json({ answer: "🤔 I couldn't find a direct answer. Try asking about skills or experience!" });
});

// 🎵 Music Search Endpoint
app.get("/api/music-search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(library);
  const filtered = library.filter(s => s.title.toLowerCase().includes(q.toLowerCase()));
  res.json(filtered.length > 0 ? filtered : library);
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub is Live."));

app.listen(PORT, () => console.log(`Server live on ${PORT}`));