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
    id: "uderRandomID", 
    email: "user@example.com", 
    password: "password123",
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "password456"
  }

}

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
  };
  res.render("urls_new", templateVars);
});

// Endpoint for GET /register returns register template
app.get("/register", (req, res) => {
  res.render("register");
});


app.get("/urls/:id", (req, res) => { // renders page with urls_show
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; // gets
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`); //output in browser
});

app.post("/login", (req, res) => {
  let username = req.body.username; // gets username from client's input
  //add error handling case with login with empty username
  if (!username || username.trim() === "") {
    res.status(400).send(`
                <h1> The username is not valid </h1>
                <a href="/urls"> Go back to the main page</a>
            `);
  }
  res.cookie("username", username, { maxAge: 900000, httpOnly: true }); //sets cookie
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  // const email = req.body.email;
  // if (email in listOfUsers) { // if(listOfUsers[email])
  //   return res.status(400).send(`<h1> This email already exists, try a different one </h1>
  //   <a href="/register"> Go back to registration form </a>`);
  // };
 // add new user obj to users{}
 // to generate Id use generateRundomString()
 // set user_id cookie with generated ID
  listOfUsers[user = generateRandomString()] = {
    id: user,
    email: req.body.email,
    password: req.body.password
  }
  // add user ID to cookies
  res.cookie('user_id', user);
  
  console.log(listOfUsers);
 // console.log user object to check 
 // redirect to /urls
  res.redirect("/urls",);
})

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
