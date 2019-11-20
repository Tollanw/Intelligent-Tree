const fetch = require("node-fetch");
var http = require("http");
const fs = require('fs');

/*
var express = require("express");
var app = express();
app.locals.data = require('./data.json');
console.log(app.locals.data);
*/

/*
fs.readFile('./data.json', 'utf8', (err, jsonString) => {
	if(err){
		console.log("File read failed:", err)
		return
	}
	try{
		const customer = JSON.parse(jsonString)
		console.log("Customer adress is: ", customer.address)
	}
	catch(err){
		console.log('Error parsing JSON string: ', err);
	}
})
*/

/*
function jsonReader(filePath, cb){
	fs.readFile(filePath, (err, fileData) => {
		if(err){
			return cb && cb(err)
		}
		try{
			const object = JSON.parse(fileData)
			return cb && cb(null, object)
		}
		catch(err){
			return cb && cb(err)
		}
	})
}

jsonReader('./data.json', (err, data) => {
	if(err){
		console.log(err)
		return
	}
	console.log(data)
})

 */

var data
var jsonQuery = require('json-query')
let rawdata = fs.readFileSync('data.json');
data = JSON.parse(rawdata);console.log(data)
let result = jsonQuery('Phrase[*mood==2].text',{
	data:data
}).value
console.log(result)


function onRequest(request, response){
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write("Suuuup");
	response.end();
}

http.createServer(onRequest).listen(8000);

/*
fetch("./data.json")
	.then(function(resp){
		return resp.json();
	})
	.then(function(data){
		console.log(data);
	});

 */

/*
$.getJSON('data.json', function(data){
	console.log('data', data);
});
 */



