// Async/Await code

// Async function to fetch data
async function fetchDataWithAsync(apiUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        // Checking if the URL format is valid before attempting to fetch
        try {
            new URL(apiUrl); // Attempting to create a URL object to validate it
        } catch (error) {
            throw new Error("Invalid URL format");
        }

        // Fetching data with the timeout controller
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        clearTimeout(timeoutId);
        const data = await response.json();
        return data.posts;
    } catch (error) {
        clearTimeout(timeoutId);

        // Handling different types of errors
        if (error.name === 'AbortError') {
            throw new Error("Operation timed out");
        }
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error("Network disconnected or server unreachable");
        }

        // Handling invalid URL format
        if (error.message === "Invalid URL format") {
            throw new Error("Error: The URL provided is not valid.");
        }

        // Handling other general errors
        throw new Error(error.message || "Network error");
    }
}

// Executing the Async function
async function executeAsync() {
    const messageDiv = document.getElementById('message');
    const apiUrlInput = document.getElementById('apiUrl');
    // Using default URL if input is empty
    const apiUrl = apiUrlInput.value.trim() || "https://dummyjson.com/posts";
    messageDiv.innerText = "Loading...";

    try {
        // Clearing the loading message
        messageDiv.innerText = "";

        // Fetching data asynchronously
        const posts = await fetchDataWithAsync(apiUrl);
        const titles = posts.map(post => post.title);

        // Displaying the titles in a list with alternating styles
        const ul = document.createElement('ul');
        ul.className = 'post-list';
        titles.forEach((title, index) => {
            const li = document.createElement('li');
            li.innerText = title;
            li.className = index % 2 === 0 ? 'even' : 'odd'; // Adding alternating class for better styling
            ul.appendChild(li);
        });
        messageDiv.appendChild(ul);
    } catch (error) {
        // Handling specific types of errors
        if (error.message === "Network disconnected or server unreachable") {
            alert("Network disconnected or server is unreachable. Please check your internet connection.");
            messageDiv.innerText = "Error: Network issue. Please try again later.";
        } else if (error.message === "Invalid URL format") {
            messageDiv.innerText = "Error: The URL provided is not valid.";
        } else if (error.message.includes("HTTP error")) {
            messageDiv.innerText = `Error: Unable to fetch data (${error.message})`;
        } else {
            messageDiv.innerText = `Error: ${error.message || "An unknown error occurred"}`;
        }
    }
}
