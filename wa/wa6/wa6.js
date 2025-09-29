const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  
  navMenu.classList.toggle('show');
   navToggle.classList.toggle('open'); 

  
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

  
  navToggle.setAttribute('aria-expanded', !isExpanded);
});