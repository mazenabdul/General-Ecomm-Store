const express = require('express');
const { handleErrors } = require('./middlewares');
const userDatabase = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');


const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post(
    '/signup', [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
    ],
    handleErrors(signUpTemplate),
    async(req, res) => {

        //Based on what was entered in the GET request, check email and passwords
        const { email, password, passwordConfirmation } = req.body;


        //If both check pass, create a user and push into database repo.
        const userCreate = await userDatabase.create({ email, password });

        //Store the ID of that user inside the user's cookie
        req.session.userId = userCreate.id;

        res.redirect('/admin/products');
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
})

router.get('/signin', (req, res) => {
    res.send(signInTemplate({}));
})

router.post('/signin', [
        requireEmailExists,
        requireValidPasswordForUser
    ],
    handleErrors(signInTemplate),
    async(req, res) => {
        const { email } = req.body;
        const user = await userDatabase.getOneBy({ email });

        req.session.id = user.id;
        res.redirect('/admin/products');
    })

module.exports = router;