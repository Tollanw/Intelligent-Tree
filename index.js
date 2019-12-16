/** 
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
const { spawnSync } = require("child_process");
const { spawn } = require("child_process");

//user database
let userDB = fs.readFileSync("users.json");
let users = JSON.parse(userDB).users;

/**
 * Pointer for the tweet-reading, each user has a pointer
 */
let userPointers = [];
for (var i = 0; i < users.length; i++) {
  userPointers[i] = { id: users[i].id, name: users[i].username, pointer: 0 };
}
console.log(userPointers);

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

//middleware checks authentication
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};

/**
 * A get request.
 * Returns a json object with all the parsed tweets
 */
app.get("/api/twitterdata", authMiddleware, function(req, res) {
  let data = fs.readFileSync("tweets_parsed.json");
  let tweets = JSON.parse(data);
  res.json(tweets);
});
/**
 * Takes a mood as query-input in the request
 * The mood can be either 1 or 2. 1 means happy, 2 means sad.
 * Returns a string
 * @requires data.json
 */
app.get("/api/getMood", authMiddleware, function(req, res) {
  if (!req.query.mood) {
    //No query tag
    res.status(422).send("Invalid request");
  } else {
    let result = jsonQuery("Phrases[*mood=" + req.query.mood + "].phrase", {
      data: moods
    }).value;
    var randomNumber = Math.floor(Math.random() * result.length);
    res.send(result[randomNumber]);
  }
});
/**
 * Update the twitter_search.json used for sending twitter-requests
 * Takes filter and keyword as parameters in the query request
 * Filter: can be either recent or popular, (string)
 * Keyword: A string
 * Returns a new json-object with all the tweets
 * @requires twitter_search
 * @requires twitter_parsed
 * @requires fs
 */
//update the twitterlist with the input
app.get("/api/setTwitterInfo", authMiddleware, function(req, res) {
  if (!req.query.filter || !req.query.keyword) {
    //No query tag
    res.status(422).send("Invalid request");
  } else {
    var filter = req.query.filter;
    var keyword = req.query.keyword;
    //change the value in the in-memory object

    //update twitter_search
    if (!(filter.length < 2 || keyword < 2)) {
      twitter_search.q = keyword;
      twitter_search.result_type = filter;
      //Serialize as JSON and Write it to a file
      fs.writeFileSync("twitter_search.json", JSON.stringify(twitter_search));
    }

    searchForTweets();

    let data = fs.readFileSync("tweets_parsed.json");
    let tweets = JSON.parse(data);
    res.status(200).json(tweets);
    //Twitter search .json
    //Run script and update twitterlist
    //send back the updated parsed twitter list
  }
});
/**
 * Get tweet with a specific tag/hashtag
 * Takes a tag as parameter in the query request
 * Tag should be a string
 * Response is a tweet with the specific tag
 * @requires twitter_search
 * @requires twitter_parsed
 * @requires fs
 */
app.get("/api/getTweetWithTag", authMiddleware, function (req, res) {
  if (req.session._ctx.user.privilege < 2) {
    res.status(403).send("Not authorized");
    return;
  }
  if (!req.query.tag) {
    //No query tag
      res.status(422).send("Invalid request");
  } else {
    //check the cookie. får personen göra detta?

    //Update twitter_search
    var tag = req.query.tag;
    twitter_search.q = tag;
    fs.writeFileSync("twitter_search.json", JSON.stringify(twitter_search));

    //update parsedtweet list
    searchForTweets();
    //get new tweet
    let data = fs.readFileSync("tweets_parsed.json");
    let tweets = JSON.parse(data);
    //send back tweet to frontend
    if (tweets.tweets.length < 1) {
      res.status(204).send("Hittade ingen tweets med hashtag " + tag);
    } else {
      res.send(tweets.tweets[0].text);
    }
  }
});
/**
 * @todo Id under development
 * @requires timeline_parsed_tweets
 * Returns a tweet in the response
 */
app.get("/api/getTweet", authMiddleware, function(req, res) {
  var reqUserId = req.user.id;
  var indexPointer = null;
  for (var i = 0; i < userPointers.length; i++) {
    if (userPointers[i].id == reqUserId) {
      indexPointer = i;
    }
  }
  if (indexPointer == null) {
    //Request user id don't match userPointers db.
    //TODO - try to update pointers. Get users, see if a new user has been added.
    res.status(403).send("No tweets-pointer found for this user.");
    return;
  }

  //read tweets from file

  let data = fs.readFileSync("timeline_parsed_tweets.json");
  let timeline_tweets = JSON.parse(data);
  if (timeline_tweets.tweets.length<1) {
    //try to update twittertimeline
    updateTwitterTimeLine();
    //reset pointer
    userPointers[indexPointer].pointer = 0;
    //reread the file
    data = fs.readFileSync("timeline_parsed_tweets.json");
    timeline_tweets = JSON.parse(data);
    if(timeline_tweets.tweets.length<1) {
      res.status(403).send("Cannot find any tweets");
      return;
    } 
  }

  //get a tweet, pointer
  let tweet = timeline_tweets.tweets[userPointers[indexPointer].pointer].text;

  //update pointer for the specific user
  if (
    userPointers[indexPointer].pointer++ >=
    timeline_tweets.tweets.length - 1
  ) {
    //if all tweets have been read. Update tweettimeline for the user (run script)
    updateTwitterTimeLine();
    //set pointer to zero
    userPointers[indexPointer].pointer = 0;
  }

  //send back the tweet
  res.status(200).send(tweet);
});

/**
 * Takes text as parameter in the request
 * Returns a phrase as answer to the request
 */
app.get("/api/speech", authMiddleware, function(req, res) {
  if (!req.query.text) {
    //No query tag
    res.status(422).send("Invalid request");
  } else {
    //get text
    var text = req.query.text;

    if (
      text.toLowerCase() === "läs en tweet" ||
      text.toLowerCase() === "läs upp en tweet"
    ) {
      //read tweets from file
      let data = fs.readFileSync("tweets_parsed.json");
      let tweets = JSON.parse(data);
      //send back a tweet
      res.send(tweets.tweets[userPointers[0].pointer].text);
      if (userPointers[0].pointer++ >= tweets.tweets.length - 1) {
        userPointers[0].pointer = 0;
      }
    } else if (
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
  }
});

//Setting up the URL: /api/logout, expires cookie session
app.get("/api/logout", function(req, res) {
  req.logout();
  return res.send();
});

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
function searchForTweets() {
  return spawnSync("python", [
    "-u",
    path.join("", "twitter_search.py"),
    "--foo",
    "some value for foo"
  ]);
}
function updateTwitterTimeLine() {
  return spawnSync("python", [
    "-u",
    path.join("", "twitter_FollowUser.py"),
    "--foo",
    "some value for foo"
  ]);
}
