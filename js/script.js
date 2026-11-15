// Ready / Variables
// js/movies-data.js — единый источник фильмов
const API = 'https://api.streamx.qzz.io';
const blacklist = 'res/movies_blacklist.txt';

let _moviesCache = null;
let _moviesPromise = null;

function slugify(str) {
    return String(str).toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
function parseVotes(v) {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;
    return Number(String(v).replace(/[^\d]/g, '')) || 0;
}
    
function loadMovies() {
    if (_moviesCache) return Promise.resolve(_moviesCache);
    if (_moviesPromise) return _moviesPromise;

    _moviesPromise = Promise.all([
        fetch(`${API}/catalog/movie/top`).then(r => {
            if (!r.ok) throw new Error('API ' + r.status);
            return r.json();
        }),
        $.get(blacklist).catch(() => '')
    ]).then(([data, blacklistRaw]) => {
        const banned = (blacklistRaw || '')
            .split('\n').map(s => s.trim()).filter(Boolean);

    _moviesCache = (data.metas || [])
    .filter(m => m.imdbRating && !banned.includes(m.name))
    .map(m => {
        const reviews = Number(
                    m.popularities?.trakt ??
                    m.popularities?.moviedb ??
                    m.popularity ??
                    0
                ) || 0;

        return {
            name: m.name,
            year: m.year,
            rating: parseFloat(m.imdbRating),
            votes: Math.round(reviews),  
            poster: m.poster,
            genre: m.genres || [],
            key: slugify(m.name + '-' + m.year)
        };
    });
        return _moviesCache;
    }).catch(err => {
        console.error('Could not download fimls:', err);
        _moviesCache = [];
        return [];
    });

    return _moviesPromise;
}
//Using API for movies in index
$(function () {
    const $featured = $('#featured-grid');
    const $top = $('#top-list');
    if ($featured.length === 0 && $top.length === 0) return;

    loadMovies().then(movies => {
        if (movies.length === 0) return;
        const featured = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
        $featured.html(featured.map(m => `
            <article class="featured-card">
                <img src="${m.poster}" alt="Poster of ${m.name}" loading="lazy" />
                <h3>${m.name}</h3>
                <p><span class="year">${m.year}</span> · <span class="star">★</span> ${m.rating.toFixed(1)}</p>
            </article>
        `).join(''));
        const top3 = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
        $top.html(top3.map(m => `<li>${m.name}</li>`).join(''));
    });
});

// Login Form Validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError($field, message) {
    $field.addClass('invalid').removeClass('valid');
    $('.field-error[data-for="' + $field.attr('id') + '"]').text(message || '');
    return false;
}
function setValid($field) {
    $field.removeClass('invalid').addClass('valid');
    $('.field-error[data-for="' + $field.attr('id') + '"]').text('');
    return true;
}

function passwordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    let level = 0;
    if (score >= 4) level = 3;
    else if (score >= 2) level = 2;
    else if (score >= 1) level = 1;

    const labels = ['', 'Weak', 'Medium', 'Strong'];
    const classes = ['', 'weak', 'medium', 'strong'];
    return { level, label: labels[level] || '', cssClass: classes[level] || '' };
}

