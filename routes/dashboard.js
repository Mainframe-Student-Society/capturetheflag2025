// routes/dashboard.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_PATH } = require('../config/config');

const db = new sqlite3.Database(DB_PATH);

// Serve dashboard HTML
router.get('/', (req, res) => {
  // TEMPORARY DEBUG: comment out session check to verify page serving
  // if (!req.session.userId) return res.redirect('/');
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

// Provide player info to the frontend
router.get('/api/player-info', (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ success: false, message: 'Session expired' });

  const userId = req.session.userId;

  db.get(
    `SELECT username, role, loop1_completed, loop2_completed, loop3_completed, points 
     FROM users WHERE id = ?`,
    [userId],
    (err, row) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (!row) return res.status(404).json({ success: false, message: 'User not found' });

      res.json({
        success: true,
        username: row.username,
        role: row.role,
        loop1_completed: !!row.loop1_completed,
        loop2_completed: !!row.loop2_completed,
        loop3_completed: !!row.loop3_completed,
        points: row.points || 0,
      });
    }
  );
});

module.exports = router;
