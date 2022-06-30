const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const bcrypt = require('bcryptjs')
const blogRouter = require('./blogRouter')
const guestbookRouter = require('./guestbookRouter')
const portfolioRouter = require('./portfolioRouter')


const db = require('./db')

const salt = bcrypt.genSaltSync(10)

//PW = 123admin
const username = "Admin"
const password = "$2a$10$otBRFm5v4QK8B4SXVkGPsu03DcfvdK3uPd0Yfe5UJuUTqSdJuSo0S"

console.log(password)


const app = express()

app.use(express.static("public"))

app.use(cookieParser())

app.use(expressSession({
    secret: "aoaisfasfadsoi",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore
}))


const csrfToken = csrf({ cookie: true })

app.use(function (request, response, next) {

    response.locals.isLoggedIn = request.session.isLoggedIn
    response.locals.csrfToken = request.session.csrfToken

    next()
})
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use("/blogpost", blogRouter)

app.use("/guestbook", guestbookRouter)

app.use("/portfolio", portfolioRouter)



app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))

//GET /
app.get('/', function (request, response) {
    response.render('home.hbs')
})

//GET /about
app.get('/about', function (request, response) {
    response.render('about.hbs')
})

//GET /contact
app.get('/contact', function (request, response) {
    response.render('contact.hbs')
})

//GET /login
app.get("/login", function (request, response) {

    response.render("login.hbs")
})

//POST /login
app.post("/login", function (request, response) {

    if (request.body.username == username && bcrypt.compareSync(request.body.password, password)) {
        request.session.isLoggedIn = true
        response.redirect("/")
    }
    else {
        const model = {

            username: request.body.username
        }
        response.render("login.hbs", model)
    }
})

//POST /logout
app.post("/logout", function (request, response) {

    if (request.session.isLoggedIn) {
        request.session.isLoggedIn = false
        response.redirect("/")
    } else {
        response.render("home.hbs")
    }
})

//GET /error500
app.get("/error500", function (request, response) {

    response.render("error500.hbs")
})

//Error 404
app.use(function (request, response) {
    response.render("error404.hbs")
})

app.listen(8080)