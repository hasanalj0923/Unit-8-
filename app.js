// global variables
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBox = document.querySelector(".search");
const previous = document.querySelector(".modal-previous");
const next = document.querySelector(".modal-next");
let modalIndex = 0;

// fetch data from API
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err));

// Display employee cards
function displayEmployees(employeeData) {
    employees = employeeData; // setting employees variable equal to employeeData for global access
    let employeeHTML = ''; // to hold the employee HTML as we create it

    employees.forEach((employee, index) => {
        const { name, email, location, picture } = employee;
        const { city } = location;

        // template literals make this much cleaner
        employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
            </div>
        </div>
        `;
    });
    gridContainer.innerHTML = employeeHTML;
}

// Display modal with employee details
function displayModal(index) {
    const { name, dob, phone, email, location, picture } = employees[index];
    const { city, street, state, postcode } = location;
    const date = new Date(dob.date);

    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.number}, ${street.name}, ${state}, ${postcode}</p>
        <p>Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
    modalIndex = index;
}

// Event listeners for gridContainer click event
gridContainer.addEventListener('click', (e) => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
    }
});

// Event listener for closing modal
modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});

// Search functionality to filter employees by name
searchBox.addEventListener('input', runSearch);

function runSearch(e) {
    const employeeNames = document.querySelectorAll(".name");
    const searchTerm = e.target.value.toLowerCase();
    
    employeeNames.forEach(name => {
        if (name.textContent.toLowerCase().includes(searchTerm)) {
            name.parentElement.parentElement.removeAttribute("style");
        } else {
            name.parentElement.parentElement.style.display = "none";
        }
    });
}

// Modal navigation functionality to switch between employees
function handleModalNavigation(direction) {
    if (direction === "next") {
        modalIndex = (modalIndex === 11) ? 0 : modalIndex + 1;
    } else {
        modalIndex = (modalIndex === 0) ? 11 : modalIndex - 1;
    }
    displayModal(modalIndex);
}

next.addEventListener('click', () => handleModalNavigation("next"));
previous.addEventListener('click', () => handleModalNavigation("previous"));

// Optimized function to handle API errors
function handleAPIError(error) {
    console.error("Failed to fetch employee data:", error);
    alert("Sorry, there was an error loading employee data. Please try again later.");
}

// Event listener for when the overlay is clicked to close the modal
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.add("hidden");
    }
});

// Improved structure for the search input to handle case insensitivity more efficiently
function filterEmployees(searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.name.first} ${employee.name.last}`.toLowerCase();
        return fullName.includes(searchTermLower);
    });
    updateEmployeeList(filteredEmployees);
}

// Dynamically updates the displayed employee list based on the search filter
function updateEmployeeList(filteredEmployees) {
    let employeeHTML = '';
    filteredEmployees.forEach((employee, index) => {
        const { name, email, location, picture } = employee;
        const { city } = location;

        employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
            </div>
        </div>
        `;
    });
    gridContainer.innerHTML = employeeHTML;
}
