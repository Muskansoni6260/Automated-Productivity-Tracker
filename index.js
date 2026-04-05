const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const streakCount = document.getElementById('streak-count');
const motivationalQuote = document.getElementById('motivational-quote');
const progressChartCanvas = document.getElementById('progress-chart');

// Motivational Quotes Array
const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Your time is limited, so don't waste it living someone else's life. – Steve Jobs",
    "The future depends on what you do today. – Mahatma Gandhi", "Do less but do everyday : Arti Lodhi"
];

// Load data from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastCompletedDate = localStorage.getItem('lastCompletedDate') || null;

// Initialize Chart
let progressChart = new Chart(progressChartCanvas, {
    type: 'bar',
    data: {
        labels: getLast7Days(),
        datasets: [{
            label: 'Tasks Completed',
            data: getProgressData(),
            backgroundColor: 'rgba(0, 184, 148, 0.6)',
            borderColor: 'rgba(0, 184, 148, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Event Listeners
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('change', toggleTaskCompletion);

// Functions
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        updateMotivationalQuote();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
        `;
        li.querySelector('input').addEventListener('change', () => toggleTaskCompletion(task.id));
        taskList.appendChild(li);
    });
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStreak();
        updateChart();
        updateMotivationalQuote();
    }
}

function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.some(task => task.completed && task.dateAdded === today);

    if (completedToday) {
        if (lastCompletedDate === getYesterday()) {
            streak++;
        } else if (lastCompletedDate !== today) {
            streak = 1;
        }
        lastCompletedDate = today;
    } else {
        if (lastCompletedDate !== today) {
            streak = 0;
        }
    }

    streakCount.textContent = streak;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastCompletedDate', lastCompletedDate);
}

function updateChart() {
    progressChart.data.datasets[0].data = getProgressData();
    progressChart.update();
}

function getProgressData() {
    const last7Days = getLast7Days();
    return last7Days.map(date => {
        return tasks.filter(task => task.completed && task.dateAdded === date).length;
    });
}

function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

function updateMotivationalQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    motivationalQuote.textContent = randomQuote;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



// Initialize on Load
renderTasks();
updateStreak();
updateMotivationalQuote();