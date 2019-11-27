const fs = require('fs');
var jsonQuery = require('json-query')


var data

//Reads the data in the json file (phrases)
function readData(){
let rawdata = fs.readFileSync('data.json');
data = JSON.parse(rawdata);
console.log(data)
}

/*Filters the data based on mood and chooses a random phrase
from it
*/git 
function filterdata(mood){
	let result = jsonQuery('Phrases[*mood=' + mood + '].phrase',{
		data:data
	}).value
	console.log(result)
	var randomNumber = Math.floor(Math.random() * result.length);
	console.log(result[randomNumber]);
	return result[randomNumber];
	}

readData();
filterdata(3);





