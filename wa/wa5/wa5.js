const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  // Toggle the 'show' class to show/hide the menu
  navMenu.classList.toggle('show');
   navToggle.classList.toggle('open'); // <-- add this line

  // Get current state of aria-expanded (true or false)
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

  // Set the opposite of current value
  navToggle.setAttribute('aria-expanded', !isExpanded);
});