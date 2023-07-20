/* Это объявление переменной, мы нашли кнопку по тегу */
const button = document.querySelector('.button-link');

let about = document.getElementById("about");

/* Тут на кнопку навешиваем обрабочик, который ждёт клика и тогда запустит логику */
button.addEventListener ('click',function toggleClass(){
	about.classList.toggle('hidden');
})

// const button = document.querySelector('button.hidden')

// так как класс есть, то он будет убран
// button.classList.toggle('hidden')