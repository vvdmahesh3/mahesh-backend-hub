const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Load Resume Data once on startup
const resumePath = path.join(__dirname, "resumeData.json");
let resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));

// 🎵 Music Library
const library = [
  { id: "vS3_7V99VEE", title: "Aakaasam Nee Haddhu Ra", artist: "G.V. Prakash Kumar", banner: "https://img.youtube.com/vi/vS3_7V99VEE/maxresdefault.jpg" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", banner: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" }
];

// --- ROUTES ---

// 1. Music Search
app.get("/api/music-search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(library);
  const filtered = library.filter(song => 
    song.title.toLowerCase().includes(q.toLowerCase()) || 
    song.artist.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered.length > 0 ? filtered : library);
});

// 2. Resume AI (Intelligent response logic)
app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  const q = question.toLowerCase();
  let answer = "🤔 I couldn't find that specific detail. Try asking about my skills, education, or internships!";

  if (q.includes("skill")) answer = `Mahesh is proficient in: ${resumeData.skills.join(", ")}`;
  else if (q.includes("intern") || q.includes("experience")) answer = `Internships: ${resumeData.internships.join(" • ")}`;
  else if (q.includes("edu") || q.includes("college")) answer = resumeData.education;
  else if (q.includes("cert")) answer = `Certifications: ${resumeData.certifications.join(", ")}`;
  else if (q.includes("achieve")) answer = `Major Milestones: ${resumeData.achievements.join(" • ")}`;

  res.json({ answer });
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub is Live and Optimized."));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));