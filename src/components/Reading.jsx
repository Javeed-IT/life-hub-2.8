import React, { useEffect, useState } from 'react'
import { load, save } from '../utils'

const SUGGEST = [
  { title:'Atomic Habits', author:'James Clear' },
  { title:'Deep Work', author:'Cal Newport' },
  { title:'The Pragmatic Programmer', author:'Hunt & Thomas' },
  { title:'Clean Architecture', author:'Robert C. Martin' },
  { title:'The Phoenix Project', author:'Kim, Behr, Spafford' },
  { title:'Make Time', author:'Knapp & Zeratsky' },
]

export default function Reading(){
  const [shelves, setShelves] = useState(load('reading.shelves', { current: [], queue: [], finished: [] }))
  const [newBook, setNewBook] = useState({ title:'', author:'', shelf:'queue' })

  useEffect(()=> save('reading.shelves', shelves), [shelves])

  const add = () => {
    if(!newBook.title) return
    const shelf = newBook.shelf || 'queue'
    const copy = { ...shelves }
    copy[shelf] = [...copy[shelf], { title:newBook.title, author:newBook.author }]
    setShelves(copy)
    setNewBook({ title:'', author:'', shelf:'queue' })
  }

  const move = (from, idx, to) => {
    const copy = { ...shelves }
    const [book] = copy[from].splice(idx,1)
    copy[to].push(book)
    setShelves(copy)
  }

  const Shelf = ({name, list}) => (
    <div className="card">
      <h3 className="text-xl font-semibold mb-3">{name}</h3>
      <ul className="space-y-2">
        {list.map((b,i)=>(
          <li key={i} className="flex items-center justify-between">
            <span>{b.title} <span className="text-slate-400">— {b.author}</span></span>
            <div className="space-x-2">
              {name!=='Current' && <button className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600" onClick={()=>move(name.toLowerCase(), i, 'current')}>Start</button>}
              {name!=='Finished' && <button className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600" onClick={()=>move(name.toLowerCase(), i, 'finished')}>Done</button>}
            </div>
          </li>
        ))}
        {list.length===0 && <li className="text-slate-400">Empty.</li>}
      </ul>
    </div>
  )

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-3">Your library</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          <Shelf name="Queue" list={shelves.queue} />
          <Shelf name="Current" list={shelves.current} />
          <Shelf name="Finished" list={shelves.finished} />
        </div>
      </div>
      <div className="space-y-5">
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Add book</h3>
          <div className="grid grid-cols-4 gap-2">
            <input className="col-span-2 rounded-xl px-3 py-2 border border-slate-700" placeholder="Title" value={newBook.title} onChange={e=>setNewBook({...newBook, title:e.target.value})}/>
            <input className="rounded-xl px-3 py-2 border border-slate-700" placeholder="Author" value={newBook.author} onChange={e=>setNewBook({...newBook, author:e.target.value})}/>
            <select className="rounded-xl px-3 py-2 border border-slate-700" value={newBook.shelf} onChange={e=>setNewBook({...newBook, shelf:e.target.value})}>
              <option value="queue">Queue</option>
              <option value="current">Current</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <button className="btn mt-3" onClick={add}>Add</button>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">Suggestions</h3>
          <ul className="space-y-2">
            {SUGGEST.map((s,i)=>(
              <li key={i} className="flex items-center justify-between">
                <span>{s.title} <span className="text-slate-400">— {s.author}</span></span>
                <button className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600" onClick={()=> setShelves(prev=>({...prev, queue:[...prev.queue, s]})) }>Queue</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
