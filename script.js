const form = document.getElementById("search-form");
const input = document.getElementById("input-show");
const showContainer = document.querySelector(".show-container");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const showName = input.value;

    // Remove previous search results
    showContainer.innerHTML = "";

    // API URL
    const url = "https://api.tvmaze.com/search/shows?q=" + showName;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            data.forEach(item => {

                const show = item.show;

                // Create show-data
                const showData = document.createElement("div");
                showData.classList.add("show-data");

                // Create image
                const image = document.createElement("img");

                if (show.image) {
                    image.src = show.image.medium;
                    image.alt = show.name;
                }

                // Create show-info
                const showInfo = document.createElement("div");
                showInfo.classList.add("show-info");

                // Create title
                const title = document.createElement("h1");
                title.textContent = show.name;

                // Create summary
                const summary = document.createElement("p");
                summary.innerHTML = show.summary || "No summary available.";

                // Build the element
                showInfo.appendChild(title);
                showInfo.appendChild(summary);

                showData.appendChild(image);
                showData.appendChild(showInfo);

                // Add to the container
                showContainer.appendChild(showData);
            });
        })
        .catch(error => {
            console.error("Error fetching shows:", error);
        });
});
