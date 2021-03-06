// dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// controllers
const coffeeList = require('./controllers/coffeeList.controller');
const user = require('./controllers/user.controller');

// database
const config = require('./config/database');

// express server exposed at port 3000
const app = express();
const port = 3000;

// deprecated promises, use es6
mongoose.Promise = global.Promise;

// connect to database
mongoose.connect(config.database, { useMongoClient: true });

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// static files
app.use(express.static(path.join(__dirname, 'public')));

// routing (to index and through controllers)
app.get('/', (req, res) => {
    res.send("Invalid request");
});

app.use('/coffeeList', coffeeList);
app.use('/user', user);

// listen
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});
