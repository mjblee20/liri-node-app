// installing npm packages
let fs = require("fs");
let Spotify = require('node-spotify-api');
let axios = require('axios');
let moment = require('moment');
// import keys.js file which stores the private info of spotify keys
require('dotenv').config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


// grab the user input in terminal to determine what function to run
if (process.argv[2] === "concert-this") {
    concertThis();
} else if (process.argv[2] === "spotify-this-song") {
    spotifyThisSong();
} else if (process.argv[2] === "movie-this") {
    movieThis();
} else if (process.argv[2] === "do-what-it-says") {
    doWhatItSays();
}

// initializes all the functions that this js file will run
function concertThis(beautified) {
    // grab all the strings after process.argv[2] and combine them into a string with spaces for artist name and band name
    let artist = process.argv.splice(3).join(" ");
    if (beautified !== undefined) {
        artist = beautified;
    }
    
    // XMLHttpRequest to the url below with a dynamic artist string given by the user
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {

        let eventsArr = response.data;

        for (let i = 0; i < eventsArr.length; i++) {
            // logging info in terminal
            console.log("Result " + (i + 1))
            console.log("========================");
            console.log("Name of the Venue:                ", eventsArr[i].venue.name);
            console.log("Venue Location:                   ", eventsArr[i].venue.city + ", " + eventsArr[i].venue.region, eventsArr[i].venue.country);
            console.log("Date of the Event(MM/DD/YYYY):    ", moment.utc(eventsArr[i].datetime).format("MM/DD/YYYY"));
            console.log("========================");

            // contructing the text that is appended to log.txt
            text = "";
            text += "Result: " + (i+1) + "\n"
            text += "========================" + "\n"
            text += "Name of the Venue:                " + eventsArr[i].venue.name + "\n";
            text += "Venue Location:                   " + eventsArr[i].venue.city + ", " + eventsArr[i].venue.region + ", " + eventsArr[i].venue.country + "\n";
            text += "Date of the Event(MM/DD/YYYY):    " + moment.utc(eventsArr[i].datetime).format("MM/DD/YYYY") + "\n";
            text += "========================" + "\n";

            // appending text to log.txt
            fs.appendFile("log.txt", "\n" + text , function(err) {
                // If an error was experienced we will log it.
                if (err) {
                  console.log(err);
                }  
            });
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function spotifyThisSong(beautified) {

    let song = "The Sign";

    if (process.argv[3] !== undefined) {
        song = process.argv.splice(3).join(" ");
    } else if (beautified !== undefined) {
        song = beautified;
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < data.tracks.items.length; i++) {
            let firstSong = data.tracks.items[i];
            let artists = "";
            // in cases wher there are several artists
            for (let j = 0; j < firstSong.artists.length; j++) {
                artists += firstSong.artists[j].name + " ";
            }

            // logging info in terminal
            console.log("========================");
            console.log(i+1);
            console.log("Artist(s):", artists);
            console.log("Song:", firstSong.name);
            console.log("Preview URL:", firstSong.preview_url);
            console.log("Album:", firstSong.album.name);
            console.log("========================");

            // contructing the text that is appended to log.txt
            text = "";
            text += "========================" + "\n";
            text += "Result: " + (i + 1) + "\n";
            text += "Artist(s): " + artists + "\n";
            text += "Song:", firstSong.name + "\n";
            text += "Preview URL: " + firstSong.preview_url + "\n";
            text += "Album: " + firstSong.album.name + "\n";
            text += "========================" + "\n";

            // appending text to log.txt
            fs.appendFile("log.txt", "\n" + text , function(err) {
                // If an error was experienced we will log it.
                if (err) {
                  console.log(err);
                }  
            });
        } 
    });
} 

function movieThis(beautified) {

    // dynamically setting the variable for the query URL
    let movieName = "Mr. Nobody";

    if (process.argv[3] !== undefined) {
        movieName = process.argv.splice(3).join(" ");
    } else if (beautified !== undefined) {
        movieName = beautified;
    }

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios
    .get(queryUrl).then(function(response) {

        // logging movie info to the terminal
        let data = response.data;
        console.log("========================");
        // Title of the movie.
        console.log("Title: " + data.Title);
        // Year the movie came out.
        console.log("Year Released: " + data.Year);
        // IMDB Rating of the movie.
        console.log("IMDB Rating: " + data.imdbRating);
        // Rotten Tomatoes Rating of the movie.
        let rottenRating;
        for (let i = 0; i < data.Ratings.length; i++) {
            if (data.Ratings[i].Source === "Rotten Tomatoes") {
                rottenRating = data.Ratings[i].Value;
            }
        }
        console.log("Rotten Tomatoes Rating: " + rottenRating);
        // Country where the movie was produced.
        console.log("Country Origin: " + data.Country);
        // Language of the movie.
        console.log("Language: " + data.Language);
        // Plot of the movie.
        console.log("Plot: " + data.Plot);
        // Actors in the movie.
        console.log("Actors: " + data.Actors);
        console.log("========================");

        // contructing the text that is appended to log.txt
        text = "";
        text += "========================" + "\n";
        text += "Title: " + data.Title + "\n";
        text += "Year Released: " + data.Year + "\n";
        text += "IMDB Rating: " + data.imdbRating + "\n";
        text += "Rotten Tomatoes Rating: " + rottenRating + "\n";
        text += "Country Origin: " + data.Country + "\n";
        text += "Language: " + data.Language + "\n";
        text += "Plot: " + data.Plot + "\n";
        text += "Actors: " + data.Actors + "\n";
        text += "========================" + "\n";

        // appending text to log.txt
        fs.appendFile("log.txt", "\n" + text , function(err) {
            // If an error was experienced we will log it.
            if (err) {
              console.log(err);
            }
        });
    })
    .catch(function (error) {
        console.log(error);
    });
}

function doWhatItSays() {
    // check the string and break it up by commas
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
    
        // We will then re-display the content as an array for later use.
        let beautified = dataArr[1].replace(/['"]+/g, '').trim();
        if (dataArr[0] === "concert-this") {
            concertThis(beautified);
        } else if (dataArr[0] === "spotify-this-song") {
            spotifyThisSong(beautified);
        } else if (dataArr[0] === "movie-this") {
            movieThis(beautified);
        } 
    });
}