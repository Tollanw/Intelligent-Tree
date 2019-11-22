const fetch = require("node-fetch");
var http = require("http");
const fs = require('fs');

var data
var jsonQuery = require('json-query')

function readData(){
let rawdata = fs.readFileSync('data.json');
data = JSON.parse(rawdata);
console.log(data)
}

function filterdata(mood){
let result = jsonQuery('Phrases[*mood=' + mood + '].phrase',{
	data:data
}).value
console.log(result)
return result;
}

readData();
filterdata(3);





