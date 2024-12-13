document.addEventListener("DOMContentLoaded", () => {
    const perPage = 5; // Number of repos per page
    let currentPage = 1;
    let repositories = [];

    async function fetchRepos() {
        try {
            const response = await fetch("https://api.github.com/users/rakib06/repos");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            repositories = await response.json();
            renderPagination();
            renderRepos();
        } catch (error) {
            console.error("Failed to fetch repositories:", error);
        }
    }

    function renderRepos() {
        const repoList = document.getElementById("repo-list");
        if (!repoList) {
            console.error("Element with id 'repo-list' not found");
            return;
        }

        repoList.innerHTML = ""; // Clear the current list

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;

        const paginatedRepos = repositories.slice(startIndex, endIndex);

        paginatedRepos.forEach(repo => {
            const listItem = document.createElement("a");
            listItem.classList.add("list-group-item", "list-group-item-action");
            listItem.href = repo.html_url;
            listItem.target = "_blank";
            listItem.textContent = repo.name;
            repoList.appendChild(listItem);
        });
    }

    function renderPagination() {
        const paginationContainer = document.createElement("div");
        paginationContainer.className = "d-flex justify-content-center mt-4";
        paginationContainer.id = "pagination-container";

        const totalPages = Math.ceil(repositories.length / perPage);

        // Previous Button
        const prevButton = document.createElement("button");
        prevButton.className = "btn btn-secondary mx-1";
        prevButton.textContent = "Previous";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderRepos();
                updatePagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Next Button
        const nextButton = document.createElement("button");
        nextButton.className = "btn btn-secondary mx-1";
        nextButton.textContent = "Next";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderRepos();
                updatePagination();
            }
        });
        paginationContainer.appendChild(nextButton);

        const repoSection = document.getElementById("repos");
        const existingPagination = document.getElementById("pagination-container");

        if (existingPagination) {
            repoSection.removeChild(existingPagination);
        }
        repoSection.appendChild(paginationContainer);
    }

    function updatePagination() {
        const paginationContainer = document.getElementById("pagination-container");
        if (paginationContainer) {
            const prevButton = paginationContainer.querySelector("button:first-child");
            const nextButton = paginationContainer.querySelector("button:last-child");

            const totalPages = Math.ceil(repositories.length / perPage);

            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }
    }

    fetchRepos();
});
