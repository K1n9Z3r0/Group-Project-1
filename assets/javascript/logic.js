/* global moment firebase */

// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

var config = {
    apiKey: "AIzaSyDc1hPQrGMsK-ajYczlJqw116OR5nh0or8",
    authDomain: "the-cookbook-10e52.firebaseapp.com",
    databaseURL: "https://the-cookbook-10e52.firebaseio.com",
    projectId: "the-cookbook-10e52",
    storageBucket: "",
    messagingSenderId: "661976231261",
    appId: "1:661976231261:web:af1355b81a0a99db"
  };

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// // -----------------------------


// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text(snap.numChildren());
});

// ------------------------------------
// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

// --------------------------------------------------------------
// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes
database.ref("/bidderData").on("value", function(snapshot) {

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the local variables for highBidder equal to the stored values in firebase.
    highBidder = snapshot.val().highBidder;
    highPrice = parseInt(snapshot.val().highPrice);

    // change the HTML to reflect the newly updated local values (most recent information from firebase)
    $("#highest-bidder").text(snapshot.val().highBidder);
    $("#highest-price").text("$" + snapshot.val().highPrice);

    // Print the local data to the console.
    console.log(snapshot.val().highBidder);
    console.log(snapshot.val().highPrice);
  }

  // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
  else {

    // Change the HTML to reflect the local value in firebase
    $("#highest-bidder").text(highBidder);
    $("#highest-price").text("$" + highPrice);

    // Print the local data to the console.
    console.log("local High Price");
    console.log(highBidder);
    console.log(highPrice);
  }

  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------
$("#searchA").on("click", function(event) {
  event.preventDefault();
  var results = $("#searchId").val();
  console.log(results);
})

// Whenever a user clicks the click button
$("#submit-bid").on("click", function(event) {
  event.preventDefault();

  // Get the input values
  var bidderName = $("#bidder-name").val().trim();
  var bidderPrice = parseInt($("#bidder-price").val().trim());

  // Log the Bidder and Price (Even if not the highest)
  console.log(bidderName);
  console.log(bidderPrice);

  if (bidderPrice > highPrice) {

    // Alert
    alert("You are now the highest bidder.");

    // Save the new price in Firebase
    database.ref("/bidderData").set({
      highBidder: bidderName,
      highPrice: bidderPrice
    });

    // Log the new High Price
    console.log("New High Price!");
    console.log(bidderName);
    console.log(bidderPrice);

    // Store the new high price and bidder name as a local variable (could have also used the Firebase variable)
    highBidder = bidderName;
    highPrice = parseInt(bidderPrice);

    // Change the HTML to reflect the new high price and bidder
    $("#highest-bidder").text(bidderName);
    $("#highest-price").text("$" + bidderPrice);
  } else {

    // Alert
    alert("Sorry that bid is too low. Try again.");
  }
});


//api connection to EDAMAM for recipes
var APIKey = "b90927458c5fa7e1f7b840215bb8a419";
var APIId = "128b0839";

// Here we are building the URL we need to query the database
var queryURL = 'https://api.edamam.com/search?q=' + results + '&app_id=' + APIId + '&app_key=' + APIKey + '&from=0&to=10&calories=591-722&time=30';


// Here we run our AJAX call to the EDAMAM API
$.ajax({ 
  url: queryURL,
  method: "GET"
}).then(function (response) {   // We store all of the retrieved data inside of an object called "response"
  // Log the queryURL
  console.log(queryURL);

  // Log the resulting object
  console.log(response);
  
  //recipe div holds recipe info
  var recipeDiv = $("<div class='recipe-display'>");

  // var recipeArray = response.hits;

  //recipe name
  var name = response.hits[0].recipe.label;
  $(".card-title").text("Recipe Name: " + name);
  
  //Recipe servings
  var servings = response.hits[0].recipe.yield;
  var pOne = $("<p>").text("Servings: " + servings); 
  $(".card-text").append(pOne);

  //Recipe total time
  var cookTime = response.hits[0].recipe.totalTime;
  var pTwo = $("<p>").text("Total Time: " + cookTime + " min"); 
  $(".card-text").append(pTwo);
  
  //Recipe Image
  var imgURL = response.hits[0].recipe.image;
  $(".card-img-top").attr("src", imgURL);

  var recipeLink = response.hits[0].recipe.url;
  $("#recipe-btn").attr("href", recipeLink);
  

  $("#recipe").append(recipeDiv);

});



// for(var i = 0; i < recipeArray.length; i++){
  //   var name = response.hits[i].recipe.label;
  //   var card = $('<div class="card" style="width: 18rem;">');

  //   var imgURL = response.hits[i].recipe.image;
  //   var image = $('<img class="card-image-top>').attr("src", imgURL);
  //   card.append(image);

  //   var cardBody = $('<div class="card-body">');
  //   card.append(cardBody);

  //   var cardTitle = $('<h5 class="card-title">');
  //   var name = response.hits[i].recipe.label;
  //   $(".card-title").text("Recipe Name: " + name);
  //   cardBody.append(cardTitle);

  //   var pCookTime = $('<p class="card-text">');
  //   var cookTime = response.hits[i].recipe.totalTime;
  //   $(".card-text").text("Total Time: " + cookTime + " min");
  //   cardBody.append(pCookTime);

  //   pServings = $('<p class="card-text">');
  //   var servings = response.hits[i].recipe.yield;
  //   $(".card-text").text("Servings: " + servings);
  //   cardBody.append(pServings);

  // }