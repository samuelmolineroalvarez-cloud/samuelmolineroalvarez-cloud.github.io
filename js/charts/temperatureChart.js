let chartInstance = null;

export function renderComparisonChart(provider1Data, provider2Data, unit) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    
    const labels = provider1Data.hourly.map(h => new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const p1Temps = provider1Data.hourly.map(h => convertTemp(h.temp, unit));
    const p2Temps = provider2Data.hourly.map(h => convertTemp(h.temp, unit));

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `${provider1Data.provider} (°${unit})`,
                    data: p1Temps,
                    borderColor: '#0284c7',
                    backgroundColor: 'rgba(2, 132, 199, 0.1)',
                    tension: 0.3
                },
                {
                    label: `${provider2Data.provider} (°${unit})`,
                    data: p2Temps,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: { display: true, text: `Temperature (°${unit})` }
                }
            }
        }
    });
}

function convertTemp(tempC, unit) {
    if (unit === 'F') return (tempC * 9/5) + 32;
    if (unit === 'K') return tempC + 273.15;
    return tempC;
}
