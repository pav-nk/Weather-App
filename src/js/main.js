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

const weatherImg = document.querySelector('#weather-img');
const preloader = document.querySelector('#preloader');
const searchForm = document.getElementById('search-form');
const cardWrapper = document.getElementById('card-wrapper');

function App() {
  const state = {
    data: null,
  };

  const getData = async (city) => {
    let response = await fetch(
      `${API_URL}${city || 'moscow'}?unitGroup=us&key=${API_KEY}&contentType=json`,
    );

    if (response.ok) {
      let json = await response.json();
      return json;
    }
    return {};
  };

  const init = async () => {
    const data = await getData();
    state.data = { data };
  };

  const render = () => {};

  return { init, render, getData };
}

document.addEventListener('DOMContentLoaded', () => {
  const app = App();
  app.init();
});
