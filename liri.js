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
					console.log(tweets[i].text+"\n", (i + 1) % 2 == 0 ? magenta: cyan);
				}
				console.log(reset);
			});
}
function spotifyIt() {
	var titleSwitch = title ? title: "The Sign";
	spotify.search({ type: "track", query: titleSwitch }, function(err, data) {
		if(err) throw err;
		for(var i = 0; i < data.tracks.items.length; i++) {
			var track = data.tracks.items[i];
			for(var j = 0; j < track.artists.length; j++) {
				console.log(track.artists[j].name);
			}
			console.log(track.album.name);
			console.log(track.name);
			console.log(track.external_urls.spotify+"\n");
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
		spotifyIt();
		break;
	case "movie-this":
		movieIt();
	case "do-what-it-says":
		doIt();
	default:
		console.log("That's not legit.");
}