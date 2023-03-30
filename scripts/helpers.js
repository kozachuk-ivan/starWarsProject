// core
const showBtnRight = document.querySelector('.show__btn-right');
const showBtnLeft = document.querySelector('.show__btn-left');
const nextBtn = document.querySelector('.show__btn-card-right');
const prevBtn = document.querySelector('.show__btn-card-left');

export function disableAndEnableHelper(heroes, showNextHeroesEventListener, showPrevHeroesEventListener) {
	if ( heroes.next === null || heroes.previous === null ) {
		if(heroes.next === null) {
			nextBtn.removeEventListener('click', showNextHeroesEventListener)
			showBtnRight.classList.add('disable')
		} else {
			prevBtn.removeEventListener('click', showPrevHeroesEventListener)
			showBtnLeft.classList.add('disable')
		}
	} else {
		if(showBtnRight.className.includes('disable')) {
			showBtnRight.classList.remove('disable') 
			nextBtn.addEventListener('click', showNextHeroesEventListener)
		} else {
			showBtnLeft.classList.remove('disable')
			prevBtn.addEventListener('click', showPrevHeroesEventListener)
		}
	}
}