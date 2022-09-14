// system imports
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

// environment config
dotenv.config();

// server config
const app = express();
app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

// domain config
app.get('/', (req, res) => {
    return res.render('index');
});

// connect to database and start server
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('Connected to database.');

    let port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server has started on port ${port}`);
    });
});