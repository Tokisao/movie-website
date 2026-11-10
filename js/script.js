// Ready / Variables
let filename = "res/movies.txt";

// Login Form Validation


// Dynamic Search
function countTriplet(str) {
    str = str.toLowerCase();
    str = str.replace(/[^a-zA-Z]/g, "");
    let counts = {};
    for (let i = 0; i <= str.length - 3; i++) {
        let trio = str.slice(i, i + 3);
        counts[trio] = (counts[trio] || 0) + 1;
    }
    return counts;
}

function countCompare(c1, c2) {
    let res = 0;
    
    for (let trio in c1) {
        res += Math.min(c1[trio], (c2[trio] || 0));
    }
    
    return res;
}

$.get(filename, function(data) {
    let lines = data.split(/\r?\n/);
    lines.pop();
    console.log(lines);
    
    const movies = [];
    for (let line of lines) {
        let info = line.split("/");
        movies.push({ name: info[0],
                      cover: info[1],
                      year: info[2],
                      rating: info[3],
                      counter: countTriplet(info[0])});
    }
    console.log(movies);
    
    $(document).ready(function() {
        if ($("title").text() == "CineScope — Movies") {
            for (let movie of movies) {
                $(".featured-grid").append('<div class="featured-card"><img src="images/'
                + movie.cover + '" alt="Poster of '
                + movie.name + '" loading="lazy" /><h3>'
                + movie.name + '</h3><p><span class="year">'
                + movie.year + '</span> · <span class="star">★</span> '
                + movie.rating + '</p></div>');
            }
        }
    });
    $("#search-bar").after('<p class="dropdown rounded" style="background-color: rgba(2, 18, 61, 0.5); position: absolute;"></p>');
    
    let count = {};
    let matches = [];
    $("#search-bar").on("focus", function() {
        $("#search-bar").on("keyup", function() {
            count = countTriplet($("#search-bar").val());
            matches = [];
            
            for (let id = 0; id < movies.length; id++) {
                let match = countCompare(count, movies[id].counter);
                matches.push({id, match});
            }
            
            matches.sort((a, b) => b.match - a.match);
            console.clear();
            console.log(matches);
            
            if (matches[0].match == 0) {
                $(".dropdown").css("display", "none");
            } else {
                $(".dropdown").css("display", "block");
            }
            $(".dropdown").text(movies[matches[0].id].name);
            
            $('.dropdown').css({
                position: 'absolute',
                top: $('#search-bar').offset().top + $('#search-bar').outerHeight(),
                left: $('#search-bar').offset().left,
                width: $('#search-bar').outerWidth(),
                height: $('#search-bar').outerHeight()
            });
        });
    });
});

$("#search-bar").on("focus", function() {
    $("#search-bar").css("background", "rgba(2, 18, 61, 0.5)");
});
$("#search-bar").on("blur", function() {
    $("#search-bar").css("background", "rgba(255, 206, 227, 0.15)");
    $(".dropdown").css("display", "none");
});

// Filter


// Dynamic Table & CRUD

