const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000; // Render's default port

app.use(cors());
app.use(express.json());

// 🎵 Music Library Metadata
const library = [
  { id: "vS3_7V99VEE", title: "Aakaasam Nee Haddhu Ra", artist: "G.V. Prakash Kumar", banner: "https://img.youtube.com/vi/vS3_7V99VEE/maxresdefault.jpg" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", banner: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
  { id: "Y-N0V0X1B4k", title: "Resilience Protocol", artist: "Mahesh Systems", banner: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400" }
];

// 🎤 AI Resume Data (Mock for brevity, add your full JSON later)
const resumeData = { education: "B.Tech AI @ Pragati Engineering College", skills: ["React", "AI", "Node"] };

// --- ROUTES ---

// Music Search Endpoint
app.get("/api/music-search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(library);
  const filtered = library.filter(song => 
    song.title.toLowerCase().includes(q.toLowerCase()) || 
    song.artist.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered.length > 0 ? filtered : library);
});

// Resume AI Endpoint
app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  // Simple logic: return skills if asked, or education
  if (question.toLowerCase().includes("skill")) return res.json({ answer: `Skills: ${resumeData.skills.join(", ")}` });
  res.json({ answer: resumeData.education });
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub Online"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));