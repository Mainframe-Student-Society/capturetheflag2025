// imports
const express = require('express'); //for building the server
const bodyParser = require('body-parser'); //will parse incoming bodies
const session = require('express-session'); //will manage user login state wtc
const path = require('path'); //for file paths
const sqlite3 = require('sqlite3').verbose(); //.verbose() will help woth detailed logging.
const { PORT, DB_PATH, SESSION_SECRET } = require('./config/config'); //grab stuff from the thingy

const app = express(); //expressing application instance.
const db = new sqlite3.Database(DB_PATH); //connection to db file.

//Middleware
app.use(bodyParser.urlencoded({ extended: true })); //middleware thing can parse conplicated objects
app.use(session({
  secret: SESSION_SECRET, // signs cookies 
  resave: false, // avoids saving session if not modified
  saveUninitialized: false // only saves sess that have data
}));

app.use(express.static(path.join(__dirname, 'public'))); //static files from public folder i e html css and js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
const authRoutes = require('./routes/auth');        // handles login/signup
const adminRoutes = require('./routes/admin');      // handles routes under /admin
const apiRoutes = require('./routes/api');          // handles routes under /api
const loop1Routes = require('./routes/loops/loop1'); // handles loop1 routes
const generalRoute = require('./routes/general');  // handles general routes
const dashboardRoute = require('./routes/dashboard'); // handles dashboard routes


//const tobyRoute = require('./routes/toby');
//const leaderboardRoute = require("./routes/leaderboard");
//const miaRoutes = require('./routes/mia');


// Use routes
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/general', generalRoute);
app.use('/loop1', loop1Routes);
app.use('/dashboard', dashboardRoute);
//app.use('/toby', tobyRoute);
//app.use("/leaderboard", leaderboardRoute);
//app.use('/mia', miaRoutes);


//Home redirect
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); //Serves the homepage ->index.html. when users visit /
});

//Error
app.use((req, res) => {
  res.status(404).send('<h3>404 Not Found</h3>'); //Handles any unmatched route with a 404 error.
});



app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`)); //tarts the Express server on the specified PORT and logs a confirmation
