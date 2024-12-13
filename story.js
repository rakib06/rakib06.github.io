// story.js
// JavaScript file to fetch and render README.md and Stories as cards with a 'See More' option

// const readmePath = "README.md"; // Path to the README.md file in your repository
const storiesPath = "stories/"; // Path to the stories directory in your repository

// // Replace these with your GitHub username and repository name
// const repoOwner = "rakib06"; 
// const repoName = "rakib06.github.io"; 

document.addEventListener("DOMContentLoaded", () => {
    const loadMarkdown = (filePath, storyName, short = true) => {
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Decode the Base64 content of the file
                const content = atob(data.content);
                // Render Markdown to HTML
                const renderedHtml = marked.parse(content);

                // If short version, truncate after 200 characters (or any limit)
                if (short) {
                    const truncated = content.substring(0, 500) + "...";
                    return {
                        title: storyName,
                        short: marked.parse(truncated),
                        full: renderedHtml
                    };
                }
                return {
                    title: storyName,
                    full: renderedHtml
                };
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                return {
                    title: storyName,
                    short: `<p>Failed to load content for ${storyName}. Please try again later.</p>`
                };
            });
    };

    const renderStoryCards = (stories) => {
        const storiesContainer = document.getElementById("story-text");
        storiesContainer.innerHTML = ""; // Clear previous content

        stories.forEach(story => {
            const card = document.createElement("div");
            card.className = "card mb-3";

            const titleColor = 'blue'; 

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title" style="color: ${titleColor};">${story.title}</h5>
                    <div class="card-text">${story.short}</div>
                    <button class="btn btn-primary see-more" data-title="${story.title}">See More</button>
                </div>
            `;

            storiesContainer.appendChild(card);
        });

        // Attach event listeners for 'See More' buttons
        document.querySelectorAll(".see-more").forEach(button => {
            button.addEventListener("click", () => {
                const title = button.getAttribute("data-title");
                const story = stories.find(s => s.title === title);
                if (story) {
                    displayFullStoryModal(story);
                }
            });
        });
    };

    const displayFullStoryModal = (story) => {
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.tabIndex = -1;
        const titleColor = 'blue'; 
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" style="color: ${titleColor};">${story.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${story.full}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        modal.addEventListener("hidden.bs.modal", () => {
            modal.remove();
        });
    };

    // Fetch and load stories
    const storiesApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${storiesPath}`;

    fetch(storiesApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const storyPromises = data
                .filter(file => file.type === "file" && file.name.endsWith(".md"))
                .map(file => {
                    const storyName = file.name.replace(".md", "");
                    return loadMarkdown(`${storiesPath}${file.name}`, storyName);
                });

            return Promise.all(storyPromises);
        })
        .then(stories => {
            renderStoryCards(stories);
        })
        .catch(error => {
            console.error("Error loading stories:", error);
            const container = document.getElementById("story-text");
            container.innerHTML = `<p>Failed to load stories. Please try again later.</p>`;
        });
});
