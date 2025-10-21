import React, { useEffect, useState } from 'react'
import { load, save } from '../utils'

export default function Notes(){
  const [notes, setNotes] = useState(load('notes.items', []))
  const [text, setText] = useState('')

  useEffect(()=> save('notes.items', notes), [notes])

  const add = () => { if(!text.trim()) return; setNotes(n=>[{id:Date.now(), text, pinned:false}, ...n]); setText('') }
  const togglePin = (id) => setNotes(n=> n.map(x=> x.id===id? {...x, pinned:!x.pinned}:x))
  const remove = (id) => setNotes(n=> n.filter(x=> x.id!==id))

  const pinned = notes.filter(n=>n.pinned)
  const others = notes.filter(n=>!n.pinned)

  const Board = ({items, title}) => (
    <div className="card">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(n=>(
          <div key={n.id} className="rounded-xl p-3 bg-slate-800 border border-slate-700">
            <p>{n.text}</p>
            <div className="mt-2 flex gap-2">
              <button className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600" onClick={()=>togglePin(n.id)}>{n.pinned?'Unpin':'Pin'}</button>
              <button className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700" onClick={()=>remove(n.id)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length===0 && <div className="text-slate-400">Empty.</div>}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-3">Quick note</h2>
        <div className="flex gap-2">
          <input className="w-full rounded-xl px-3 py-2 border border-slate-700" placeholder="Write something..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') add()}} />
          <button className="btn" onClick={add}>Add</button>
        </div>
      </div>
      <Board title="Pinned" items={pinned} />
      <Board title="Others" items={others} />
    </div>
  )
}
