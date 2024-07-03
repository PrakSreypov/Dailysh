/* =========== Start Query DOM elements =========== */
const tasksList = document.querySelector('#tasks-list');
const taskModal = document.querySelector("#task-modal");
const modalTaskForm = document.querySelector("#task-modal-form");
const viewTaskModal = document.querySelector('#view-task-modal');
const inProgressTaskCount = document.getElementById('in-progress-task');
const upcomingTaskCount = document.getElementById('upcomming-task');
const totalTaskCount = document.getElementById('total-tasks');
/* =========== End Query DOM elements   =========== */

/* =========== Start Retrieve tasks from localStorage or initialize an empty array =========== */
let taskEntries = JSON.parse(localStorage.getItem("taskEntries")) || [];
let currentEditIndex = null;
let isEditing = false;
/* =========== End Retrieve tasks from localStorage or initialize an empty array   =========== */

/* =========== Start Save tasks to localStorage =========== */
const saveTasks = () => {
    try {
        localStorage.setItem("taskEntries", JSON.stringify(taskEntries));
    } catch (error) {
        console.error("Error saving notes to localStorage", error);
    }
};
/* =========== End Save tasks to localStorage =========== */

/* =========== Start add task function =========== */
function addTask() {
    isEditing = false;
    modalTaskForm.reset();

    // open task modal
    taskModal.style.display = "block";
    document.body.classList.add('no-scroll');
}

// close task modal
const closeTaskModal = () => {
    taskModal.style.display = "none";
    currentEditIndex = null;
    document.body.classList.remove('no-scroll');
};

// handle on submit form
modalTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskTitle = document.getElementById("task-title").value;
    const taskDes = document.getElementById("task-description").value;
    const taskStartDate = document.getElementById("start-date").value;
    const taskStartTime = document.getElementById("start-time").value;
    const taskDueDate = document.getElementById("due-date").value;
    const taskDueTime = document.getElementById("due-time").value;
    const taskPriority = document.getElementById("task-priority").value;
    const taskStatus = document.getElementById("task-status").value;
    const taskTags = document.getElementById("task-tags").value;

    const taskEntry = {
        taskTitle,
        taskDes,
        taskStartDate,
        taskStartTime,
        taskDueDate,
        taskDueTime,
        taskPriority,
        taskStatus,
        taskTags,
    };

    if (isEditing) {
        taskEntries[currentEditIndex] = taskEntry;
        isEditing = false;
    } else {
        taskEntries.unshift(taskEntry);
    }

    currentEditIndex = null;
    saveTasks();
    renderTasks();
    taskModal.style.display = "none";
    document.body.classList.remove('no-scroll');
});
/* =========== End add task function   =========== */

/* =========== Start render task function =========== */
const renderTasks = () => {
    tasksList.innerHTML = "";
    let inProgressCount = 0;
    let upcomingCount = 0;
    const today = new Date().toISOString().split("T")[0];

    taskEntries.forEach((task, index) => {
        if (
            task &&
            task.taskTitle &&
            task.taskStartDate &&
            task.taskStartTime &&
            task.taskDueDate &&
            task.taskDueTime
        ) {
            const taskDiv = taskCard(task, index);
            tasksList.appendChild(taskDiv);

            if (task.taskStatus === "Doing") {
                inProgressCount++;
            } 

            if (isUpcoming(task.taskStartDate, task.taskDueDate, today)) {
                upcomingCount++;
            }
        }
    });

    inProgressTaskCount.textContent = inProgressCount;
    upcomingTaskCount.textContent = upcomingCount;
    totalTaskCount.textContent = taskEntries.length;

    taskActions();

};

// function handle on upcomming date
const isUpcoming = (startDate, dueDate, today) => {
    return startDate > today || (startDate <= today && dueDate >= today);
};
/* =========== End render task function   =========== */

/* =========== Start edit task function   =========== */
const openTaskEditModal = (index) => {
    // Close viewTaskModal if it's open
    closeViewTaskModal();

    isEditing = true;
    currentEditIndex = index;

    const task = taskEntries[index];

    document.getElementById("task-title").value = task.taskTitle;
    document.getElementById("task-description").value = task.taskDes;
    document.getElementById("start-date").value = task.taskStartDate;
    document.getElementById("start-time").value = task.taskStartTime;
    document.getElementById("due-date").value = task.taskDueDate;
    document.getElementById("due-time").value = task.taskDueTime;
    document.getElementById("task-priority").value = task.taskPriority;
    document.getElementById("task-status").value = task.taskStatus;
    document.getElementById("task-tags").value = task.taskTags;

    // Open taskModal for editing
    taskModal.style.display = "block";
    
    // Prevent scrolling the content behind the modal
    document.body.classList.add('no-scroll');
};
/* =========== End edit task function     =========== */

/* =========== Start delete task function   =========== */
const deleteTask = (index) => {
    // Close viewTaskModal if it's open
    closeViewTaskModal();

    taskEntries.splice(index, 1);
    saveTasks();
    renderTasks();
    document.body.classList.remove('no-scroll');
};
/* =========== End delete task function     =========== */

