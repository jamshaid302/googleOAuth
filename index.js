const express = require('express');
const app = express();
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '589354559611-u6hki1fhqmnpl01ns125utkd2usjq8qi.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
}));

app.get('/', function(req, res) {
    res.render('pages/auth');
});

const passport = require('passport');
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => {
    console.log(userProfile._json);
    res.render('pages/success',{user: userProfile})
    // res.send(userProfile)
});
app.get('/error', (req, res) => {
    res.send("error logging in")
});

// serializeUser determines which data of the user object should be stored in the session
// The result of the serializeUser method is attached to the session as req.session.passport.user = {}. 
// Here for instance, 
// it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));