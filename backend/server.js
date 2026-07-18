const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect database
connectDB();  

const Task = require("./models/task");

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, category, priority, dueDate } = req.body;

    const newTask = new Task({
      title,
      category,
      priority,
      dueDate,
      completed: false
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});