/* Это объявление переменной, мы нашли кнопку по тегу */
let button = document.querySelector('.button-link');
let about = document.getElementById("about");
/* Тут на кнопку навешиваем обрабочик, который ждёт клика и тогда запустит логику */
button.addEventListener ('click',
function toggleClass(){
	about.classList.remove("hide");
	about.classList.add("about");
	// alert(about.className);  
})

