
class Slider {
	// Конструктор класса Slider, принимает объект mediaQueries
	constructor(mediaQueries) {
		this.mediaQueries = mediaQueries;  // Медиа-запросы для определения количества видимых слайдов
		this.sliderCount = false;  // Флаг для подсчета шагов слайдера
		this.iconCount = false;  // Флаг для отображения счетчика
		this.sliderNumberStep = false; // Элементы для отображения общего количества шагов и текущего шага
	}

	initIconCount() {
		this.iconCount = document.querySelectorAll('.radio');//Кол-во icon реализуем равное количеству шагов, регулировать кол-во icon при изменение кол-ва шагов(когда видимых слайдов больше одного) можно через css
	}

	// Метод инициализации слайдера, принимает объект с параметрами
	initSlider({ btnNext = null, btnPrev = null, containerSlider, slider, item, itemLength }) {
		this.windowWidth = document.documentElement.clientWidth;  // Ширина окна
		this.item = item;  // Один элемент слайдера
		this.btnNext = btnNext;  // Кнопка для перехода к следующему слайду
		this.btnPrev = btnPrev;  // Кнопка для перехода к предыдущему слайду
		this.containerSlider = containerSlider;  // Контейнер слайдера
		this.slider = slider;  // Сам слайдер
		this.sliderLength = itemLength;  // Количество элементов слайдера
		this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);  // Количество видимых слайдов
		this.distance = this.updateWidthItem();  // Ширина одного элемента слайдера
		this.position = 0;  // Начальная позиция слайдера

		// Установка обработчика события, когда документ полностью загружен
		document.addEventListener('DOMContentLoaded', () => {
			// this.slider.style.transition = 'transform .3s linear';  // Установка анимации перехода
			this.updateButtonStates();

			if (this.sliderCount) {
				this.setCountTotalStep();  // Установка общего количества шагов
				if (!this.sliderNumberStep) return;
				this.showTotalStep();  // Отображение общего количества шагов
			}
		});

