const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({ extended: true }));

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

// root path should direct to reader page
app.get('/', (req, res) => {
  res.redirect('/reader/home')
});

// make sure path exists for author 
const authorRoutes = require('./routes/author');
//this adds all the authorRoutes to the app under the path /author
app.use('/author', authorRoutes);

// make sure path exists for reader 
const readerRoutes = require('./routes/reader');
//this adds all the readerRoutes to the app under the path /reader
app.use('/reader', readerRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

