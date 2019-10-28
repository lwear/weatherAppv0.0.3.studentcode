// client-side js
// run by the browser each time your view template is loaded
function getForecastFromNetwork(){
   return fetch('forecast/48.4284,-123.3656').then((response) => {
        return response.json();
      })
      .catch(() => {
        return null;
      });
}

/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
 */
function updateData() {
   var location = {label:"Victoria", geo:"48.4284,-123.3656"};
   var card = getForecastCard(location);
  
    // Get the forecast data from the network.
    getForecastFromNetwork()
        .then((forecast) => {
          renderForecast(card, forecast);
        });

}

/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
/*function renderForecast( data) {
    document.write(JSON.stringify(data));
}*/


/**
 * Renders the forecast data into the card element.
 *
 * card The card element to update.
 * Weather forecast data to update the element with as json object.
 */
function renderForecast(card, data) {
  
  // If no data, skip the update.
  if (!data) {
    return;
  }

  // Find out when the element was last updated.
 /* const cardLastUpdatedElem = card.querySelector('.card-last-updated');
  const cardLastUpdated = cardLastUpdatedElem.textContent;
  const lastUpdated = parseInt(cardLastUpdated);

  // If the data on the element is newer, skip the update.
  if (lastUpdated >= data.currently.time) {
    return;
  }
  cardLastUpdatedElem.textContent = data.currently.time;
*/
  // Render the forecast data into the card.
  card.querySelector('.description').textContent = data.currently.summary;
  const forecastFrom = luxon.DateTime
      .fromSeconds(data.currently.time)
      .setZone(data.timezone)
      .toFormat('DDDD t');
  card.querySelector('.date').textContent = forecastFrom;
  card.querySelector('.current .icon')
      .className = `icon ${data.currently.icon}`;
  card.querySelector('.current .temperature .value')
      .textContent = Math.round(data.currently.temperature);
  card.querySelector('.current .humidity .value')
      .textContent = Math.round(data.currently.humidity * 100);
  card.querySelector('.current .wind .value')
      .textContent = Math.round(data.currently.windSpeed);
  card.querySelector('.current .wind .direction')
      .textContent = Math.round(data.currently.windBearing);
  const sunrise = luxon.DateTime
      .fromSeconds(data.daily.data[0].sunriseTime)
      .setZone(data.timezone)
      .toFormat('t');
  card.querySelector('.current .sunrise .value').textContent = sunrise;
  const sunset = luxon.DateTime
      .fromSeconds(data.daily.data[0].sunsetTime)
      .setZone(data.timezone)
      .toFormat('t');
  card.querySelector('.current .sunset .value').textContent = sunset;

  // Render the next 7 days.
  const futureTiles = card.querySelectorAll('.future .oneday');
  futureTiles.forEach((tile, index) => {
    const forecast = data.daily.data[index + 1];
    const forecastFor = luxon.DateTime
        .fromSeconds(forecast.time)
        .setZone(data.timezone)
        .toFormat('ccc');
    tile.querySelector('.date').textContent = forecastFor;
    tile.querySelector('.icon').className = `icon ${forecast.icon}`;
    tile.querySelector('.temp-high .value')
        .textContent = Math.round(forecast.temperatureHigh);
    tile.querySelector('.temp-low .value')
        .textContent = Math.round(forecast.temperatureLow);
  });
/*
  // If the loading spinner is still visible, remove it.
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }*/
} // renderForecast

/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  
  // if the card exists, return it
  if (card) {
    return card;
  }
  
  // otherwise generate new card
  const newCard = document.getElementById('weather-template').cloneNode(true);
  
  // querySelector looks for a child of new card
  newCard.querySelector('.location').textContent = location.label;
  newCard.setAttribute('id', id);
  /*newCard.querySelector('.remove-city')
      .addEventListener('click', removeLocation);*/
  document.querySelector('.grid-container').appendChild(newCard);
  newCard.removeAttribute('hidden');
  return newCard;
}






updateData();

