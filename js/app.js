import { searchLocation } from './services/geocoding.js';
import { fetchOpenMeteo } from './api/openMeteo.js';
import { fetchMetNorway } from './api/metNorway.js';
import { formatTemperature } from './utils/conversions.js';
import { getWeatherInfo } from './utils/weatherCodes.js';
import { renderComparisonChart } from './charts/temperatureChart.js';
import { getFavorites, saveFavorite, getStoredUnit, saveStoredUnit } from './services/storageService.js';
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
        alert('Not found');
    }
});
document.getElementById('geo-btn').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Not supported');
        return;
    }
    navigator.geolocation.getCurrentPosition(position => {
        selectLocation({
            name: 'My location',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        alert('Unable of finding location');
    });
});
document.getElementById('unit-selector').addEventListener('change', (e) => {
    currentUnit = e.target.value;
    saveStoredUnit(currentUnit);
    if (currentWeatherData.length > 0) renderUI();
});
document.getElementById('favorite-btn').addEventListener('click', () => {
    if (!currentLocation) return;
    saveFavorite(currentLocation);
    loadFavoritesUI();
});
async function selectLocation(loc) {
    const lat = loc.latitude ?? loc.lat;
    const lon = loc.longitude ?? loc.lon;

    if (!lat || !lon) {
        alert('not valid data');
        return;
    }

    currentLocation = { name: loc.name, country: loc.country || '', lat, lon };

    try {
        const results = await Promise.allSettled([
            fetchOpenMeteo(lat, lon),
            fetchMetNorway(lat, lon)
        ]);

        currentWeatherData = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        if (currentWeatherData.length === 0) {
            alert('Error obtainig data');
            return;
        }

        renderUI();
        loadFavoritesUI();
    } catch (error) {
        console.error('Error', error);
    }
}
function renderUI() {
    const primary = currentWeatherData[0];
    const weatherInfo = getWeatherInfo(primary.current.conditionCode);

    document.body.className = weatherInfo.theme;

    document.getElementById('current-weather-content').innerHTML = `
        <h3>${currentLocation.name}, ${currentLocation.country}</h3>
        <div style="font-size: 3rem; margin: 0.5rem 0; color: var(--accent-color);">
            ${weatherInfo.icon} ${formatTemperature(primary.current.temp, currentUnit)}
        </div>
        <p><strong>${weatherInfo.label}</strong> (Sensation: ${formatTemperature(primary.current.feelsLike, currentUnit)})</p>
        <p>Humidity: ${primary.current.humidity}% | wind: ${primary.current.windSpeed} m/s</p>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">Fuente: ${primary.provider}</p>
    `;
    document.getElementById('hourly-timeline').innerHTML = primary.hourly.map(h => {
        const hInfo = getWeatherInfo(h.code);
        const timeStr = new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="hourly-item">
                <span>${timeStr}</span>
                <span style="font-size: 1.5rem; color: var(--accent-color);">${hInfo.icon}</span>
                <strong>${formatTemperature(h.temp, currentUnit)}</strong>
            </div>
        `;
    }).join('');

    document.getElementById('daily-forecast-container').innerHTML = primary.daily.map(d => {
        const dInfo = getWeatherInfo(d.code);
        const dayName = new Date(d.date).toLocaleDateString([], { weekday: 'short' });
        return `
            <div class="daily-item">
                <strong>${dayName}</strong>
                <span style="font-size: 2rem; color: var(--accent-color);">${dInfo.icon}</span>
                <span>${formatTemperature(d.maxTemp, currentUnit)} / ${formatTemperature(d.minTemp, currentUnit)}</span>
            </div>
        `;
    }).join('');

    if (currentWeatherData.length >= 2) {
        renderComparisonChart(currentWeatherData[0], currentWeatherData[1], currentUnit);
    }
}

function loadFavoritesUI() {
    const listEl = document.getElementById('favorites-list');
    const favorites = getFavorites();
    if (favorites.length === 0) {
        listEl.innerHTML = '<li class="empty-favorite">No hay favoritos guardados.</li>';
        return;
    }
    listEl.innerHTML = favorites.map(f => `
        <li class="favorite-item" data-lat="${f.lat}" data-lon="${f.lon}" data-name="${f.name}">
            <span>${f.name}</span>
            <button class="btn btn-secondary" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">Ver</button>
        </li>
    `).join('');

    listEl.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', () => {
            selectLocation({
                name: item.dataset.name,
                lat: parseFloat(item.dataset.lat),
                lon: parseFloat(item.dataset.lon)
            });
        });
    });
}
loadFavoritesUI();
