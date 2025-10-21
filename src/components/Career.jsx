import React, { useEffect, useState } from 'react'
import { load, save } from '../utils'

export default function Career(){
  const [goals, setGoals] = useState(load('career.goals', [
    { text:'Pass AZ-104 (Azure Admin)', done:false },
    { text:'Publish IT Systems Engineer portfolio on GitHub & LinkedIn', done:false },
    { text:'Automate a Windows Server lab with PowerShell', done:false },
  ]))
  const [tasks, setTasks] = useState(load('career.tasks', []))
  const [newTask, setNewTask] = useState('')

  useEffect(()=> save('career.goals', goals), [goals])
  useEffect(()=> save('career.tasks', tasks), [tasks])

  const addTask = () => { if(!newTask) return; setTasks(t=>[...t,{text:newTask,done:false}]); setNewTask('') }
  const toggle = (listSetter, list, i) => listSetter(list.map((t,idx)=> idx===i? {...t,done:!t.done}:t))

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-3">Career roadmap</h2>
        <ul className="space-y-2">
          {goals.map((g,i)=>(
            <li key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={g.done} onChange={()=>toggle(setGoals,goals,i)} />
              <span className={g.done?'line-through text-slate-400':''}>{g.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-3">Tasks</h3>
        <div className="flex gap-2 mb-3">
          <input className="w-full rounded-xl px-3 py-2 border border-slate-700" placeholder="Add a task..."
            value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') addTask()}} />
          <button className="btn" onClick={addTask}>Add</button>
        </div>
        <ul className="space-y-2">
          {tasks.map((t,i)=>(
            <li key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={()=>toggle(setTasks,tasks,i)} />
              <span className={t.done?'line-through text-slate-400':''}>{t.text}</span>
            </li>
          ))}
          {tasks.length===0 && <li className="text-slate-400">No tasks yet.</li>}
        </ul>
      </div>
    </div>
  )
}
