if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts') 

const indexRouter = require('./routes/index')



app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use('/public', express.static('public'));

app.use('/', indexRouter)

app.use(express.urlencoded({ extended: false }))



const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.get('/', (req, res) => {
    res.render('index.ejs', {name : 'kyle'})
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', (req,res) => {
    
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', (req,res) => {
    req.body.name
})

app.listen(process.env.PORT || 3000)