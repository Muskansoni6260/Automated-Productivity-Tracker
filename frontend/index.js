document.addEventListener("DOMContentLoaded", () => {

    console.log("JS Loaded ✅");

    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const motivationalQuote = document.getElementById('motivational-quote');

    const goalForm = document.getElementById('goal-form');
    const goalInput = document.getElementById('goal-input');

    const goalCompleted = document.getElementById('goal-completed');
    const goalTarget = document.getElementById('goal-target');
    const goalBar = document.getElementById('goal-bar');

    const dailyCompleted = document.getElementById('daily-completed');
    const weeklyPercent = document.getElementById('weekly-percent');
    const streakCount = document.getElementById('streak-count');

    const themeToggle = document.getElementById('theme-toggle');

    let tasks = [];
    let dailyGoal = 0;

    const quotes = [
        "Success is not final, failure is not fatal.",
        "Do less but do everyday",
        "Believe you can and you're halfway there.",
    ];

    // FETCH TASKS
    async function fetchTasksFromBackend() {
        try {
            const res = await fetch("http://localhost:5000/api/tasks");
            const data = await res.json();

            console.log("Fetched:", data);

            tasks = data.map(task => ({
                id: task._id,
                text: task.title || "No Title",
                category: task.category || "General",
                priority: task.priority || "Low",
                dueDate: task.dueDate || new Date(),
                completed: task.completed || false,
                dateAdded: (task.createdAt || new Date().toISOString()).split('T')[0]
            }));

            renderTasks();
            updateStats();

        } catch (error) {
            console.log("Backend error ❌", error);
        }
    }

    // ADD TASK
    
    
    async function addTask(e) {
    e.preventDefault();
    console.log("Form submitted ✅");

    const title = document.getElementById("task-input").value.trim();
    const category = document.getElementById("task-category").value;
    const priority = document.getElementById("task-priority").value;
    const dueDate = document.getElementById("task-due-date").value;

    if (!title || !category || !priority || !dueDate) {
        alert("Fill all fields");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, category, priority, dueDate })
        });

        const data = await res.json();
        console.log("Response from backend:", data);

        if (!res.ok) {
            alert("Backend error: " + data.message);
            return;
        }

        taskForm.reset();
        fetchTasksFromBackend();

    } catch (error) {
        console.log("Fetch error ❌", error);
        alert("Cannot connect to backend");
    }
}

    // DELETE
    async function deleteTask(id) {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: "DELETE"
        });
        fetchTasksFromBackend();
    }

    // TOGGLE
    async function toggleTaskCompletion(id) {
        const task = tasks.find(t => t.id === id);

        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !task.completed })
        });

        fetchTasksFromBackend();
    }

    // RENDER
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = `
            <li class="empty-state">
                📋 No tasks yet<br>
                <small>Start small 🚀</small>
            </li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');

            li.className = `task-item ${task.priority.toLowerCase()}-priority ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <div>
                        <strong>${task.text}</strong>
                        <small>${task.category} • ${new Date(task.dueDate).toLocaleDateString()}</small>
                    </div>
                </div>
                <button class="delete-btn">❌</button>
            `;

            li.querySelector('input').addEventListener('change', () => toggleTaskCompletion(task.id));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });
    }

    // GOAL
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        dailyGoal = parseInt(goalInput.value);
        goalTarget.textContent = dailyGoal;
        updateStats();
    });

    // STATS
    function updateStats() {
        const today = new Date().toISOString().split('T')[0];

        const todayTasks = tasks.filter(t => t.dateAdded === today);
        const completedToday = todayTasks.filter(t => t.completed).length;

        dailyCompleted.textContent = completedToday;
        goalCompleted.textContent = completedToday;

        if (dailyGoal > 0) {
            let percent = (completedToday / dailyGoal) * 100;
            goalBar.style.width = percent + "%";
        }

        const completed = tasks.filter(t => t.completed).length;
        const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
        weeklyPercent.textContent = percent + "%";

        streakCount.textContent = completedToday > 0 ? "1 🔥" : "0 🔥";

        updateChart();
    }

    // CHART
    let chart;
    function updateChart() {
        const ctx = document.getElementById('progress-chart').getContext('2d');

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [
                        tasks.filter(t => t.completed).length,
                        tasks.filter(t => !t.completed).length
                    ]
                }]
            }
        });
    }

    // THEME
    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme =
            document.body.dataset.theme === "dark" ? "light" : "dark";
    });

    // QUOTE
    function updateMotivationalQuote() {
        motivationalQuote.textContent =
            quotes[Math.floor(Math.random() * quotes.length)];
    }

    // INIT
    taskForm.addEventListener('submit', addTask);
    fetchTasksFromBackend();
    updateMotivationalQuote();

});