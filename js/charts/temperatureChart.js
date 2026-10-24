import { convertTemperature } from '../utils/conversions.js';
let chartInstance = null;
export function renderComparisonChart(p1Data, p2Data, unit) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');    
    const labels = p1Data.hourly.map(h => new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const p1Temps = p1Data.hourly.map(h => convertTemperature(h.temp, unit));
    const p2Temps = p2Data.hourly.map(h => convertTemperature(h.temp, unit));
    if (chartInstance) {
        chartInstance.destroy();
    }
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${p1Data.provider} (°${unit})`,
                    data: p1Temps,
                    borderColor: '#0284c7',
                    tension: 0.3
                },
                {
                    label: `${p2Data.provider} (°${unit})`,
                    data: p2Temps,
                    borderColor: '#dc2626',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
