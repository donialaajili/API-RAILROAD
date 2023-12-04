const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const port = 3000;

const app = express();

app.get('/', (req, res) =>{
    res.send('Hello World')
})

app.listen(port, () => console.log("Le serveur a demarré au port  "+ port));

// MongoDB Connection
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Passport Setup
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  // Check if user exists in the database based on payload information
  // Example: User.findById(payload.sub, (err, user) => {
  //   if (err) return done(err, false);
  //   if (user) return done(null, user);
  //   return done(null, false);
  // });
}));
