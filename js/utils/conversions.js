export function convertTemperature(tempC, targetUnit) {
    if (tempC === null || tempC === undefined) return null;
    if (targetUnit === 'F') return (tempC * 9/5) + 32;
    if (targetUnit === 'K') return tempC + 273.15;
    return tempC;
}

export function formatTemperature(tempC, targetUnit) {
    const converted = convertTemperature(tempC, targetUnit);
    if (converted === null) return 'N/A';
    return `${Math.round(converted)}°${targetUnit}`;
}
