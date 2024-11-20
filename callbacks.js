// callbacks.js

// Delaying the callback execution by 5 seconds
function delayedCallback(callback) {
    setTimeout(callback, 5000);
}

// Function to start countdown and execute the callback
function startCountdown(callback) {
    const messageDiv = document.getElementById('message');
    let countdown = 5; // Set countdown time in seconds

    // Display countdown timer
    const countdownInterval = setInterval(() => {
        messageDiv.innerText = `Waiting for callback... Time remaining: ${countdown} sec`;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval); // Stop the countdown when it reaches 0
            callback(); // Execute the callback after countdown ends
        }
    }, 1000); // Update every second
}

function executeCallback() {
    const messageDiv = document.getElementById('message');
    const apiUrlInput = document.getElementById('apiUrl');
    let apiUrl = apiUrlInput.value.trim() || "https://dummyjson.com/posts"; // Using default URL if input is empty

    // Checking if the URL format is valid
    try {
        new URL(apiUrl); // Attempting to create a URL object to validate it
    } catch (error) {
        messageDiv.innerText = "Error: Invalid URL format";
        return; // Stopping the execution if the URL is invalid
    }

    // Start countdown and then fetch data
    startCountdown(() => {
        fetch(apiUrl)
            .then(response => {
                // Checking if the response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const titles = Array.isArray(data.posts)
                    ? data.posts.map(post => post.title)
                    : Object.keys(data).map(key => `${key}: ${data[key]}`); // Handling unexpected formats

                // Clearing the message and displaying the results
                messageDiv.innerText = ""; // Removing "Waiting for callback..."
                const ul = document.createElement('ul');
                ul.className = 'post-list';

                // Displaying titles in a list with alternating styles
                titles.forEach((title, index) => {
                    const li = document.createElement('li');
                    li.innerText = title;
                    li.className = index % 2 === 0 ? 'even' : 'odd'; // Adding alternating class for better styling
                    ul.appendChild(li);
                });

                messageDiv.appendChild(ul);
            })
            .catch(error => {
                // Handling different types of errors
                if (error.message === "Failed to fetch") {
                    alert("Network disconnected or server unreachable. Please check your internet connection.");
                } else if (error.message.includes("HTTP error")) {
                    const status = error.message.split(":")[1].trim();
                    messageDiv.innerText = `Error: Unable to fetch data (HTTP Status: ${status})`;
                } else {
                    messageDiv.innerText = `Error: ${error.message || "An unknown error occurred"}`;
                }
            });
    });
}
