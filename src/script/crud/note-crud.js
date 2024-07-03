/* =========== Start Query DOM elements =========== */
const noteList = document.querySelector('#note-list');
const noteModal = document.querySelector('#note-modal');
const modalNoteForm = document.querySelector('#modal-note-form');
const viewNoteModal = document.querySelector('#view-note-modal');
/* =========== End Query DOM elements =========== */


/* =========== Start Retrieve notes from localStorage or initialize an empty array =========== */
let noteEntries = JSON.parse(localStorage.getItem('noteEntries')) || [];
let currentEditNoteId = null;
let isNoteEditing = false;
/* =========== End Retrieve notes from localStorage or initialize an empty array =========== */


/* =========== Start Save notes to localStorage =========== */
const saveNotes = () => {
    try {
        localStorage.setItem('noteEntries', JSON.stringify(noteEntries));
    } catch (error) {
        console.error('Error saving notes to localStorage', error);
    }
};
/* =========== End Save notes to localStorage =========== */


/* =========== Start open modal function =========== */
function openCreateModal () {
    isNoteEditing = false;
    modalNoteForm.reset();
    noteModal.style.display = 'block';

    // Prevent scrolling the content behind the modal
    document.body.classList.add('no-scroll');
};
/* =========== End open modal function =========== */


/* =========== Start close modal function =========== */
const closeModal = () => {
    noteModal.style.display = 'none';
    currentEditNoteId = null;
};
/* =========== End close modal function =========== */


/* =========== Start add note =========== */
modalNoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('modal-note-title').value;
    const date = document.getElementById('modal-note-date').value;
    const des = document.getElementById('modal-note-des').value;

    const entry = { title, date, des };
    if (isNoteEditing) {
        noteEntries[currentEditNoteId] = entry;
        isNoteEditing = false;
    } else {
        noteEntries.unshift(entry);
    }
    currentEditNoteId = null;
    saveNotes();
    renderNotes();
    closeModal();

    document.body.classList.remove('no-scroll');
});
/* =========== End add note   =========== */


/* =========== Start render note entry =========== */
const renderNotes = () => {
    noteList.innerHTML = '';
    noteEntries.forEach((note, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'note-box';

        entryDiv.innerHTML = NoteCardEntry(note, index);
        noteList.appendChild(entryDiv);

        // Add the click event listener to open the view modal
        entryDiv.addEventListener('click', () => openViewModal(index));
        
    });
};
/* =========== End render note entry   =========== */


/* =========== Start edit note function   =========== */
const openEditModal = (index) => {
    isNoteEditing = true;
    currentEditNoteId = index;
    const entry = noteEntries[index];
    document.getElementById('modal-note-title').value = entry.title;
    document.getElementById('modal-note-date').value = entry.date;
    document.getElementById('modal-note-des').value = entry.des;
    noteModal.style.display = 'block';
};
/* =========== End   edit note function   =========== */


/* =========== Start delete note function   =========== */
const deleteEntry = (index) => {
    noteEntries.splice(index, 1);
    saveNotes();
    renderNotes();
};
/* =========== End delete note function   =========== */

/* =========== Start view note function   =========== */
const openViewModal = (index) => {
    // Prevent scrolling the content behind the modal
    document.body.classList.add('no-scroll');

    const entry = noteEntries[index];
    document.getElementById('view-note-title').textContent = entry.title;
    document.getElementById('view-note-date').textContent = entry.date;
    document.getElementById('view-note-des').textContent = entry.des;
    viewNoteModal.style.display = 'block';

};
/* =========== End view note function   =========== */

/* =========== Start close view modal function =========== */
const closeViewModal = () => {
    viewNoteModal.style.display = 'none';

    document.body.classList.remove('no-scroll');
};
/* =========== End close view modal function =========== */

/* =========== Start note card entries   =========== */
const NoteCardEntry = (note, index) => {

    const getDayOfWeek = (dateString) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(dateString);
        const day = daysOfWeek[date.getDay()];
        const dayOfMonth = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}.${dayOfMonth}/${month}/${year}`;
    };

    const formattedDate = getDayOfWeek(note.date);
    return `
            <div class="note-content">
                <div class="note-header">
                    <div class="name">${note.title}</div>
                    <div class="note-actions">
                        <div class="edit-btn" onclick="event.stopPropagation(); openEditModal(${index})">
                            <svg class="feather feather-edit" fill="none" width="20" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </div>
                        <div class="edit-btn"  onclick="event.stopPropagation(); deleteEntry(${index})">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            viewBox="0 0 1024 1024"
                            stroke-width="1"
                        >
                            <path
                                fill="currentColor"
                                d="M360 184h-8c4.4 0 8-3.6 8-8zh304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32M731.3 840H292.7l-24.2-512h487z"
                            />
                        </svg>
                        </div>
                        
                    </div>
                </div>
                <p class="note-line note-des">${note.des}</p>
                <p class="note-line time">${formattedDate}</p>
            </div>
    `
}
/* =========== Start note card entries   =========== */


/* =========== Initial render of notes when the page loads   =========== */
renderNotes();