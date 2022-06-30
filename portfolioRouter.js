const express = require('express')
const db = require('./db')

const router = express.Router()

//GET /portfolio

router.get("/", function (request, response) {

    db.getAllPortfolioPosts(function (error, portfolio) {

        if (error) {

            const model = {

                somethingWentWrong: true
            }

            response.render("error500.hbs", model)

        } else {
            portfolio.reverse()
            const model = {

                somethingWentWrong: false,
                portfolio

            }

            response.render("portfolio.hbs", model)
        }
    })
})

//GET /portfolio/create
router.get("/create", function (request, response) {

    if (request.session.isLoggedIn) {

        const model = {

            validationErrors: []
        }

        response.render("portfolio-create.hbs", model)
    }
    else {
        response.redirect("/login")
    }
})

//GET /portfolio/id
router.get("/:id", function (request, response) {

    const id = request.params.id //portfolio-id

    db.getPortfolioById(id, function (error, portfolio) {

        if (error) {
            console.log(error)
            response.render("error500.hbs")
        } else {

            const model = {

                portfolio
            }

            response.render("certainportfolio.hbs", model)
        }
    })
})

//GET /portfolio/edit
router.get("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id //portfolio-id

        db.getPortfolioById(id, function (error, portfolio) {

            if (error) {
                console.log(error)
                response.render("error500.hbs")
            } else {

                const model = {
                    portfolio
                }

                response.render("portfolio-edit.hbs", model)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /portfolio/edit
router.post("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id
        const title = request.body.title
        const projectLink = request.body.projectLink

        db.editPortfolioPost(title, projectLink, id, function (error) {

            if (error) {

                response.render("error500.hbs")

            } else {
                response.redirect('/portfolio/' + id)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /portfolio/create
//Body: title=title&content=content
router.post("/create", function (request, response) {

    if (request.session.isLoggedIn) {

        const title = request.body.title
        const projectLink = request.body.projectLink
        const date = new Date()
        const datePosted = date.toDateString()

        const validationErrors = []

        if (title == "") {

            validationErrors.push("Must enter a tile.")
        }

        if (projectLink == "") {

            validationErrors.push("Must enter a project link.")
        }

        if (validationErrors.length == 0) {

            db.createPortfolioPost(title, projectLink, datePosted, function (error, id) {

                if (error) {

                    response.render("error500.hbs")

                } else {

                    response.redirect("/portfolio")
                }
            })

        } else {

            const model = {

                validationErrors,
                title,
                projectLink,
                datePosted
            }

            response.render("portfolio-create.hbs", model)

        }
    }
    else {
        response.redirect("/login")
    }
})

//POST /portfolio/delete
router.post("/delete/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id
        db.deletePortfolioPost(id, function (error) {

            response.redirect("/portfolio")
        })
    }
    else {
        response.redirect("/login")
    }
})

module.exports = router