		// Обработчик события изменения размера окна
		window.addEventListener('resize', () => {
			let newWindowWidth = document.documentElement.clientWidth;
			if (newWindowWidth === this.windowWidth) return;
			this.resetSlider();  // Сброс слайдера
			this.distance = this.updateWidthItem();  // Обновление ширины элемента
			this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);  // Обновление видимых слайдов

			if (this.sliderCount) {
				this.setCountTotalStep();  // Установка общего количества шагов
				if (!this.sliderNumberStep) return;
				this.showTotalStep();  // Отображение общего количества шагов
			}
			this.windowWidth = newWindowWidth;
			this.updateButtonStates();
		});

		// Установка обработчиков событий для кнопок перехода
		if (btnNext && btnPrev) {
			this.btnPrev.addEventListener('click', () => {
				this.movePrev();  // Переход к предыдущему слайду
				this.updateButtonStates();
				if (this.sliderCount) {
					this.showSlideStep();  // Отображение текущего шага
				}
			});
			this.btnNext.addEventListener('click', () => {
				this.moveNext();  // Переход к следующему слайду
				this.updateButtonStates();
				if (this.sliderCount) {
					this.showSlideStep();  // Отображение текущего шага
				}
			});
		}
	}
	// Метод инициализации подсчета шагов
	initCount($totalStep = null, $stepSlide = null) {
		this.sliderCount = true;  // Флаг включения подсчета шагов

		if (!$totalStep || !$stepSlide) return;
		this.totalStep = $totalStep;  // Элемент для отображения общего количества шагов
		this.stepSlide = $stepSlide;  // Элемент для отображения текущего шага
		this.sliderNumberStep = true;
	}
	// Метод инициализации перетаскивания слайдера
	initDragDrop(desktop = false) {
		this.isDragging = false;  // Флаг перетаскивания
		this.touchStart = 0;  // Начальная точка касания/клика
		this.touchEnd = 0;  // Конечная точка касания/клика
		this.touchMove = 0;  // Текущая позиция перетаскивания

		// Обработчик события начала касания
		this.slider.addEventListener('touchstart', (e) => {
			e.preventDefault();
			this.startDragDrop(e.touches[0].clientX);
		}, { passive: false });

		// Обработчик события перемещения касания
		this.slider.addEventListener('touchmove', (e) => {
			if (!this.isDragging) return;
			e.preventDefault();
			this.moveDragDrop(e.touches[0].clientX);
		}, { passive: false });

		// Обработчик события завершения касания
		document.addEventListener('touchend', (e) => {
			if (!this.isDragging) return;
			e.preventDefault();
			this.endDragDrop();
		});

		if (!desktop) return;

		// Обработчики событий для мыши
		this.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();
			this.startDragDrop(e.clientX);
		}, { passive: false });

		this.slider.addEventListener('mousemove', (e) => {
			if (!this.isDragging) return;
			e.preventDefault();
			this.moveDragDrop(e.clientX);
		}, { passive: false });

		document.addEventListener('mouseup', (e) => {
			if (!this.isDragging) return;
			e.preventDefault();
			this.endDragDrop();
		});
	}
	//Метод проверки кнопок для отключения или включения
	updateButtonStates() {
		if (this.btnNext) {
			this.btnNext.disabled = this.position <= this.sliderEnd();
		}
		if (this.btnPrev) {
			this.btnPrev.disabled = this.position >= 0;
		}
	}
	// Метод начала перетаскивания
	startDragDrop(value) {
		this.isDragging = true;
		this.touchStart = value;
	}
	// Метод перемещения при перетаскивании
	moveDragDrop(value) {
		this.touchMove = value - this.touchStart + this.position;
		this.animateSlider(this.slider, this.touchMove);
		this.touchEnd = value;
	}
	// Метод завершения перетаскивания
	endDragDrop() {
		this.isDragging = false;
		this.position = this.touchMove;

		setTimeout(() => {
			// Если позиция больше 0, вернуться к началу
			if (this.position > 0) {
				this.animateSlider(this.slider, 0);
				this.position = 0;
				if (this.sliderCount) {
					this.showSlideStep();
				}
				// Если позиция меньше конца слайдера, вернуться к концу
			} else if (this.position < this.sliderEnd()) {
				this.animateSlider(this.slider, this.sliderEnd());
				this.position = this.sliderEnd();
				this.showSlideStep();
				// Если перетаскивание было значительным, перейти на следующий слайд
			} else if (this.touchEnd - this.touchStart < -20) {
				this.position = this.distance * (Math.floor(this.position / this.distance));
				if (this.sliderCount) {
					this.showSlideStep();
				}
				this.animateSlider(this.slider, this.position);
				// Если перетаскивание было значительным, перейти на предыдущий слайд
			} else if (this.touchEnd - this.touchStart > 20) {
				this.position = this.distance * (Math.ceil(this.position / this.distance));
				if (this.sliderCount) {
					this.showSlideStep();
				}
				this.animateSlider(this.slider, this.position);
				// Иначе, оставить на текущем слайде
			} else {
				this.position = this.distance * (Math.round(this.position / this.distance));
				this.animateSlider(this.slider, this.position);
			}
			this.updateButtonStates();
		}, 100);
	}
	// Метод вычисления конца слайдера
	sliderEnd() {
		return -(this.sliderLength * this.distance - this.visibleSlides * this.distance);
	}
	// Метод установки общего количества шагов
	setCountTotalStep() {
		this.countStep = this.sliderLength - this.visibleSlides + 1;
	}
	// Метод отображения общего количества шагов
	showTotalStep() {
		if (!this.sliderNumberStep) return;
		this.totalStep.textContent = this.countStep;
	}
	// Метод отображения текущего шага
	showSlideStep() {

		if (this.position > 0) return;

		const value = Math.abs(this.position / this.distance) + 1;
		if (this.iconCount) {
			this.iconCount.forEach(el => el.classList.remove('radio-active'));
			this.iconCount[value - 1].classList.add('radio-active');
			console.log(value);
		}
		if (!this.sliderNumberStep) return;
		if (value >= this.totalStep.textContent) {
			this.stepSlide.textContent = this.totalStep.textContent;
			return;
		}
		this.stepSlide.textContent = value;
	}
	// Метод получения количества видимых слайдов по медиа-запросам
	getVisibleSlidesMediaQueries(media) {
		for (let key in media) {
			if (media[key].matches) {
				return parseInt(key);
			}
		}
	}
	// Метод обновления ширины элемента
	updateWidthItem() {
		return this.item.offsetWidth;
	}
	// Метод перехода к следующему слайду
	moveNext() {
		const valueEnd = this.visibleSlides * this.distance - this.distance * this.sliderLength;
		if (this.position <= valueEnd) {
			return;
		}
		this.position = this.position - this.distance;
		this.animateSlider(this.slider, this.position);
	}
	// Метод перехода к предыдущему слайду
	movePrev() {
		if (this.position === 0) {
			return;
		}
		this.position = this.position + this.distance;
		this.animateSlider(this.slider, this.position);
	}
	// Метод анимации слайдера
	animateSlider(elem, value) {
		requestAnimationFrame(() => {
			elem.style.transform = `translateX(${value}px)`;
		});
	}
	// Метод сброса слайдера
	resetSlider() {
		this.position = 0;
		if (this.sliderNumberStep) {
			this.stepSlide.textContent = 1;
		}
		this.animateSlider(this.slider, this.position);
	}
}

export default Slider;