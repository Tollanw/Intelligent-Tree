README_requests
--------------------------------------

### Request: /api/login

A post request for login.
Need to be called by creating a session before using the other requests.
A session last for 24 hours.  
Takes two parameters:
- email (email-address)
- password (the password)



### Request: /api/setTwitterInfo
Used for the setting the twitter_search.json. 
You need to be logged in to use this request. 
Takes two parameters in body:
- filter (should be recent or popular)
- keyword (represent a hashtag or a word)
Returns the new list with parsed tweets. 

Example: http://localhost:8080/api/setTwitterInfo?filter=recent&keyword=#ericsson



### Request: /api/twitterdata
Returns a the list with all the parsed tweets. 
You need to be logged in to use this request. 
Two update the list setTwitterInfo needs to be called first. 

Example: http://localhost:8080/api/twitterdata



### Request: /api/getMood
Returns a string that represent the current mode. 
You need to be logged in to use this request. 
Takes one parameter in body:
- mood (can be either 1 (happy) or 2 (sad)

Example: http://localhost:8080/api/getMood?mood=1



### Request: /api/getTweetWithTag
Returns a tweet (string) that contains a specific word or hashtag. 
You need to be logged in to use this request. 
To use this get-request you need privilege 2 or more. 
Takes one parameter in body:
- tag (represent the specific word or hashtag the user is asking for)

Example: http://localhost:8080/api/getTweetWithTag?tag=ericsson



### Request: /api/getTweet (under development)
A get Request. 
You need to be logged in to use this request. 
Returns the next tweet on the tweet-list. 
The return value depends on the logged in user. 

Example: http://localhost:8080/api/getTweet



### Request: /api/speech (under development)
Returns a valid answer two a information question about the tree. 
You need to be logged in to use this request. 
Can also returns jokes and more….
