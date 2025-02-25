import '../scss/style.scss';
import { API_KEY, API_URL } from './config';

import windImg from '../images/wind.svg';
import rainImg from '../images/rain.svg';
import snowImg from '../images/snow.svg';
import clearDayImg from '../images/clear-day.svg';
import clearNightImg from '../images/clear-night.svg';
import cloudyImg from '../images/cloudy.svg';
import fogImg from '../images/fog.svg';
import partlyCloudyDayImg from '../images/partly-cloudy-day.svg';
import partlyCloudyNightImg from '../images/partly-cloudy-night.svg';

const toggleCheckbox = document.getElementById('toggle-checkbox');
const preloader = document.querySelector('#preloader');
const searchForm = document.getElementById('search-form');
const cardWrapper = document.getElementById('card-wrapper');

const cardCity = document.getElementById('card-city');
const cardTemp = document.getElementById('card-temp');
const cardDesc = document.getElementById('card-description');
const cardWindspeed = document.getElementById('card-windspeed');
const cardLatitudeLongitude = document.getElementById(
  'card-latitude-longitude',
);
const cardTimeZone = document.getElementById('card-timezone');
const cardFeelslike = document.getElementById('card-feelslike');
const weatherImg = document.querySelector('#weather-image');

const weatherImages = {
  wind: windImg,
  rain: rainImg,
  snow: snowImg,
  'clear-day': clearDayImg,
  'clear-night': clearNightImg,
  cloudy: cloudyImg,
  fog: fogImg,
  'partly-cloudy-day': partlyCloudyDayImg,
  'partly-cloudy-night': partlyCloudyNightImg,
};

function App() {
  const state = {
    data: null,
    isCelsiusTemp: false,
  };

  const toggleCardView = () => {
    preloader.classList.toggle('hidden');
    cardWrapper.classList.toggle('hidden');
  };

  const getCurrentTemp = (temp) => {
    return state.isCelsiusTemp
      ? `${Math.floor(((temp - 32) * 5) / 9)} ℃`
      : `${temp} F`;
  };

  const updateTempView = (temp, feelslike) => {
    cardTemp.textContent = `${getCurrentTemp(temp)}`;
    cardFeelslike.textContent = `${getCurrentTemp(feelslike)}`;
  };

  const updateView = () => {
    toggleCardView();
    const {
      address,
      description,
      latitude,
      longitude,
      timezone,
      icon,
      temp,
      windspeed,
      feelslike,
    } = state.data;

    cardCity.textContent = `${address} `;
    cardTemp.textContent = `${getCurrentTemp(temp)}`;
    cardDesc.textContent = description;
    cardWindspeed.textContent = `${windspeed} m / s`;
    cardLatitudeLongitude.textContent = `${latitude} / ${longitude}`;
    cardTimeZone.textContent = timezone;
    cardFeelslike.textContent = `${getCurrentTemp(feelslike)}`;
    weatherImg.src = weatherImages[icon];
    weatherImg.setAttribute('alt', address);
  };

  const getData = async (city) => {
    let response = await fetch(
      `${API_URL}${city || 'moscow'}?unitGroup=us&key=${API_KEY}&contentType=json`,
    );

    if (response.ok) {
      toggleCardView();
      const {
        address,
        description,
        latitude,
        longitude,
        timezone,
        currentConditions: { icon, temp, windspeed, feelslike },
      } = await response.json();
      state.data = {
        address,
        description,
        latitude,
        longitude,
        timezone,
        icon,
        temp,
        windspeed,
        feelslike,
      };
    }
  };

  const init = async () => {
    await getData();
    searchForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      let formData = new FormData(searchForm);
      await getData(formData.get('search'));
      updateView();
      searchForm.reset();
    });
    toggleCheckbox.addEventListener('change', () => {
      state.isCelsiusTemp = !state.isCelsiusTemp;
      updateTempView(state.data.temp, state.data.feelslike);
    });
    updateView();
    toggleCardView();
  };

  return { init };
}

document.addEventListener('DOMContentLoaded', () => {
  const app = App();
  app.init();
});
