README_requests
--------------------------------------

### Request: /api/login
```
A post request for login.
Need to be called by creating a session before using the other requests.
A session last for 24 hours.  
Takes two parameters:
- email (email-address)
- password (the password)

Example: http://localhost:8080/api/login?email=user@email.com&password=password
```


### Request: /api/setTwitterInfo (deprecated)
```
Used for the setting the twitter_search.json. 
You need to be logged in to use this request. 
Takes two parameters in body:
- filter (should be recent or popular)
- keyword (represent a hashtag or a word)
Returns the new list with parsed tweets. 

Example: http://localhost:8080/api/setTwitterInfo?filter=recent&keyword=#ericsson
```

### Request: /api/twitterdata (deprecated)
```
Returns a the list with all the parsed tweets. 
You need to be logged in to use this request. 
Two update the list setTwitterInfo needs to be called first. 

Example: http://localhost:8080/api/twitterdata
```

### Request: /api/getMood
```
Returns a string that represent the current mode. 
You need to be logged in to use this request. 
Takes one parameter in body:
- mood (can be either 1 (happy) or 2 (sad)

Example: http://localhost:8080/api/getMood?mood=1
```


### Request: /api/getTweetWithTag
```
Returns a tweet (string) that contains a specific word or hashtag. 
You need to be logged in to use this request. 
To use this get-request you need privilege 2 or more. 
Takes one parameter in body:
- tag (represent the specific word or hashtag the user is asking for)

Example: http://localhost:8080/api/getTweetWithTag?tag=ericsson
```


### Request: /api/getTweet
```
A get Request. 
You need to be logged in to use this request. 
Returns the next tweet on the tweet-list. 
The return value depends on the logged in user.
User1 follows the following twitter-accounts:
  - "Ericssonsverige", "nyteknik" and "RISEsweden"
User2 follows the following twitter-accounts:
  - "Ericssonsverige" and "dagensindustri"


Example: http://localhost:8080/api/getTweet
```

### Request: /api/speech
```
A get request
Takes text as parameter. Text should be a string.
Returns a valid answer for the input
The returnvalue is a string and can be:
  - A joke
  - Information about the tree
  - Greeting
  - And more
You need to be logged in to use this request. 

Example: http://localhost:8080/api/speech?text=hej hur mår du
```
