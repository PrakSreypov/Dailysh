import { SidebarData } from '../data/sidebar-data.js';

const dataSource = {
    "sidebar-data": SidebarData,
};

const SidebarContainer = (data) => {
    return `
        <div class="sidebar-overlay"></div>
        <div class="sidebar">
            <div class="logo">
                <img src="../src/images/logo1.png" alt="logo">
            </div>

            <div class="sidebar-links">
                ${data.sidebarLink.map((item) => `
                    <a href="${item.link}" class="sidebar-link">
                        <div class="sidebar-icon active">
                            ${item.svg}
                        </div>
                        <div class="sidebar-name">
                            <span>${item.text}</span>
                        </div>
                    </a>
                `).join('')}
            </div>
            <footer>Created By Prak Sreypov</footer>
        </div>
    `;
};

class Sidebar extends HTMLElement {
    connectedCallback() {
        const dataAtt = this.getAttribute("data-source");
        const dataSourceKey = dataSource[dataAtt];
        this.innerHTML = SidebarContainer(dataSourceKey);

        // Add event listeners after the content has been added to the DOM
        const navMenuBtn = document.querySelector(".navbar-menu");
        const sidebarContainer = document.querySelector(".sidebar");
        const sidebarOverlay = document.querySelector(".sidebar-overlay");
        const body = document.body;

        // Event listener for the nav menu button
        navMenuBtn.addEventListener("click", () => {
            sidebarContainer.classList.toggle("sidebar-toggle");
            sidebarOverlay.classList.toggle("active");
            body.classList.toggle("no-scroll");
        });

        // Event listener to close the sidebar when clicking the overlay
        sidebarOverlay.addEventListener("click", () => {
            sidebarContainer.classList.remove("sidebar-toggle");
            sidebarOverlay.classList.remove("active");
            body.classList.remove("no-scroll");
        });

        // Event listener to handle screen resize
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1200) {
                sidebarContainer.classList.remove("sidebar-toggle");
                sidebarOverlay.classList.remove("active");
                body.classList.remove("no-scroll");
            }
        });
    }
}

customElements.define("sidebar-component", Sidebar);