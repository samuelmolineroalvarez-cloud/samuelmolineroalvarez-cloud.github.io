const API_URL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";
const YEARS = Array.from({ length: 22 }, (_, i) => String(2000 + i));
const message = document.querySelector("#message");

// The selected municipality is passed between pages using the query string.
// If no municipality was selected on index.html, default to the whole country.
const params = new URLSearchParams(window.location.search);
const areaCode = params.get("area") || "SSS";
const areaName = params.get("name") || (areaCode === "SSS" ? "Finland" : areaCode);

function makeRequestBody(contentCode) {
  return {
    query: [
      { code: "timeperiod_y", selection: { filter: "item", values: YEARS } },
      { code: "alue_23_20260101", selection: { filter: "item", values: [areaCode] } },
      { code: "contentscode", selection: { filter: "item", values: [contentCode] } }
    ],
    response: { format: "json-stat2" }
  };
}

async function fetchSeries(contentCode) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(makeRequestBody(contentCode))
  });
  if (!response.ok) throw new Error(`Statistics Finland request failed (${response.status}).`);
  const data = await response.json();
  if (!Array.isArray(data.value)) throw new Error("The API response did not contain data values.");
  return data.value.map(v => Number(v));
}

async function init() {
  try {
    // Separate POST requests as required by the assignment.
    const [births, deaths] = await Promise.all([
      fetchSeries("synt-vm01"),
      fetchSeries("synt-vm11")
    ]);

    new frappe.Chart("#chart", {
      title: `Births and deaths — ${areaName}`,
      data: {
        labels: YEARS,
        datasets: [
          { name: "Births", values: births },
          { name: "Deaths", values: deaths }
        ]
      },
      type: "bar",
      height: 450,
      colors: ["#63d0ff", "#363636"]
    });
    message.textContent = `Showing births and deaths for ${areaName}.`;
  } catch (error) {
    message.textContent = error.message;
  }
}

init();
