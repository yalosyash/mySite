const about = document.getElementById("about");
const buttonAbout = document.getElementById("buttonAbout");

if (about && buttonAbout) {
  buttonAbout.addEventListener("click", function () {
    const isHidden = about.classList.contains("hidden");
    about.classList.toggle("hidden");
    buttonAbout.innerText = isHidden ? "Свернуть" : "Обо мне";
    buttonAbout.setAttribute("aria-expanded", String(!isHidden));
  });
}
