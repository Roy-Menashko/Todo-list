import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "211334248",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",async (req, res) => {
  let result = await db.query("SELECT * FROM items");
  let items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item_id = req.body.updatedItemId;
  const new_title = req.body.updatedItemTitle;
  await db.query("update items set title = $1 where id = $2",[new_title,item_id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const delete_id = req.body.deleteItemId;
  await db.query("delete from items where id = $1",[delete_id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
