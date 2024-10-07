import "./css/bootstrap.min.css";
import "./js/bootstrap.bundle.min";

const fetchData = async (query) => {
    // Show the loading spinner when the fetch starts
    document.querySelector(".spinner-container").classList.remove("d-none");
    // Clear previous results and errors
    document.querySelector(".dynamic_data").innerHTML = "";
    
    const url = `https://steam2.p.rapidapi.com/search/${query}/page/1`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'steam2.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Simulate an error if the response is not OK
        if (!response.ok) throw new Error("Failed to fetch data. Please try again.");

        console.log(result);
        handleData(result);
    } catch (error) {
        handleError(error); // Handle errors
        console.error(error);
    } finally {
        // Hide the loading spinner after data is fetched or an error occurs
        document.querySelector(".spinner-container").classList.add("d-none");
    }
};

// Add event listener to the search button
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value; // Get the input value
    if (query) {
        fetchData(query); // Call fetchData with the user's search query
    } else {
        handleError({ message: "Please enter a search term." });
    }
});

// Function to handle displaying fetched data
function handleData(result) {
    const resultHeader = document.querySelector('.result-header');
    resultHeader.classList.remove('d-none'); // Show results header

    // Clear any previous results
    document.querySelector(".dynamic_data").innerHTML = "";

    if (result && result.length > 0) {
        result.forEach((game) => {
            document.querySelector(".dynamic_data").innerHTML += `
                <div class="col">
                    <article class="card">
                        <div class="card-body">
                            <p><strong>Title:</strong> ${game.title}</p>
                            <p><strong>App ID:</strong> ${game.appId}</p>
                            <p><strong>Review:</strong> ${game.reviewSummary}</p>
                            <a href="${game.url}" target="_blank" class="btn btn-primary">Visit Game Page</a>
                            <img src="${game.imgUrl}" class="img-fluid" style="max-width: 250%; height: 100px;" alt="${game.title}">
                        </div>
                    </article>
                </div>
            `;
        });
    } else {
        handleError({ message: "No results found." });
    }
}

// Function to handle errors
function handleError(error) {
    document.querySelector(".dynamic_data").innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${error.message}
        </div>
    `;
}

// Add an HTML element for the results header if it doesn't exist
if (!document.querySelector('.result-header')) {
    const headerElement = document.createElement('h2');
    headerElement.className = 'result-header d-none'; // Initially hidden
    headerElement.textContent = "Here's the result for your search... ✨";
    document.querySelector('main').insertBefore(headerElement, document.querySelector('.dynamic_data'));
}
