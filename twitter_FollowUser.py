import os
import threading, time
import json
from twython import Twython
import re

def twitter_search():
    #Loads the Auth json file VERY crucial.
    with open("twitter_Auth.json") as auth:
        data = json.load(auth)
        followUser(data)

def followUser(creds):
    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])
    with open("twitter_timeline.json", "r") as file:
        timeline = json.load(file)
    with open("timeline_parsed_tweets.json", "w") as write:
        output = {}
        output['tweets'] = []
        for status in python_tweets.get_user_timeline(**timeline):
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
        lastElement = len(data["Phrase"])
        #print(String)
        forbiddenTweet = False
        while True:
            if lastElement == i:
                break
            for word in String:
                if word == (data["Phrase"][i]["text"]):
                    forbiddenTweet = True
            i += 1
    return forbiddenTweet

#Run section
twitter_search()