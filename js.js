const about = document.querySelector('.about');
const button = document.querySelector('.button');
button.onclick = function() {
	const text = ["Обо мне", "Свернуть"];
	about.classList.toggle("hidden");
	(button.textContent === text[0]) ? button.innerText = text[1] : button.innerText = text[0];
};