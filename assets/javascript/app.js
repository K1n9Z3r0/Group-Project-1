// Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDc1hPQrGMsK-ajYczlJqw116OR5nh0or8",
    authDomain: "the-cookbook-10e52.firebaseapp.com",
    databaseURL: "https://the-cookbook-10e52.firebaseio.com",
    projectId: "the-cookbook-10e52",
    storageBucket: "",
    messagingSenderId: "661976231261",
    appId: "1:661976231261:web:af1355b81a0a99db"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


// EDAMAM Recipe Search API Key
var apiKey ="b90927458c5fa7e1f7b840215bb8a419"

var searchInput = $("#search-input");
// Here we are building the URL we need to query the database
var queryURL = "https://api.edamam.com/search?q=" + searchInput + 
    "&app_id=${ 128b0839 }& app_key=${ b90927458c5fa7e1f7b840215bb8a419 }& from=0 & to=3 & calories=591 - 722 & health=alcohol - free"



curl "https://api.edamam.com/search?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=591-722&health=alcohol-free"
