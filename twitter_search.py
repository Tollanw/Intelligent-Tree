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

def push_tweets_to_rasberry():
    command = "curl -d @parsed_tweets.json --header 'Content-type:application/json' -X POST http://<IP_ADDRESS:PORT>/tweets>" 
#   os.system(command)
    print(command)

def get_tweets(creds):
    # Load the query for a search from json file
    with open("twitter_search.json", "r") as file:
        search = json.load(file)
    # Instantiate an object of twython which handels Oauth tokens
    python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])
    
    with open("tweets_parsed.json", "w") as file:
        output = {}
        output['tweets'] = []
        for status in python_tweets.search(**search)['statuses']:
            output['tweets'].append({
                'user' : status['user']['screen_name'],
                'date' : status['created_at'],
                'text' : status['full_text']
            })
        print(output)
        json.dump(output,file)
    #with open("tweets_parsed.json", "r") as file:
        #data = json.load(file)
        #print(data["tweets"][0]["user"])
        #print(data["tweets"][0]["text"])

def twitter_search():
    #print (time.ctime())
    
    #WAIT_TIME_SECONDS = 1 # every one hour
    #ticker = threading.Event()
    with open("twitter_Auth.json") as auth:
        data = json.load(auth)
        get_tweets(data)
        #push_tweets_to_rasberry()

    
    #while not ticker.wait(WAIT_TIME_SECONDS):
    #    twitter_search()


#if __name__ == "__main__":
#    try:
#        twitter_search()
#    except KeyboardInterrupt:
#        print ("Terminate twitter_search")
#    except Exception as e:
#        print (e)
twitter_search()