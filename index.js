const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

const app = express();
const PORT = process.env.PORT || 10000; 

app.use(cors());
app.use(express.json());

// 1. LOAD DATA
const resumePath = path.join(__dirname, "resumeData.json");
let resumeData = {};
try {
  resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));
} catch (err) {
  console.error("Error loading resumeData.json:", err);
}

const library = [
  { id: "vS3_7V99VEE", title: "Aakaasam Nee Haddhu Ra", artist: "G.V. Prakash Kumar", banner: "https://img.youtube.com/vi/vS3_7V99VEE/maxresdefault.jpg" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", banner: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" }
];

// 2. AI RESUME SEARCH LOGIC
const corpus = [
  { key: "education", value: resumeData.education },
  { key: "internships", value: (resumeData.internships || []).join(" • ") },
  { key: "skills", value: (resumeData.skills || []).join(", ") },
  { key: "certifications", value: (resumeData.certifications || []).join(", ") },
  { key: "projects", value: (resumeData.projects || []).join(" • ") },
  { key: "achievements", value: (resumeData.achievements || []).join(" • ") },
];

const fuse = new Fuse(corpus, { keys: ["key", "value"], threshold: 0.4 });

// 3. ROUTES
app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided" });

  const results = fuse.search(question);
  if (results.length > 0) {
    const bestMatch = results[0].item;
    return res.json({ answer: `**${bestMatch.key.toUpperCase()}**: ${bestMatch.value}` });
  }

  res.json({ answer: "🤔 I couldn't find a specific answer for that. Try asking about skills, internships, or education!" });
});

app.get("/api/music-search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(library);
  const filtered = library.filter(song => 
    song.title.toLowerCase().includes(q.toLowerCase()) || 
    song.artist.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered.length > 0 ? filtered : library);
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub Online"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));