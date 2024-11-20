// Promise-based code

// Function to fetch data with a Promise
function fetchDataWithPromise(apiUrl) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Operation timed out")), 5000);

        // Checking if the URL format is valid
        try {
            new URL(apiUrl); // Attempting to create a URL object to validate it
        } catch (error) {
            reject(new Error("Invalid URL format"));
            return; // Stopping the execution if the URL is invalid
        }

        fetch(apiUrl)
            .then(response => {
                // Checking if the response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                clearTimeout(timeout);
                resolve(data.posts);
            })
            .catch(err => {
                clearTimeout(timeout);

                // Handling network errors or other issues
                if (err.message === "Failed to fetch") {
                    reject(new Error("Network disconnected or server unreachable"));
                } else if (err.message.includes("HTTP error")) {
                    const status = err.message.split(":")[1].trim();
                    reject(new Error(`Unable to fetch data (HTTP Status: ${status})`));
                } else {
                    reject(err.message || "Error fetching data");
                }
            });
    });
}

// Executing the Promise-based function
function executePromise() {
    const messageDiv = document.getElementById('message');
    const apiUrlInput = document.getElementById('apiUrl');
    let apiUrl = apiUrlInput.value.trim() || "https://dummyjson.com/posts"; // Using default URL if input is empty

    messageDiv.innerText = "Loading...";

    fetchDataWithPromise(apiUrl)
        .then(posts => {
            const titles = posts.map(post => post.title);

            // Clearing the loading message and displaying the results
            messageDiv.innerText = ""; // Removing "Loading..."
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
            // Handling errors including invalid URL
            if (error.message === "Invalid URL format") {
                messageDiv.innerText = "Error: The URL provided is not valid.";
            } else if (error.message === "Network disconnected or server unreachable") {
                alert("Network disconnected or server is unreachable. Please check your internet connection.");
                messageDiv.innerText = "Error: Network issue. Please try again later.";
            } else if (error.message.includes("HTTP Status")) {
                messageDiv.innerText = `Error: Unable to fetch data (${error.message})`;
            } else {
                messageDiv.innerText = `Error: ${error.message || "An unknown error occurred"}`;
            }
        });
}
