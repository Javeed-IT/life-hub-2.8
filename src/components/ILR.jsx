import React, { useEffect, useState } from 'react'
import { load, save } from '../utils'

function diff(target){
  const now = new Date()
  const end = new Date(target)
  const ms = Math.max(0, end - now)
  const days = Math.floor(ms / (1000*60*60*24))
  const hours = Math.floor((ms % (1000*60*60*24)) / (1000*60*60))
  const minutes = Math.floor((ms % (1000*60*60)) / (1000*60))
  return { days, hours, minutes }
}

export default function ILR(){
  const [date, setDate] = useState(load('ilr.date',''))
  const [nowDiff, setNowDiff] = useState(date? diff(date) : {days:0,hours:0,minutes:0})

  useEffect(()=>{
    if(!date) return
    const id = setInterval(()=> setNowDiff(diff(date)), 60000)
    return ()=>clearInterval(id)
  }, [date])

  useEffect(()=> save('ilr.date', date), [date])

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-semibold">ILR Countdown</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-slate-400">Target date</span>
          <input type="date" className="mt-1 w-full rounded-xl px-3 py-2 border border-slate-700"
            value={date} onChange={e=>setDate(e.target.value)} />
        </label>
        <div className="rounded-xl p-4 bg-slate-800 border border-slate-700 grid place-items-center">
          {date ? (
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Time remaining</div>
              <div className="text-2xl font-semibold">{nowDiff.days}d {nowDiff.hours}h {nowDiff.minutes}m</div>
            </div>
          ) : (
            <div className="text-slate-400">Set a target date to start the countdown.</div>
          )}
        </div>
      </div>
    </div>
  )
}
