const express = require("express");
const router = express.Router();
const path = require("path");
const { DB_PATH } = require("../config/config");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(DB_PATH);

// --- GET /general ---
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/general.html'));
});

module.exports = router;
