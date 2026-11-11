# CineScope — Movie Website
## 1. Project Title & Topic
* **Project Title:** CineScope
* **Topic:** Movie Website: info, ratings, trailers, reviews
---
## 2. Group Member Names
* **Dayana Zharylgapova** 
* **Medina Alish** 
* **Mukhammedali Bolegen**
---
## 3. Description of the Project
**CineScope** is a multi-page, fully responsive website for movie enthusiasts. It is packed with features for rating, selecting and browsing films, featuring a user-friendly, intuitive design that adapts to all devices.
---
## 4. Features Implemented
* **Multi-Page Site Structure:**
  1. `index.html` (Home): Hero banner, featured movie cards, key benefits, weekly top 3 list, and call-to-action block.
  2. `movies.html` (Movies): Full interactive catalog showing top movies, release years, and rating scores.
  3. `trailers.html` (Trailers): Grid of video trailer cards with dynamic YouTube thumbnails linking directly to official trailers.
  4. `reviews.html` (Reviews & Ratings): Top-rated films presented in a custom table, real user review cards, and an interactive review submission form.
  5. `contact.html` (Contact Us): Contact channels (address, email, phone) and an inquiry form.
  6. `register.html` (Register): User registration form with validation and password confirmation.
* **Navigation & Header:**
  * Fixed/sticky header with backdrop blur effect for effortless navigation.
  * Active navigation link indicators corresponding to the current page.
  * Responsive burger menu toggle for small screens.
  * A dynamic search bar with genre filters dropdown.

* **Semantic HTML5 Architecture:**
  * Clean layout structure utilizing semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`).
  * Explicit form validation attributes (`required`, `type="email"`, `select`, `textarea`).

* **Advanced Layouts & Styling:**
  * **Flexbox:** Used for navigation bar alignment and footer columns.
  * **CSS Grid:** Implemented for equal-height movie poster cards and review cards.
  * **CSS Variables (`:root`):** Standardized color palettes, font sizes, spacing, and transition speeds.
  * **Pseudo-classes (`:nth-child()`, `:hover`, `:focus`):** Applied alternating accent borders on cards, zebra striping on tables, and focus states on input fields.
  * **Performance:** Image lazy-loading implemented via `loading="lazy"`.

* **Responsive Design:**
  * Custom media queries for two distinct breakpoints (Tablet: `768px` and Mobile: `488px`).
  * Bootstrap Grid integration (`container`, `row`, `col-md-*`, `col-lg-*`) ensuring responsive layout shifts.

* **Form validation (register, contact, review forms):**
  * Required fields, email format checked with RegEx, and password
    confirmation matching.
  * A live password-strength meter (weak / medium / strong) based on
    length, mixed case, digits and symbols.
  * Instant feedback with error messages, valid/invalid highlighting and
    Bootstrap alerts — the form won't submit until everything is correct.

* **Dynamic search & filter:**
  * Real-time search over the movie catalogue — results update on every
    keystroke, no reload.
  * Trigram-based ranking, plus a smart rating filter (e.g. `sci 8.5`
    shows Sci-Fi movies rated 8.5+).
  * Genre dropdown that works together with the search bar.
  * Movie data is loaded from `/res/movies.txt` via `$.get`.

* **Dynamic table with CRUD (`reviews.html`):**
  * Movies are listed in a table and can be added, edited and deleted
    through modal dialogs.
  * Deleting asks for confirmation first.
  * Changes are saved in `localStorage`, so records survive a page reload.
  * A quick filter-by-title input and Esc/Enter keyboard shortcuts.

* **Image gallery lightbox:**
  * Clicking a movie poster opens it in a full-size lightbox.
  * Prev/Next arrows, image counter, keyboard navigation and
    click-outside to close.
  * Smooth fade-in/fade-out animations with jQuery.
---
## 5. Technologies Used
* **HTML5:** Semantic markup, tables, forms, and validation.
* **CSS3:** Custom styles, CSS Grid, Flexbox, `:root` CSS variables, transitions, and media queries (`style.css`).
* **jQuery:** Selectors, event listeners, file read.
* **Bootstrap (v5.3.3):** Container grids, responsive utility classes, and table wrappers.
* **Google Fonts:** `Poppins` font family for typography.
---
## 6. Individual Contribution of Member
* **Dayana Z.:**
  Was responsible for the movies, trailers, and contacts pages. The site's CSS styles were created by both team members. In jQuery, built the **CRUD table** (create/edit/delete via modals, saved in `localStorage`) and the **image gallery lightbox** with prev/next navigation and smooth fade transitions

* **Medina A.:**
  Created the "main" and "reviews" pages and a curated list of resources. The site's CSS styles were created by both team members. Handled **client-side form validation** — required fields, email RegEx, password matching, a live password-strength meter and real-time error feedback.

* **Mukhammedali B.:**
  Added dynamic search bar with genre filter and moved all movies to `.txt` to load from there.
---
## 7. Link to the Published Website
* **Live Website:** [https://tokisao.github.io/movie-website/index.html](https://tokisao.github.io/movie-website/index.html)
