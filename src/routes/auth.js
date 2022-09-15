const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
    return res.render('register')
});

router.get('/login', (req, res) => {
    return res.render('login');
});

router.post('/register', async (req, res) => {
    try {
        let { username, password, confirmedPassword } = req.body;
        if (validateCredential(username) && validateCredential(password) && validateCredential(confirmedPassword)) {
            if (username.length < 3) {
                return res.render(
                    'register', 
                    createErrorResponse('Username must be at least 3 characters in length.'));
            }

            if (password.length < 5) {
                return res.render(
                    'register', 
                    createErrorResponse('Password must be at least 5 characters in length.'));
            }

            if (password !== confirmedPassword) {
                return res.render(
                    'register', 
                    createErrorResponse('Passwords do not match.'));
            }

            let user = await User.findOne({ username: username });
            if (!user) {
                let salt = await bcrypt.genSalt(10);
                let passwordHash = await bcrypt.hash(password, salt);
                let newUser = await User.create({
                    username: username,
                    passwordHash: passwordHash
                });

                req.session.user = newUser;
                return res.redirect('/feed');
            }

            return res.render(
                'register',
                createErrorResponse(`Username ${username} already exists. Please choose a different username.`))
        }

        return res.render(
            'register',
            createErrorResponse('You must supply non-empty values for all three fields.'));

    } catch (err) {
        console.log(err);
        return res.render(
            'register',
            createErrorResponse('An internal server error occurred. Please try again.'));
    }
});

router.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        if (validateCredential(username) && validateCredential(password)) {
            let user = await User.findOne({ username: username });
            if (!user) {
                return res.render(
                    'login',
                    createErrorResponse('Invalid username or password'));
            }

            let authenticated = await bcrypt.compare(password, user.passwordHash);
            if (authenticated) {
                req.session.user = user;
                return res.redirect('/feed');
            }

            return res.render(
                'login',
                createErrorResponse('Invalid username or password'));
        }

        return res.render(
            'login',
            createErrorResponse('You must supply non-empty values for both fields.'));

    } catch (err) {
        console.log(err);
        return res.render(
            'login',
            createErrorResponse('An internal server error occurred. Please try again.'));
    }
});

function createErrorResponse(errorMessage) {
    return {
        errorMessage: errorMessage
    };
}

function validateCredential(credential) {
    return credential !== null && credential.match(/^ *$/) === null;
}

module.exports = router;