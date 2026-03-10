import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // 1. FETCH TASKS FROM BACKEND (On Page Load)
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []); // The empty [] means "only run this once when the app starts"

  // 2. ADD TASK TO BACKEND
  const addTask = async () => {
    if (!input.trim()) return;

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }) // Send the text to the backend
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]); // Add the server's response to our UI
    setInput('');
  };

  // 3. DELETE TASK FROM BACKEND
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE'
    });
    
    // Update the UI by removing the task with that ID
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-10 font-sans">
      <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
        TaskFlow FullStack
      </h1>
      
      <div className="flex gap-3 mb-10 w-full max-w-md">
        <input 
          className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Syncing with the server..."
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95">
          Add
        </button>
      </div>

      <div className="w-full max-w-md space-y-3">
        {tasks.map((task) => (
          <div key={task._id} className="group bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-blue-500/50 transition-all">
            <span className="text-lg">{task.text}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1 rounded-lg text-sm font-bold transition-all"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App