/* EDAMAM API */
//api connection to EDAMAM for recipes
var APIKey = "b90927458c5fa7e1f7b840215bb8a419";
var APIId = "128b0839";
var queryURL;
var results;

// Initialize Firebase

var config = {
    apiKey: "AIzaSyAddH55KPlQUToNQZ1C2RcP-yBc5MZN-Aw",
    authDomain: "the-cookbook-1b04d.firebaseapp.com",
    databaseURL: "https://the-cookbook-1b04d.firebaseio.com",
    projectId: "the-cookbook-1b04d",
    storageBucket: "",
    messagingSenderId: "80062811173",
    appId: "1:80062811173:web:ab89aca054f332bd"
};

firebase.initializeApp(config);

// Reference the database.
var database = firebase.database();

// ---------------------------------------------------------------------------------------
// Searchbar element 
$("#searchA").on("click", function(event) {
    event.preventDefault();
    results = $("#searchId").val();
    queryURL = 'https://api.edamam.com/search?q=' + results + '&app_id=' + APIId + '&app_key=' + APIKey + '&from=0&to=10&calories=591-722&time=30';
    console.log("search: " + results);
    ajaxSearch();

    $("greetingBox").hide();

    // integrating firebase functionality
    var searchHist = String(results);

    // sending caputered variables to firebase 
    database.ref().set({
        searchHist: searchHist
    });


    database.ref().on("value", function(snapshot) {

        // Log the value of the various properties
        console.log(snapshot.val().searchHist);

        // Printing changes to firebase to the html 
        $("#recent-Search").text(snapshot.val().searchHist);

    })

});


// the ajaxSearch function
function ajaxSearch() {
    // Here we run our AJAX call to the EDAMAM API
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) { // We store all of the retrieved data inside of an object called "response"

        // Log the queryURL
        console.log(queryURL);

        // Log the resulting object
        console.log(response);

        //recipe div holds recipe info
        var recipeDiv = $("<div class='recipe-display'>");

        var recipeArray = response.hits;

        /* Old code for single search result */
        // //recipe name
        // var name = response.hits[0].recipe.label;
        // $(".card-title").text("Recipe Name: " + name);

        // //Recipe servings
        // var servings = response.hits[0].recipe.yield;
        // var pOne = $("<p>").text("Servings: " + servings);
        // $(".card-text").append(pOne);

        // //Recipe total time
        // var cookTime = response.hits[0].recipe.totalTime;
        // var pTwo = $("<p>").text("Total Time: " + cookTime + " min");
        // $(".card-text").append(pTwo);

        // //Recipe Image
        // var imgURL = response.hits[0].recipe.image;
        // $(".card-img-top").attr("src", imgURL);

        // var recipeLink = response.hits[0].recipe.url;
        // $("#recipe-btn").attr("href", recipeLink);

        // $("#recipe1").append(recipeDiv);


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


            // recipeDiv.append('<div class="card" style="width: 18rem;">');
            // recipeDiv.append('<img src="'+imgURL+'" class="card-img-top" alt="...">');
            // recipeDiv.append('<div class="card-body">');
            // recipeDiv.append('<h5 class="card-title">'+name+'</h5>');
            // recipeDiv.append('<p class="card-text">Servings: '+servings+'</p>');
            // recipeDiv.append('<p class="card-text">Total Time: '+cookTime+'</p>');
            // recipeDiv.append('<a href="'+recipeLink+'" class="btn btn-primary" id="recipe-btn">Go to Recipe</a>');

            // var recipeDiv = $("<div id='recipe"+i+"'>");

            var newElementString = "";
            newElementString += '<div class="recipeBox" id="recipe' + i + '">';
            newElementString += '<div class="card" style="width: 18rem;">';
            newElementString += '<img src="' + imgURL + '" class="card-img-top" alt="...">';
            newElementString += '<div class="card-body">';
            newElementString += '<h5 class="card-title">' + name + '</h5>';
            newElementString += '<p class="card-text">Servings: ' + servings + '</p>';
            newElementString += '<p class="card-text">Total Time: ' + cookTime + '</p>';
            newElementString += '<a href="' + recipeLink + '" class="btn btn-primary" id="recipe-btn">Go to Recipe</a>';

            var recipeDiv = $(newElementString);
            $("#searchResultsBox").append(recipeDiv);
        }
    });
}