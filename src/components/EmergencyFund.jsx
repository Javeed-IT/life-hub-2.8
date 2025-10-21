import React, { useEffect, useMemo, useState } from 'react'
import { load, save, currency, todayKey } from '../utils'

function monthFromDateStr(s){ return (s||'').slice(0,7) }

export default function EmergencyFund(){
  const [state, setState] = useState(load('emergencyFund', {
    balance: 0,
    targetAmount: 0,
    monthsTarget: 0,
    baseline: 0,
    monthlyExpenses: 0
  }))
  const [history, setHistory] = useState(load('savings.history', []))

  useEffect(()=> save('emergencyFund', state), [state])
  useEffect(()=> save('savings.history', history), [history])

  // Auto monthly snapshot only if balance > 0
  useEffect(()=>{
    const nowM = monthFromDateStr(todayKey())
    const lastM = history.length ? monthFromDateStr(history[history.length-1].date) : ""
    if(nowM !== lastM && Number(state.balance)>0){
      setHistory(h => [...h, { date: todayKey(), balance: Number(state.balance)||0 }])
    }
  }, [])

  const target = useMemo(()=> Number(state.targetAmount)||0, [state.targetAmount])
  const pct = target>0 ? Math.min(100, Math.round((Number(state.balance||0)/target)*100)) : 0

  const setNum = (k,v)=> setState(s=>({...s, [k]: Number(v)||0 }))
  const clearAll = ()=> setState({ balance:0, targetAmount:0, monthsTarget:0, baseline:0, monthlyExpenses:0 })
  const logSnapshot = ()=> setHistory(h => [...h, { date: todayKey(), balance: Number(state.balance)||0 }])

  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-semibold">Emergency Fund</h2>
        {target>0 && <span className="badge">Target: <strong>{currency(target)}</strong></span>}
        <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600" onClick={logSnapshot}>Log snapshot</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm text-slate-400">Current Balance</span>
          <input className="mt-1 w-full rounded-xl px-3 py-2 border border-slate-700"
            value={state.balance}
            onChange={(e)=>setNum('balance', e.target.value)}
            type="number" min="0" step="50" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Target Months</span>
          <input className="mt-1 w-full rounded-xl px-3 py-2 border border-slate-700"
            value={state.monthsTarget}
            onChange={(e)=>setNum('monthsTarget', e.target.value)}
            type="number" min="0" step="1" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Target Amount (manual)</span>
          <input className="mt-1 w-full rounded-xl px-3 py-2 border border-slate-700"
            value={state.targetAmount}
            onChange={(e)=>setNum('targetAmount', e.target.value)}
            type="number" min="0" step="50" />
        </label>
      </div>

      <div className="space-x-3">
        <button className="btn" onClick={()=>save('emergencyFund', state)}>Apply</button>
        <button className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600" onClick={clearAll}>Clear</button>
      </div>

      {target>0 && (
        <>
          <div className="progress"><span style={{width: pct + '%'}}></span></div>
          <p className="text-slate-300">{currency(state.balance)} / {currency(target)} ({pct}%)</p>
        </>
      )}
    </div>
  )
}
