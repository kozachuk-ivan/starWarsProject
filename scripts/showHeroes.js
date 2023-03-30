// api
import { getFilms, getPlanet, getSpecies, getHeroes } from './api.js';

export async function introAllPersons() {
	const nextBtn = document.querySelector('.show__btn-card-right');
	const prevBtn = document.querySelector('.show__btn-card-left');
	const sectionShow = document.querySelector('.show');
	const popUp = document.querySelector('.pop-up');
	const popUpBtn = document.querySelector('.pop-up__btn-back');
	const characterName = document.querySelector('.pop-up__character-name');
	const characterBday = document.querySelector('.pop-up__character-bday');
	const characterGender = document.querySelector('.pop-up__character-male');
	const countSpan = document.querySelector('.count__span');
	const preLoader = document.querySelector('.lds-dual-ring');

	let count = 1;
	let currentHeroesList;
	countSpan.textContent = count

	const showNextHeroesEventListener = () => {
		showNextOrPrevHeroes('next')
	}
	const showPrevHeroesEventListener = () => {
		showNextOrPrevHeroes('prev')
	}

	nextBtn.addEventListener('click', showNextHeroesEventListener);
	prevBtn.addEventListener('click', () => showPrevHeroesEventListener);
	sectionShow.addEventListener('click', showDetailHeroInfo);
	popUpBtn.addEventListener('click', closePopUp);

	async function showNextOrPrevHeroes(nextOrPrev) {
		preLoader.setAttribute('style', 'display: flex; background-color: rgba(0, 0, 0, 0.9);');
		nextOrPrev === 'next' ? count++ : count--;
		currentHeroesList = await getHeroes(count, showNextHeroesEventListener,showPrevHeroesEventListener)
			.then(() => preLoader.removeAttribute('style'));
		countSpan.textContent = count;	
	}

	function closePopUp() {
		popUp.removeAttribute('style');
		const liItems = document.querySelectorAll('.pop-up__character-films > li');
		liItems.forEach(item => item.remove());
		sectionShow.addEventListener('click', showDetailHeroInfo);
	}

	function showDetailHeroInfo(event) {
		if(event.target.closest('.show__card') || event.target.closest('.show__desc')) {
			sectionShow.removeEventListener('click', showDetailHeroInfo);
			preLoader.setAttribute('style', 'display: flex; background-color: rgba(0, 0, 0, 0.9);');
			let target;
			let filmsAPI = [];
			let planetAPI;
			let speciesAPI;

			if(event.target.className.includes('show__card')) {
				target = event.target.firstElementChild.textContent;
			} else {
				target = event.target.textContent;
			}

			currentHeroesList.forEach(hero => {				
				if(hero.name === target) {
					filmsAPI = hero.films;
					planetAPI = hero.homeworld;
					speciesAPI = hero.species;
					characterName.textContent = hero.name;
					characterBday.textContent = hero.birth_year;
					characterGender.textContent = hero.gender;
				}
			});

			const filmsResponse = getFilms(filmsAPI);
			const planetResponse = getPlanet(planetAPI);
			const speciesResponse = getSpecies(speciesAPI);

			Promise.all([filmsResponse, planetResponse, speciesResponse])
				.then(() => preLoader.removeAttribute('style'))
				.then(() => popUp.style.cssText = `transform: translate(-50%, 50%);`);
		}
	}

	currentHeroesList = await getHeroes(count, showNextHeroesEventListener, showPrevHeroesEventListener);
}