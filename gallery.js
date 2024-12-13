// gallery.js 

const repoOwner = "rakib06"; // Your GitHub username
const repoName = "rakib06.github.io"; // Your repository name
const directoryPath = "media/photos/gallery"; // Directory path in your repo

document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`;

    const imageModal = document.getElementById("image-modal");
    const imageModalContent = document.getElementById("image-modal-content");
    const imageModalClose = document.getElementById("image-modal-close");

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const carouselItems = document.getElementById("carousel-items");

            data.forEach((file, index) => {
                if (file.type === "file" && file.name.includes("__")) {
                    const [name, descriptionWithExt] = file.name.split("__");
                    const description = descriptionWithExt.split(".")[0];
                    const imageUrl = file.download_url;

                    const slide = document.createElement("div");
                    slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;

                    slide.innerHTML = `
                        <img src="${imageUrl}" loading="lazy" class="d-block w-100" alt="${name}"  onclick="showImageModal('${imageUrl}', '${name}')">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${name}</h5>
                            <p>${description}</p>
                        </div>
                    `;

                    carouselItems.appendChild(slide);
                }
            });
        })
        .catch(error => {
            console.error("Error loading gallery images:", error);
        });

    // Show full image in modal
    window.showImageModal = (imageUrl, altText) => {
        imageModal.style.display = "block";
        imageModalContent.src = imageUrl;
        imageModalContent.alt = altText;
    };

    // Close the modal
    imageModalClose.onclick = () => {
        imageModal.style.display = "none";
    };

    // Close modal when clicking outside the image
    imageModal.onclick = (event) => {
        if (event.target === imageModal) {
            imageModal.style.display = "none";
        }
    };
});
