const form = document.getElementById("search-form");
const input = document.getElementById("input-show");
const showContainer = document.querySelector(".show-container");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const showName = input.value;
    showContainer.innerHTML = "";
    const url = "https://api.tvmaze.com/search/shows?q=" + showName;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const show = item.show;
                const showData = document.createElement("div");
                showData.classList.add("show-data");
                const image = document.createElement("img");
                if (show.image) {
                    image.src = show.image.medium;
                    image.alt = show.name;
                }
                const showInfo = document.createElement("div");
                showInfo.classList.add("show-info");
                const title = document.createElement("h1");
                title.textContent = show.name;
                const summary = document.createElement("p");
                if (show.summary) {
                    summary.innerHTML = show.summary;
                } else {
                    summary.textContent = "No summary available.";
                }
                showInfo.appendChild(title);
                showInfo.appendChild(summary);
                showData.appendChild(image);
                showData.appendChild(showInfo);
                showContainer.appendChild(showData);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});
