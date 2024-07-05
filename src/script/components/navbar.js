class NavbarContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar">
                <!-- Start navbar left  -->
                <section class="navbar-left">
                    <div class="navbar-menu">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="27px"
                            height="27px"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
                            />
                        </svg>
                    </div>
                    <p class="navbar-name">Dailysh</p>
                    <div class="search-wrapper">
                        <input
                            class="search-input"
                            type="text"
                            placeholder="Search"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            class="feather feather-search"
                            viewBox="0 0 24 24"
                        >
                            <defs></defs>
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                    </div>
                </section>
                <!-- End navbar left  -->

                <!-- Start navbar right  -->
                <section class="navbar-right">
                    <button class="mode-switch" title="Switch Theme">
                        <svg
                            class="moon"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <defs></defs>
                            <path
                                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                            ></path>
                        </svg>
                    </button>
                    <button class="notification-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="feather feather-bell"
                        >
                            <path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                            />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                    <button class="profile-btn">
                        <img src="../src/images/profile.jpg" />
                        <span class="username">Sreypov</span>
                    </button>
                </section>
                <!-- End navbar right  -->
            </nav>        
        `
    }
}

customElements.define("navbar-component", NavbarContainer);

// ========== Start select the mode switch button from the DOM ==========
const modeSwitch = document.querySelector(".mode-switch");

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
        modeSwitch.classList.add("active");
    } else {
        document.documentElement.classList.remove("dark");
        modeSwitch.classList.remove("active");
    }
}

// Check if the mode switch button exists
if (modeSwitch) {
    // Load the theme from local storage
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Toggle the 'dark' class on the document's root element
    // This will switch the theme to dark mode or light mode
    modeSwitch.addEventListener("click", function () {
        const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);

        // Save the new theme to local storage
        localStorage.setItem("theme", newTheme);
    });
}
// ========== Start select the mode switch button from the DOM  ==========