const express = require("express");
const router = express.Router();
router.use(express.static('public'));
const url = require('url')

/**
 * @desc renders author home page
 */
router.get("/home", (req, res, next) => {
    // get author name from db
    global.db.serialize(() => { // to make sure that first call to db finishes and adds res.local before second call to db that also adds to locals and renders the page 
        global.db.get(
            "SELECT * FROM authors WHERE author_id=1",
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else { // set local variables for html
                    res.locals.author_name = data.author_name;
                    res.locals.blog_title = data.blog_title;
                    res.locals.blog_subtitle = data.blog_subtitle;
                }
            }
        );
        // get author articles from db
        global.db.all(
            "SELECT * FROM articles WHERE author_id=1 ORDER BY date_modification DESC",
            function (err, data) {
                if (err) {
                    next(err);  //send the error on to the error handler
                } else {
                    res.locals.publishedArticles = [];
                    res.locals.draftArticles = [];
                    for (let i = 0; i < data.length; i++) { // analyze which articles are published and wich arent
                        if (data[i].published) {
                            res.locals.publishedArticles.push(data[i]); // add local var to html to have access 
                        } else {
                            res.locals.draftArticles.push(data[i]); // add local var to html to have access 
                        }
                    }
                    res.render("author/home");
                }
            }
        )
    });
});

/**
 * @desc home page : delete or publish=true change in db articles 
 */
router.post("/home", (req, res, next) => {
    if (req.body.task == "delete") {
        global.db.run(
            "DELETE FROM articles WHERE article_id=?",
            req.body.id,
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('home')
                }
            }
        );
    }
    if (req.body.task == "publish") {
        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //reference - slightly adjusted https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime answered Jun 22, 2012 at 5:40 by Gajus accessed: jan/11/2023 
        global.db.run(
            "UPDATE articles SET published=1, date_publication=? WHERE article_id=?; ",
            [date, req.body.id],
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.redirect('home')
                }
            }
        );
    }
    if (req.body.task == "new-article") {
        global.db.serialize(() => { // to make sure that first call to db finishes and adds res.local before second call to db that also adds to locals and renders the page 
            var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //reference - slightly adjusted https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime answered Jun 22, 2012 at 5:40 by Gajus accessed: jan/11/2023 
            global.db.run(
                "INSERT INTO articles (author_id, date_creation, date_modification) VALUES (1,?,?) ;",
                [date, date],
                function (err, data) {
                    if (err) {
                        next(err);
                    }
                }
            );
            global.db.get(
                "SELECT last_insert_rowid()",
                function (err, data) {
                    if (err) {
                        next(err);
                    } else { // it was hard to get data.last_insert.rowid() did not work because of (), I found answer in developer mozilla documentiation reference below
                         // reference: thanks to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors Last modified: Dec 13, 2022, by MDN contributors accessed jan/15/2023
                        res.redirect(url.format({
                            pathname: "article",
                            query: {
                                "id": data['last_insert_rowid()']
                            }
                        }));
                    }
                }
            );
        })
    }
});

// article edit page // 
/**
 * @desc renders author article page
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
        // get article data from db
        global.db.get(
            "SELECT title, subtitle, content, date_creation, date_modification FROM articles WHERE article_id=?",
            req.query.id, // article id from GET from home page 
            function (err, data) {
                if (err) {
                    next(err);
                } else {
                    res.locals.article_id = req.query.id;
                    res.render("author/article", data);
                }
            }
        );
    });
});


/**
 * @desc author article updates db with article modification and go to author home page 
 */
router.post("/article", (req, res, next) => {
    var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //reference - slightly adjusted https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime answered Jun 22, 2012 at 5:40 by Gajus accessed: jan/11/2023 
    global.db.run(
        "UPDATE articles SET title=?, subtitle=?, content=?, date_modification=? WHERE article_id=?;",
        [req.body.title, req.body.subtitle, req.body.content, date, req.body.article_id],
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect('home')
            }
        }
    );
});

/**
 * @desc renders author setings page
 */
router.get("/settings", (req, res, next) => {
    global.db.get(
        "SELECT * FROM authors WHERE author_id=1",
        function (err, data) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.render("author/settings", data);
            }
        }
    )
});

/**
 * @desc changes author settings in db
 */
router.post("/settings", (req, res, next) => {
    global.db.run(
        "UPDATE authors SET author_name=?, blog_title=?, blog_subtitle=? WHERE author_id=1",
        [req.body.author_name, req.body.blog_title, req.body.blog_subtitle],
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect('home')
            }
        }
    );

});

module.exports = router;