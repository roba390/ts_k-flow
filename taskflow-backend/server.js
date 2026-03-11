const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// --- SCHEMA & MODEL (The Blueprint) ---
const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }, // New field
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', TaskSchema);

// --- ROUTES ---

// 1. GET: Fetch from DB
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Get all, newest first
    res.json(tasks);
});

// 2. POST: Save to DB
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    const savedTask = await newTask.save();
    res.json(savedTask);
});

// Update task status (Toggle Complete)
app.patch('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

// 3. DELETE: Remove from DB
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));