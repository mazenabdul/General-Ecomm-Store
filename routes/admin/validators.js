const { check } = require('express-validator');
const userDatabase = require('../../repositories/users');

module.exports = {

    requireTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5 and 40 characters!'),

    requirePrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage('Must be a value greater than 1!'),

    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid E-mail')
        .custom(async(email) => {
            //If user email is already in use, throw message. 
            const existingUser = await userDatabase.getOneBy({ email: email });
            if (existingUser) {
                throw new Error('E-mail in use!');
            }
        }),

    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),

    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true
        }),

    requireEmailExists: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide a valid email')
        .custom(async(email) => {
            const user = await userDatabase.getOneBy({ email: email });
            if (!user) {
                throw new Error('Email not found!')
            }
        }),

    requireValidPasswordForUser: check('password')
        .trim()
        .custom(async(password, { req }) => {
            const user = await userDatabase.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error('Invalid password');
            }
            const validPassword = await userDatabase.comparePassword(user.password, password);
            if (!validPassword) {
                throw new Error('Invalid password!');
            }
        })

}