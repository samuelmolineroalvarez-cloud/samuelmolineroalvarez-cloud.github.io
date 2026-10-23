export function convertTemperature(tempC, targetUnit) {
    if (tempC === null || tempC === undefined) return null;
    switch (targetUnit) {
        case 'F':
            return (tempC * 9/5) + 32;
        case 'K':
            return tempC + 273.15;
        case 'C':
        default:
            return tempC;
    }
}

export function formatTemperature(tempC, targetUnit) {
    const converted = convertTemperature(tempC, targetUnit);
    if (converted === null) return 'N/A';
    return `${Math.round(converted)}°${targetUnit}`;
}
