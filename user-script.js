document.addEventListener("DOMContentLoaded", () => {
    /* ------------------ TASK MANAGER ------------------ */
    const taskInput = document.querySelector(".task-enter");
    const dateInput = document.querySelector(".date-enter");
    const addBtn = document.querySelector(".add-task");
    const taskList = document.querySelector(".task-list");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
        taskList.innerHTML = "";
        const today = new Date();

        tasks.forEach((task, index) => {
            const dueDate = new Date(task.date);
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let statusText = "";
            if (diffDays > 0) statusText = `⏳ ${diffDays} day(s) left`;
            else if (diffDays === 0) statusText = "⚡ Due today!";
            else statusText = `❌ ${Math.abs(diffDays)} day(s) late`;

            const li = document.createElement("li");
            li.innerHTML = `
                <span>
                    <strong>${task.text}</strong> - <small>${task.date}</small> 
                    <em>(${statusText})</em>
                </span>
                <button class="delete-btn" data-index="${index}" title="Mark as Done">✔ Done</button>
            `;
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;
        if (taskText === "" || taskDate === "") {
            alert("Please enter task and date");
            return;
        }
        tasks.push({ text: taskText, date: taskDate });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        dateInput.value = "";
        renderTasks();
    }

    addBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    });

    renderTasks();

    /* ------------------ TIMETABLE ------------------ */
    const daySelector = document.getElementById("daySelector");
    const timetableDisplay = document.getElementById("timetableDisplay");
    const showAddFormBtn = document.getElementById("showAddForm");
    const addForm = document.getElementById("addForm");
    const addScheduleBtn = document.getElementById("addSchedule");
    const dayInput = document.getElementById("dayInput");
    const timeInput = document.getElementById("timeInput");
    const subjectInput = document.getElementById("subjectInput");

    let schedule = JSON.parse(localStorage.getItem("schedule")) || {
        Monday: [], Tuesday: [], Wednesday: [],
        Thursday: [], Friday: [], Saturday: [], Sunday: []
    };

    function saveSchedule() {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }

    function renderSchedule(day) {
        timetableDisplay.innerHTML = "";
        if (!day) return;

        const tasksForDay = schedule[day] || [];
        if (tasksForDay.length === 0) {
            timetableDisplay.innerHTML = `<p>No schedule yet for ${day}.</p>`;
        } else {
            const ul = document.createElement("ul");
            tasksForDay.forEach((entry, index) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span><strong>${entry.time}</strong> - ${entry.subject}</span>
                    <button class="delete-schedule" data-day="${day}" data-index="${index}">❌</button>
                `;
                ul.appendChild(li);
            });
            timetableDisplay.appendChild(ul);
        }
    }

    daySelector.addEventListener("change", (e) => {
        renderSchedule(e.target.value);
    });

    showAddFormBtn.addEventListener("click", () => {
        addForm.style.display = addForm.style.display === "none" ? "block" : "none";
    });

    addScheduleBtn.addEventListener("click", () => {
        const day = dayInput.value;
        const time = timeInput.value;
        const subject = subjectInput.value.trim();

        if (!day || !time || subject === "") {
            alert("Please select a day, time, and enter a subject");
            return;
        }

        const exists = schedule[day].some((entry) => entry.time === time);
        if (exists) {
            alert(`A schedule already exists at ${time} on ${day}`);
            return;
        }

        schedule[day].push({ time, subject });
        saveSchedule();

        dayInput.value = "";
        timeInput.value = "";
        subjectInput.value = "";
        addForm.style.display = "none";

        if (daySelector.value === day) renderSchedule(day);
    });

    timetableDisplay.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-schedule")) {
            const day = e.target.dataset.day;
            const index = e.target.dataset.index;
            schedule[day].splice(index, 1);
            saveSchedule();
            renderSchedule(day);
        }
    });

    /* ------------------ NOTES ------------------ */
    const notesInput = document.querySelector(".notesInput");
    const addNotesBtn = document.querySelector(".add-notes");
    const seeNotesBtn = document.querySelector(".see-notes");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function addNote() {
        const text = notesInput.value.trim();
        if (text === "") {
            alert("Please write something in notes.");
            return;
        }
        notes.push(text);
        saveNotes();
        notesInput.value = "";
        alert("Note added successfully!");
    }

    addNotesBtn.addEventListener("click", addNote);

    seeNotesBtn.addEventListener("click", () => {
        window.location.href = "notes.html";
    });

    /* ------------------ MOTIVATIONAL QUOTES ------------------ */
    const quoteContainer = document.getElementById("quote-text"); // Use a container instead of single <p>
    const newQuoteBtn = document.getElementById("new-quote");

    // Preloaded quotes (~50)
    const initialQuotes = [
        "Believe in yourself and all that you are.",
        "Push yourself, because no one else will do it for you.",
        "Great things never come from comfort zones.",
        "Success doesn’t just find you. You have to go out and get it.",
        "Don’t stop until you’re proud.",
        "Dream it. Wish it. Do it.",
        "Stay positive, work hard, make it happen.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Little things make big days.",
        "Don’t wait for opportunity. Create it.",
        "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
        "The key to success is to focus on goals, not obstacles.",
        "Your limitation—it’s only your imagination.",
        "Push harder than yesterday if you want a different tomorrow.",
        "Don’t watch the clock; do what it does. Keep going.",
        "The secret of getting ahead is getting started.",
        "Great things take time. Be patient.",
        "Don’t be afraid to fail. Be afraid not to try.",
        "Difficult roads often lead to beautiful destinations.",
        "The best way to get started is to quit talking and begin doing.",
        "Wake up with determination. Go to bed with satisfaction.",
        "It always seems impossible until it’s done.",
        "Act as if what you do makes a difference. It does.",
        "Don’t limit your challenges. Challenge your limits.",
        "Work hard in silence. Let your success be your noise.",
        "Your only limit is your mind.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "Hustle until you no longer need to introduce yourself.",
        "Do something today that your future self will thank you for.",
        "Doubt kills more dreams than failure ever will.",
        "Dream bigger. Do bigger.",
        "It’s going to be hard, but hard does not mean impossible.",
        "Stay focused and never give up.",
        "Winners are not people who never fail, but people who never quit.",
        "Be stronger than your excuses.",
        "Good things come to those who hustle.",
        "Don’t call it a dream, call it a plan.",
        "Everything you’ve ever wanted is on the other side of fear.",
        "If it doesn’t challenge you, it won’t change you.",
        "Failure is the condiment that gives success its flavor.",
        "Don’t wish for it. Work for it.",
        "The way to get started is to stop talking and begin doing.",
        "Big journeys begin with small steps.",
        "Keep going. Everything you need will come to you at the perfect time.",
        "Your future is created by what you do today, not tomorrow.",
        "Every accomplishment starts with the decision to try.",
        "Be so good they can’t ignore you.",
        "Start where you are. Use what you have. Do what you can."
    ];

    if (!localStorage.getItem("quotes")) {
        localStorage.setItem("quotes", JSON.stringify(initialQuotes));
    }

    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let availableQuotes = [...quotes];

    function getRandomQuotes(count = 5) {
        if (availableQuotes.length < count) {
            availableQuotes = [...quotes];
        }

        const selected = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableQuotes.length);
            selected.push(availableQuotes[randomIndex]);
            availableQuotes.splice(randomIndex, 1);
        }
        return selected;
    }

    // Display multiple quotes
    function displayQuotes() {
        const selectedQuotes = getRandomQuotes(5);
        quoteContainer.innerHTML = ""; // Clear old quotes
        selectedQuotes.forEach((q) => {
            const p = document.createElement("p");
            p.textContent = `💡 ${q}`;
            p.style.marginBottom = "8px";
            p.style.fontSize = "16px";
            p.style.fontWeight = "500";
            quoteContainer.appendChild(p);
        });
    }

    // On page load
    displayQuotes();

    // On button click
    newQuoteBtn.addEventListener("click", displayQuotes);


});
