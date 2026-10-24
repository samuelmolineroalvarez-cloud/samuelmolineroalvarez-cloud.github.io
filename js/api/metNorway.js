export async function fetchMetNorway(lat, lon) {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;    
    const response = await fetch(url, {
        headers: { 'User-Agent': 'WeatherAppUniversityProject/1.0' }
    });    
    if (!response.ok) throw new Error('Error al conectar con MET Norway');
    const data = await response.json();    
    const timeseries = data.properties.timeseries;
    const currentProps = timeseries[0].data.instant.details;    
    return {
        provider: 'MET Norway',
        current: {
            temp: currentProps.air_temperature,
            feelsLike: currentProps.air_temperature,
            humidity: currentProps.relative_humidity,
            windSpeed: currentProps.wind_speed,
            conditionCode: 0
        },
        hourly: timeseries.slice(0, 24).map(item => ({
            time: item.time,
            temp: item.data.instant.details.air_temperature,
            code: 0
        })),
        daily: []
    };
}
