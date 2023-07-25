/* Это объявление переменной, мы нашли кнопку по тегу */
const button = document.querySelector('.button');
// Объявление переменной для скрытого блока, нашли по Id
let about = document.getElementById("about");

/* Тут на кнопку навешиваем обрабочик, который ждёт клика и тогда запустит логику */
 button.addEventListener ('click',
 	function toggleClass(){
 		about.classList.toggle('hidden');
 		button.innerText = 'Свернуть'
 		// button.innerText = 'Обо мне'
 		}
);