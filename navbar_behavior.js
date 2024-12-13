//navbar_behavior.js
// document.addEventListener("DOMContentLoaded", () => {
//     const navbar = document.querySelector('.navbar');
//     const navbarOffset = navbar.offsetTop;

//     window.addEventListener("scroll", () => {
//         if (window.scrollY > navbarOffset) {
//             navbar.classList.add('navbar-fixed-top');
//         } else {
//             navbar.classList.remove('navbar-fixed-top');
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector('.navbar'); // Select the navbar
    const navbarOffset = navbar.offsetTop; // Get its offset from the top of the page

    window.addEventListener('scroll', () => {
        if (window.scrollY > navbarOffset) {
            navbar.classList.add('navbar-fixed-top'); // Add the class when scrolled past
        } else {
            navbar.classList.remove('navbar-fixed-top'); // Remove it otherwise
        }
    });
});


