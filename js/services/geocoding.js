export async function searchLocation(query) {
    if (!query || !query.trim()) return [];
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en el servicio de geocodificación');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error al buscar la ubicación:', error);
        return [];
    }
}
