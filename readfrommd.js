// Function to load markdown from a .md file and inject it into HTML element(s)
const loadMarkdownToHtml = (filePath, targetId) => {
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

            // Inject HTML into target element
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = renderedHtml;
            } else {
                console.error(`Element with ID "${targetId}" not found.`);
            }
        })
        .catch(error => {
            console.error(`Error loading ${filePath}:`, error);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = `<p>Failed to load content. Please try again later.</p>`;
            }
        });
};


document.addEventListener("DOMContentLoaded", () => {
    // Specify your GitHub repo details
    const repoOwner = "rakib06"; // Replace with your GitHub username
    const repoName = "rakib06.github.io"; // Replace with your repository name

    // Load and inject markdown for stories
    loadMarkdownToHtml("media/files/md/header.md", "rakibheader");
    loadMarkdownToHtml("media/files/md/about.md", "about");
    // loadMarkdownToHtml("media/files/md/skills.md", "skills");
    loadMarkdownToHtml("media/files/md/experience.md", "experience");
    loadMarkdownToHtml("media/files/md/education.md", "education");

    


    


    // Load and inject markdown for timelines
    // loadMarkdownToHtml("timelines/timeline1.md", "timeline-content");
});