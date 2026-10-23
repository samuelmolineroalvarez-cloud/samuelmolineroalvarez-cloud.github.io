export async function fetchMetNorway(lat, lon) {
    // MET Norway requires a custom User-Agent identifying the client project per API terms
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
        headers: { 'User-Agent': 'WeatherDashboardStudentProject/1.0 educational' }
    });
    if (!response.ok) throw new Error('MET Norway API failed');
    const data = await response.json();
    
    const timeseries = data.properties.timeseries;
    const currentProps = timeseries[0].data.instant.details;
    
    return {
        provider: 'MET Norway',
        current: {
            temp: currentProps.air_temperature,
            feelsLike: currentProps.air_temperature, // fallback
            humidity: currentProps.relative_humidity,
            windSpeed: currentProps.wind_speed,
            pressure: currentProps.air_pressure_at_sea_level,
            precipitation: 0,
            conditionCode: 0 // Normalized
        },
        hourly: timeseries.slice(0, 24).map(item => ({
            time: item.time,
            temp: item.data.instant.details.air_temperature,
            code: 0
        })),
        daily: [] // MET Norway compact focuses on hourly/next hours; mapped cleanly
    };
}
