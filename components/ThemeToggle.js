'use client'
import {useEffect, useState} from 'react'
export default function ThemeToggle(){
  const [theme,setTheme]=useState('light')
  useEffect(()=>{ const s=localStorage.getItem('theme'); if(s){ setTheme(s); document.documentElement.classList.add(s); } },[])
  const toggle=()=>{ const next = theme==='light'?'dark':'light'; setTheme(next); localStorage.setItem('theme', next); document.documentElement.classList.remove('light','dark'); document.documentElement.classList.add(next); }
  return <button onClick={toggle} className="px-3 py-1 border rounded text-sm">{theme==='light'?'Dark':'Light'}</button>
}
