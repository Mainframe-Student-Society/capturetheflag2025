const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { DB_PATH } = require('../config/config');
const db = new sqlite3.Database(DB_PATH);

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, row) => {
    if (row) {
      req.session.userId = row.id;  // this makes the dashboard session work
      req.session.user = row;

      res.redirect('/general');
    } else {
      res.send('<h3>Invalid credentials. <a href="/">Try again</a></h3>');
    }
  });
});

module.exports = router;
