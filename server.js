const fs = require('fs');
var jsonQuery = require('json-query')

class readData{

	constructor(){
		this.data;
	}
	//var data

	//Reads the data in the json file (phrases)
	readFile(){
	let rawdata = fs.readFileSync('data.json');
	data = JSON.parse(rawdata);
	console.log(data)
	}

	/*Filters the data based on mood and chooses a random phrase
	from it
	*/
	filterData(mood){
	let result = jsonQuery('Phrases[*mood=' + mood + '].phrase',{
		data:data
	}).value
	console.log(result)
	var randomNumber = Math.floor(Math.random() * result.length);
	console.log(result[randomNumber]);
	return result[randomNumber];
	}
}






