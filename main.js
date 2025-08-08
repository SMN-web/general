export function showPanel(id) {
   document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
}

// Themes
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

// Save/load theme preference to localStorage
export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === THEME_DARK || savedTheme === THEME_LIGHT) {
    setTheme(savedTheme);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? THEME_DARK : THEME_LIGHT);
  }
}

// Toggle theme (call on user action)
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === THEME_DARK ? THEME_LIGHT : THEME_DARK);
}

// Responsive mobile menu helper
// Adds/removes 'mobile' class on body for viewport < 600px
export function handleResponsive() {
  const mobile = window.innerWidth < 600;
  if (mobile) {
    document.body.classList.add('mobile');
  } else {
    document.body.classList.remove('mobile');
  }
}

// Session/local storage for login persistence
export function saveLoginSession(email, role, token) {
  localStorage.setItem('session_email', email);
  localStorage.setItem('session_role', role);
  if (token) localStorage.setItem('session_token', token);
}

export function loadLoginSession() {
  const email = localStorage.getItem('session_email');
  const role = localStorage.getItem('session_role');
  const token = localStorage.getItem('session_token');
  if (email && role) return { email, role, token };
  return null;
}

export function clearLoginSession() {
  localStorage.removeItem('session_email');
  localStorage.removeItem('session_role');
  localStorage.removeItem('session_token');
}

// Centralized browser native back/forward navigation handling
// initPanels is an object with functions to init admin, moderator, user panels and optionally switch admin tab
export function setupPopStateHandler(initPanels) {
  window.addEventListener('popstate', (event) => {
    const state = event.state || {};
    if (state.view) {
      showPanel(state.view + '-panel');

      if (state.view === 'admin') {
        initPanels.initAdminPanel();
        if (state.tabId) {
          initPanels.switchAdminTab && initPanels.switchAdminTab(state.tabId, false);
        }
      } else if (state.view === 'moderator') {
        initPanels.initModeratorPanel && initPanels.initModeratorPanel();
      } else if (state.view === 'user') {
        initPanels.initUserPanel && initPanels.initUserPanel();
      } else if (state.view === 'login') {
        // just show login panel; no special init needed
      }
    } else {
      // fallback to login panel
      showPanel('login-panel');
    }
  });
}

// Optionally bind resize event to handle responsive layout
export function setupResponsiveListener() {
  handleResponsive();
  window.addEventListener('resize', handleResponsive);
}
