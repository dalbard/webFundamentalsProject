const sqlite = require('sqlite3')
const db = new sqlite.Database("database.db")

db.run(`
        CREATE TABLE IF NOT EXISTS blogposts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            datePosted TEXT
        )
`)

db.run(`
       CREATE TABLE IF NOT EXISTS guestbook(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT,
           message TEXT,
           datePosted TEXT
       )
`)

db.run(`
       CREATE TABLE IF NOT EXISTS portfolio(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           title TEXT,
           datePosted TEXT,
           projectLink TEXT
       )
`)

exports.getAllBlogPosts = function (callback) {

    const query = "SELECT * FROM blogposts"

    db.all(query, function (error, blogposts) {

        callback(error, blogposts)
    })
}

exports.getBlogPostsById = function (id, callback) {

    const query = "SELECT * FROM blogposts WHERE id = ?"
    const values = [id]

    db.get(query, values, function (error, blogposts) {

        callback(error, blogposts)
    })
}

exports.createBlogPost = function (title, content, datePosted, callback) {

    const query = "INSERT INTO blogposts (title, content, datePosted) VALUES (?, ?, ?)"
    const values = [title, content, datePosted]

    db.run(query, values, function (error) {

        const id = this.lastID

        callback(error, id)
    })
}

exports.editBlogPost = function (title, content, id, callback) {

    const query = "UPDATE blogposts SET title = ?, content = ? WHERE id =?"
    const values = [title, content, id]

    db.run(query, values, function (error) {

        callback(error)
    })

}

exports.deleteBlogPost = function (id, callback) {

    const query = "DELETE FROM blogposts WHERE id = ?"

    db.run(query, [id], function (error) {

        callback(error)
    })
}










exports.getAllGuestBookPosts = function (callback) {

    const query = "SELECT * FROM guestbook"

    db.all(query, function (error, guestbook) {

        callback(error, guestbook)
    })
}

exports.getGuestBookById = function (id, callback) {

    const query = "SELECT * FROM guestbook WHERE id=?"
    const values = [id]

    db.get(query, values, function (error, guestbook) {

        callback(error, guestbook)
    })
}

exports.editGuestbook = function (name, message, id, callback) {

    const query = "UPDATE guestbook SET name = ?, message = ? WHERE id = ?"
    const values = [name, message, id]

    db.run(query, values, function (error) {

        callback(error)
    })
}

exports.createGuestBookPost = function (name, message, datePosted, callback) {

    const query = "INSERT INTO guestbook (name, message, datePosted) VALUES (?, ?, ?)"
    const values = [name, message, datePosted]

    db.run(query, values, function (error) {

        const id = this.lastID

        callback(error, id)
    })
}

exports.deleteGuestBook = function (id, callback) {

    const query = "DELETE FROM guestbook WHERE id=?"

    db.run(query, [id], function (error) {

        callback(error)
    })
}







exports.getAllPortfolioPosts = function (callback) {

    const query = "SELECT * FROM portfolio"

    db.all(query, function (error, portfolio) {

        callback(error, portfolio)
    })
}

exports.getPortfolioById = function (id, callback) {

    const query = "SELECT * FROM portfolio WHERE id=?"
    const values = [id]

    db.get(query, values, function (error, portfolio) {

        callback(error, portfolio)
    })
}

exports.createPortfolioPost = function (title, projectLink, datePosted, callback) {

    const query = "INSERT INTO portfolio (title, projectLink, datePosted) VALUES (?, ?, ?)"
    const values = [title, projectLink, datePosted]

    db.run(query, values, function (error) {

        const id = this.lastID

        callback(error, id)
    })
}

exports.editPortfolioPost = function (title, projectLink, id, callback) {

    const query = "UPDATE portfolio SET title = ?, projectLink = ?  WHERE id =?"
    const values = [title, projectLink, id]

    db.run(query, values, function (error) {

        callback(error)
    })
}

exports.deletePortfolioPost = function (id, callback) {

    const query = "DELETE FROM portfolio WHERE id=?"

    db.run(query, [id], function (error) {

        callback(error)
    })
}