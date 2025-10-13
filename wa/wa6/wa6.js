const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  
  navMenu.classList.toggle('show');
   navToggle.classList.toggle('open'); 

  
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

  
  navToggle.setAttribute('aria-expanded', !isExpanded);
});

// load saved theme on page load
window.addEventListener('load', function () {
  const savedTheme = localStorage.getItem('userTheme') || 'light';
  document.body.className = savedTheme;

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
});

// function to toggle theme
function toggleTheme() {
  let currentTheme = document.body.className || 'light';
  let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.body.className = newTheme;
  localStorage.setItem('userTheme', newTheme);

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}





// on page load check saved theme
window.addEventListener('load', function () {
  const optOut = localStorage.getItem('optOut') === 'true';
  const savedTheme = localStorage.getItem('userTheme') || 'light';

  if (!optOut) {
    document.body.className = savedTheme;
  }

  // update the checkbox if user opted out
  const optOutToggle = document.getElementById('opt-out-toggle');
  if (optOutToggle) {
    optOutToggle.checked = optOut;

    // save the opt-out choice when clicked
    optOutToggle.addEventListener('change', function () {
      localStorage.setItem('optOut', optOutToggle.checked ? 'true' : 'false');
    });
  }

  // action when clear data button is clicked
  const clearBtn = document.getElementById('clear-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      localStorage.clear();     
      location.reload();         
    });
  }
});

// switch between dark and light themes
function toggleTheme() {
  const optOut = localStorage.getItem('optOut') === 'true';
  let currentTheme = document.body.className || 'light';
  let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.body.className = newTheme;

  // only save if user didnt opt out
  if (!optOut) {
    localStorage.setItem('userTheme', newTheme);
  }

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}