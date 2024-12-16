//greet.js


document.addEventListener("DOMContentLoaded", () => {

    const commandText = "skills --overview";
    let index = 0;
    const typingElement = document.getElementById("typingText");

    // Function to simulate typing animation
    function typeText() {
        if (index < commandText.length) {
            typingElement.textContent += commandText[index];
            index++;
            setTimeout(typeText, 100); // Adjust speed here (100ms per character)
        } else {
            // Once typing is finished, show the skills table
            setTimeout(() => {
                document.getElementById("skillsTable").style.display = "table";
            }, 500); // Wait a little before displaying the table
        }
    }

    // Start the typing animation when the page loads
    window.onload = typeText;


    

    
});


