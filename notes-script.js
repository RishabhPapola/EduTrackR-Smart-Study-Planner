document.addEventListener("DOMContentLoaded", () => {
    const notesSection = document.querySelector(".notes-section");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
        notesSection.innerHTML = '<p id="notes-shown">No notes yet.</p>';
    } else {
        const ul = document.createElement("ul");
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.classList.add("note-item"); // add class for styling
            li.innerHTML = `
                <span class="note-text">${note}</span>
                <button class="delete-note" data-index="${index}">❌</button>
            `;
            ul.appendChild(li);
        });
        notesSection.appendChild(ul);
    }

    // Handle delete
    notesSection.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-note")) {
            const index = e.target.dataset.index;
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            location.reload(); // reload page to update
        }
    });
});
