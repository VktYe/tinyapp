const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

// database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function() {
  const charts = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  let randomString = '';
  
  for (let i = 0; i < stringLength; i++) {
    let rString = Math.floor(Math.random() * charts.length);
    randomString += charts.substring(rString, rString + 1);
  }
  return randomString;
};

// Setting view engine
app.set("view engine", "ejs");

// Midlleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Endpoints:

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); // curl - will return etire HTML response string


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // returns as json string
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"] // passing username to the urls_index
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { // page where to create new tinyurl
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});


app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; // gets
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`); //output in browser
});

app.post("/login", (req, res) => {
  let username = req.body.username; // gets username from client's input
  res.cookie("username", username, { maxAge: 900000, httpOnly: true }); //sets cookie
  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => { // renders page with urls_show
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => { //after updating URL redirect to /urls
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL;
  res.redirect('/urls');
});

app.get(`/u/:id`, (req, res) => { //redirects to the longURL after using short
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => { //after deleting url redirects to /urls
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
