import os
import json
import re
def parser():
    with open('tweets.json') as json_file:
        data = json.load(json_file)
        output = {}
        output['tweets'] = []
        for t in data['statuses']:
            cleanString = re.sub('\W+',' ', t['text'] )
             
            output['tweets'].append({ 
                'id': str(t['id']),
                'text': cleanString})

        with open('tweets_parsed.json', 'w+') as outfile:
            json.dump(output, outfile)

