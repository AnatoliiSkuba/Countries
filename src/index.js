import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
countryList.style.listStyleType = "none";
countryList.style.padding = "0";

searchBox.addEventListener("input", debounce((evt) => {
    evt.preventDefault();
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    const persistedSearch = evt.target.value.trim();
    if (persistedSearch !== "") {
        API.fetchCountries(persistedSearch)
        .then(renderCountry)
        // .catch(onFetchError)
    };
    
}, DEBOUNCE_DELAY));

function renderCountry(country) {
    if (country.status) { console.log(country) } else {
        if (country.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (country.length <= 10 && country.length > 1) {
            const markup = country
                .sort((firstCountry, secondCountry) => firstCountry.name.common.localeCompare(secondCountry.name.common))
                .map(({ flags, name }) => `<li style="display: flex; align-items: center; margin: 5px 0"><img src="${flags.svg}" width="30">&nbsp;&nbsp;${name.common}</li>`).join('');
            countryList.insertAdjacentHTML("afterbegin", markup);
        } else {
            renderInfo(country[0]);
            function renderInfo({ name, capital, population, flags, languages }) {
                const markup = `<p style="font-weight: bold; font-size: 38px; display: flex; align-items: center;"><img src="${flags.svg}" width="30">&nbsp;${name.common}</p>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages)
                        .sort((firstLanguage, secondLanguage) => firstLanguage.localeCompare(secondLanguage))
                        .join(', ')}</p>`;
                countryInfo.insertAdjacentHTML("afterbegin", markup);
            };
        };
    };
};

// function onFetchError(error) {
//     Notify.failure('Oops, there is no country with that name');
//     console.log(error);
// };