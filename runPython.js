var express = require('express'); 
var app = express(); 
var spawn = require("child_process").spawn; 
var process = spawn('python',["twitter_search.py"]); 
