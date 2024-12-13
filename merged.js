// merged.js
// JavaScript file to fetch and render both README.md (for Stories) and Timelines

document.addEventListener("DOMContentLoaded", () => {
    const storiesPath = "stories/"; // Path to the stories directory
    const timelinePath = "timelines/"; // Path to the timeline file

    const repoOwner = "rakib06"; // Replace with your GitHub username
    const repoName = "rakib06.github.io"; // Replace with your repository name

    // const loadMarkdown = (filePath, short = true) => {
    //     const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    //     return fetch(apiUrl)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             // Decode Base64 content from GitHub API
    //             const decodedContent = atob(data.content);

    //             // Render markdown to HTML
    //             const renderedHtml = marked.parse(decodedContent);

    //             if (short) {
    //                 // Truncate content for the short version
    //                 const truncated = decodedContent.substring(0, 500) + "...";
    //                 return {
    //                     short: marked.parse(truncated),
    //                     full: renderedHtml
    //                 };
    //             }

    //             return {
    //                 full: renderedHtml
    //             };
    //         })
    //         .catch(error => {
    //             console.error(`Error loading ${filePath}:`, error);
    //             return {
    //                 short: `<p>Failed to load content. Please try again later.</p>`,
    //                 full: `<p>Failed to load full content. Please try again later.</p>`
    //             };
    //         });
    // };

    const loadMarkdown = (filePath, short = true) => {
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.content || data.encoding !== "base64") {
                    throw new Error("Content is not Base64-encoded or missing.");
                }
    
                // Decode Base64 content from GitHub API
                const decodedContent = atob(data.content);
    
                // Render markdown to HTML
                const renderedHtml = marked.parse(decodedContent);
    
                if (short) {
                    // Truncate content for the short version
                    const truncated = decodedContent.substring(0, 500) + "...";
                    return {
                        short: marked.parse(truncated),
                        full: renderedHtml
                    };
                }
    
                return {
                    full: renderedHtml
                };
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                return {
                    short: `<p>Failed to load content. Please try again later.</p>`,
                    full: `<p>Failed to load full content. Please try again later.</p>`
                };
            });
    };
    
    const renderCard = (containerId, title, content, color = 'blue') => {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear previous content

        const card = document.createElement("div");
        card.className = "card mb-3";

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title" style="color: ${color};">${title}</h5>
                <div class="card-text">${content.short}</div>
                <button class="btn btn-primary see-more" data-full-content="${encodeURIComponent(content.full)}">See More</button>
            </div>
        `;

        container.appendChild(card);

        // Add event listener for "See More" button
        container.querySelector(".see-more").addEventListener("click", (event) => {
            const fullContent = decodeURIComponent(event.target.getAttribute("data-full-content"));
            displayFullContentModal(title, fullContent);
        });
    };

    const renderCards = (containerId, stories) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear previous content

        stories.forEach(story => {
            const card = document.createElement("div");
            card.className = "card mb-3";

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title" style="color: blue;">${story.title}</h5>
                    <div class="card-text">${story.short}</div>
                    <button class="btn btn-primary see-more" data-full-content="${encodeURIComponent(story.full)}">See More</button>
                </div>
            `;

            container.appendChild(card);

            // Add event listener for "See More" button
            card.querySelector(".see-more").addEventListener("click", (event) => {
                const fullContent = decodeURIComponent(event.target.getAttribute("data-full-content"));
                displayFullContentModal(story.title, fullContent);
            });
        });
    };

    const displayFullContentModal = (title, content) => {
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" style="color: blue;">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
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

    // Load and render timeline
    // loadMarkdown(timelinePath).then(timeline => {
    //     renderCard("timeline-text", "Professional Timeline", timeline);
    // });

    // Fetch and load timeline files
        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${timelinePath}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch timeline directory: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Find all Markdown files in the directory
            const timelineFile = data.find(file => file.name.endsWith(".md"));

            if (!timelineFile) {
                throw new Error("No Markdown file found in the timeline directory.");
            }

            // Fetch the content of the first Markdown file
            return loadMarkdown(`${timelinePath}${timelineFile.name}`);
        })
        .then(timeline => {
            renderCard("timeline-text", "Professional Timeline", timeline);
        })
        .catch(error => {
            console.error("Error loading timelines:", error);
            const container = document.getElementById("timeline-text");
            container.innerHTML = `<p>Failed to load timeline. Please try again later.</p>`;
        });


    // Fetch and load stories
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${storiesPath}`)

        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch stories: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const storyPromises = data
                .filter(file => file.type === "file" && file.name.endsWith(".md"))
                .map(file => {
                    const storyName = file.name.replace(".md", "");
                    return loadMarkdown(`${storiesPath}${file.name}`).then(content => ({
                        title: storyName,
                        ...content
                    }));
                });

            return Promise.all(storyPromises);
        })
        .then(stories => {
            renderCards("story-text", stories);
        })
        .catch(error => {
            console.error("Error loading stories:", error);
            const container = document.getElementById("story-text");
            container.innerHTML = `<p>Failed to load stories. Please try again later.</p>`;
        });
});