$(function () {
    const $regForm = $('#register-form');
    if ($regForm.length === 0) return; 

    $('#reg-password').on('input', function () {
        const val = $(this).val();
        const s = passwordStrength(val);
        const $bar = $('#strength-bar');
        $bar.removeClass('weak medium strong').addClass(s.cssClass);
        $('#strength-label').text(s.label ? 'Strength: ' + s.label : '');
    });

    $('#reg-confirm').on('input', function () {
        const match = $(this).val() === $('#reg-password').val();
        if ($(this).val() === '') {
            $(this).removeClass('invalid valid');
            $('.field-error[data-for="reg-confirm"]').text('');
        } else if (match) {
            setValid($(this));
        } else {
            setError($(this), 'Passwords do not match.');
        }
    });

    $regForm.on('submit', function (e) {
        e.preventDefault();
        let ok = true;

        const name  = $('#reg-name').val().trim();
        const email = $('#reg-email').val().trim();
        const pwd   = $('#reg-password').val();
        const conf  = $('#reg-confirm').val();
        const terms = $('#reg-terms').is(':checked');

        if (name.length < 2) ok = setError($('#reg-name'), 'Name must be at least 2 characters.') && ok;
        else ok = setValid($('#reg-name')) && ok;

        if (!EMAIL_RE.test(email)) ok = setError($('#reg-email'), 'Enter a valid email address.') && ok;
        else ok = setValid($('#reg-email')) && ok;

        const s = passwordStrength(pwd);
        if (pwd.length < 8) ok = setError($('#reg-password'), 'Password must be at least 8 characters.') && ok;
        else if (!/[A-Za-z]/.test(pwd) || !/\d/.test(pwd)) ok = setError($('#reg-password'), 'Password must contain a letter and a digit.') && ok;
        else if (s.level < 2) ok = setError($('#reg-password'), 'Password is too weak — mix cases, digits, symbols.') && ok;
        else ok = setValid($('#reg-password')) && ok;

        if (conf !== pwd) ok = setError($('#reg-confirm'), 'Passwords do not match.') && ok;
        else ok = setValid($('#reg-confirm')) && ok;

        if (!terms) ok = setError($('#reg-terms'), 'You must accept the Terms of Service.') && ok;
        else ok = setValid($('#reg-terms')) && ok;

        const $alert = $('#register-alert');
        if (!ok) {
            $alert.removeClass('d-none alert-success').addClass('alert-danger')
                  .text('Please fix the errors highlighted below.');
            $('html, body').animate({ scrollTop: $alert.offset().top - 100 }, 250);
        } else {
            $alert.removeClass('d-none alert-danger').addClass('alert-success')
                  .text('✅ Account created successfully! (demo)');

            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);

            $regForm[0].reset();
            $('#strength-bar').removeClass('weak medium strong');
            $('#strength-label').text('');
            $('.form-group input').removeClass('valid invalid');
        }
    });
});

$(function () {
    const $form = $('.review-form').filter(function () {
        return $('#contact-name').length && $(this).find('#contact-name').length > 0;
    });
    if ($form.length === 0) return;

     const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) $('#contact-name').val(savedName);
    if (savedEmail) $('#contact-email').val(savedEmail);

    $form.on('submit', function (e) {
        e.preventDefault();
        let ok = true;

        const name    = $('#contact-name').val().trim();
        const email   = $('#contact-email').val().trim();
        const subject = $('#contact-subject').val().trim();
        const message = $('#contact-message').val().trim();

        if (name.length < 2)        ok = setError($('#contact-name'), 'Name must be at least 2 characters.') && ok;
        else                         ok = setValid($('#contact-name')) && ok;

        if (!EMAIL_RE.test(email))  ok = setError($('#contact-email'), 'Enter a valid email address.') && ok;
        else                         ok = setValid($('#contact-email')) && ok;

        if (subject.length < 3)     ok = setError($('#contact-subject'), 'Subject must be at least 3 characters.') && ok;
        else                         ok = setValid($('#contact-subject')) && ok;

        if (message.length < 10)    ok = setError($('#contact-message'), 'Message must be at least 10 characters.') && ok;
        else                         ok = setValid($('#contact-message')) && ok;

        let $alert = $form.find('.form-alert');
        if ($alert.length === 0) {
            $alert = $('<div class="alert form-alert mt-3" role="alert"></div>');
            $form.prepend($alert);
        }
        if (!ok) {
            $alert.removeClass('alert-success').addClass('alert-danger')
                  .text('Please fix the errors highlighted below.');
        } else {
            $alert.removeClass('alert-danger').addClass('alert-success')
                  .text('✅ Message sent! We will get back to you soon. (demo)');
            $form[0].reset();
            $form.find('input, textarea').removeClass('valid invalid');
        }
    });
});

