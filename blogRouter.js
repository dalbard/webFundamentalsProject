const express = require('express')
const db = require('./db')

const router = express.Router()

//GET /blogpost

router.get("/", function (request, response) {

    db.getAllBlogPosts(function (error, blogpost) {

        if (error) {

            const model = {

                somethingWentWrong: true
            }

            response.redirect("/error500", model)

        } else {
            blogpost.reverse()
            const model = {

                somethingWentWrong: false,
                blogpost

            }

            response.render("blogpost.hbs", model)
        }
    })
})

//GET /blogposts/create

router.get("/create", function (request, response) {

    if (request.session.isLoggedIn) {

        const model = {

            validationErrors: []
        }

        response.render("blogpost-create.hbs", model)

    } else {
        response.redirect("/login")
    }
})
//GET /blogposts/id
router.get("/:id", function (request, response) {

    const id = request.params.id //blogpost-id

    db.getBlogPostsById(id, function (error, blogpost) {

        if (error) {
            console.log(error)
            response.redirect("/error500")
        } else {

            const model = {

                blogpost
            }

            response.render("certainblogpost.hbs", model)
        }
    })
})

//GET /blogpost/edit
router.get("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id //blogpost-id

        db.getBlogPostsById(id, function (error, blogpost) {

            if (error) {
                console.log(error)
                response.redirect("/error500")
            } else {

                const model = {
                    blogpost
                }

                response.render("blogpost-edit.hbs", model)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /blogpost/edit
router.post("/edit/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id
        const title = request.body.title
        const content = request.body.content

        db.editBlogPost(title, content, id, function (error) {

            if (error) {

                response.redirect("/error500")

            } else {
                response.redirect('/blogpost/' + id)
            }
        })
    }
    else {
        response.redirect("/login")
    }
})

//POST /blogposts/create
//Body: title=title&content=content
router.post("/create", function (request, response) {

    if (request.session.isLoggedIn) {

        const title = request.body.title
        const content = request.body.content
        const date = new Date()
        const datePosted = date.toDateString()

        const validationErrors = []

        if (title == "") {

            validationErrors.push("Must enter a tile.")
        }

        if (content == "") {

            validationErrors.push("Must enter some content.")
        }

        if (validationErrors.length == 0) {

            db.createBlogPost(title, content, datePosted, function (error, id) {

                if (error) {

                    response.redirect("/error500")

                } else {

                    response.redirect("/blogpost")
                }
            })

        } else {

            const model = {

                validationErrors,
                title,
                content,
                datePosted
            }

            response.render("blogpost-create.hbs", model)

        }
    }
    else {
        response.redirect("/login")
    }
})

//POST /blogpost/delete
router.post("/delete/:id", function (request, response) {

    if (request.session.isLoggedIn) {

        const id = request.params.id
        db.deleteBlogPost(id, function (error) {

            response.redirect("/blogpost")
        })
    }
    else {
        response.redirect("/login")
    }
})

module.exports = router