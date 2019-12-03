# Example command to create a bearer token
#curl -u 'Qc7FPoOal87vrSm4N8hjYFpLZ:fxQ5oaUfNGZdhpp8tRxERiR257qznVpazaL27zhUeCy6Pt9KAd' --data 'grant_type=client_credentials' 'https://api.twitter.com/oauth2/token'
# Example command to search something
#curl -X GET -H "Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAJ2T%2FQAAAAAAsQS3ozEw%2Bqm41wMbiMLPY%2BZEHis%3D6xqM71JUhCn8qy26bh1d9QFXfTIkyJ4jMCs9tmSUaLsS2k9I7t" 'https://api.twitter.com/1.1/search/tweets.json??q=%23<TAG>&result_type=recent
# Example command to push tweet to rasberry
#curl -d @parsed_tweets.json --header "Content-type:application/json" -X POST <IP:port/tweets>

import os
import threading, time
import json
from twython import Twython
import re

def push_tweets_to_rasberry():
    command = "curl -d @parsed_tweets.json --header 'Content-type:application/json' -X POST http://<IP_ADDRESS:PORT>/tweets>" 
#   os.system(command)
    print(command)
    
def twitter_search():
    #Loads the Auth json file VERY crucial.
    with open("twitter_Auth.json") as auth:
        data = json.load(auth)
        followUser(data)
        #get_tweets(data)

def get_tweets(creds):
    # Load the query for a search from json file
    with open("twitter_search.json", "r") as file:
        search = json.load(file)
    # Instantiate an object of twython which handels Oauth tokens
    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])
    
    with open("tweets_parsed.json", "w") as file:
        output = {}
        output['tweets'] = []
        #Starts the search and iterate over the tweets and saves one.
        for status in python_tweets.search(**search)['statuses']:
            if not forbiddenTweet(status["full_text"]):
                output['tweets'].append({
                    'user' : status['user']['screen_name'],
                    'date' : status['created_at'],
                    'text' : filterString(status["full_text"])
                })
        json.dump(output,file)

def followUser(creds):
    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])
    with open("twitter_timeline.json", "r") as file:
        timeline = json.load(file)
    with open("timeline_parsed_tweets.json", "w") as write:
        output = {}
        output['tweets'] = []
        for status in python_tweets.get_user_timeline(**timeline):
            #print(status["full_text"])
            if not forbiddenTweet(status["full_text"]):
                output['tweets'].append({
                    'user' : status['user']['screen_name'],
                    'date' : status['created_at'],
                    'text' : filterString(status["full_text"])
                })
        json.dump(output, write)

#Filter Section of code            
def filterString(text):
    #Replaces the links and symbols to a more suitable string.
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"url\S+", "", text)
    text = re.sub(r"@", "at ", text)
    text = re.sub(r"#", "hashtag ", text)
    return text

def forbiddenTweet(text):
    with open("DummyFile.json", "r") as filterFile:
        data = json.load(filterFile)
        i = 0
        String = filterString(text.lower()).split(" ")
        #String = re.sub(r"\n", " ", String)
        lastElement = len(data["Phrase"])
        #print(String)
        forbiddenTweet = False
        while True:
            if lastElement == i:
                break
            for word in String:
                if word == (data["Phrase"][i]["text"]):
                    forbiddenTweet = True
                    print("FLAG")
            i += 1
    return forbiddenTweet

#Run section
twitter_search()
