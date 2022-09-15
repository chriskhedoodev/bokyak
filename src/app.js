// system imports
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

// domain imports
const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');

// environment config
dotenv.config();

// server infrastructure config
const app = express();

let store = new session.MemoryStore();
app.use(session({
  secret: 'some secret',
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  saveUninitialized: false,
  resave: false,
  store: store
}));

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

// server domain config
app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

app.get('/', (req, res) => {
    return res.redirect('/feed');
});

// connect to database and start server
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('Connected to database.');

    let port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server has started on port ${port}`);
    });
});