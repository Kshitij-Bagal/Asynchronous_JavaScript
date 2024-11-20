// Function to handle active tab change
function navigateTo(page, tabId) {
    const tabs = document.querySelectorAll('.tab');
    
    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to the clicked tab
    const clickedTab = document.getElementById(tabId);
    clickedTab.classList.add('active');

    // Navigate to the selected page
    window.location.href = page;
}

// Function to set the active tab based on the current page
function setActiveTab() {
    const currentPage = window.location.pathname; // Get the current page URL
    const tabs = document.querySelectorAll('.tab');

    // Check which tab matches the current page URL
    tabs.forEach(tab => {
        const tabPage = tab.getAttribute('data-page');
        
        switch (true) {
            case currentPage.includes('callbacks'):
                if (tabPage === 'callbacks.html') {
                    tab.classList.add('active');
                }
                break;
            case currentPage.includes('promises'):
                if (tabPage === 'promises.html') {
                    tab.classList.add('active');
                }
                break;
            case currentPage.includes('async-await'):
                if (tabPage === 'async-await.html') {
                    tab.classList.add('active');
                }
                break;
            case currentPage.includes('index'):
                if (tabPage === 'index.html') {
                    tab.classList.add('active');
                }
                break;
            default:
                break;
        }
    });
}

// Call the setActiveTab function when the page is loaded
window.onload = function(){setTimeout(setActiveTab,1); };
