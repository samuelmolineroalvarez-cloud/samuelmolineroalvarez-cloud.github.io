export function getWeatherDescription(code) {
    // WMO Weather interpretation codes (Open-Meteo standard mapping)
    const codes = {
        0: { label: 'Clear sky', icon: '☀️' },
        1: { label: 'Mainly clear', icon: '🌤️' },
        2: { label: 'Partly cloudy', icon: '⛅' },
        3: { label: 'Overcast', icon: '☁️' },
        45: { label: 'Foggy', icon: '🌫️' },
        51: { label: 'Light drizzle', icon: '🌧️' },
        61: { label: 'Rain showers', icon: '🌧️' },
        71: { label: 'Snowfall', icon: '❄️' },
        95: { label: 'Thunderstorm', icon: '⚡' }
    };
    return codes[code] || { label: 'Variable conditions', icon: '🌡️' };
}
