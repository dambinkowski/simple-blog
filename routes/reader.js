const express = require("express");
const router = express.Router();
router.use(express.static('public'));
const url = require('url')

/**
 * @desc renders reader home page
 */
router.get("/home", (req, res, next) => {
    global.db.serialize(() => { // to make sure that first call to db finishes and adds res.local before second call to db that also adds to locals and renders the page 
        // get blog info from db
        global.db.get(
            "SELECT * FROM authors WHERE author_id=1",
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else {
                    res.locals.author_name = data.author_name;
                    res.locals.blog_title = data.blog_title;
                    res.locals.blog_subtitle = data.blog_subtitle;
                }
            }
        );
        // get articles from db
        global.db.all(
            "SELECT * FROM articles WHERE author_id=1 AND published=TRUE",
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else {
                    res.render("reader/home", { publishedArticles: data });
                }
            }
        )
    });
});



/**
 * @desc renders reader article page
 */
router.get("/article", (req, res, next) => {
    global.db.serialize(() => { // to make sure that first call to db finishes and adds res.local before second call to db that also adds to locals and renders the page 
        // get author name from db
        global.db.get(
            "SELECT * FROM authors WHERE author_id=1",
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else {
                    res.locals.author_name = data.author_name;
                    res.locals.blog_title = data.blog_title;
                    res.locals.blog_subtitle = data.blog_subtitle;
                }
            }
        );
        // get comments from db
        global.db.all(
            "SELECT * FROM articlesComments WHERE article_id = ? ORDER BY date_comment DESC",
            req.query.id,
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else {
                    res.locals.comments = data;
                }
            }
        );


        // get article data from db
        global.db.get(
            "SELECT article_id, title, subtitle, content, date_publication, likes FROM articles WHERE article_id=?",
            req.query.id, // article id from GET from home page 
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.render("reader/article", data);
                }
            }
        );
    });
});


/**
 * @desc handles post from reader articles and updates db, redirects back to article page  
 */
router.post("/article", (req, res, next) => {
    if (req.body.task == "add_coment") {
        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //reference - slightly adjusted https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime answered Jun 22, 2012 at 5:40 by Gajus accessed: jan/11/2023 
        global.db.run(
            "INSERT INTO articlesComments (article_id, content, date_comment) VALUES(?,?,?);",
            [req.body.article_id, req.body.content, date],
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.redirect(url.format({
                        pathname: "article",
                        query: {
                            "id": req.body.article_id
                        }
                    }));
                }
            }
        );
    }
    if (req.body.task == "add_like") {
        var likes = parseInt(req.body.likes) + 1;
        global.db.run(
            "UPDATE articles SET likes=? WHERE article_id=?;",
            [likes, req.body.article_id],
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.redirect(url.format({
                        pathname: "article",
                        query: {
                            "id": req.body.article_id
                        }
                    }));
                }
            }
        );

    }
});

module.exports = router;