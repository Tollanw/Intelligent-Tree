const fs = require('fs')
var jsonQuery = require('json-query')

/*class readData{

	constructor(){
		this.data;
	}*/
	//var data

	//Reads the data in the json file (phrases)
	function readFile(){
	let rawdata = fs.readFileSync('data.json');
	data = JSON.parse(rawdata);
	//console.log(data)
	}

	/*Filters the data based on mood and chooses a random phrase
	from it
	*/
	function filterData(mood, text){

	if(text == null){
		let result = jsonQuery('Phrases[* mood=' + mood + ' & type=generall].phrase',{
			data:data
		}).value
		var randomNumber = Math.floor(Math.random() * result.length);
		console.log(result[randomNumber]);
		return result[randomNumber];
		}

	if(checkIfquestion(text)){
		var str = text;
		if(str.includes("hur mår")){
			var answears = jsonQuery('Phrases[*type = AnswearWell].phrase',{
				data:data
			}).value
			var randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
			return answears[randomNumber];
		}
		if(str.includes("hur lång")){
			var answears = jsonQuery('Phrases[*type = AnswearTall].phrase',{
				data:data
			}).value
			var randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
			return answears[randomNumber];
		}
		if(str.includes("vart kommer")){
			var answears = jsonQuery('Phrases[*type = AnswearFrom].phrase',{
				data:data
			}).value
			var randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
			return answears[randomNumber];
		}
		if(str.includes("vad är du")){
			var answears = jsonQuery('Phrases[*type = AnswearIs].phrase',{
				data:data
			}).value
			var randomNumber = Math.floor(Math.random() * answears.length);
			console.log(answears[randomNumber]);
			return answears[randomNumber];
		}

	}
	
	if(text.includes("hej") || text.includes("hallå") || text.includes("goddag")){
		var answears = jsonQuery('Phrases[*type = Greeting].phrase',{
			data:data
		}).value
		var randomNumber = Math.floor(Math.random() * answears.length);
		console.log(answears[randomNumber]);
		return answears[randomNumber];
	}

	if(text.includes("info")){
		var answears = jsonQuery('Phrases[*type = info].phrase',{
			data:data
		}).value
		var randomNumber = Math.floor(Math.random() * answears.length);
		console.log(answears[randomNumber]);
		return answears[randomNumber];
	}
	else{
		var answears = jsonQuery('Phrases[*type = default].phrase',{
			data:data
		}).value
		var randomNumber = Math.floor(Math.random() * answeras.length);
		return answears[randomNumber];


	}
}

	function checkIfquestion(text){
		var str = text;
		if(str.includes("hur mår") || str.includes("hur lång") || str.includes("vart kommer du") || str.includes("Vad är du")){
			return true
		} else {
			return false
		}
	}

	readFile();
	var checktext = "hur mår du";
	filterData(1,checktext);
//}






