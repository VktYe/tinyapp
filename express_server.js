const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

// database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const listOfUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "password123",
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "password456"
  }

};

// helper functions
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

const getUserByEmail = function(email) {
  for (const userId in listOfUsers) {
    const user = listOfUsers[userId];
    if (email === user.email) { // if user.email exists return user
      return user;
    }
  }
  return null;
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
    user: listOfUsers[req.cookies["user_id"]] // passing user_id object to urls_index
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { // page where to create new tinyurl
  const templateVars = {
    user: listOfUsers[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

// Endpoint for GET /register returns register template
app.get("/register", (req, res) => {
  const user = listOfUsers[req.cookies["user_id"]];
  res.render("register", {user});
});

app.get("/login", (req, res) => {
  const user = listOfUsers[req.cookies["user_id"]];
  res.render("login", {user});
});


app.get("/urls/:id", (req, res) => { // renders page with urls_show
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: listOfUsers[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);

  if (email.trim() === "" || password.trim() === "") {
    return res.status(400).send(`
      <h1>Email or password field cannot be empty</h1>
      <a href="/login"> Go back to login page</a>`);
  }
  if (!user || user.password !== password) { //checks if email exists and compares passwords
    return res.status(403).send(`
      <h1>Incorrect email or password</h1>
      <a href="/login"> Go back to login page</a>`);
  }
 
  res.cookie("user_id", user.id, { maxAge: 900000, httpOnly: true }); //sets cookie
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email.trim() === "" || password.trim() === "") {
    return res.status(400).send(`
      <h1>Email or password field cannot be empty</h1>
      <a href="/register"> Go back to registration form </a>`);
  }

  if (getUserByEmail(email)) {
    return res.status(400).send(`
      <h1>This email already exists, try a different one </h1>
      <a href="/register"> Go back to registration form </a>`);
  }

  const userID = generateRandomString();
  listOfUsers[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  
  console.log(listOfUsers); // delete comment
  res.cookie('user_id', userID);
  res.redirect("/urls");
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
