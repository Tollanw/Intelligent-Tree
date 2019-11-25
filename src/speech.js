import greeting from '../tweets_parsed.json'

export default class TextToSpeech {
	
	constructor() {
		//options used for the speech synthesis
		this.options = {
			rate: 1,
			pitch: 1,
			voice: ''
		}
		this.available_voices = false
		this.voice = false
		this.recognition
		this.getVoices()
		this.initregnition()
	}
	//Init the recognition software
	//Maybe we should add grammar for the recognition, change some weight-values regarding trees etc.?
	initregnition = () => {
		this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition 
			|| window.mozSpeechRecognition || window.msSpeechRecognition)()
		//maxAlternatives=3 gives 3 different alternatives when the onresult is called by recognition
		this.recognition.maxAlternatives = 3
		this.recognition.continuous = true;
	}

	//get all the available voices
	getVoices = () => {
		this.available_voices = window.speechSynthesis.getVoices()
		console.log(this.available_voices)
		let findVoice = this.findVoice
		if(this.available_voices.length == 0) {
			window.speechSynthesis.addEventListener('voiceschanged', function() {
				findVoice()
			});
		}
		else {
			findVoice()
		}
	}
	//find a voice
	findVoice = () => {
		//choose swedish if possible
		let sve = this.available_voices.find(v => v.lang === 'sv-SE')
		if (sve !== undefined) this.options.voice = sve
		else this.options.voice = this.available_voices[0]
	}

	//speak
	//The text-parameter is the spoken input
	speak = (text) => {
		let options = this.options
		return new Promise((resolve, reject) => {
			try {
				let utter = new SpeechSynthesisUtterance();
				Object.assign(utter, options)
				utter.text = text
				utter.onend = function() {
					resolve(utter)
				}
				window.speechSynthesis.speak(utter)
			} catch (error) {
				reject(false)	
			}
		})
	}
	listen = () => {
		
		this.recognition.start();
		console.log("Recording started");

		//start the recognition
		

		//is called if a error occur
		this.recognition.onerror = function() {
			console.log("Error! Something went wrong.");
		}
		//is called when recognition starts
		this.recognition.onstart = function() {
			console.log("Recognition activated. Start talking.");

		}
		//is called when the speech ends
		this.recognition.onend = function() {
			console.log("No voice. Recognition has stopped.");
		}

		var talk = (text) => {
			return this.speak(text);
		}
		
		var getAllJSONObjectsWithId = (jsonArray,id,equalId) => {
			var array=[];
			if(equalId==null || id==null || jsonArray==null) {
				console.log("Wrong input, parameter missing");
				console.log("Returning jsonarray "+ jsonArray);
				return jsonArray;
			}
			for(var i=0; i<jsonArray.length; i++) {
				var current=jsonArray[i];
				if(current.id === equalId) {
					array.push(current);
				}
			}
			if(array.length<1) {
				console.log("No object with the 'id:' "+ id + " matching with the 'equalid': " + equalId);
			}
			return array;
		}

		//is called when recognition has a result..
		this.recognition.onresult = function(event) {
			console.log(event);
			var a = getAllJSONObjectsWithId(greeting.greetings,'id',2);
			console.log(a);
			
			//event.results[0][0].transcript gets the spoken data as text
			var transcript = event.results[0][0].transcript;
			console.log(event.results[0]);
			//writes to the span with id=message
			document.getElementById("message").innerHTML = transcript;  
			if (transcript.toLowerCase().includes('hej') || transcript.toLowerCase().includes('tjena')) {
				talk("Tjena kompis");
				//var greetings = greeting.greetings[Math.floor(Math.random() * greeting.greetings.length)].text;
				//talk(greetings);
			}
			else if (transcript.toLowerCase().includes('mamma')) {
				talk("Visste du att min mamma har sagt att jag kommer bli längre än ett hus en dag.");
			}
			else if (transcript.toLowerCase()==='hur lång är du') {
				talk("Jag vet inte, men jag tror jag är över 30 meter.");
			}
			else if (transcript.toLowerCase().includes('träd') || transcript.toLowerCase().includes('cool')) {
				talk("Jag är ett så himla coolt träd.");
			}
			else {
				talk("Jag förstår inte vad du menar med " + transcript);
			}
			
		}
	}
	//stop the recognition manually
	stopSpeechRecognition = () => {
		this.recognition.stop();
		console.log("Recognition has stopped by user");
	}
}