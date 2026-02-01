
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS authors (
    author_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name     TEXT NOT NULL,
    blog_title      TEXT,
    blog_subtitle   TEXT
);

INSERT INTO authors (author_name, blog_title, blog_subtitle) 
VALUES ("John Super-John", "Lets Talk Cookies", "Journey of cookie connoisseur");

CREATE TABLE IF NOT EXISTS articles (
    article_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id           INT NOT NULL, 
    title               TEXT,
    subtitle            TEXT, 
    content             TEXT, 
    date_creation       DATETIME, 
    date_modification   DATETIME, 
    published           INT DEFAULT 0,
    date_publication    DATETIME,
    likes               INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
    
);

/* Dummy test data was into "content" was copied from https://chat.openai.com/chat# accessed on 15/jan/23  */

INSERT INTO articles (author_id, title, subtitle, content, date_creation, date_modification, published) 
VALUES (1,"Why cookies","Shape and taste","Eating cookies can be a fun and delicious way to treat yourself, but they also offer other benefits. Cookies can be a great source of carbohydrates, which provide energy for the body. They can also contain ingredients such as nuts, oats, and fruits that provide some essential vitamins and minerals. Additionally, cookies can be a comforting and satisfying snack, helping to curb cravings and boost mood. Furthermore, cookies can be enjoyed in a variety of ways, from a classic chocolate chip cookie to a more exotic flavor like lavender lemon. Eating cookies in moderation can be a sweet and enjoyable way to incorporate some key nutrients and enjoy a little indulgence in your daily routine.", "2022-12-29 23:20:11","2022-12-29 23:50:22", 0);

INSERT INTO articles (author_id, title, subtitle, content, date_creation, date_modification, published) 
VALUES (1,"No cookies?","Baking cookies tips","Baking cookies can be a fun and rewarding experience, but it's important to keep a few tips in mind to achieve the perfect results. First, make sure you are using fresh ingredients, as old baking powder or expired eggs can affect the taste and texture of your cookies. Secondly, pay attention to the recipe's instructions and measure your ingredients carefully. Thirdly, when making cookies, avoid over-mixing the dough as it can make your cookies tough. Fourthly, use a cookie scoop or spoon to ensure your cookies are all the same size and will bake evenly. Lastly, pay attention to the baking time, as over-baking can also lead to tough and dry cookies. Follow these tips and you'll be sure to enjoy delicious, perfectly baked cookies every time.", "2022-2-21 13:20:23","2022-7-29 23:50:01", 0);

INSERT INTO articles (author_id, title, subtitle, content, date_creation, date_modification, published, date_publication) 
VALUES (1,"Me and cookies","My journey of cookie exploration","Once upon a time, there was a young girl named Sarah who had a passion for baking cookies. She began her journey in her small kitchen, experimenting with different ingredients and techniques. As she grew older, she traveled the world, seeking out new recipes and techniques to perfect her craft. She tried everything from classic chocolate chip to exotic matcha green tea cookies. Along the way, she met other bakers who shared her love of cookies and together they explored the art of cookie-making. Eventually, Sarah opened her own bakery, where she continues to share her delicious creations with the world. She realized that the journey of cookie exploration is never-ending, and she will continue to discover new ways to make the perfect cookie.", "2022-4-25 12:20:44","2022-5-29 22:50", 1, "2022-6-29 22:50:33");
CREATE TABLE IF NOT EXISTS articlesComments (
    comment_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id          INT NOT NULL,  
    content             TEXT, 
    date_comment        DATETIME,
    FOREIGN KEY (article_id) 
    REFERENCES articles(article_id)
    ON DELETE CASCADE
);

INSERT INTO articlesComments (article_id, content, date_comment)
VALUES (3,"I really like this article !! :))) ", "2022-7-29 22:50:23" );

INSERT INTO articlesComments (article_id, content, date_comment)
VALUES (3,"its okay could be better!! :))) ", "2022-8-29 22:50:55" );


















------ DEVELOPMENT -----

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);

--insert default data (if necessary here)

INSERT INTO testUsers ("test_name") VALUES ("Simon Star");
INSERT INTO testUserRecords ("test_record_value", "test_user_id") VALUES( "Lorem ipsum dolor sit amet", 1); --try changing the test_user_id to a different number and you will get an error

--/ development 

COMMIT;

