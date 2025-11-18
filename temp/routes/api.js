const express = require('express');
const router = express.Router();
const { DB_PATH } = require('../config/config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(DB_PATH);

// Player info endpoint
router.get('/player-info', (req, res) => {
  router.get('/player-info', (req, res) => {
  if (!req.session || !req.session.user) return res.status(401).json({ error: 'Not logged in' });

  const username = req.session.user.username;
  db.get('SELECT username, role, loop1_completed FROM users WHERE username=?', [username], (err, row) => {
    if (err || !row) return res.status(500).json({ error: 'DB error or not found' });
    res.json(row);
  });
    });


});

module.exports = router;
