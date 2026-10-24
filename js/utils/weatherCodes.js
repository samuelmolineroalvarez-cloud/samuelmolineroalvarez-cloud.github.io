export const weatherConfig = {
    0: { label: 'Clear', icon: '<i class="fa-solid fa-sun"></i>', theme: 'theme-clear-day' },
    1: { label: 'Mainly clear', icon: '<i class="fa-solid fa-cloud-sun"></i>', theme: 'theme-clear-day' },
    2: { label: 'Parcialy cloudy', icon: '<i class="fa-solid fa-cloud-sun"></i>', theme: 'theme-clear-day' },
    3: { label: 'Cloudy', icon: '<i class="fa-solid fa-cloud"></i>', theme: 'theme-rainy' },
    45: { label: 'Foggy', icon: '<i class="fa-solid fa-smog"></i>', theme: 'theme-rainy' },
    51: { label: 'Rainy', icon: '<i class="fa-solid fa-cloud-rain"></i>', theme: 'theme-rainy' },
    61: { label: 'Rainy', icon: '<i class="fa-solid fa-cloud-showers-heavy"></i>', theme: 'theme-rainy' },
    71: { label: 'Snowy', icon: '<i class="fa-solid fa-snowflake"></i>', theme: 'theme-snowy' },
    95: { label: 'Stormy', icon: '<i class="fa-solid fa-cloud-bolt"></i>', theme: 'theme-rainy' }
};

export function getWeatherInfo(code) {
    return weatherConfig[code] || { label: 'Condiciones variables', icon: '<i class="fa-solid fa-temperature-half"></i>', theme: 'theme-clear-day' };
}
