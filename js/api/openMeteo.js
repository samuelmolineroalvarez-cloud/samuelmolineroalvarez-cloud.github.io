export async function fetchOpenMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al conectar con Open-Meteo');
    const data = await response.json();
    
    return {
        provider: 'Open-Meteo',
        current: {
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            conditionCode: data.current.weather_code
        },
        hourly: data.hourly.time.slice(0, 24).map((time, idx) => ({
            time,
            temp: data.hourly.temperature_2m[idx],
            code: data.hourly.weather_code[idx]
        })),
        daily: data.daily.time.map((date, idx) => ({
            date,
            maxTemp: data.daily.temperature_2m_max[idx],
            minTemp: data.daily.temperature_2m_min[idx],
            code: data.daily.weather_code[idx]
        }))
    };
}
