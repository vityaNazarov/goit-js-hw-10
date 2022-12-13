import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  evt.preventDefault();
  let inputValue = evt.target.value.trim();
  clearMarkup();

  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length === 1) {
          clearMarkup();
          createCoutryCard(countries);
          return;
        }
        if (countries.length <= 10 && countries.length >= 2) {
          clearMarkup();
          createCountriesList(countries);
          return;
        }
        if (countries.length > 10) {
          clearMarkup();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function createCountriesList(countries) {
  const countriesListMarkup = countries
    .map(country => {
      return `<li class="country-list__item"><img class="country-list__item-img" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="60" height="40" /><p class="country-list__item-name">${country.name.official}</p></li>`;
    })
    .join(' ');
  refs.ulEl.insertAdjacentHTML('beforeend', countriesListMarkup);
}

function createCoutryCard(countries) {
  const countryCardMarkup = countries
    .map(country => {
      return `<div class="flag-and-name">
      <img
        src="${country.flags.svg}"
        alt="Flag of ${country.name.official}"
        width="60"
        height="40"
        class="flag-img"
      />
      <p class="country-name">${country.name.official}</p>
    </div>
    <ul class="country-info-list">
      <li class="country-info-item">
        <p class="country-info-text">Capital:&nbsp</p>
        <span class="country-info-span">${country.capital}</span>
      </li>
      <li class="country-info-item">
        <p class="country-info-text">Population:&nbsp</p>
        <span class="country-info-span">${country.population}</span>
      </li>
      <li class="country-info-item">
        <p class="country-info-text">Languages:&nbsp</p>
        <span class="country-info-span">${Object.values(
          country.languages
        )}</span>
      </li>
    </ul>`;
    })
    .join(' ');
  refs.divEl.innerHTML = countryCardMarkup;
}

function clearMarkup() {
  refs.ulEl.innerHTML = '';
  refs.divEl.innerHTML = '';
}
