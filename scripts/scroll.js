export function scrollIntoView() {
	let headerBtn = document.querySelector('.header__card-scroll')
	let watchHero = document.querySelector('.show');
	headerBtn.addEventListener('click', scrollToWatchBlock);
	function scrollToWatchBlock(event) {
		if (event.target.closest('.header__link')) {
			event.preventDefault()
		}
		watchHero.scrollIntoView({
			block: 'start',
			inline: "nearest",
			behavior: 'smooth'
		});
	}
}

export function scrollAnimation() {
	const animationItems = document.querySelectorAll('.scroll__animation');
	if (animationItems.length > 0) {
		window.addEventListener('scroll', animOnScroll);
		function animOnScroll(params) {
			for (let index = 0; index < animationItems.length; index++) {
				
				const animItem = animationItems[index];
				const animItemHight = animItem.offsetHeight;
				const animItemOffset = animItem.getBoundingClientRect().top + window.pageYOffset;
				const animStart = 4

				let animItemPoint = window.innerHeight - animItemHight / animStart; 

				if( animItemHight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if((window.pageYOffset > animItemOffset - animItemPoint) && window.pageYOffset < (animItemOffset + animItemHight)) {
					animItem.classList.add('_active');
				} else if (!animItem.classList.contains('unremove')) {
					animItem.classList.remove('_active');
				}
			}
		}
		setTimeout(() => {
			animOnScroll();
		}, 300);
	}
}
