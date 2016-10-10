
// load packages
var t = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");
var inquirer = require("inquirer");

// prepare api call
var client = new twitter(t.twitterKeys);

// color fun. does it work on windows? no se.
var magenta = "\x1b[35m";
var cyan = "\x1b[36m";
var reset = "\x1b[0m"

// write output to log file
var log_file = fs.WriteStream("./log.txt", {flags: "a"});
var log_stdout = process.stdout;

console.log = function(d) {
	log_file.write(util.format(d)+"\n");
	log_stdout.write(util.format(d)+"\n");
}
// conditional function
function choose(choice, option) {
	// conditionals for user commands
	switch(choice) {
		case "Show someone's tweets.":
			inquirer.prompt([{
				type: "input",
				name: "screenName",
				message: "Who's tweets would you like to see (twitter handle)?"
			}]).then(function(user) {
				tweetIt(user.screenName);
			});
			break;
		case "Spotify a song.":
			inquirer.prompt([{
				type: "confirm",
				name: "ask",
				message: "Have a song in mind?"
			}]).then(function(user) {
				user.ask ?
					inquirer.prompt([{
						type: "input",
						name: "song",
						message: "What song?"
					}]).then(function(user) {
						spotifyIt(user.song);
					}):
					aceofbase();
			});
			break;
		case "IMDB a movie.":
			inquirer.prompt([{
				type: "confirm",
				name: "ask",
				message: "Have a movie in mind?"
			}]).then(function(user) {
				user.ask ?
					inquirer.prompt([{
						type: "input",
						name: "movie",
						message: "What movie?"
					}]).then(function(user) {
						movieIt(user.movie);
					}):
					MrNobody();
			});
			break;
		case "Do what it says.":
			doIt();
			break;
		case "tweet-it":
			tweetIt(option);
			break;
		case "spotify-this-song":
			option ? spotifyIt(option):aceofbase();
			break;
		case "movie-this":
			option ? movieIt(option):MrNobody();
			break;
		default:
			console.log("That's not legit.");
	}

}
// api call functions
function tweetIt(screenName) {
	client.get("statuses/user_timeline", {screen_name: screenName, count: 20}, function(error, tweets, response) {
				if(error) console.log("Something went wrong..."), choose("Show someone's tweets.");
				for(var i = 0; i < tweets.length; i++) {
					console.log((i + 1) % 2 == 0 ? magenta: cyan);
					console.log(tweets[i].text);
				}
				console.log(reset);
			});
}
function spotifyIt(title) {
	spotify.search({ type: "track", query: title }, function(err, data) {
		if(err) throw err;
		for(var i = 0; i < data.tracks.items.length; i++) {
			console.log((i + 1) % 2 == 0 ? magenta: cyan);
			var track = data.tracks.items[i];
			if(track.artists.length > 1) {
				console.log("Artists:")
				for(var j = 0; j < track.artists.length; j++) {
					console.log(track.artists[j].name);
				}
			} else {
					console.log("Artist: "+track.artists[0].name);				
			}
			console.log("Album: "+track.album.name);
			console.log("Song: "+track.name);
			console.log("URL: "+track.external_urls.spotify);
			console.log(reset);
		}

	});
}
function aceofbase() {
	spotify.lookup({ type: "track", id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
			console.log(magenta);
			console.log("Artist: "+data.artists[0].name);
			console.log("Album: "+data.album.name);
			console.log("Song: "+data.name);
			console.log("URL: "+data.external_urls.spotify);
			console.log(reset);
	});

}
function movieIt(title) {
	var url = "http://www.omdbapi.com/?s="+title;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var movies = JSON.parse(body);
			for(var i = 0; i < movies.Search.length; i++){
				var url = "http://www.omdbapi.com/?tomatoes=true&i="+movies.Search[i].imdbID;
				request(url, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					var movies = JSON.parse(body);
					console.log((i + 1) % 2 == 0 ? magenta: cyan);
					console.log("Title: "+movies.Title);
					console.log("Release: "+movies.Year);
					console.log("IMDB Rating: "+movies.imdbRating);
					console.log("Country: "+movies.Country);
					console.log("Language: "+movies.Language);
					console.log("Plot: "+movies.Plot);
					console.log("Actors"+movies.Actors);
					console.log("Rotten Tomatoes Rating: "+movies.tomatoRating);
					console.log("Rotten Tomatoes: "+movies.tomatoURL);
				    console.log(reset);
				  }
				})

			}
			console.log(reset);
		}
	});
}
function MrNobody() {
	var url = "http://www.omdbapi.com/?i=tt0485947";
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var movies = JSON.parse(body);
		console.log(magenta);
		console.log("Title: "+movies.Title);
		console.log("Release: "+movies.Year);
		console.log("IMDB Rating: "+movies.imdbRating);
		console.log("Country: "+movies.Country);
		console.log("Language: "+movies.Language);
		console.log("Plot: "+movies.Plot);
		console.log("Actors"+movies.Actors);
		console.log("Rotten Tomatoes Rating: "+movies.tomatoRating);
		console.log("Rotten Tomatoes: "+movies.tomatoURL);
	    console.log(reset);
	  }
	})

}
function doIt() {
	fs.readFile("./random.txt", "utf8", (err, data) => {
		if (err) throw err;
		var random = data.split("\n");
		for(var i = 0; i < random.length; i++) {
			var randomLine = random[i].split(",");
			randomLine.length == 2 ?
			choose(randomLine[0], randomLine[1].split("'")[1]):
			choose(randomLine[0]);
		}
	});
}
// Prompt user to choose commands
inquirer.prompt([{
	type: "list",
	name: "choice",
	message: "What would you like to do?",
	choices: ["Show someone's tweets.", "Spotify a song.", "IMDB a movie.", "Do what it says."]
}]).then(function(user) {
	choose(user.choice);
});
