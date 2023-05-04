if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express()
const expressLayouts = require('express-ejs-layouts') 
const path = require("path")

const indexRouter = require('./routes/index')




app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
app.use('/public', express.static('public'));

app.use('/', indexRouter)

app.use(express.urlencoded({ extended: false }))



const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoDb = "mongodb+srv://lucash256w:Qazwsx2121@cluster0.dxlhlod.mongodb.net/dressMate"
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Define user model
const User = mongoose.model(
    "User",
    new Schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    })
  );

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));





app.get('/', (req, res) => {
    res.render('index.ejs', {user: req.user})
})

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

app.get('/profile', (req, res) => {
    res.render('profile.ejs', { user: req.user});
});

app.post('/profile', async (req, res, next) => {
  res.render('profile.ejs', {user: "Hello"});
});




app.get('/register', (req, res) => {
    res.render('register.ejs')
});

app.post('/register', async (req, res, next) => {
    try {
        const user = new User({
          username: req.body.username,
          password: req.body.password
        });
        const result = await user.save();
        res.redirect("/");
      } catch(err) {
        return next(err);
      };
});

app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

app.use(require('./routes/auth'))
app.use(require('./routes/index'))

passport.use(
    new LocalStrategy(async(username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        };
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });





app.listen(process.env.PORT || 3000)