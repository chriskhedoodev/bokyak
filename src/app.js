// system imports
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
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
app.use('/public', express.static(path.join(__dirname, 'public')));

// domain config
app.get('/', (req, res) => {
    return res.render('index');
});

// connect to database and start server
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('Connected to database.');

    let port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server has started on port ${port}`);
    });
});