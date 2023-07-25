// Это объявление переменной, мы нашли кнопку по тегу
const button = document.querySelector('.button');
// Объявление переменной для скрытого блока, нашли по Id
let about = document.getElementById("about");

//Тут на кнопку навешиваем обрабочик, который ждёт клика и тогда запустит логику
button.onclick = function () {        
	//по клику на кнопку выполняется функция с циклом внутри
	if (button.innerText === 'Обо мне') {
		about.classList.toggle('hidden');
		button.innerText = ('Свернуть');
		//если текст на кнопке "Обо мне", то открывается блок и меняется текст на "Свернуть"
	} else {
		about.classList.toggle('hidden');
		button.innerText = ('Обо мне');
		//если текст на кнопке "Свернуть", то блок сворачивается и меняется текст на "Обо мне"
	}
};