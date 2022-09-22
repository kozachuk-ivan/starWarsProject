export function introAllPersons() {
	let showName = document.querySelectorAll('.show__desc');
	let nextBtn = document.querySelector('.show__btn-card-right');
	let prevBtn = document.querySelector('.show__btn-card-left');
	let showBtnRight = document.querySelector('.show__btn-right');
	let showBtnLeft = document.querySelector('.show__btn-left');
	let countSpan = document.querySelector('.count__span');
	let sectionShow = document.querySelector('.show');
	let popUp = document.querySelector('.pop-up');
	let popUpBtn = document.querySelector('.pop-up__btn-back');
	let characterName = document.querySelector('.pop-up__character-name');
	let characterBday = document.querySelector('.pop-up__character-bday');
	let characterGender = document.querySelector('.pop-up__character-male');
	let characterFilms = document.querySelector('.pop-up__character-films');
	let characterPlanet = document.querySelector('.pop-up__character-planet');
	let characterSubspecies = document.querySelector('.pop-up__character-subspecies');
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
		count++;
		await getHeroes(`https://swapi.dev/api/people/?page=${count}`)
		countSpan.textContent = count;	
	}

	async function showPrevHeroes() {
		count--;
		await getHeroes(`https://swapi.dev/api/people/?page=${count}`);
		countSpan.textContent = count;
	}

	function closePopUp() {
		popUp.style = '';
		let liItems = document.querySelectorAll('.pop-up__character-films > li');
		liItems.forEach(item => item.remove());
	}

	async function showDetalInfo(event) {
		if(event.target.closest('.show__card') || event.target.closest('.show__desc')) {
			let parentTarget = event.target;
			let target;
			(parentTarget === event.target.closest('.show__card')) 
			? target = parentTarget.firstElementChild.textContent 
			: target = parentTarget.textContent;
			let films = [];
			let planet;
			let species;
			
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

			films.forEach( async (film) => {
 				let getFilm = await fetch(`${film}`)
					.then(data => data.json())
					.then(data => {
						characterFilms.insertAdjacentHTML('beforeend', 
						`
							<li>${data.title}</li>
						`); 
					})
					.then(data => popUp.style.cssText = `transform: translate(-50%, 50%);`);
			});
	
			let getPlanet = await fetch(`${planet}`)
				.then(data => data.json())
				.then(data => characterPlanet.textContent = data.name);

			characterSubspecies.textContent = 'unknown';

			await species.forEach(item => {
				let getSpacies = fetch(`${item}`)
					.then(data => data.json())
					.then(data => characterSubspecies.textContent = data.name);
			});
		}
	}
	getHeroes(`https://swapi.dev/api/people/?page=${count}`);
}