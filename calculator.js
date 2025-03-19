const switchModeBtn = document.querySelector(
  ".toggle-mode .material-symbols-outlined"
);
const html = document.documentElement;
const body = document.body;

let isDarkMode = true;

switchModeBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    html.classList.remove("light-theme");
    html.classList.add("dark-theme");
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    switchModeBtn.textContent = "dark_mode";
  } else {
    html.classList.remove("dark-theme");
    html.classList.add("light-theme");
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    switchModeBtn.textContent = "light_mode";
  }
});
