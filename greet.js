//greet.js


document.addEventListener("DOMContentLoaded", () => {


    function greetUser() {
        const now = new Date(); // Get current date and time
        const currentHour = now.getHours(); // Get the current hour (0-23)
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get user's timezone
    
        let greeting;
    
        if (currentHour >= 5 && currentHour < 12) {
            greeting = "Good Morning!";
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "Good Afternoon!";
        } else if (currentHour >= 18 && currentHour < 22) {
            greeting = "Good Evening!";
        } else {
            greeting = "Good Night!";
        }
    
        return { greeting, timezone: userTimezone };
    }
    
    // Display the greeting and timezone
    const userInfo = greetUser();

    const greet = document.getElementById("greet");
    const tz = document.getElementById("tz");

    greet.innerHTML = `Hello.. ${userInfo.greeting}`
    tz.innerHTML  =`${userInfo.timezone}`;
    //Your current timezone is: 
    
    // You can also log it to the console
    console.log(`Greeting: ${userInfo.greeting}`);
    console.log(`Timezone: ${userInfo.timezone}`);
    
});


