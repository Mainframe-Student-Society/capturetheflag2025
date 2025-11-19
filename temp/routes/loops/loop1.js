const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('../../config/config');
const db = new sqlite3.Database(DB_PATH);

const LOG_PATH = path.join(__dirname, '../../logs/activity.csv');

// --- GET /loop1 ---
// This serves your Loop 1 HTML page
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../../views/loop1.html');
  res.sendFile(filePath);
});


// --- POST /loop1/submit ---
router.post('/submit', (req, res) => {
  const userId = req.session?.userId; // safer session check
  const { answer } = req.body;

  if (!userId)
    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });

  const correctAnswer = "back123";
  const timestamp = new Date().toISOString();
  const ip = req.ip.replace('::ffff:', '');

  if (answer.trim() === correctAnswer) {
    const token = Math.random().toString(36).substring(2, 8);

    db.run(
      'UPDATE users SET loop1_completed=1, loop1_token=?, loop1_completed_at=? WHERE id=?',
      [token, timestamp, userId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        const logLine = `${timestamp},${userId},${ip},LOOP1_SUCCESS,token=${token}\n`;
        fs.appendFileSync(LOG_PATH, logLine);

        res.json({ success: true, token });
      }
    );
  } else {
    const logLine = `${timestamp},${userId},${ip},LOOP1_FAIL,answer=${answer}\n`;
    fs.appendFileSync(LOG_PATH, logLine);
    res.json({ success: false, message: "Incorrect exploit code." });
  }
});

module.exports = router;
