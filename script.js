const API_URL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";
const YEARS = Array.from({ length: 22 }, (_, i) => String(2000 + i));
const message = document.querySelector("#message");

let areaCodes = [];
let areaNames = [];
let currentValues = [];
let currentLabels = [...YEARS];
let currentAreaCode = "SSS";
let currentAreaName = "Finland";
let chart;

async function getAreaMetadata() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Could not retrieve municipality list.");
  const metadata = await response.json();

  // The API's second variable contains [codes, names].
  const areaVariable = metadata.variables.find(v => v.code === "alue_23_20260101");
  if (!areaVariable) throw new Error("Municipality data was not found in the API response.");
  areaCodes = areaVariable.values;
  areaNames = areaVariable.valueTexts;
}

function makeRequestBody(areaCode, contentCode = "synt-vaesto") {
  return {
    query: [
      {
        code: "timeperiod_y",
        selection: { filter: "item", values: YEARS }
      },
      {
        code: "alue_23_20260101",
        selection: { filter: "item", values: [areaCode] }
      },
      {
        code: "contentscode",
        selection: { filter: "item", values: [contentCode] }
      }
    ],
    response: { format: "json-stat2" }
  };
}

async function fetchSeries(areaCode, contentCode = "synt-vaesto") {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(makeRequestBody(areaCode, contentCode))
  });
  if (!response.ok) throw new Error(`Statistics Finland request failed (${response.status}).`);
  const data = await response.json();

  // JSON-stat2 stores the values in the first dataset dimension.
  const values = data.value;
  if (!Array.isArray(values)) throw new Error("The API response did not contain data values.");
  return values.map(v => Number(v));
}

function renderPopulationChart() {
  document.querySelector("#chart").innerHTML = "";
  chart = new frappe.Chart("#chart", {
    title: `Population — ${currentAreaName}`,
    data: {
      labels: currentLabels,
      datasets: [{ name: "Population", values: currentValues }]
    },
    type: "line",
    height: 450,
    colors: ["#eb5146"],
    lineOptions: { regionFill: 0, hideDots: 0 }
  });
}

async function loadPopulation(areaCode, areaName) {
  message.textContent = "Loading data…";
  try {
    const values = await fetchSeries(areaCode);
    currentValues = values;
    currentLabels = [...YEARS];
    currentAreaCode = areaCode;
    currentAreaName = areaName;
    document.querySelector("#navigation").href = `/newchart.html?area=${encodeURIComponent(areaCode)}&name=${encodeURIComponent(areaName)}`;
    renderPopulationChart();
    message.textContent = `Showing population data for ${areaName}.`;
  } catch (error) {
    message.textContent = error.message;
  }
}

document.querySelector("#municipality-form").addEventListener("submit", async event => {
  event.preventDefault();
  const query = document.querySelector("#input-area").value.trim();

  if (!query) {
    message.textContent = "Enter a municipality name.";
    return;
  }

  const index = areaNames.findIndex(name => name.toLocaleLowerCase() === query.toLocaleLowerCase());
  if (index === -1) {
    message.textContent = `Municipality "${query}" was not found. Check the spelling and try again.`;
    return;
  }

  await loadPopulation(areaCodes[index], areaNames[index]);
});

document.querySelector("#add-data").addEventListener("click", () => {
  if (currentValues.length < 2 || currentValues.some(v => !Number.isFinite(v))) {
    message.textContent = "There is not enough valid data to make a prediction.";
    return;
  }

  let totalDelta = 0;
  for (let i = 1; i < currentValues.length; i++) {
    totalDelta += currentValues[i] - currentValues[i - 1];
  }
  const meanDelta = totalDelta / (currentValues.length - 1);
  const prediction = Math.round(currentValues[currentValues.length - 1] + meanDelta);

  currentValues = [...currentValues, prediction];
  const nextYear = Number(currentLabels[currentLabels.length - 1]) + 1;
  currentLabels = [...currentLabels, String(nextYear)];
  renderPopulationChart();
  message.textContent = `Added estimated population for ${nextYear}. This is a simple trend estimate, not an official forecast.`;
});

(async function init() {
  try {
    await getAreaMetadata();
    await loadPopulation("SSS", "Finland");
  } catch (error) {
    message.textContent = error.message;
  }
})();
