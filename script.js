const toggle = document.querySelector('.theme-toggle__checkbox');

toggle.addEventListener('change', function () {
  if (this.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
});
