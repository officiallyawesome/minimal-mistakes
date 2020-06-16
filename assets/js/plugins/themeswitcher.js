var DEFAULT_THEME = 'dark';
var ALT_THEME = 'light';
var STORAGE_KEY = 'css-theme';
var colorscheme = document.getElementsByName('colorscheme');

/* changes the active radiobutton */
function indicateTheme(mode) {
  for (var i = colorscheme.length; i--;) {
    if (colorscheme[i].value == mode) {
      colorscheme[i].checked = true;
    }
  }
}

/* turns alt stylesheet on/off */
function applyTheme(mode) {
  var activeMode = DEFAULT_THEME;
  var otherMode = ALT_THEME;
  if (mode == ALT_THEME) {
    activeMode = ALT_THEME;
    otherMode = DEFAULT_THEME;
  }
  var active = document.getElementById(STORAGE_KEY + '-' + activeMode);
  var other = document.getElementById(STORAGE_KEY + '-' + otherMode);
  active.setAttribute('media', 'all');
  other.setAttribute('media', 'speech');
}

/* handles radiobutton clicks */
function setTheme(e) {
  var mode = e.target.value;
  if (mode == 'auto') {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, mode);
  }
  /* when the auto button was clicked the auto-switcher needs to kick in */
  var e = window.matchMedia('(prefers-color-scheme: ' + ALT_THEME + ')');
  autoTheme(e);
}

/* handles the media query evaluation, so it expects a media query as parameter */
function autoTheme(e) {
  var current = localStorage.getItem(STORAGE_KEY);
  var mode = 'auto';
  var indicate = 'auto';
  /* user set preference has priority */
  if (current != null) {
    indicate = mode = current;
  } else if (e != null && e.matches) {
    mode = ALT_THEME;
  }
  applyTheme(mode);
  indicateTheme(indicate);
}

document.addEventListener('gdprCookiesEnabled', function(e) {
  if (e.detail.performance) {
    /* create an event listener for media query matches and run it immediately */
    var mql = window.matchMedia('(prefers-color-scheme: ' + ALT_THEME + ')');
    autoTheme(mql);
    mql.addListener(autoTheme);

    /* set up listeners for radio button clicks */
    for (var i = colorscheme.length; i--;) {
      colorscheme[i].onclick = setTheme;
    }

    /* display theme switcher form(s) */
    var themeforms = document.getElementsByClassName("page__footer-theme");
    for (var i = themeforms.length; i--;) {
      themeforms[i].style.display = 'inline-block';
    }
  }
});
