/* EDAMAM API */
//api connection to EDAMAM for recipes
var APIKey = "b90927458c5fa7e1f7b840215bb8a419";
var APIId = "128b0839";
var queryURL;
var results;



/* global moment firebase */

// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

var config = {
    apiKey: "AIzaSyAddH55KPlQUToNQZ1C2RcP-yBc5MZN-Aw",
    authDomain: "the-cookbook-1b04d.firebaseapp.com",
    databaseURL: "https://the-cookbook-1b04d.firebaseio.com",
    projectId: "the-cookbook-1b04d",
    storageBucket: "the-cookbook-1b04d.appspot.com",
    messagingSenderId: "80062811173",
    appId: "1:80062811173:web:ab89aca054f332bd"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

searchArray = [];

function addSearch() {
    results = $("#searchId").val();
    for (var i = 0; i < searchArray.length; i++) {
        if (results !== searchArray[i]) {
            searchArray.push(results);


        }
    }
}

var searchResults = {
    name: results,
    count: 0
}

// --------------------------------------------------------------
// Search button
$("#searchA").on("click", function(event) {
    event.preventDefault();
    results = $("#searchId").val();
    queryURL = 'https://api.edamam.com/search?q=' + results + '&app_id=' + APIId + '&app_key=' + APIKey + '&from=0&to=10&calories=591-722&time=30';
    ajaxSearch();
    $("#introDiv").empty();


    // integrating firebase functionality
    var searchHist = String(results);

    // sending caputered variables to firebase 
    database.ref().set({
        searchHist: searchHist
    });


    database.ref().on("value", function(snapshot) {

        // Printing changes to firebase to the html 
        $("#recentSearch").text(snapshot.val().searchHist);

    })

});

// Reset Search results button
$("#reset").on("click", function(event) {
    $("#searchResultsBox").empty();
});

// the ajaxSearch function
function ajaxSearch() {
    // Here we run our AJAX call to the EDAMAM API
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) { // We store all of the retrieved data inside of an object called "response"
        // Log the queryURL

        //recipe div holds recipe info
        var recipeDiv = $("<div class='recipe-display'>");

        var recipeArray = response.hits;


        /* New code for all search results */
        for (var i = 0; i < recipeArray.length; i++) {

            // Recipe name
            var name = response.hits[i].recipe.label;

            // Recipe URL
            var recipeLink = response.hits[i].recipe.url;

            // Recipe servings
            var servings = response.hits[i].recipe.yield;

            // Recipe total time
            var cookTime = response.hits[i].recipe.totalTime;

            if (cookTime === 0) {
                cookTime = "N/A";
            }

            // Recipe Image
            var imgURL = response.hits[i].recipe.image;


            var newElementString = "";
            newElementString += '<div class="recipeBox" id="recipe' + i + '">';
            newElementString += '<div class="card" style="width: 18rem;">';
            newElementString += '<img src="' + imgURL + '" class="card-img-top" alt="...">';
            newElementString += '<div class="card-body">';
            newElementString += '<h5 class="card-title">' + name + '</h5>';
            newElementString += '<p class="card-text">Servings: ' + servings + '</p>';
            newElementString += '<p class="card-text">Total Time: ' + cookTime + '</p>';
            newElementString += '<a class="btn btn-primary" href="' + recipeLink + '" target="_blank" id="recipe-btn">Go to Recipe</a>';

            var recipeDiv = $(newElementString);
            $("#searchResultsBox").prepend(recipeDiv);
        }
    });
}