/* =========== Start view note function   =========== */
const openViewTaskModal = (index) => {
    // Prevent scrolling the content behind the modal
    document.body.classList.add('no-scroll');

    // Get the elements where the task details will be displayed
    const titleEl = document.getElementById('view-task-title');
    const desEl = document.getElementById('view-task-des');
    const startDateEl = document.getElementById('view-task-start-date');
    const startTimeEl = document.getElementById('view-task-start-time');
    const dueDateEl =document.getElementById('view-task-due-date');
    const dueTimeEl = document.getElementById('view-task-due-time');
    const statusEl = document.getElementById('view-task-status');
    const priorityEl = document.getElementById('view-task-priority');
    const tagEl = document.getElementById('view-task-tags');

    const entry = taskEntries[index];

    
    // Set the text content of the elements to the corresponding task details
    titleEl.textContent = entry.taskTitle;
    desEl.textContent = entry.taskDes;
    startDateEl.textContent = getDayOfWeek(entry.taskStartDate);;
    startTimeEl.textContent = convertTo12HourFormat(entry.taskStartTime);
    dueDateEl.textContent = getDayOfWeek(entry.taskDueDate);
    dueTimeEl.textContent = convertTo12HourFormat(entry.taskDueTime);
    priorityEl.textContent = entry.taskPriority;
    statusEl.textContent = entry.taskStatus;
    tagEl.textContent = entry.taskTags;

    // Remove existing priority classes
    priorityEl.classList.remove('Low', 'Medium', 'High');
    // Add the new priority class based on the task's priority
    priorityEl.classList.add(entry.taskPriority);

    // Remove existing status classes
    statusEl.classList.remove('To-Do', 'Doing', 'Done');
    // Add the new status class based on the task's status
    statusEl.classList.add(entry.taskStatus);
     // Add the status class to the progress icon element
    document.querySelector('.icon-progress').classList.add(entry.taskStatus);

    // Display the view task modal
    viewTaskModal.style.display = 'block';

};
/* =========== End view note function   =========== */

/* =========== Start close view modal function =========== */
const closeViewTaskModal = () => {
    viewTaskModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
};
/* =========== End close view modal function =========== */

/* =========== Start Convert time to 12-hour format   =========== */
const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
};
/* =========== End Convert time to 12-hour format     =========== */

/* =========== Start Convert date to a readable format   =========== */
const getDayOfWeek = (dateString) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    const day = daysOfWeek[date.getDay()];
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}.${dayOfMonth}.${month}.${year}`;
};
/* =========== End Convert date to a readable format   =========== */

/* =========== Start task card entries      =========== */
const taskCard = (task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-card-wrapper";

    // Add the click event listener to open the view modal
    taskDiv.addEventListener('click', () => openViewTaskModal(index));

    const startTimeFormatted = convertTo12HourFormat(task.taskStartTime);
    const dueTimeFormatted = convertTo12HourFormat(task.taskDueTime);

    taskDiv.innerHTML = `
        <div class="task-box">
            <div class="task-box-header">
                <div class="task-box-header_left">
                    <span>${startTimeFormatted} - ${dueTimeFormatted}</span>
                    <span class="time-split">|</span>
                    <span class="time-status">${
                        task.taskStartDate ===
                        new Date().toISOString().split("T")[0]
                            ? "Today"
                            : getDayOfWeek(task.taskDueDate)
                    }</span>
                </div>
                <div class="task-box-header_right more-wrapper">
                    <button class="task-btn-more">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#" class="dropdown-item edit-task" data-index="${index}">Edit</a>
                        <a href="#" class="dropdown-item delete-task" data-index="${index}">Delete</a>
                    </div>
                </div>
            </div>
            <div class="task-box-content">
                <p class="box-content-header">${task.taskTitle}</p>
                <div class="box-content">
                    <div class="task-des">
                        <p class="box-content-subheader">Description:</p>
                        <p class="box-content-des">${task.taskDes}</p>
                    </div>
                    <div class="task-des">
                        <p class="box-content-subheader">Priority:</p>
                        <p class="box-content-des text-priority ${task.taskPriority}">${task.taskPriority}</p>
                    </div>
                    <div class="task-des">
                        <p class="box-content-subheader">Status:</p>
                        <div class="box-content-des">
                            <button class="btn-progress ${task.taskStatus}">
                                <span class="icon-progress"></span>${task.taskStatus}
                            </button>
                        </div>
                    </div>
                    <div class="task-des">
                        <p class="box-content-subheader">Tag:</p>
                        <button class="btn-tag">
                            <span class="tag-decor"></span>
                            <div class="btn-tag-content">
                                <div class="tag-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z" clip-rule="evenodd"/></svg>
                                </div>
                                <span class="tag-text">${task.taskTags}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>        
    `;

    return taskDiv;
};
/* =========== End task card entries        =========== */

/* =========== Start task actions dropdown  =========== */
// Attach dropdown event listeners
const taskActions = () => {
    document.querySelectorAll(".task-btn-more").forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
                if (menu !== button.nextElementSibling) {
                    menu.classList.remove("show");
                }
            });
            button.nextElementSibling.classList.toggle("show");
        });
    });
};

// Event delegation for task actions
tasksList.addEventListener('click', (event) => {
    event.stopPropagation();
    if (event.target.closest('.edit-task')) {
        const index = event.target.closest('.edit-task').dataset.index;
        openTaskEditModal(index);
    } else if (event.target.closest('.delete-task')) {
        const index = event.target.closest('.delete-task').dataset.index;
        deleteTask(index);
    }
});
/* =========== End task actions dropdown    =========== */

renderTasks();