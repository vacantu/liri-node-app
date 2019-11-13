// onst XXX_APIKEY = process.env();
//import { spotify } from './keys';
//console.log(spotify);

// Including packages required
const dotenv = require("dotenv").config();
const axios = require('axios');
const inquirer = require("inquirer");
const Spotify = require('node-spotify-api');
const bandsintown = require('bandsintown');
const moment = require("moment");
// console.log("DOTENV: ",dotenv.parsed.SPOTIFY_SECRET);

//var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: dotenv.parsed.SPOTIFY_ID,
    secret: dotenv.parsed.SPOTIFY_SECRET
  });

inquirer
  .prompt([
    {  
    type: "list",
    message: "What do you want to do?",
    choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "choice"
},
// Here we ask the user for the search terms
{
    type: "input",
    message: "Enter your search term",
    name: "searchTerm",
}
])
.then(function(inquirerResponse) {``

var item = "";  
var option = inquirerResponse.choice;
  if (!inquirerResponse.searchTerm) {
    item = "Ace of Base";
  } else {
    item = inquirerResponse.searchTerm;
  }
  switch (option) {
      case 'concert-this':      
      let URL = `https://rest.bandsintown.com/artists/${item}/events?app_id=${dotenv.parsed.BIT_ID}&date=upcoming`;
            axios.get(URL)
            .then(function (response) {
              // handle success
              var jsonData = response.data;
              for (var i= 0; i<jsonData.length; i++) {
                if ( jsonData[i].venue.region === "TX" ) {
                  // get the event data
                  let venueName = jsonData[i].venue.name;
                  let venueLocation = `${jsonData[i].venue.city}, ${jsonData[i].venue.region}`;
                  let venueDate = jsonData[i].datetime.substring(0,10); // format date as "MM/DD/YYYY"
                  let venueDateFixed =  moment(venueDate,'YYYY-MM-DD').format('MM-DD-YYYY');
                  console.log(`${item}, will be performing at ${venueName}, in ${venueLocation}, on ${venueDateFixed}`);
                } else {
                  console.log(`${item}, no in town. Try later.`);
                }
              }
            })
            .catch(function (error) {
              if (error = '400') {
                console.log(`We are sorry, ${item}, is not in our database.`);
              }
              console.log(error);
            })
            .finally(function () {
              // always executed
            })
            break;
      case 'spotify-this-song':
              console.log("You ask me to " + option + " " + item);
              spotify.search({ type: 'track', query: item }, function(err, data) {
                  if (err) {
                    return console.log('Error occurred: ' + err);
                  }
                  //console.log("THIS IS DATA: ",JSON.parse(data));
                  //Artist(s)
                  // The song's name
                  // preview link of the song from Spotify
                  // The album that the song is from
                console.log("ITEMS: ",data.tracks.items[1].artists.external_urls.spotify);
                let songHref = data.tracks.href;
                console.log(songHref);
                let items = data.tracks.items[1];
                  //console.log(items);
              });           
            break;
      case 'movie-this':
            break;
      case 'do-what-it-says':
            break;
        default:
}


})
// To send data requests to OMDB, I need this: http://www.omdbapi.com/?apikey=[yourkey]&
