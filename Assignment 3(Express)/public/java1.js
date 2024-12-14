$(function() {
    // Function to hide all descriptions and reset all buttons
    function hideAllDescriptions() {
        $("#result-sem1, #result-sem2, #result-sem3").empty(); // Clear all description areas
    }

    // Load Semester 1 Project description
    $("#sem1").click(function() {
        hideAllDescriptions(); // Hide all other descriptions
        $.get("project1.txt", function(response) {
            $("#result-sem1").empty();
            $("#result-sem1").append("<h3>Semester 1 Projects</h3>");
            $("#result-sem1").append("<div class='result-content'>" + response + "</div>");
        });
    });

    // Load Semester 2 Project description
    $("#sem2").click(function() {
        hideAllDescriptions(); // Hide all other descriptions
        $.get("project2.txt", function(response) {
            $("#result-sem2").empty();
            $("#result-sem2").append("<h3>Semester 2 Projects</h3>");
            $("#result-sem2").append("<div class='result-content'>" + response + "</div>");
        });
    });

    // Load Semester 3 Project description
    $("#sem3").click(function() {
        hideAllDescriptions(); // Hide all other descriptions
        $.get("project3.txt", function(response) {
            $("#result-sem3").empty();
            $("#result-sem3").append("<h3>Semester 3 Projects</h3>");
            $("#result-sem3").append("<div class='result-content'>" + response + "</div>");
        });
    });
});
