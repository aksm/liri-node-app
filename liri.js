// allow block-scope definitions
"use strict";

// load packages
var t = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");

// prepare api call
var client = new twitter(t.twitterKeys);

// color fun. does it work on windows? no se.
var magenta = "\x1b[35m";
var cyan = "\x1b[36m";
var reset = "\x1b[0m"

// user arguments
var command = process.argv[2];
var title = process.argv[3];

// api call functions
function tweetIt() {
	client.get("statuses/user_timeline", {screen_name: "aksm", count: 20}, function(error, tweets, response) {
				if(error) throw error;
				for(var i = 0; i < tweets.length; i++) {
					console.log((i + 1) % 2 == 0 ? magenta: cyan);
					console.log(tweets[i].text+"\n");
				}
				console.log(reset);
			});
}
function aceofbase() {
	spotify.lookup({ type: "track", id: "0hrBpAOgrt8RXigk83LLNE" }, function(err, data) {
			console.log("Artist: "+data.artists[0].name);
			console.log("Album: "+data.album.name);
			console.log("Song: "+data.name);
			console.log("URL: "+data.external_urls.spotify+"\n");

	});

}
function spotifyIt() {
	spotify.search({ type: "track", query: title }, function(err, data) {
		if(err) throw err;
		for(var i = 0; i < data.tracks.items.length; i++) {
			console.log((i + 1) % 2 == 0 ? magenta: cyan);
			var track = data.tracks.items[i];
			for(var j = 0; j < track.artists.length; j++) {
				console.log("Artist: "+track.artists[j].name);
			}
			console.log("Album: "+track.album.name);
			console.log("Song: "+track.name);
			console.log("URL: "+track.external_urls.spotify+"\n");
			console.log(reset);
		}

	});
}
function movieIt() {

}
function doIt() {

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
		movieIt();
	case "do-what-it-says":
		doIt();
	default:
		console.log("That's not legit.");
}