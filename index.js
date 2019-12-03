/*
Back-end Index Javascript file
here resides the main code of the back-end
from davids code
*/
const express = require("express");
// creating an express instance
const app = express();
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");
//root to application
const publicRoot = "dist"; //change to relative path
app.use(express.static(publicRoot));
// getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;

//for tweets
var fs = require("fs");

//for moods
const jsonQuery = require("json-query");
const moods = require("./data.json");

//for changing twitter_search.json
const twitter_search = require("./twitter_search.json");

//For running python
const path = require("path");
const { spawn } = require("child_process");

//initialize body parser
app.use(bodyParser.json());
//initialize cookie session
app.use(
  cookieSession({
    name: "mysession",
    keys: ["vueauthrandomkey"],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);
//initialize passport system
app.use(passport.initialize());
//initialize passports session management system
app.use(passport.session());

//mock "database" of users
let users = [
  {
    id: 1,
    name: "Jude",
    email: "user@email.com",
    password: "password"
  },
  {
    id: 2,
    name: "Emma",
    email: "emma@email.com",
    password: "password2"
  }
];
//Setting up the URL: /api/login, handles login requests, responds to front-end
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in", info]);
    }

    req.login(user, err => {
      res.send("Logged in");
    });
  })(req, res, next);
});
//get the json data
app.get("/api/twitterdata", function(req, res) {
  const tweets = require("./tweets_parsed.json");
  res.json(tweets);
});
//get a mood-phrase
app.get("/api/getMood", function(req, res) {
  let result = jsonQuery("Phrases[*mood=" + req.query.mood + "].phrase", {
    data: moods
  }).value;
  var randomNumber = Math.floor(Math.random() * result.length);
  res.send(result[randomNumber]);
});
//update the twitterlist with the input
app.get("/api/setTwitterInfo", function(req, res) {
  var filter = req.query.filter;
  var keyword = req.query.keyword;
  console.log("Filter = " + filter);
  console.log("Keyword = " + keyword);
  //change the value in the in-memory object

  //update twitter_search
  if(!(filter.length < 2 || keyword < 2)) {
  twitter_search.q = keyword;
  twitter_search.result_type=filter;
  //Serialize as JSON and Write it to a file
  fs.writeFileSync('twitter_search.json', JSON.stringify(twitter_search));
  }


  const subprocess = runScript();

  res.send("hej");
  //Twitter search .json
  //Run script and update twitterlist
  //send back the updated parsed twitter list
});

app.post("/api/runscript", function(req, res) {
    const subprocess = runScript();

});

//recording parse, send back the result.
app.get("/api/speech", function(req, res) {
  var text = req.query.text;
  console.log(text);

  if (
    text.toLowerCase().includes("hej") ||
    text.toLowerCase().includes("tjena")
  ) {
    res.send("Tjena kompis");
  } else if (text.toLowerCase().includes("mamma")) {
    res.send(
      "Visste du att min mamma har sagt att jag kommer bli längre än ett hus en dag."
    );
  } else if (text.toLowerCase() === "hur lång är du") {
    res.send("Jag vet inte, men jag tror jag är över 30 meter.");
  } else if (
    text.toLowerCase().includes("träd") ||
    text.toLowerCase().includes("cool")
  ) {
    res.send("Jag är ett så himla coolt träd.");
  } else {
    res.send("Jag förstår inte vad du menar med " + text);
  }
});

//Setting up the URL: /api/logout, expires cookie session
app.get("/api/logout", function(req, res) {
  req.logout();
  return res.send();
});

//middleware checks authentication
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};
/*Setting up the URL: /api/user, sends user data to the front-end,
middleware makes sure that the session is valid
*/
app.get("/api/user", authMiddleware, (req, res) => {
  let user = users.find(user => {
    return user.id === req.session.passport.user;
  });

  console.log([user, req.session]);

  res.send({ user: user });
});
//specifying how passport.js will log us in, triggered by passport.authenticate called by login
passport.use(
  new LocalStrategy(
    //specifying expected fields
    {
      usernameField: "email",
      passwordField: "password"
    },
    //query user data
    (username, password, done) => {
      let user = users.find(user => {
        return user.email === username && user.password === password;
      });
      //if valid the user data is stored in the session
      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect username or password" });
      }
    }
  )
);
//tell passport.js how to HANDLE a given user object, (only stores id in cookie)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
//tell passport.js how to fetch a given user object from the cookie table (on request)
passport.deserializeUser((id, done) => {
  let user = users.find(user => {
    return user.id === id;
  });

  done(null, user);
});
//boot the node.js server on port 3000
app.listen(8080, () => {
  console.log("Example app listening on port 8080");
});
// add route to the root of our application
app.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: publicRoot });
});
function runScript() {
  console.log("run script");
  return spawn("python", [
    "-u",
    path.join("", "twitter_search.py"),
    "--foo",
    "some value for foo"
  ]);
}
