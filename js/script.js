// Ready


// Login Form Validation


// Dynamic Search
$("#search-bar").on("focus", function() {
    $("#search-bar").css("background", "rgba(2, 18, 61, 0.5)");
    $("#search-bar").on("keyup", function() {
        console.log($("#search-bar").val());
    });
});
$("#search-bar").on("blur", function() {
    $("#search-bar").css("background", "rgba(255, 206, 227, 0.15)");
});

// Filter


// Dynamic Table & CRUD