$(function () {
    const $form = $('#review').closest('form');
    if ($form.length === 0 || $('#review').length === 0) return;

    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) $('#name').val(savedName);
    if (savedEmail) $('#email').val(savedEmail);

    $form.on('submit', function (e) {
        e.preventDefault();
        let ok = true;

        const name   = $('#name').val().trim();
        const email  = $('#email').val().trim();
        const movie  = $('#movie').val();
        const rating = $('#rating').val();
        const review = $('#review').val().trim();

        if (name.length < 2)        ok = setError($('#name'), 'Enter your name.') && ok;
        else                         ok = setValid($('#name')) && ok;

        if (!EMAIL_RE.test(email))  ok = setError($('#email'), 'Enter a valid email.') && ok;
        else                         ok = setValid($('#email')) && ok;

        if (!movie)                  ok = setError($('#movie'), 'Please select a movie.') && ok;
        else                         ok = setValid($('#movie')) && ok;

        if (!rating)                 ok = setError($('#rating'), 'Please pick a rating.') && ok;
        else                         ok = setValid($('#rating')) && ok;

        if (review.length < 10)      ok = setError($('#review'), 'Review must be at least 10 characters.') && ok;
        else                         ok = setValid($('#review')) && ok;

        let $alert = $form.find('.form-alert');
        if ($alert.length === 0) {
            $alert = $('<div class="alert form-alert mt-3" role="alert"></div>');
            $form.prepend($alert);
        }
        if (!ok) {
            $alert.removeClass('alert-success').addClass('alert-danger')
                  .text('Please fix the errors highlighted below.');
        } else {
            $alert.removeClass('alert-danger').addClass('alert-success')
                  .text('✅ Review submitted! (demo)');
            $form[0].reset();
            $form.find('input, select, textarea').removeClass('valid invalid');
        }
    });
});

// Dynamic Search
function strProcess(str) {
    str = str.toLowerCase();
    let name = str;
    let ratingMin = 0.0;
    if (name.indexOf(".") != -1) { // get float (minimum rating)
        let index = name.indexOf(".");
        if (index > 0 && index + 1 < name.length && /^\d$/.test(name[index - 1]) && /^\d$/.test(name[index + 1])) {
            ratingMin = parseFloat(name.substring(index - 1, index + 2));
        }
    }
    name = name.replace(/[^a-zA-Z]/g, "");
    return {name, ratingMin};
}

function countTriplet(str) {
    let counts = {};
    for (let i = 0; i <= str.length - 3; i++) {
        const trio = str.slice(i, i + 3);
        counts[trio] = (counts[trio] || 0) + 1;
    }
    return counts;
}

function countCompare(c1, c2) {
    let res = 0;
    
    $.each(c1, function(index, element) {
        res += Math.min(c1[index], (c2[index] || 0));
    });
    
    return res;
}

async function getMovies() {
    const response = await fetch(`${API}/catalog/movie/top`);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data.metas);
    return data.metas;
}

async function verifiedMovies() {
    return getMovies()
        .then(movies => { // Movies validation
            return $.get(blacklist).then(data => {
                let banned = data.split("\n");
                banned.pop();
                console.log("Banned movies", banned);
                
                let verified = [];
                $.each(movies, function(index, element) {
                    if (element.imdbRating != '' && $.inArray(element.name, banned) == -1) {
                        verified.push({
                            name: element.name,
                            year: element.year.slice(0, 4), // In case 2022-
                            rating: element.imdbRating,
                            poster: element.poster,
                            genre: element.genres,
                            counter: countTriplet(strProcess(element.name).name)
                        });
                    }
                });
                return verified;
            });
        })
}

async function getGenres(movies) {
    let genres = [];
    $.each(movies, function(index, element) {
        genres = genres.concat(element.genre);
    });
    genres = new Set(genres); // Removes duplicates
    genres = Array.from(genres);
    return genres;
}

async function findMatches(search, movies, req) {
    let res = [];
    
    $.each(movies, function(index, element) {
        if (req.ratingMin <= element.rating && (genre_filters == "All" || element.genre.includes(genre_filters))) {
            res.push({id: index, match: countCompare(search, element.counter)});
        }
    });
    
    res.sort((a, b) => b.match - a.match);
    
    return res;
}

let genre_filters = "All";

async function update_search(movies) {
    console.log("========= search-input =========");
    $(".search-res").remove();
    if ($(".search-bar").val() == "") return;
    
    const req = strProcess($(".search-bar").val()); // Divides search request into movie name, rating min, and future in-search filters (year and e.t.c.).
    let matches = await findMatches(countTriplet(req.name), movies, req);
    
    $.each(matches, function(index, element) {
        if (index > 2) return;
        $(".search").append(`
        <div class="search-res rounded">
        </div>`);
        $(".search-res").eq(index).css("top", $('.search-bar').offset().top - $(window).scrollTop() + (3 * index + 1) * $('.search-bar').outerHeight());
        
        if (element.match > 0) {
            $(".search-res").eq(index).css("background-color", "rgba(2, 18, 100, 0.8)");
        }
        console.log(movies[element.id].name);
        
        $(".search-res").eq(index).append(`
        <img src="${movies[element.id].poster}" class="rounded">
        <p>${movies[element.id].genre.join(" / ")}</p>
        <p><span class="year">${movies[element.id].year}</span> · <span class="star">★</span> ${movies[element.id].rating}</p>
        <h5>${movies[element.id].name}</h5>`);
    });
    
    $('.search-res').css({
        left: $('.search-bar').offset().left,
        width: $('.search-bar').outerWidth(),
        height: $('.search-bar').outerHeight() * 3
    });
    $(".search-res img").css("height", $('.search-res').outerHeight());
}

