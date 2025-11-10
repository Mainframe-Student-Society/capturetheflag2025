const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('../config/config');

const db = new sqlite3.Database(DB_PATH);
const faqPath = path.join(__dirname, '../toby/data/faq.json');
const faq = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));

// ------------------ TOBY ENDPOINT ------------------
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase();

  if (!req.session.userId) {
    return res.json({
      answer: "Access denied. Please log in to continue, agent.",
    });
  }

  db.get('SELECT username, role FROM users WHERE id = ?', [req.session.userId], (err, row) => {
    if (err || !row) {
      console.error(err);
      return res.json({ answer: "System error. Couldn’t verify your credentials." });
    }

    const { username, role } = row;
    const match = faq.find(item => q.includes(item.q.toLowerCase()));

    // base default response
    let response = match ? match.a : "Hmm... I'm not sure about that yet.";

    // contextual flavour
    if (role === 'good') {
      response = `🟢 Toby: ${response}`;
    } else if (role === 'bad') {
      response = `⚠️ System: You’re not authorized to talk to Toby. Try connecting with Mia.`;
    }

    res.json({ username, role, answer: response });
  });
});

module.exports = router;
