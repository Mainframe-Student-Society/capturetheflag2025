const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  const auth = req.headers.authorization;
  const valid = 'Basic ' + Buffer.from('admin:hackathon').toString('base64');
  if (!auth || auth !== valid) {
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Auth required.');
  }
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router;

const { formTeams } = require('../controllers/teamcontroller');

router.post('/admin/form-teams', (req, res) => {
  formTeams(5, (err, teams) => {
    if (err) return res.status(500).send('Error forming teams: ' + err.message);
    res.json({ ok: true, teams });
  });
});
