
import Slider from './utils/slider-28.js';
import phoneNumberMask from './utils/maskPhone.js';


try {
	
const allDocuments = document.querySelectorAll('.document');
const allDocBtn = document.querySelectorAll('.doc-instruction__btn');

allDocBtn.forEach((btn, indexBtn) => {
	btn.addEventListener('click', () => {
		allDocBtn.forEach(btn => btn.classList.remove('active-doc-btn'));
		allDocuments.forEach(doc => doc.classList.remove('active-doc'));
		allDocuments[indexBtn].classList.add('active-doc');
		btn.classList.add('active-doc-btn')
	});
});

} catch (error) {
	console.log(error);
}



// Элементы для отображения общего количества шагов и текущего шага (например 1 из 5)
// const totalStep = document.querySelectorAll('.total-steps');
// const stepSlide = document.querySelectorAll('.step-slide');




// Объект медиа-запросов, в ключах прописываем сколько видно слайдов, в css устанавливаем какое количество слайдов видно: .item {
// 	flex-shrink: 0;
// 	flex-grow: 0;
// 	width: 25%; (25% это 4 слайда , 50% = 2 , 33% = 3, и тд)
// 	padding: 0 14px;
// }

// для правильной работы счетчика шагов нужно прописать ключ для каждого изменения кол-ва видимых слайдов и указать разрешение при котором кол-во видимых слайдов меняется(в объекте указываем те же медиа запросы что и в css):
// const media = {
// 	1: window.matchMedia('(max-width: 500px)'), 1 видимый слайд
// 	2: window.matchMedia('(max-width: 767px)'), 2 видимых слайда
// 	3: window.matchMedia('(max-width: 1024px)'), 3 видимых слайда
// 	4: window.matchMedia('(min-width: 1025px)'), 4 видимых слада
// };


function initializeSlider(selector) {
	const allContainerSlider = selector;
	if (allContainerSlider) {

		const media = {
			1: window.matchMedia('(min-width: 0px)')
		};
		//Перебор нужен для для возможности инициализации множества слайдеров
		document.querySelectorAll(selector).forEach((elem, index) => {
			// Объект с элементами слайдера, если кнопки ненужны не указываем их в объекте
			const $sliderAllElem = {
				btnNext: document.querySelectorAll('.btn-next-slide')[index],
				btnPrev: document.querySelectorAll('.btn-prev-slide')[index],
				containerSlider: elem,
				slider: elem.querySelector('.slider'),
				itemLength: elem.querySelectorAll('.item').length,
				item: elem.querySelector('.item'),
			}

			// Создаем объект слайдер
			const sliderObj = new Slider(media);

			sliderObj.initSlider($sliderAllElem);//инициализация слайдера

			// sliderObj.initCount(totalStep[index], stepSlide[index]);//инициализация счетчика, не обязательна


			sliderObj.initDragDrop('desktop');//инициализация drag'n drop не обязательна, если для desktop ненужно, то вызываем метод без аргумента

			// Для инициализации иконок шагов без отображения общего количества шагов и текущего шага нужно вызвать sliderObj.initCount() без аргументов

			sliderObj.initCount();//инициализация счетчика для подсчета, без параметров:
			// Элементы для отображения общего количества шагов и текущего шага
			// const totalStep = document.querySelectorAll('.total-steps');
			// const stepSlide = document.querySelectorAll('.step-slide');

			sliderObj.initIconCount();//инициализация иконок шагов radio

		});

	} else {
		console.warn(`Элемент ${selector} не найден. Слайдер не активирован.`);
	}
}

initializeSlider('.container-slider');




const initBurgerMenu = () => {
	const burgerMenu = document.querySelector('.burger-menu');

	const burgerMenuActive = () => {
		const line_1 = document.querySelector('.burger-menu__line-1');
		const line_2 = document.querySelector('.burger-menu__line-2');
		const line_3 = document.querySelector('.burger-menu__line-3');
		const burgerMenu = document.querySelector('.burger-menu');
		let active = false;
		burgerMenu.addEventListener('click', () => {
			line_1.classList.toggle('rotate-line-1');
			line_2.classList.toggle('display-none');
			line_3.classList.toggle('rotate-line-3');
			active = !active;

		})
		return () => active;
	}
	const getActiveState = burgerMenuActive();

	burgerMenu.addEventListener('click', () => {
		const headerMenu = document.querySelector('.header__menu');

		if (getActiveState) {
			headerMenu.classList.toggle('toggle-menu');
		}
	});
}
try {
	initBurgerMenu();

} catch (error) {
	console.log(error);
}





function initializePhoneNumberMask(selector) {
	const element = document.querySelector(selector);
	if (element) {

		phoneNumberMask(3, '+7(___)___-__-__', [')', '(', '-'], selector, true);

		//phoneNumberMask(стартовая позиция курсора,, маска,  массив не заменяемых символов, класс input к которому применяется маска,булево значение эффекта hover маски)

	} else {
		console.warn(`Элемент ${selector} не найден. Маска не будет применена.`);
	}
}

// Инициализация масок для мобильного и стационарного номеров
initializePhoneNumberMask('.mask-mobile');
initializePhoneNumberMask('.mask-landline');


const initFormAddAd = () => {
	const checkBoxAll = document.querySelectorAll('.price-form__checkbox');
	const inputAll = document.querySelectorAll('.price-form__input');

	checkBoxAll.forEach((checkbox, index) => {

		checkbox.addEventListener('change', function () {
			if (this.checked) inputAll[index].value = '';
			inputAll[index].disabled = this.checked;
		});
	});
};

try {
	initFormAddAd();

} catch (error) {
	console.log(error);
}





