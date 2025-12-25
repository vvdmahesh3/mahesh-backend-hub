const express = require("express");
const cors = require("cors");

const app = express();
// Render uses the PORT environment variable
const PORT = process.env.PORT || 10000; 

app.use(cors());
app.use(express.json());

// 🎵 Music Library
const library = [
  { id: "vS3_7V99VEE", title: "Aakaasam Nee Haddhu Ra", artist: "G.V. Prakash Kumar", banner: "https://img.youtube.com/vi/vS3_7V99VEE/maxresdefault.jpg" },
  { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", artist: "Rick Astley", banner: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" }
];

// --- ROUTES ---

// Music Search
app.get("/api/music-search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(library);
  const filtered = library.filter(song => 
    song.title.toLowerCase().includes(q.toLowerCase()) || 
    song.artist.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered.length > 0 ? filtered : library);
});

// Resume AI
app.post("/api/ask-resume", (req, res) => {
  const { question } = req.body;
  // Add your logic here or use a simplified response for testing
  res.json({ answer: "System online. Ask me about Mahesh's skills or education." });
});

app.get("/", (req, res) => res.send("Mahesh Backend Hub Online"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));