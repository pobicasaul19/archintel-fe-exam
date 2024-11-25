const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let db = require("./db.json"); 

// Get all articles
app.get("/articles", (req, res) => {
  res.json(db.articles);
});

// Create an article
app.post("/articles", (req, res) => {
  const newArticle = { id: Date.now(), ...req.body };
  db.articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Update an article
app.put("/articles/:id", (req, res) => {
  const { id } = req.params;
  const index = db.articles.findIndex((article) => article.id == id);
  if (index !== -1) {
    db.articles[index] = { ...db.articles[index], ...req.body };
    res.json(db.articles[index]);
  } else {
    res.status(404).send("Article not found");
  }
});

// Delete an article
app.delete("/articles/:id", (req, res) => {
  db.articles = db.articles.filter((article) => article.id != req.params.id);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Mockup server running on http://localhost:3000");
});
