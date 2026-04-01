const about = document.getElementById("about");
const buttonAbout = document.getElementById("buttonAbout");

buttonAbout.addEventListener("click", function () {
  if (about.classList.contains("hidden")) {
    about.classList.remove("hidden");
    buttonAbout.innerText = "Свернуть";
  } else {
    about.classList.add("hidden");
    buttonAbout.innerText = "Обо мне";
  }
});
