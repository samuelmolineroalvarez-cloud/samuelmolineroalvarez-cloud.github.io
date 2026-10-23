import { searchLocation } from './services/geocoding.js';
import { fetchOpenMeteo } from './api/openMeteo.js';
import { fetchMetNorway } from './api/metNorway.js';
import { fetchOpenWeatherMap } from './api/openWeatherMap.js'; // (Optional 3rd provider stub / adapter)
import { formatTemperature } from './utils/conversions.js';
import { getWeatherDescription } from './utils/weatherCodes.js';
import { renderComparisonChart } from './charts/temperatureChart.js';
import { getFavorites, saveFavorite, removeFavorite, getStoredUnit, saveStoredUnit } from './services/storageService.js';

let currentLocation = null;
let currentWeatherData = [];
let currentUnit = getStoredUnit();

document.getElementById('unit-selector').value = currentUnit;

document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const results = await searchLocation(query);
    if (results.length > 0) {
        selectLocation(results[0]);
    } else {
        alert('Location not found.');
    }
});

document.getElementById('geo-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        selectLocation({ name: 'Current Location', country: '', latitude: lat, longitude: lon });
    }, () => {
        alert('Unable to retrieve your location. Please check permissions.');
    });
});

document.getElementById('unit-selector').addEventListener('change', (e) => {
    currentUnit = e.target.value;
    saveStoredUnit(currentUnit);
    if (currentWeatherData.length > 0) {
        renderUI();
    }
});

document.getElementById('favorite-btn').addEventListener('click', () => {
    if (!currentLocation) return;
    saveFavorite(currentLocation);
    loadFavoritesUI();
});

async function selectLocation(loc) {
    currentLocation = { name: loc.name, country: loc.country || '', lat: loc.latitude || loc.lat, lon: loc.longitude || loc.lon };
    
    // Fetch from independent providers in parallel with Promise.allSettled
    const results = await Promise.allSettled([
        fetchOpenMeteo(currentLocation.lat, currentLocation.lon),
        fetchMetNorway(currentLocation.lat, currentLocation.lon)
    ]);

    currentWeatherData = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

    if (currentWeatherData.length === 0) {
        alert('Failed to fetch weather data from providers.');
        return;
    }

    renderUI();
    loadFavoritesUI();
}

function renderUI() {
    const primary = currentWeatherData[0];
    const desc = getWeatherDescription(primary.current.conditionCode);

    // Render Current Weather Card
    document.getElementById('current-weather-content').innerHTML = `
        <h3>${currentLocation.name}, ${currentLocation.country}</h3>
        <div style="font-size: 3rem; margin: 0.5rem 0;">${desc.icon} ${formatTemperature(primary.current.temp, currentUnit)}</div>
        <p><strong>${desc.label}</strong> (Feels like ${formatTemperature(primary.current.feelsLike, currentUnit)})</p>
        <p>Humidity: ${primary.current.humidity}% | Wind: ${primary.current.windSpeed} m/s</p>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">Source: ${primary.provider}</p>
    `;

    // Render Hourly Timeline
    const timelineEl = document.getElementById('hourly-timeline');
    timelineEl.innerHTML = primary.hourly.map(h => {
        const hDesc = getWeatherDescription(h.code);
        const timeStr = new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="hourly-item">
                <span>${timeStr}</span>
                <span style="font-size: 1.5rem;">${hDesc.icon}</span>
                <strong>${formatTemperature(h.temp, currentUnit)}</strong>
            </div>
        `;
    }).join('');

    // Render 7-Day Forecast
    const dailyEl = document.getElementById('daily-forecast-container');
    dailyEl.innerHTML = primary.daily.map(d => {
        const dDesc = getWeatherDescription(d.code);
        const dayName = new Date(d.date).toLocaleDateString([], { weekday: 'short' });
        return `
            <div class="daily-item">
                <strong>${dayName}</strong>
                <span style="font-size: 2rem;">${dDesc.icon}</span>
                <span>${formatTemperature(d.maxTemp, currentUnit)} / ${formatTemperature(d.minTemp, currentUnit)}</span>
            </div>
        `;
    }).join('');

    // Render Comparison Chart if 2+ providers succeeded
    if (currentWeatherData.length >= 2) {
        renderComparisonChart(currentWeatherData[0], currentWeatherData[1], currentUnit);
    }
}

function loadFavoritesUI() {
    const listEl = document.getElementById('favorites-list');
    const favorites = getFavorites();
    if (favorites.length === 0) {
        listEl.innerHTML = '<li class="empty-favorite">No favorites saved yet.</li>';
        return;
    }
    listEl.innerHTML = favorites.map(f => `
        <li class="favorite-item" data-lat="${f.lat}" data-lon="${f.lon}" data-name="${f.name}">
            <span>${f.name}, ${f.country}</span>
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">View</button>
        </li>
    `).join('');

    listEl.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', () => {
            selectLocation({
                name: item.dataset.name,
                country: '',
                latitude: parseFloat(item.dataset.lat),
                longitude: parseFloat(item.dataset.lon)
            });
        });
    });
}

loadFavoritesUI();
