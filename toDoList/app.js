const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/views/date.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let toDoList = [];

app.listen(3000, function () {
  console.log("listening at port 3000");
});

app.get("/", function (req, res) {
  let day = date.getDay();

  res.render("list", {
    todaysDay: day,
    toDoList: toDoList,
  });
});

app.post("/", function (req, res) {
  let todo = req.body.todo;
  toDoList.push(todo);

  res.redirect("/");
});

app.post("/del", function (req, res) {
  let i = Number(Object.keys(req.body)[0]);

  toDoList.splice(i, 1);
  res.redirect("/");
});
