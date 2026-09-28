const form = document.getElementById("search-form");
const input = document.getElementById("input-show");
const showContainer = document.querySelector(".show-container");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const showName = input.value;

    // Remove previous results
    showContainer.innerHTML = "";

    const url = "https://api.tvmaze.com/search/shows?q=" + showName;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            data.forEach(item => {

                const show = item.show;

                // Main show container
                const showData = document.createElement("div");
                showData.classList.add("show-data");

                // Image
                const image = document.createElement("img");

                if (show.image) {
                    image.src = show.image.medium;
                    image.alt = show.name;
                }

                // Information container
                const showInfo = document.createElement("div");
                showInfo.classList.add("show-info");

                // Title
                const title = document.createElement("h1");
                title.textContent = show.name;

                // Summary
                const summary = document.createElement("p");

                if (show.summary) {
                    summary.innerHTML = show.summary;
                } else {
                    summary.textContent = "No summary available.";
                }

                // Build show-data
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
