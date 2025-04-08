const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080

// database
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca", 
    userID: "aJ48lW",
  },
  "9sm5xK": {
    longURL: "http://www.google.com", 
    userID: "aJ48W"
  },
};

const listOfUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 10),
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("password345", 10)
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

const urlsForUser = function(id) { // create a new obj with matching userID
  const userURLs = {};
  for (const urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === id) {
      userURLs[urlID] = urlDatabase[urlID];
    }
  }
  return userURLs;
}


// Setting view engine
app.set("view engine", "ejs");

// Midlleware
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Endpoints:
app.get("/", (req, res) => res.send("Hello!"));
app.get("/hello", (req, res) => res.send("<html><body>Hello <b>World</b></body></html>\n")); // curl - will return etire HTML response string
app.get("/urls.json", (req, res) => res.json(urlDatabase)) // returns as json string


app.get("/urls", (req, res) => {
  const user = listOfUsers[req.cookies["user_id"]];
  if(!user) {
    res.status(403).send(`
      <h1>You cannot see URLs if you are not logged in or registered</h1>
      <a href="/login"> Go back to login page</a><br>
      <a href="/register"> Go  to registration page</a>`
    );
  };
  const templateVars = {
    urls: urlsForUser(user.id),
    user: user // passing user_id object to urls_index
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => { // page where to create new tinyurl
  const user = listOfUsers[req.cookies["user_id"]];
  // if user is not logged in
  if (!user) {
    res.redirect("/login");
  }
  const templateVars = { user };
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
  const id = req.params.id;
  const user = listOfUsers[req.cookies["user_id"]];

  // checks if user exists
  if (!user) {
    return res.status(403).send(`
      <h1>403 - Access Denied</h1>
      <p>You must be logged in to view this URL.</p>
      <a href="/login">Go to Login</a>
      `)
  }

  // checks if URL exists
  if(!urlDatabase[id]) { 
    return res.status(404).send(`
      <h1>404 - URL Not Found</h1>
      <p>The short URL <strong>${id}</strong> does not exist.</p>
      <a href="/urls">Go back to My URLs</a>
      `)
  }
  // checks if user have the URL
  if (urlDatabase[id].userID !== user.id) {

    return res.status(403).send(`
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this URL.</p>
      <a href="/urls">Go back to My URLs</a>`)
  }

  const templateVars = {
    id: id,
    longURL: urlDatabase[id].longURL,
    user: user
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const user = listOfUsers[req.cookies["user_id"]];
  if (!user) {
    return res.status(403).send(`
      <h1>You cannot shorten URLs if you are not logged in</h1>
      <a href="/login"> Go back to login page</a>`
    );
  }    
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: longURL,
    userID: user.id
  };
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email);
  console.log(user.password); // check for hashed password
  console.log(password)

  if (email.trim() === "" || password.trim() === "") {
    return res.status(400).send(`
      <h1>Email or password field cannot be empty</h1>
      <a href="/login"> Go back to login page</a>`);
  }
  if (!user || !bcrypt.compareSync(password, user.password)) { //checks if email exists and use bcryptcompares passwords
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
  const hashPassword = bcrypt.hashSync(password, 10); // hash the password
  listOfUsers[userID] = {
    id: userID,
    email: req.body.email,
    password: hashPassword 
  };
  console.log("New user:", listOfUsers[userID]); // checks if password no longer stored in plain-text
  
 
  res.cookie('user_id', userID);
  res.redirect("/urls");
});


app.post("/urls/:id", (req, res) => { //after updating URL redirect to /urls
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.status(400).send("URL not found");
  }
  //
  urlDatabase[id].longURL = req.body.longURL;
  res.redirect('/urls');
});

app.get(`/u/:id`, (req, res) => { //redirects to the longURL after using short URL
  const id = req.params.id; // doesn't handle if id is ""
  if (!(id in urlDatabase)) {
    return res.status(404).send(`
      <h1>404 - URL Not Found</h1>
      <p>The short URL <strong>${id}</strong> does not exist.</p>
      <a href="/urls">Go back to My URLs</a>
    `);
  }
  res.redirect(urlDatabase[id].longURL);
});

app.post("/urls/:id/delete", (req, res) => { //after deleting url redirects to /urls
  const user = listOfUsers[req.cookies["user_id"]];

  if (user) {
    delete urlDatabase[req.params.id]; 
  }
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
