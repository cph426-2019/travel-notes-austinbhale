import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as exphbs from "express-handlebars";
import * as moment from "moment";

import { DB, Rows } from "./db";

import admin from "./admin";

let app = express();

app.set("view engine", "hbs");
app.set("views", "server/views");
app.engine("hbs", exphbs({
    defaultLayout: "default",
    extname: "hbs",
}));

app.use(express.static("dist/"));
app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    let [rows] = await DB.query<Rows>("SELECT * FROM posts ORDER BY publishAt DESC");
    rows.map((rows) => rows.publishAt = moment(rows.publishAt).format('MMMM D, YYYY'));
    res.render("index", {
        title: "Austin's Notes",
        sectionHdr: "index-hdr",
        posts: rows
    });
});

import { async } from "q";
app.get("/todos.json", async (req, res) => {
    let [rows, fields] = await DB.query<Rows>("SELECT * FROM todos");
    res.json(rows);
});

app.get("/todos", async (req, res) => {
    // Destructuring assignment
    let [rows] = await DB.query<Rows>("SELECT * FROM todos");
    res.render("todos", {todos: rows});
});

app.get("/todos/eat", async (req, res) => {
    let sql = "INSERT INTO `blog`.`todos` (`description`, `url`) VALUES (:description, :url)";
    await DB.execute(
        sql,
        {description: "EAT!!!", url: "http://food.com"}
    );
    res.redirect("/todos");
});

app.get("/todos/:id", async (req, res) => {
    let [rows] = await DB.query<Rows>("SELECT * FROM todos WHERE id = :id", {id: req.params.id});
    res.json(rows);
});

app.get("/about-me", (req, res) => {
    res.render("about-me", {
        title: "About Me",
        sectionHdr: "about-me-hdr",
    });
});

app.get("/bucket-list", (req, res) => {
    res.render("bucket-list", {
        title: "Bucket List",
        sectionHdr: "bucket-list-hdr",
    });
});

app.get("/gallery", (req, res) => {
    res.render("gallery", {
        title: "Photo Gallery",
        sectionHdr: "gallery-hdr",
    });
});

app.use("/admin", admin);

// To see individual posts on client-side.
app.get("/:id", async (req, res) => {
    let sql = "SELECT * FROM posts WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try {
        let [rows] = await DB.query<Rows>(sql, params);
        rows.map((rows) => rows.publishAt = moment(rows.publishAt).format('MMMM D, YYYY'));
        if (rows.length === 1) {
            res.render("post", {
                post: rows[0],
                action: `${req.baseUrl}${req.path}`,
                layout: "default",                
                sectionHdr: "index-hdr",
            });
        } else {
            res.redirect(`${req.baseUrl}${req.path}/../`);
        }
    } catch (e) {
        res.redirect(`${req.baseUrl}${req.path}/../`);
    }
});

export let main = async () => {
    app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
    .on("error", (e) => console.error(e));
};

main();