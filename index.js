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
const cookie = require("cookie");
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

//user database
let userDB = fs.readFileSync("users.json");
let users = JSON.parse(userDB).users;

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

    runScript("0", "not");

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
    runScript("0", "not");

    //get new tweet
    let data = fs.readFileSync("tweets_parsed.json");
    if(IsJsonString(data)==false) {
      res.send("Hittade ingen tweets med hashtaggen");
      return;
    }

    let tweets = JSON.parse(data);
    //send back tweet to frontend
    if (tweets.tweets.length < 1) {
      res.send("Hittade ingen tweets med hashtaggen");
    } else {
      //random tweet in tweetlist
      res.send(tweets.tweets[Math.floor(Math.random() * tweets.tweets.length)].text);
      //res.send(tweets.tweets[0].text);
    }
  }
});
/**
 * @requires timeline_parsed_tweets
 * Returns a tweet in the response
 */
app.get("/api/getTweet", authMiddleware, function (req, res) {
  //check the cookie, who?
  let cookies = cookie.parse(req.headers.cookie);
  let phrasePointer = cookies.phrasePointer;
  if(!phrasePointer) {
    phrasePointer=0;
  }
  var user = req.user;
  
  //read tweets from file
  let data = fs.readFileSync("timeline_parsed_tweets.json");
  let timeline_tweets = JSON.parse(data);
  if (timeline_tweets.tweets.length < 1) {
    //try to update twittertimeline
    runScript(user.id, "follow");
    //reset pointer
    phrasePointer = 0;
    data = fs.readFileSync("timeline_parsed_tweets.json");
    timeline_tweets = JSON.parse(data);
      if (timeline_tweets.tweets.length < 1) {
        res.status(403).send("Cannot find any tweets");
          return;
      }
      else {
        if(timeline_tweets.tweets[0][user.username].length < 0) {
          res.status(403).send("Cannot find any tweets for the following accounts: " + user.follows);
          return;
        }
      }
      
  }
  if(timeline_tweets.tweets[0][user.username].length < phrasePointer) {
    phrasePointer=0;
  }

  //get a tweet, pointer
  let tweet = timeline_tweets.tweets[0][user.username][phrasePointer].text;
  //update pointer for the specific user
  if (
    phrasePointer++ >=
    timeline_tweets.tweets[0][user.username].length - 1
    ) {
      //if all tweets have been read. Update tweettimeline for the user (run script)
      runScript(user.id, "follow");
      //set pointer to zero
      phrasePointer = 0;
      }
  //send back the tweet
  res.setHeader('Set-Cookie', 'phrasePointer=' + phrasePointer);
  res.status(200).send(tweet);
});

/**
 * Takes text as parameter in the request
 * Returns a phrase as answer to the request
 */
app.get("/api/speech", function(req, res) {

  if(!req.query.text) {
    res.status(422).send("Error");
    return;
  }
  var text = req.query.text;
  var randomNumber;
  var answears;
  if(checkIfquestion(text)){
		//var str = text;
		if(text.toLowerCase().includes("hur mår")){
			answears = jsonQuery('Phrases[*type = AnswearWell].phrase',{
				data:moods
			}).value
			randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
      res.send(answears[randomNumber]);
      return;
		}
		if(text.toLowerCase().includes("hur lång")){
			answears = jsonQuery('Phrases[*type = AnswearTall].phrase',{
				data:moods
			}).value
			randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
      res.send(answears[randomNumber]);
      return;
		}
		if(text.toLowerCase().includes("vart kommer")){
			answears = jsonQuery('Phrases[*type = AnswearFrom].phrase',{
				data:moods
			}).value
			randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
      res.send(answears[randomNumber]);
      return;
		}
		if(text.toLowerCase().includes("vad är du")){
			answears = jsonQuery('Phrases[*type = AnswearIs].phrase',{
				data:moods
			}).value
			randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
      res.send(answears[randomNumber]);
      return;
		}

	}
	
	if(text.toLowerCase().includes("hej") || text.toLowerCase().includes("hallå") || text.toLowerCase().includes("goddag")){
		answears = jsonQuery('Phrases[*type = Greeting].phrase',{
			data:moods
		}).value
		randomNumber = Math.floor(Math.random() * answears.length);
		console.log(answears[randomNumber]);
    res.send(answears[randomNumber]);
    return;
  }
  
	if(text.toLowerCase().includes("info")){
		answears = jsonQuery('Phrases[*type = info].phrase',{
			data:moods
		}).value
		randomNumber = Math.floor(Math.random() * answears.length);
		console.log(answears[randomNumber]);
    res.send(answears[randomNumber]);
    return;
	}
	else{
		answears = jsonQuery('Phrases[*type = Default].phrase',{
			data:moods
    }).value
		randomNumber = Math.floor(Math.random() * answears.length);
    res.send(answears[randomNumber]);
    return;
	}

});

function checkIfquestion(text){
  var str = text;
  if(str.toLowerCase().includes("hur mår") || str.toLowerCase().includes("hur lång") || str.toLowerCase().includes("vart kommer du") || str.toLowerCase().includes("vad är du")){
    return true
  } else {
    return false
  }
}


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
    //console.log(req.session._ctx);
    

  //console.log([user, req.session]);
  res.setHeader('Set-Cookie', 'phrasePointer=0');
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
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicRoot });
});

//Method to run the python code to update the tweet list.
function runScript(id, follow){
    return spawnSync('python', [
      "-u", 
      path.join("", 'twitter_search.py'),
      "--foo", id, follow
    ]);
}

function IsJsonString(string) {
  try {
      JSON.parse(string);
  } catch (error) {
      return false;
  }
  return true;
}
