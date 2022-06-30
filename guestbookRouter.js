const express = require('express')
const db = require('./db')

const router = express.Router()

//GET /guestbook

router.get("/", function (request, response) {

    db.getAllGuestBookPosts(function (error, guestbook) {

        if (error) {

            const model = {

                somethingWentWrong: true
            }

            response.render("error500.hbs", model)

        } else {
            guestbook.reverse()
            const model = {

                somethingWentWrong: false,
                guestbook

            }

            response.render("guestbook.hbs", model)
        }
    })
})

//GET /guestbook/create
router.get("/create", function (request, response) {

    const model = {

        validationErrors: []
    }

    response.render("guestbook-create.hbs", model)
})

//GET /guestbook/id
router.get("/:id", function (request, response) {

    const id = request.params.id //guestbook-id

    db.getGuestBookById(id, function (error, guestbook) {

        if (error) {
            console.log(error)
            response.render("error500.hbs")
        } else {

            const model = {

                guestbook
            }

            response.render("certainguestbook.hbs", model)
        }
    })
})

//GET /guestbook/edit
router.get("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id //blogpost-id

        db.getGuestBookById(id, function (error, guestbook) {

            if (error) {
                console.log(error)
                response.render("error500.hbs")
            } else {

                const model = {
                    guestbook
                }

                response.render("guestbook-edit.hbs", model)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /guestbook/edit
router.post("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id
        const name = request.body.name
        const message = request.body.message

        db.editGuestbook(name, message, id, function (error) {

            if (error) {

                response.render("error500.hbs")

            } else {
                response.redirect('/guestbook/' + id)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /guestbook/create
//Body: name=name&message=message
router.post("/create", function (request, response) {

    const name = request.body.name
    const message = request.body.message
    const date = new Date()
    const datePosted = date.toDateString()

    const validationErrors = []

    if (name == "") {

        validationErrors.push("Must enter a name.")
    }

    if (message == "") {

        validationErrors.push("Must enter a message.")
    }

    if (validationErrors.length == 0) {

        db.createGuestBookPost(name, message, datePosted, function (error, id) {

            if (error) {

                response.render("error500.hbs")

            } else {

                response.redirect("/guestbook")
            }
        })

    } else {

        const model = {

            validationErrors,
            name,
            message,
            datePosted
        }

        response.render("guestbook-create.hbs", model)

    }
})

//GET /guestbook/delete
router.post("/delete/:id", function (request, response) {
    if (request.session.isLoggedIn) {
        const id = request.params.id
        db.deleteGuestBook(id, function (error) {

            response.redirect("/guestbook")
        })
    }
    else {
        response.redirect("/login")
    }
})

module.exports = router