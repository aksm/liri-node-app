// allow block-scope definitions
"use strict";

// load packages
var t = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");

// prepare api call
var client = new twitter(t.twitterKeys);

// color fun. does it work on windows? no se.
var magenta = "\x1b[35m";
var cyan = "\x1b[36m";
var reset = "\x1b[0m"

// user arguments
var command = process.argv[2];
var title = process.argv[3];

var log_file = fs.WriteStream("./log.txt", {flags: "a"});
var log_stdout = process.stdout;

console.log = function(d) {
	log_file.write(util.format(d)+"\n");
	log_stdout.write(util.format(d)+"\n");
}

// api call functions
function tweetIt() {
	client.get("statuses/user_timeline", {screen_name: "aksm", count: 20}, function(error, tweets, response) {
				if(error) throw error;
				for(var i = 0; i < tweets.length; i++) {
					console.log((i + 1) % 2 == 0 ? magenta: cyan);
					console.log(tweets[i].text);
				}
				console.log(reset);
			});
}
function spotifyIt() {
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
function movieIt() {
	var url = "http://www.omdbapi.com/?s="+title;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var movies = JSON.parse(body);
			for(var i = 0; i < movies.Search.length; i++){
				console.log(i);
				var url = "http://www.omdbapi.com/?tomatoes=true&i="+movies.Search[i].imdbID;
				request(url, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
					var movies = JSON.parse(body);
					console.log(i);
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
		exec("node liri.js "+data, function(error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
		});
	});
}

// conditionals
// var run = ({
		// "my-tweets": tweetme(),
		// "spotify-this-song": spotifyme(),
		// "movie-this": movieme(),
		// "do-what-it-says": doItforme()
		// "my-tweets": console.log(command, "this"),
		// "spotify-this-song": console.log(command, "that"),
		// "movie-this": console.log("the other thing"),
		// "do-what-it-says": console.log("finally")
// }[command] || console.log("That's not legit."));

switch(command) {
	case "my-tweets":
		tweetIt();
		break;
	case "spotify-this-song":
		title ? spotifyIt() : aceofbase();
		break;
	case "movie-this":
		title ? movieIt() : MrNobody();
		break;
	case "do-what-it-says":
		doIt();
		break;
	default:
		console.log("That's not legit.");
}