async function searchBar() { // Runs only once, returning breaks searchbar later
    const movies = await verifiedMovies();
    console.log("Movies", movies);
    
    let genres = await getGenres(movies);
    
    $.each(genres, function(index, element) {
        $(".genres").append(`<option value="${element}">${element}</option>`);
    });
    
    if ($("title").text() == "CineScope — Movies") { // Page with all movies
        $.each(movies, function(index, element) {
            $(".featured-grid").append(`
            <div class="featured-card">
                <img src="${element.poster}" alt="Poster of ${element.name}" loading="lazy">
                <h3>${element.name}</h3>
                <p><span class="year">${element.year}</span> · <span class="star">★</span> ${element.rating}</p>
            </div>`);
        });
    }
}

$(".search-bar").keyup(async (e) => await update_search(await verifiedMovies()));

$(".genres").on("input", async function() {
    genre_filters = $(".genres").val();
    await update_search(await verifiedMovies());
});

searchBar(); // Deleting this disables search bar

$(".search-bar").on("focus", function() {
    $(this).css("background-color", "rgba(2, 18, 61, 0.5)");
});
$(".search-bar").on("blur", function() {
    $(this).css("background-color", "rgba(255, 206, 227, 0.15)");
});

$(".genres").on("focus", function() {
    $(this).css("background-color", "rgba(2, 18, 61, 0.5)");
});
$(".genres").on("blur", function() {
    $(this).css("background-color", "rgba(255, 206, 227, 0.15)");
});

$(window).resize(function() {
    let results = $(".search-res");
    for (let i = 0; i < results.length; i++) {
        results.eq(i).css("top", $('.search-bar').offset().top - $(window).scrollTop() + (3 * i + 1) * $('.search-bar').outerHeight());
    }
    results.css("left", $('.search-bar').offset().left);
    results.css("width", $('.search-bar').outerWidth());
    results.css("height", $('.search-bar').outerHeight() * 3);
    results.children(".img").css("height", $('.search-res').outerHeight());
});

