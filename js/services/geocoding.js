export async function searchLocation(query) {
    if (!query.trim()) return [];
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Geocoding network error');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}
