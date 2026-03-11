import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, ClipboardList } from 'lucide-react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleComplete = async (id) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'PATCH' });
    const updated = await res.json();
    setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-400 to-slate-600 bg-clip-text text-transparent">
            TaskFlow.
          </h1>
          <p className="text-slate-500 font-medium">Focus on what matters, ignore the rest.</p>
        </header>

        {/* Input Section */}
        <div className="group relative mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2">
            <input 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder:text-slate-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's the mission?"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="bg-white text-black p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <ClipboardList className="mx-auto mb-4 text-slate-600" size={48} />
              <p className="text-slate-500 font-medium">No tasks found. Start by adding one above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task._id} 
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                  task.completed 
                  ? 'bg-slate-900/40 border-white/5 opacity-60' 
                  : 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.07] shadow-lg shadow-black/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleComplete(task._id)} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    {task.completed ? <CheckCircle size={22} fill="currentColor" className="text-indigo-500 fill-indigo-500/20" /> : <Circle size={22} />}
                  </button>
                  <span className={`text-lg font-medium transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.text}
                  </span>
                </div>
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App