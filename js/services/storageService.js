const FAVORITES_KEY = 'weather_app_favorites';
const UNIT_KEY = 'weather_app_unit';

export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
        return [];
    }
}

export function saveFavorite(location) {
    const favorites = getFavorites();
    if (!favorites.some(f => f.lat === location.lat && f.lon === location.lon)) {
        favorites.push(location);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function getStoredUnit() {
    return localStorage.getItem(UNIT_KEY) || 'C';
}

export function saveStoredUnit(unit) {
    localStorage.setItem(UNIT_KEY, unit);
}
