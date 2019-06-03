import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as exphbs from "express-handlebars";

let app = express();

app.set("view engine", "hbs");
app.set("views", "server/views");
app.engine("hbs", exphbs({
    defaultLayout: "default",
    extname: "hbs",
}));

app.use(express.static("dist/"));

app.get("/", (req, res) => {
    res.render("index", {
        title: "Austin's Notes",
        sectionHdr: "index-hdr",
    });
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

export let main = async () => {
    app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
    .on("error", (e) => console.error(e));
};

main();