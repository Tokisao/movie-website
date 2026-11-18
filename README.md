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
## 3. AI Usage Disclosure
We used AI (DeepSeek and ChatGPT) to help us build this project. We used it to review some of the HTML, CSS and JavaScript code and to fix bugs. We also used it to suggest layout ideas. We tested everything ourselves, but we want to be honest that AI was used in this project for assistance.

We also added a note about AI usage in the footer of every page on the website.
---
## 4. Description of the Project
**CineScope** is a multi-page, fully responsive website for movie enthusiasts. It is packed with features for rating, selecting and browsing films, featuring a user-friendly, intuitive design that adapts to all devices.
---
## 5. Features Implemented
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
 
* **Other Features:**
  * Dark/light theme toggle, saved in localStorage
  * Image gallery with lightbox (click a poster to view it, arrow keys to navigate)
  * FAQ accordion on the contact page
  * Login state shown in the nav (profile dropdown with logout)
  * Movie data pulled from a public API (api.streamx.qzz.io)
---
## 6. Technologies Used
* **HTML5:** Semantic markup, tables, forms, and validation.
* **CSS3:** Custom styles, CSS Grid, Flexbox, `:root` CSS variables, transitions, and media queries (`style.css`).
* **jQuery:** Selectors, event listeners, file read.
* **Bootstrap (v5.3.3):** Container grids, responsive utility classes, and table wrappers.
* **Google Fonts:** `Poppins` font family for typography.
---
## 7. Individual Contribution of Member
* **Dayana Z.:**
  Was responsible for the movies, trailers, and contacts pages. The site's CSS styles were created by both team members. In jQuery, built the CRUD table (create, edit, delete via modals, saved in localStorage) and the image gallery lightbox with prev/next navigation and smooth fade transitions. Also made the theme toggle for light/dark mode, the FAQ accordion, and the featured movies section on the home page.
  
* **Medina A.:**
  Created the main and reviews pages and a curated list of resources. The site's CSS styles were created by both team members. Handled client-side form validation like required fields, email RegEx, password matching, a live password-strength meter and real-time error feedback. Also did the sign in and registration functionality, plus the login state in the nav bar with the profile dropdown and logout.

* **Mukhammedali B.:**
  Added the dynamic search bar with genre filter and moved all movies to a txt file to load from there. Also connected the external API to get the movie library, built the trailers page using the API, and added the feature where movie posters get bigger when you click them.
---
## 8. Link to the Published Website
* **Live Website:** [https://tokisao.github.io/movie-website/index.html](https://tokisao.github.io/movie-website/index.html)