// Trailers page sync with API
$(function () {
    const $row = $('#trailers-row');
    if ($row.length === 0) return;

    Promise.all([loadMovies(), $.getJSON('res/trailers.json')]).then(([movies, trailerMap]) => {
        const cards = movies
            .filter(m => trailerMap[m.key])
            .map(m => {
                const vid = trailerMap[m.key];
                return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <a class="trailer-card" href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener">
                        <img src="https://img.youtube.com/vi/${vid}/hqdefault.jpg" alt="${m.name} Trailer" loading="lazy" />
                        <h3>${m.name}</h3>
                        <p>Official Trailer · ${m.year}</p>
                    </a>
                </div>`;
            }).join('');
        $row.html(cards || '<p class="text-center">Trailers are not added yet</p>');
    });
});

// Dynamic Table & CRUD
$(function () {
    const $tbody = $('#crud-tbody');
    if ($tbody.length === 0) return;

   const STORAGE_KEY = 'cinescope_ratings_v2';

    function saveRecords(recs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(recs)); }
    function nextId(recs) { return recs.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1; }

    let records = [];
    let filterText = '';

    loadMovies().then(movies => {
    records = movies.map((m, i) => ({
        id: i + 1,
        title: m.name,
        genre: m.genre.join(' / '),
        year: m.year,
        rating: m.rating,
        reviews: m.votes   
    }));
    saveRecords(records);
    render();
});

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function flashAlert(msg, type) {
        const $a = $('#crud-alert');
        $a.removeClass('d-none alert-success alert-danger')
          .addClass('alert-' + (type === 'error' ? 'danger' : 'success'))
          .text(msg);
        clearTimeout(flashAlert._t);
        flashAlert._t = setTimeout(() => $a.addClass('d-none'), 2500);
    }

    function render() {
    const q = filterText.toLowerCase();
    const list = filterText
        ? records.filter(r =>
            r.title.toLowerCase().includes(q) ||
            (r.genre || '').toLowerCase().includes(q) ||
            String(r.year).includes(filterText) ||
            String(r.rating).includes(filterText)
          )
        : records;

    $tbody.empty();

    if (list.length === 0) {
        $tbody.append(
            '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No records found.</td></tr>'
        );
    } else {
        list.forEach((rec, idx) => {
            $tbody.append(
                '<tr data-id="' + rec.id + '">' +
                    '<td>' + (idx + 1) + '</td>' +
                    '<td>' + escapeHtml(rec.title) + '</td>' +
                    '<td>' + escapeHtml(rec.genre || '') + '</td>' +
                    '<td>' + rec.year + '</td>' +
                    '<td><span class="star">★</span> ' + Number(rec.rating).toFixed(1) + '</td>' +
                    '<td>' + Number(rec.reviews || 0).toLocaleString('en-US') + '</td>' +
                    '<td class="actions-cell">' +
                        '<button type="button" class="btn-icon btn-edit"   data-action="edit"   data-id="' + rec.id + '">Edit</button>' +
                        '<button type="button" class="btn-icon btn-delete" data-action="delete" data-id="' + rec.id + '">Delete</button>' +
                    '</td>' +
                '</tr>'
            );
        });
    }

    $('#crud-count').text(
        list.length + ' record' + (list.length === 1 ? '' : 's') +
        (filterText ? ' (filtered from ' + records.length + ')' : '')
    );
    }   

    /* ---- modal helpers ---- */
    function openModal(id) {
        $('#' + id).addClass('is-open').attr('aria-hidden', 'false');
        $('body').css('overflow', 'hidden');
    }
    function closeModal(id) {
        $('#' + id).removeClass('is-open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
    }
    function clearRecordErrors() {
        $('#record-form input').removeClass('valid invalid');
        $('#record-form .field-error').text('');
    }

    function openAddModal() {
    clearRecordErrors();
    $('#modal-title').text('Add Movie');
    $('#record-id').val('');
    $('#record-title').val('');
    $('#record-genre').val('');
    $('#record-year').val('');
    $('#record-rating').val('');
    $('#record-reviews').val('');
    openModal('record-modal');
    setTimeout(() => $('#record-title').focus(), 50);
    }

    function openEditModal(id) {
    const rec = records.find(r => r.id === id);
    if (!rec) return;
    clearRecordErrors();
    $('#modal-title').text('Edit Movie');
    $('#record-id').val(rec.id);
    $('#record-title').val(rec.title);
    $('#record-genre').val(rec.genre || '');
    $('#record-year').val(rec.year);
    $('#record-rating').val(rec.rating);
    $('#record-reviews').val(rec.reviews);
    openModal('record-modal');
    setTimeout(() => $('#record-title').focus(), 50);
    }

    /* ---- submit: CREATE or UPDATE ---- */
    $('#record-form').on('submit', function (e) {
    e.preventDefault();

    const id      = $('#record-id').val();
    const title   = $('#record-title').val().trim();
    const genre   = $('#record-genre').val().trim();
    const year    = $('#record-year').val().trim();
    const rating  = $('#record-rating').val().trim();
    const reviews = $('#record-reviews').val().trim();

    let ok = true;

    if (title.length < 2) {
        $('#record-title').addClass('invalid');
        $('.field-error[data-for="record-title"]').text('Title must be at least 2 characters.');
        ok = false;
    } else {
        $('#record-title').removeClass('invalid').addClass('valid');
        $('.field-error[data-for="record-title"]').text('');
    }

    if (genre.length < 2) {
        $('#record-genre').addClass('invalid');
        $('.field-error[data-for="record-genre"]').text('Genre must be at least 2 characters.');
        ok = false;
    } else {
        $('#record-genre').removeClass('invalid').addClass('valid');
        $('.field-error[data-for="record-genre"]').text('');
    }

    const yNum = Number(year);
    if (!year || !Number.isInteger(yNum) || yNum < 1888 || yNum > 2100) {
        $('#record-year').addClass('invalid');
        $('.field-error[data-for="record-year"]').text('Enter a valid year (1888–2100).');
        ok = false;
    } else {
        $('#record-year').removeClass('invalid').addClass('valid');
        $('.field-error[data-for="record-year"]').text('');
    }

    const rNum = Number(rating);
    if (!rating || isNaN(rNum) || rNum < 1 || rNum > 10) {
        $('#record-rating').addClass('invalid');
        $('.field-error[data-for="record-rating"]').text('Rating must be between 1 and 10.');
        ok = false;
    } else {
        $('#record-rating').removeClass('invalid').addClass('valid');
        $('.field-error[data-for="record-rating"]').text('');
    }

    const revNum = Number(reviews);
    if (reviews === '' || !Number.isInteger(revNum) || revNum < 0) {
        $('#record-reviews').addClass('invalid');
        $('.field-error[data-for="record-reviews"]').text('Reviews must be a non-negative integer.');
        ok = false;
    } else {
        $('#record-reviews').removeClass('invalid').addClass('valid');
        $('.field-error[data-for="record-reviews"]').text('');
    }

    if (!ok) return;

    const payload = {
        title, genre,
        year: yNum,
        rating: rNum,
        reviews: revNum
    };

    if (id) {
        const idx = records.findIndex(r => r.id === Number(id));
        if (idx !== -1) {
            records[idx] = { id: Number(id), ...payload };
            saveRecords(records);
            flashAlert('✅ Record updated.');
        }
    } else {
        records.push({ id: nextId(records), ...payload });
        saveRecords(records);
        flashAlert('✅ Record added.');
    }

    closeModal('record-modal');
    render();
    });

    /* ---- DELETE ---- */
    let pendingDeleteId = null;

    function askDelete(id) {
        const rec = records.find(r => r.id === id);
        if (!rec) return;
        pendingDeleteId = id;
        $('#confirm-text').html('Delete <strong>' + escapeHtml(rec.title) + '</strong>? This cannot be undone.');
        openModal('confirm-modal');
    }

    $('#confirm-ok').on('click', function () {
        if (pendingDeleteId == null) return;
        records = records.filter(r => r.id !== pendingDeleteId);
        saveRecords(records);
        pendingDeleteId = null;
        closeModal('confirm-modal');
        flashAlert('🗑️ Record deleted.');
        render();
    });

    /* ---- events ---- */
    $('#btn-add-record').on('click', openAddModal);

    $tbody.on('click', '[data-action]', function () {
        const action = $(this).data('action');
        const id     = Number($(this).data('id'));
        if (action === 'edit')   openEditModal(id);
        if (action === 'delete') askDelete(id);
    });

    $('#crud-search').on('input', function () {
        filterText = $(this).val().trim();
        render();
    });

    $('#modal-cancel').on('click', () => closeModal('record-modal'));
    $('#confirm-cancel').on('click', () => { pendingDeleteId = null; closeModal('confirm-modal'); });

    $('.modal-overlay').on('click', function (e) {
        if (e.target === this) {
            if (this.id === 'confirm-modal') pendingDeleteId = null;
            closeModal(this.id);
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if ($('#confirm-modal').hasClass('is-open')) {
            pendingDeleteId = null; closeModal('confirm-modal');
        } else if ($('#record-modal').hasClass('is-open')) {
            closeModal('record-modal');
        }
    });

    render();
});

// Image gallery
$(function () {
    const $grid = $('.featured-grid');
    if ($grid.length === 0) return;

    if ($('#lightbox').length === 0) {
        $('body').append(
            '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">' +
                '<button type="button" class="lightbox-close" id="lb-close" aria-label="Close">&times;</button>' +
                '<button type="button" class="lightbox-nav lightbox-prev" id="lb-prev" aria-label="Previous">&#10094;</button>' +
                '<img class="lightbox-img" id="lb-img" alt="" />' +
                '<button type="button" class="lightbox-nav lightbox-next" id="lb-next" aria-label="Next">&#10095;</button>' +
                '<div class="lightbox-caption" id="lb-caption"></div>' +
                '<div class="lightbox-counter" id="lb-counter"></div>' +
            '</div>'
        );
    }

    const $lb      = $('#lightbox');
    const $lbImg   = $('#lb-img');
    const $lbCap   = $('#lb-caption');
    const $lbCount = $('#lb-counter');

    let items = [];
    let current = 0;
    let animating = false;

    function esc(str) {
        return String(str || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function collect() {
        items = [];
        $grid.find('.featured-card').each(function () {
            const $img = $(this).find('img').first();
            if ($img.length === 0) return;
            items.push({
                src:   $img.attr('src'),
                alt:   $img.attr('alt') || '',
                title: $(this).find('h3').first().text().trim(),
                meta:  $(this).find('p').first().text().trim()
            });
        });
    }

    function updateChrome(i) {
        const it = items[i];
        if (!it) return;
        $lbCap.html(esc(it.title) + '<span>' + esc(it.meta) + '</span>');
        $lbCount.text((i + 1) + ' / ' + items.length);
    }

    function openLightbox(index) {
        collect();
        if (items.length === 0) return;
        current = Math.max(0, Math.min(index, items.length - 1));
        const it = items[current];

        $lbImg.attr('src', it.src).attr('alt', it.alt);
        updateChrome(current);

        $lb.css('display', 'flex').hide().fadeIn(220);
        $('body').css('overflow', 'hidden');

        $lbImg.css({ opacity: 0 }).animate({ opacity: 1 }, 260);
    }

    function closeLightbox() {
        $lb.fadeOut(200, function () {
            $(this).css('display', 'none');
            $lbImg.attr('src', '');
            $('body').css('overflow', '');
        });
    }

    function goTo(index) {
        if (animating || items.length === 0) return;
        animating = true;
        current = (index + items.length) % items.length;
        const it = items[current];

        $lbImg.fadeOut(140, function () {
            $lbImg.attr('src', it.src).attr('alt', it.alt);
            updateChrome(current);
            $lbImg.fadeIn(160, function () { animating = false; });
        });
    }

    $grid.on('click', '.featured-card', function () {
        collect();
        const idx = $grid.find('.featured-card').index(this);
        if (idx >= 0) openLightbox(idx);
    });

    $grid.find('.featured-card').attr({ tabindex: 0, role: 'button' });
    $grid.on('keydown', '.featured-card', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    $('#lb-close').on('click', closeLightbox);
    $('#lb-prev').on('click', function (e) { e.stopPropagation(); goTo(current - 1); });
    $('#lb-next').on('click', function (e) { e.stopPropagation(); goTo(current + 1); });

    $lb.on('click', function (e) { if (e.target === this) closeLightbox(); });

    $(document).on('keydown', function (e) {
        if (!$lb.is(':visible')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });
});
/* light/dark theme toggle*/
(function () {
    const THEME_KEY = 'cinescope_theme';
    const $body     = $('body');
    const $toggle   = $('#theme-toggle');
    const $icon     = $toggle.find('.theme-icon');

    function applyTheme(theme) {
        if (theme === 'light') {
            $body.addClass('light-theme');
            $icon.text('☀️');
            $toggle.attr('title', 'Switch to dark theme');
        } else {
            $body.removeClass('light-theme');
            $icon.text('🌙');
            $toggle.attr('title', 'Switch to light theme');
        }
    }

    // Load saved theme on every page (runs immediately)
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);

    // Toggle on click
    $toggle.on('click', function () {
        const isLight = $body.hasClass('light-theme');
        const next = isLight ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);

        // Small feedback animation
        $(this).stop(true, true).animate({ opacity: 0.4 }, 90)
               .animate({ opacity: 1 }, 120);
    });
})();

/* FAQ accordition*/
$(function () {
    const $faq = $('.faq-list');
    if ($faq.length === 0) return;

    $faq.on('click', '.faq-question', function () {
        const $btn    = $(this);
        const $item   = $btn.closest('.faq-item');
        const $answer = $item.find('.faq-answer');
        const isOpen  = $btn.attr('aria-expanded') === 'true';
        $faq.find('.faq-question[aria-expanded="true"]')
            .not($btn)
            .attr('aria-expanded', 'false')
            .each(function () {
                $(this).closest('.faq-item')
                    .find('.faq-answer').slideUp(260);
                $(this).find('.faq-indicator').text('+');
            });

        // Toggle clicked item with smooth slide animation
        $answer.stop(true, true).slideToggle(260);

        $btn.attr('aria-expanded', String(!isOpen));
        $btn.find('.faq-indicator').text(isOpen ? '+' : '−');
    });
});
// Populate movie select on reviews page
$(function () {
    const $movie = $('#movie');
    if ($movie.length === 0) return;

    loadMovies().then(movies => {
        if (!movies.length) return;

        const sorted = [...movies].sort((a, b) => a.name.localeCompare(b.name));
        const options = sorted.map(m =>
            `<option value="${m.name}">${m.name} (${m.year})</option>`
        ).join('');

        $movie.append(options);
    });
});
