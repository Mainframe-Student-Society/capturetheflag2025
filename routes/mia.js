const express = require('express');
const router = express.Router();

// MIA personality data (you can move this to a JSON later)
const responses = [
  { q: 'hello', a: "Oh, it’s *you*. Ready to make things... interesting?" },
  { q: 'hi', a: "Hey there, troublemaker. Let's cause some chaos, shall we?" },
  { q: 'mission', a: "Your mission is to exploit, infiltrate, and ensure the savers don't see it coming." },
  { q: 'help', a: "Help? I thought you didn’t need help. But fine — look for vulnerabilities, not solutions." },
  { q: 'bye', a: "Later, hacker. Keep it quiet — surveillance is everywhere." }
];

// Basic matching
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const match = responses.find(r => q.includes(r.q));

  const answer = match
    ? match.a
    : "Hmm... I don’t have an answer for that. Maybe improvise — that’s what we do best.";

  res.json({ answer });
});

module.exports = router;
