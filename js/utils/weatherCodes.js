export const weatherConfig = {
    0: { label: 'Cielo despejado', icon: '<i class="fa-solid fa-sun"></i>', theme: 'theme-clear-day' },
    1: { label: 'Principalmente despejado', icon: '<i class="fa-solid fa-cloud-sun"></i>', theme: 'theme-clear-day' },
    2: { label: 'Parcialmente nublado', icon: '<i class="fa-solid fa-cloud-sun"></i>', theme: 'theme-clear-day' },
    3: { label: 'Nublado / Cubierto', icon: '<i class="fa-solid fa-cloud"></i>', theme: 'theme-rainy' },
    45: { label: 'Niebla', icon: '<i class="fa-solid fa-smog"></i>', theme: 'theme-rainy' },
    51: { label: 'Llovizna ligera', icon: '<i class="fa-solid fa-cloud-rain"></i>', theme: 'theme-rainy' },
    61: { label: 'Chubascos de lluvia', icon: '<i class="fa-solid fa-cloud-showers-heavy"></i>', theme: 'theme-rainy' },
    71: { label: 'Nevada', icon: '<i class="fa-solid fa-snowflake"></i>', theme: 'theme-snowy' },
    95: { label: 'Tormenta eléctrica', icon: '<i class="fa-solid fa-cloud-bolt"></i>', theme: 'theme-rainy' }
};

export function getWeatherInfo(code) {
    return weatherConfig[code] || { label: 'Condiciones variables', icon: '<i class="fa-solid fa-temperature-half"></i>', theme: 'theme-clear-day' };
}
