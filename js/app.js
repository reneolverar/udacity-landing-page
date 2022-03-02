/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
**/


/********
 * Define Global Variables
**/

// Get the empty unordered navigation list that will be populated with JS: <ul id="navbar__list"></ul>
let navigation = document.getElementById('navbar__list');
// Get all the sections of the HTML to populate the navigation bar
const sections = document.querySelectorAll('section');

/**
 * End Global Variables
 ********/


/********
 * Start Helper Functions
**/

// Function to apply display style to elements
function toggleVisibility (element, styleDisplay) {
    element.style.display = styleDisplay;
}

// Function to make the "Go to top" button visible or not depending on the position of the viewport on the document
function toggleGoToTopButton (firstElementOffsetTop) {
    if (firstElementOffsetTop <=0) {
        toggleVisibility(navigation.firstElementChild, "inline-block");
    }
    else {
        toggleVisibility(navigation.firstElementChild, "none");
    }
}

// Function to hide navigation bar when no scrolling happened in the last x seconds
function hideNavigationBar () {
    toggleVisibility(navigation, "none");
}

// Function to add a button-type functionality with the text "+" to toggle the visibility of the section
function addCollapseFunctionality (section) {
    section.getElementsByTagName("h2")[0].innerHTML += " +";
}

// Function to toggle the visibility of the paragraphs of the sections when clicked
function toggleCollapse (event) {
    const targetLenght = event.target.innerHTML.length;
    if (event.target.tagName == "H2") {
        const paragraphs = event.target.parentElement.getElementsByTagName("p");
        if (event.target.innerHTML[targetLenght -1] == "+") {
            event.target.innerHTML = event.target.innerHTML.replace('+', '-');
            for (const paragraph of paragraphs) {
                toggleVisibility(paragraph, "none");
            }
        }
        else {
            event.target.innerHTML = event.target.innerHTML.replace('-', '+');
            for (const paragraph of paragraphs) {
                toggleVisibility(paragraph, "block");
            }
        }
    }
}

/**
 * End Helper Functions
 ********/


/********
 * Begin Main Functions
**/

// Build the nav
function navBuilder () {

    /* Code to test performance */
    // const startingTime = performance.now();

    let navList = '';

    // Create the "Go to top" button from start and hide / unhide to avoid reflows and only do repaints
    navList += `<li><a class="menu__link" href="#">Go to top</a></li>`;

    // Create a navigation element for each section and an event listener for collapsing function toggleCollapse
    for(const section of sections) {

        addCollapseFunctionality(section);

        // Create an event listener for each section header
        section.addEventListener('click', toggleCollapse);

        const sectionID = section.id;
        const sectionDataNav = section.dataset.nav;
        // href="#${ref}" = go to top (#) of ID ($) of "ref"
        navList += `<li><a class="menu__link" href="#${sectionID}">${sectionDataNav}</a></li>`;
    }

    // Write all elements (sections) to the navigation
    navigation.innerHTML = navList;

    // Hide the "Go to top" button when page loads to unhide later after scrolling
    toggleVisibility(navigation.firstElementChild, "none");

    /* Code to test performance */
    // const endingTime = performance.now();
    // console.log('This code took ' + (endingTime - startingTime) + ' milliseconds.');

}

navBuilder();

// Add class 'active' to section when near top of viewport
// Highlights navigation and section according to closest scroll position of the screen
function activateSection () {

    // Unhide navigation list directly after the user scrolled the page in case it was hidden
    toggleVisibility(navigation, "block");

    // Select all elements of the navigation bar
    const navigations = document.querySelectorAll('.menu__link');

    // Check if below first section and toggle the GoToTopButton
    const firstElementOffsetTop = Math.floor(sections[0].getBoundingClientRect().top);
    toggleGoToTopButton(firstElementOffsetTop);

     // iterate the sections and navigations.
    for (let i = 0; i < sections.length; i++) {

        // Get the position of the section to the nearest integer
        const elementOffsetTop = Math.floor(sections[i].getBoundingClientRect().top);
        const elementOffsetHeight = Math.floor(sections[i].getBoundingClientRect().height);

        // Check if section is in view
        inViewport = () => elementOffsetTop <= 0 && elementOffsetTop > - elementOffsetHeight;

        // Remove active class from section and navigation
        sections[i].classList.remove('your-active-class');
        navigations[i+1].classList.remove('menu__activate');

        // Add a class if conditional is met
        if (inViewport()){
            sections[i].classList.add('your-active-class');
            navigations[i+1].classList.add('menu__activate');
        }
    }
    setTimeout(hideNavigationBar, 5000);
}

// Scroll to anchor ID using scrollTO event

function scrollToSection (event) {
    event.preventDefault();
    if (event.target.innerText == "Go to top") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else {
        document.querySelector(event.target.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    };
};

navigation.addEventListener('click', scrollToSection);

/**
 * End Main Functions
 ********/


/********
 * Begin Events
**/

window.addEventListener('scroll', activateSection);