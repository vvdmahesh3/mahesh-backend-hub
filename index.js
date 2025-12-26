const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const yts = require("yt-search"); // New search engine

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Load Resume Data
const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, "resumeData.json"), "utf8"));

// --- AI RESUME LOGIC ---
const corpus = [
  { key: "education", value: resumeData.education },
  { key: "internships", value: (resumeData.internships || []).join(" • ") },
  { key: "skills", value: (resumeData.skills || []).join(", ") },
  { key: "projects", value: (resumeData.projects || []).join(" • ") },
  { key: "achievements", value: (resumeData.achievements || []).join(" • ") },
];
const fuse = new Fuse(corpus, { keys: ["key", "value"], threshold: 0.4 });

app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  const results = fuse.search(question || "");
  res.json({ answer: results.length > 0 ? results[0].item.value : "🤔 I couldn't find that. Try asking about skills!" });
});

// --- 🎵 NEW REAL-TIME MUSIC SEARCH ---
app.get("/api/music-search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const r = await yts(q);
    const videos = r.videos.slice(0, 10); // Get top 10 results
    const results = videos.map(v => ({
      id: v.videoId,
      title: v.title,
      artist: v.author.name,
      banner: v.image || v.thumbnail,
      duration: v.timestamp
    }));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub Online"));
app.listen(PORT, () => console.log(`Server live on ${PORT}`));