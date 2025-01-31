const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {savedRedirectUrl}=require('../middleware');

// Render signup form
router.get("/signup", (req, res) => {
    res.render('users/signup');
});

// Handle signup logic
router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // registr hone k ebad niche wal ep elogin kaaro

        req.login(registeredUser, err => {  // iska matlab hai dirrect signup hon eke baad login nhai karn apadega

            if (err) return next(err);
            req.flash('success', 'Welcome to My Hotel!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

// Render login form
router.get("/login", (req, res) => {
    res.render('users/login');
});

// Handle login logic
router.post("/login",savedRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
    // man lo app login nhai ho aur app idhar dusre tab khol rahe  session ki thorugh
    //par jese login hoajye toh passport seesion ki purani history ko delete kardeta hai
    // toh hum jaha jana chat ethe waha nahi ja ppaynge

    //
});
router.get("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
});

module.exports = router;