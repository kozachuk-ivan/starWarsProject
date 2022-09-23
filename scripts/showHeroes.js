export function introAllPersons() {
	const showName = document.querySelectorAll('.show__desc');
	const nextBtn = document.querySelector('.show__btn-card-right');
	const prevBtn = document.querySelector('.show__btn-card-left');
	const showBtnRight = document.querySelector('.show__btn-right');
	const showBtnLeft = document.querySelector('.show__btn-left');
	const countSpan = document.querySelector('.count__span');
	const sectionShow = document.querySelector('.show');
	const popUp = document.querySelector('.pop-up');
	const popUpBtn = document.querySelector('.pop-up__btn-back');
	const characterName = document.querySelector('.pop-up__character-name');
	const characterBday = document.querySelector('.pop-up__character-bday');
	const characterGender = document.querySelector('.pop-up__character-male');
	const characterFilms = document.querySelector('.pop-up__character-films');
	const characterPlanet = document.querySelector('.pop-up__character-planet');
	const characterSubspecies = document.querySelector('.pop-up__character-subspecies');
	const preLoader = document.querySelector('.lds-dual-ring');

	let count = 1;
	let curentHeroesList;
	countSpan.textContent = count

	nextBtn.addEventListener('click', showNextHeroes);
	prevBtn.addEventListener('click', showPrevHeroes);
	sectionShow.addEventListener('click', showDetalInfo);
	popUpBtn.addEventListener('click', closePopUp);

	let getHeroes = async (link) => {
		let promiseHeroes = await fetch(link);
		let heroes = await promiseHeroes.json();

		(heroes.next === null ) ? 
		(nextBtn.removeEventListener('click', showNextHeroes), showBtnRight.classList.add('disable')) :
		(showBtnRight.classList.remove('disable'), nextBtn.addEventListener('click', showNextHeroes));
		
		(heroes.previous === null) ? 
		(prevBtn.removeEventListener('click', showPrevHeroes), showBtnLeft.classList.add('disable')) :
		(showBtnLeft.classList.remove('disable'),prevBtn.addEventListener('click', showPrevHeroes));

		let listHeroes = await heroes.results;

		curentHeroesList = listHeroes;

		for (let i = 0; i < showName.length; i++) {
			showName[i].textContent = '';
		}

		for (let i = 0; i < showName.length && i < listHeroes.length; i++) {
			showName[i].textContent = listHeroes[i].name;
		}
	}

	async function showNextHeroes() {
		preLoader.setAttribute('style', 'display: flex; background-color: rgba(0, 0, 0, 0.9);');
		count++;
		await getHeroes(`https://swapi.dev/api/people/?page=${count}`)
			.then(() => preLoader.removeAttribute('style'));
		countSpan.textContent = count;	
	}

	async function showPrevHeroes() {
		preLoader.setAttribute('style', 'display: flex; background-color: rgba(0, 0, 0, 0.9);');
		count--;
		await getHeroes(`https://swapi.dev/api/people/?page=${count}`)
			.then(() =>preLoader.removeAttribute('style'));
		countSpan.textContent = count;
	}

	function closePopUp() {
		popUp.style = '';
		const liItems = document.querySelectorAll('.pop-up__character-films > li');
		liItems.forEach(item => item.remove());
		sectionShow.addEventListener('click', showDetalInfo);
	}

	async function showDetalInfo(event) {
		if(event.target.closest('.show__card') || event.target.closest('.show__desc')) {
			sectionShow.removeEventListener('click', showDetalInfo);
			preLoader.setAttribute('style', 'display: flex; background-color: rgba(0, 0, 0, 0.9);');
			let getFilm;
			let getSpacies;
			let parentTarget = event.target;
			let target;
			let films = [];
			let planet;
			let species;
			(parentTarget === event.target.closest('.show__card')) 
			? target = parentTarget.firstElementChild.textContent 
			: target = parentTarget.textContent;
			
			await curentHeroesList.forEach(hero => {
				if(hero.name === target) {
					films = hero.films;
					planet = hero.homeworld;
					species = hero.species;
					characterName.textContent = hero.name;
					characterBday.textContent = hero.birth_year;
					characterGender.textContent = hero.gender;
				}
			});

			await films.forEach((film) => {
 				getFilm = fetch(`${film}`)
					.then(data => data.json())
					.then(data => {
						characterFilms.insertAdjacentHTML('beforeend', 
						`
							<li>${data.title}</li>
						`); 
					})
			});
	
			const getPlanet = await fetch(`${planet}`)
				.then(data => data.json())
				.then(data => characterPlanet.textContent = data.name);

			characterSubspecies.textContent = 'unknown';

			await species.forEach(item => {
				getSpacies = fetch(`${item}`)
					.then(data => data.json())
					.then(data => characterSubspecies.textContent = data.name);
			});

			Promise.all([getFilm, getPlanet, getSpacies])
				.then(() => preLoader.removeAttribute('style'))
				.then(() => popUp.style.cssText = `transform: translate(-50%, 50%);`);
		}
	}
	getHeroes(`https://swapi.dev/api/people/?page=${count}`);
}