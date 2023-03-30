// core
const showName = document.querySelectorAll('.show__desc');
const characterFilms = document.querySelector('.pop-up__character-films');
const characterPlanet = document.querySelector('.pop-up__character-planet');
const characterSubspecies = document.querySelector('.pop-up__character-subspecies');

// helpers
import { disableAndEnableHelper } from './helpers.js'

export async function getSpecies(speciesAPI) {
	let species;

	await speciesAPI.forEach( item => {
			species = fetch(`${item}`)
				.then(data => data.json())
				.then(data =>  characterSubspecies.textContent = data.name);
		});

	if(!species) {
		characterSubspecies.textContent = 'unknown';
	}

	return species;
}

export async function getPlanet(planetAPI) {
	const planet = await fetch(`${planetAPI}`)
			.then(data => data.json())
			.then(data => characterPlanet.textContent = data.name);

	return planet;
}

export async function getFilms(filmsAPI) {
	let films;

	await filmsAPI.forEach((film) => {
		films = fetch(`${film}`)
			.then(data => data.json())
			.then(data => {
				characterFilms.insertAdjacentHTML('beforeend', 
				`
					<li>${data.title}</li>
				`); 
			})
	});
	return films;
}

export async function getHeroes(count, showNextHeroesEventListener, showPrevHeroesEventListener) {
	for (let i = 0; i < showName.length; i++) {
		showName[i].textContent = '';
	}

	const heroesResponse = await fetch(`https://swapi.dev/api/people/?page=${count}`)
		.then(data => data.json());
	
	disableAndEnableHelper(heroesResponse, showNextHeroesEventListener, showPrevHeroesEventListener);

	for (let i = 0; i < showName.length && i < heroesResponse.results.length; i++) {
		showName[i].textContent = heroesResponse.results[i].name;
	}

	return heroesResponse.results;
}