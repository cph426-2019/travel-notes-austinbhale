import * as express from "express";
import * as bcrypt from "bcrypt";
import { DB, Rows, InsertResult } from "./db";
import * as cookieParser from "cookie-parser";
import * as moment from "moment";

// Helper function to find path of current page
let path = (req: express.Request): string => {
    return `${req.baseUrl}${req.path}`
};

let router = express.Router();

// Cookie parser will read and write secure cookies that
// are protected by our cookie secret.
router.use(cookieParser(process.env.COOKIE_SECRET));

// Login Form
router.get("/login", (req, res) => {
    res.render("admin/login", {
        layout: "admin",
        message: req.query.message
    });
});

router.post("/login", async (req, res) => {
    let isValid = await bcrypt.compare(req.body.password, process.env.ADMIN_PASSWORD_HASH);
    if (isValid) {
        res.cookie("authenticated", "true", {
            signed: true // By using the signed option, our cookie is secure.
        });
        res.redirect(`${req.baseUrl}`); // Redirect to admin home page.
    } else {
        res.redirect(`${req.baseUrl}/login?message=Password Incorrect`);
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("authenticated");
    res.redirect(`${req.baseUrl}/login`);
});

// Middleware to authenticate the user
router.use((req, res, next) => {
    if (req.signedCookies.authenticated) {
        next();
    } else {
        return res.redirect(`${req.baseUrl}/login`);
    }
});

router.get("/", (req, res) => {
    res.render("admin/index", {
        layout: "admin"
    });
});

// This route is for listing all todos
router.get("/todos", async (req, res) => {
    let [rows] = await DB.query<Rows>("SELECT * FROM todos");
    res.render("admin/todos/index", {
        todos: rows,
        layout: "admin"
    });
});

// This route is for listing all posts
router.get("/posts", async (req, res) => {
    let [rows] = await DB.query<Rows>("SELECT * FROM posts ORDER BY publishAt DESC");
    res.render("admin/posts/index", {
        posts: rows,
        layout: "admin"
    });
});

// We're defining this route above /todos/:id to be sure it
// gets tested by the router logic first.
router.get("/todos/new", (req, res) => {
    res.render("admin/todos/editor", {
        action: `${req.baseUrl}/todos`,
        layout: "admin",
        todo: {
            description: "",
            url: "",
        },
    });
});

router.get("/posts/new", (req, res) => {
    res.render("admin/posts/editor", {
        action: `${req.baseUrl}/posts`,
        layout: "admin",
        post: {
            title: "",
            body: "",
            publishAt: ""
        },
    });
});

// The route for creating a new todo is just '/todos' because the HTTP
// spec says when you create a new resource, it should be subordinate
// to the URL you posted the data to.
router.post("/todos", async (req, res) => {
    try {
        let sql = `INSERT INTO todos
                    (description, url)
                    VALUES
                    (:description, :url)`;
        let params = {
            description: req.body.description,
            url: req.body.url
        };

        // Don't want to redirect here, it would be better to render again.
        // Can also do it on the client-side for validating form input.
        //
        // if (req.body.description === "") {
        //     res.redirect(`${path(req)}/new?message=Invalid Description`);
        //     return;
        // }

        // Creating a new record in the DB is special because we
        // need to know the id that the DB assigned to our new record.
        let [result] = await DB.execute<InsertResult>(sql, params);
        res.redirect(`${path(req)}/${result.insertId}?message=Saved!`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

// Create a new blog post
router.post("/posts", async (req, res) => {
    try {
        let sql = `INSERT INTO posts
                    (title, body, publishAt)
                    VALUES
                    (:title, :body, :publishAt)`;
        let params = {
            title: req.body.title,
            body: req.body.body,
            publishAt: req.body.publishAt
        };

        let [result] = await DB.execute<InsertResult>(sql, params);
        res.redirect(`${path(req)}/${result.insertId}?message=Saved!`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

// Views the editor of an existing todo
router.get("/todos/:id", async (req, res) => {

    let sql = "SELECT * FROM todos WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try {
        let [rows] = await DB.query<Rows>(sql, params);
        if (rows.length === 1) {
            res.render("admin/todos/editor", {
                todo: rows[0],
                action: path(req),
                layout: "admin",
                message: req.query.message,
            });
        } else {
            res.redirect(`${path(req)}/../`);
        }
    } catch (e) {
        res.redirect(`${path(req)}/../`);
    }
});

// Views the editor of an existing post
router.get("/posts/:id", async (req, res) => {

    let sql = "SELECT * FROM posts WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try {
        let [rows] = await DB.query<Rows>(sql, params);
        rows.map((rows) => rows.publishAt = moment(rows.publishAt).format('YYYY-MM-DDTHH:mm'));
        if (rows.length === 1) {
            res.render("admin/posts/editor", {
                post: rows[0],
                action: path(req),
                layout: "admin",
                message: req.query.message,
            });
        } else {
            res.redirect(`${path(req)}/../`);
        }
    } catch (e) {
        res.redirect(`${path(req)}/../`);
    }
});

// View the editor of an existing todo
router.post("/todos/:id", async (req, res) => {
    try {
        // You can use MySQL Workbench to generate this sql with specific values.
        // Replace specific values with placeholders prefixed by :
        // UPDATE
        let sql = `UPDATE todos     
                   SET description=:description, 
                       url=:url 
                   WHERE id=:id`;
        let params = {
            id: req.params.id,
            description: req.body.description,
            url: req.body.url
        };
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}?message=Saved!`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

// View the editor of an existing post
router.post("/posts/:id", async (req, res) => {
    try {
        let sql = `UPDATE posts     
                   SET title=:title, 
                       body=:body,
                       publishAt=:publishAt
                   WHERE id=:id`;
        let params = {
            id: req.params.id,
            title: req.body.title,
            body: req.body.body,
            publishAt: req.body.publishAt
        };
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}?message=Saved!`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}?message=Error Saving`);
    }
});

// Add delete support
router.post("/todos/:id/delete", async (req, res) => {
    let sql = "DELETE FROM todos WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try {
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}/../../`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}/../`)
    }
});

// Add delete support
router.post("/posts/:id/delete", async (req, res) => {
    let sql = "DELETE FROM posts WHERE id=:id";
    let params = {
        id: req.params.id
    };
    try {
        await DB.execute<Rows>(sql, params);
        res.redirect(`${path(req)}/../../`);
    } catch (e) {
        console.error(e);
        res.redirect(`${path(req)}/../`)
    }
});

export default router;