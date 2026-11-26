import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FiGrid, FiBookOpen, FiClipboard, FiUsers, FiLogOut, FiBell, FiSearch, FiClock, FiCheckCircle, FiAward, FiPlus, FiMenu, FiX, FiArrowRight, FiHome } from 'react-icons/fi'
import './App.css'

const seedQuestions = [
  { id: 1, text: 'Which language is primarily used to structure content on the web?', options: ['CSS', 'HTML', 'Python', 'SQL'], answer: 1 },
  { id: 2, text: 'Which React hook is used to manage local component state?', options: ['useEffect', 'useMemo', 'useState', 'useRef'], answer: 2 },
  { id: 3, text: 'Which CSS property changes the text color?', options: ['font-style', 'background', 'color', 'text-align'], answer: 2 },
  { id: 4, text: 'What does JSX allow you to write in React?', options: ['HTML-like syntax in JavaScript', 'SQL queries', 'Server configuration', 'CSS only'], answer: 0 },
  { id: 5, text: 'Which array method creates a new array by transforming each item?', options: ['filter()', 'map()', 'find()', 'push()'], answer: 1 }
]
const initialExams = [
  { id: 1, title: 'Frontend Development Basics', subject: 'Web Development', date: 'Available now', duration: 15, questions: 5, status: 'Active', description: 'Test your knowledge of HTML, CSS and React fundamentals.' },
  { id: 2, title: 'JavaScript Fundamentals', subject: 'Programming', date: 'Tomorrow, 10:00 AM', duration: 30, questions: 20, status: 'Upcoming', description: 'Core JavaScript concepts, functions and arrays.' },
  { id: 3, title: 'Database Essentials', subject: 'Database', date: 'Completed', duration: 20, questions: 15, status: 'Completed', description: 'Basic database concepts and SQL.' }
]
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }

function App() {
  const [user, setUser] = useState(() => read('examUser', null))
  const [exams, setExams] = useState(() => read('examList', initialExams))
  const [results, setResults] = useState(() => read('examResults', []))
  const [questions, setQuestions] = useState(() => read('examQuestions', seedQuestions))
  useEffect(() => localStorage.setItem('examList', JSON.stringify(exams)), [exams])
  useEffect(() => localStorage.setItem('examResults', JSON.stringify(results)), [results])
  useEffect(() => localStorage.setItem('examQuestions', JSON.stringify(questions)), [questions])
  const login = (name, role) => { const next = { name, role }; setUser(next); localStorage.setItem('examUser', JSON.stringify(next)) }
  const logout = () => { setUser(null); localStorage.removeItem('examUser') }
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={login} />} />
    <Route path="/*" element={user ? <Shell user={user} logout={logout} exams={exams} setExams={setExams} results={results} setResults={setResults} questions={questions} setQuestions={setQuestions} /> : <Navigate to="/login" />} />
  </Routes>
}

function Login({ onLogin }) {
  const [name, setName] = useState('Alex Morgan')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  return <main className="login-page">
    <section className="login-visual"><div className="brand light"><span className="brand-mark">E</span> ExamFlow</div><div className="visual-copy"><span className="eyebrow">LEARN · PRACTICE · SUCCEED</span><h1>Your next<br/>achievement<br/><em>starts here.</em></h1><p>A simple, focused space to take exams, track progress and reach your goals.</p></div><div className="visual-foot">A smarter way to assess learning.</div></section>
    <section className="login-panel"><div className="login-box"><div className="mobile-brand brand"><span className="brand-mark">E</span> ExamFlow</div><span className="eyebrow blue">WELCOME BACK</span><h2>Sign in to continue</h2><p className="muted">Enter your details to access your workspace.</p>
      <form onSubmit={e => { e.preventDefault(); if (!name.trim()) return setError('Please enter your name.'); onLogin(name.trim(), role) }}>
        <label>Your name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
        <label>Sign in as</label><div className="role-switch"><button type="button" className={role === 'student' ? 'selected' : ''} onClick={() => setRole('student')}>Student</button><button type="button" className={role === 'admin' ? 'selected' : ''} onClick={() => setRole('admin')}>Administrator</button></div>
        {error && <p className="error">{error}</p>}<button className="btn primary full" type="submit">Continue <FiArrowRight /></button>
      </form><div className="demo-note"><FiCheckCircle/> Demo sign-in — no password required.</div></div></section>
  </main>
}

function Shell({ user, logout, exams, setExams, results, setResults, questions, setQuestions }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const admin = user.role === 'admin'
  const links = admin ? [['/','Overview',FiGrid],['/exams','Manage exams',FiBookOpen],['/questions','Questions',FiClipboard],['/students','Students',FiUsers]] : [['/','Overview',FiGrid],['/exams','My examinations',FiBookOpen],['/results','My results',FiAward]]
  const title = links.find(x => x[0] === location.pathname)?.[1] || 'Examination'
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}><div className="brand"><span className="brand-mark">E</span> ExamFlow</div><div className="workspace-label">WORKSPACE</div><nav>{links.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}><Icon/> {label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>Need a hand?</strong><p>Keep learning. Your progress adds up.</p></div><button className="logout" onClick={logout}><FiLogOut/> Sign out</button></div></aside>
    {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu"/>}
    <main className="main-area"><header className="topbar"><button className="mobile-menu icon-btn" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <FiX/> : <FiMenu/>}</button><div><span className="breadcrumb">Workspace / </span><strong>{title}</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><FiBell/></button><div className="user-chip"><div className="avatar">{user.name.charAt(0).toUpperCase()}</div><div><strong>{user.name}</strong><small>{admin ? 'Administrator' : 'Student'}</small></div></div></div></header>
      <div className="page-content"><Routes>
        <Route path="/" element={admin ? <AdminHome exams={exams} results={results} /> : <StudentHome user={user} exams={exams} results={results}/>} />
        <Route path="/exams" element={admin ? <ExamManagement exams={exams} setExams={setExams}/> : <ExamList exams={exams} questions={questions} setResults={setResults} results={results}/>} />
        <Route path="/take/:id" element={<TakeExam exams={exams} questions={questions} setResults={setResults} results={results}/>} />
        <Route path="/results" element={<Results results={results}/>} />
        <Route path="/questions" element={<QuestionManagement questions={questions} setQuestions={setQuestions}/>} />
        <Route path="/students" element={<Students results={results}/>} />
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes></div>
    </main>
  </div>
}

function PageHeading({ eyebrow, title, desc, action }) { return <div className="page-heading"><div><span className="eyebrow blue">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div> }
function Stat({ icon: Icon, label, value, note, tone='blue' }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div> }
function StudentHome({ user, exams, results }) {
  const active = exams.filter(e => e.status === 'Active')
  return <><PageHeading eyebrow="STUDENT SPACE" title={`Good day, ${user.name.split(' ')[0]} 👋`} desc="Ready to make progress? Here's what's happening with your learning." action={<div className="date-pill"><FiClock/> Your learning hub</div>}/>
    <div className="stats-grid"><Stat icon={FiBookOpen} label="Available exams" value={active.length} note="Ready when you are"/><Stat icon={FiAward} label="Exams completed" value={results.length} note="Keep it up" tone="purple"/><Stat icon={FiCheckCircle} label="Average score" value={results.length ? `${Math.round(results.reduce((a,r)=>a+r.percentage,0)/results.length)}%` : '—'} note="Across your attempts" tone="green"/></div>
    <div className="section-title"><div><h2>Available examinations</h2><p>Choose an exam to get started.</p></div><NavLink to="/exams" className="text-link">View all <FiArrowRight/></NavLink></div>
    <div className="exam-grid">{(active.length ? active : exams).slice(0,3).map(exam => <ExamTile key={exam.id} exam={exam}/>)}</div>
    <div className="tip-banner"><div className="tip-symbol">✦</div><div><strong>A little preparation goes a long way.</strong><p>Find a quiet place, check your connection and read each question carefully.</p></div></div>
  </>
}
function ExamTile({ exam }) { const nav = useNavigate(); return <article className="exam-card"><div className="card-top"><span className="subject-tag">{exam.subject}</span><span className={`status ${exam.status.toLowerCase()}`}>{exam.status}</span></div><h3>{exam.title}</h3><p>{exam.description}</p><div className="exam-meta"><span><FiClock/> {exam.duration} min</span><span><FiClipboard/> {exam.questions} questions</span></div><button className="btn primary full" disabled={exam.status !== 'Active'} onClick={() => nav(`/take/${exam.id}`)}>{exam.status === 'Active' ? 'Start examination' : exam.status} <FiArrowRight/></button></article> }
function ExamList({ exams }) { return <><PageHeading eyebrow="YOUR EXAMINATIONS" title="Explore exams" desc="Review the details and start an available examination."/><div className="exam-grid">{exams.map(e=><ExamTile key={e.id} exam={e}/>)}</div></> }
function AdminHome({ exams, results }) { return <><PageHeading eyebrow="ADMINISTRATION" title="Dashboard overview" desc="A snapshot of your examination workspace." action={<span className="date-pill"><FiHome/> Admin workspace</span>}/><div className="stats-grid"><Stat icon={FiUsers} label="Registered students" value="128" note="Demo workspace" tone="purple"/><Stat icon={FiBookOpen} label="Total examinations" value={exams.length} note="Across all subjects"/><Stat icon={FiClipboard} label="Exam attempts" value={results.length} note="Recorded in this browser" tone="green"/><Stat icon={FiAward} label="Questions" value="5" note="Sample question bank" tone="orange"/></div><div className="section-title"><div><h2>Recent examinations</h2><p>Manage the exams available to students.</p></div><NavLink to="/exams" className="text-link">Manage exams <FiArrowRight/></NavLink></div><div className="table-wrap"><table><thead><tr><th>EXAMINATION</th><th>SUBJECT</th><th>DURATION</th><th>QUESTIONS</th><th>STATUS</th></tr></thead><tbody>{exams.map(e=><tr key={e.id}><td><strong>{e.title}</strong></td><td>{e.subject}</td><td>{e.duration} min</td><td>{e.questions}</td><td><span className={`status ${e.status.toLowerCase()}`}>{e.status}</span></td></tr>)}</tbody></table></div></> }

function ExamManagement({ exams, setExams }) {
  const [show,setShow] = useState(false), [form,setForm] = useState({title:'',subject:'General',duration:20,questions:5,description:''})
  const add = e => { e.preventDefault(); if(!form.title.trim()) return; setExams([...exams,{...form,id:Date.now(),status:'Active',date:'Available now'}]); setForm({title:'',subject:'General',duration:20,questions:5,description:''}); setShow(false) }
  return <><PageHeading eyebrow="ADMINISTRATION" title="Exam management" desc="Create and manage examinations for your students." action={<button className="btn primary" onClick={()=>setShow(!show)}><FiPlus/> Create exam</button>}/>
    {show && <form className="form-card" onSubmit={add}><h3>Create a new exam</h3><div className="form-grid"><label>Exam title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. HTML & CSS Basics"/></label><label>Subject<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>Duration (minutes)<input type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})}/></label><label>Question count<input type="number" min="1" value={form.questions} onChange={e=>setForm({...form,questions:Number(e.target.value)})}/></label></div><label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Short exam description"/></label><div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary">Save exam</button></div></form>}
    <div className="table-wrap"><table><thead><tr><th>EXAMINATION</th><th>SUBJECT</th><th>DURATION</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{exams.map(e=><tr key={e.id}><td><strong>{e.title}</strong><small className="table-sub">{e.description}</small></td><td>{e.subject}</td><td>{e.duration} min</td><td><span className={`status ${e.status.toLowerCase()}`}>{e.status}</span></td><td><button className="small-action" onClick={()=>setExams(exams.map(x=>x.id===e.id?{...x,status:x.status==='Active'?'Upcoming':'Active'}:x))}>Toggle</button><button className="small-action danger-text" onClick={()=>setExams(exams.filter(x=>x.id!==e.id))}>Delete</button></td></tr>)}</tbody></table></div>
  </> 
}
function QuestionManagement({ questions, setQuestions }) {
 const [text,setText]=useState(''), [opts,setOpts]=useState(['','','','']), [answer,setAnswer]=useState(0)
 const add=e=>{e.preventDefault();if(!text.trim()||opts.some(o=>!o.trim()))return;setQuestions([...questions,{id:Date.now(),text,options:opts,answer}]);setText('');setOpts(['','','','']);setAnswer(0)}
 return <><PageHeading eyebrow="CONTENT LIBRARY" title="Question bank" desc="Build and maintain multiple-choice questions."/><form className="form-card" onSubmit={add}><h3>Add a question</h3><label>Question<input required value={text} onChange={e=>setText(e.target.value)} placeholder="Enter your question"/></label><div className="form-grid">{opts.map((o,i)=><label>Option {i+1}<input required value={o} onChange={e=>setOpts(opts.map((v,j)=>j===i?e.target.value:v))} placeholder={`Answer option ${i+1}`}/></label>)}</div><label>Correct answer<select value={answer} onChange={e=>setAnswer(Number(e.target.value))}>{opts.map((o,i)=><option value={i}>Option {i+1}</option>)}</select></label><div className="form-actions"><button className="btn primary"><FiPlus/> Add question</button></div></form><div className="question-list">{questions.map((q,i)=><div className="question-row" key={q.id}><div className="question-number">{String(i+1).padStart(2,'0')}</div><div className="question-info"><strong>{q.text}</strong><small>{q.options.length} options · Correct answer: {q.options[q.answer]}</small></div><button className="small-action danger-text" onClick={()=>setQuestions(questions.filter(x=>x.id!==q.id))}>Delete</button></div>)}</div></>
}
function Students({ results }) { return <><PageHeading eyebrow="PEOPLE" title="Students" desc="Student activity in this demo workspace."/><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ROLE</th><th>EXAM ATTEMPTS</th><th>STATUS</th></tr></thead><tbody><tr><td><strong>Alex Morgan</strong></td><td>Student</td><td>{results.length}</td><td><span className="status active">Active</span></td></tr><tr><td><strong>Jamie Taylor</strong></td><td>Student</td><td>0</td><td><span className="status active">Active</span></td></tr><tr><td><strong>Sam Lee</strong></td><td>Student</td><td>0</td><td><span className="status active">Active</span></td></tr></tbody></table></div><p className="muted note">This starter project uses sample student records. Connect a backend to manage real student accounts.</p></> }
function TakeExam({ exams, questions, setResults, results }) {
 const {id}=useLocation().pathname.match(/\/take\/(\d+)/)?.groups || {}
 const examId=Number(window.location.pathname.split('/').pop()), exam=exams.find(e=>e.id===examId)
 const [answers,setAnswers]=useState({}), [index,setIndex]=useState(0), [seconds,setSeconds]=useState((exam?.duration||15)*60), [submitted,setSubmitted]=useState(false)
 const nav=useNavigate(), qs=questions.slice(0,Math.max(1,exam?.questions||5))
 useEffect(()=>{if(submitted)return;const t=setInterval(()=>setSeconds(s=>{if(s<=1){clearInterval(t);return 0}return s-1}),1000);return()=>clearInterval(t)},[submitted])
 useEffect(()=>{if(seconds===0&&!submitted)finish()},[seconds])
 const finish=()=>{if(submitted)return;const correct=qs.filter(q=>answers[q.id]===q.answer).length;const percentage=Math.round(correct/qs.length*100);setResults([...results,{id:Date.now(),title:exam?.title||'Examination',correct,total:qs.length,percentage,date:new Date().toLocaleDateString()}]);setSubmitted(true);nav('/results')}
 if(!exam)return <div className="empty-state">Exam not found. <NavLink to="/exams">Return to exams</NavLink></div>
 const q=qs[index], fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
 return <><PageHeading eyebrow="EXAM IN PROGRESS" title={exam.title} desc="Answer each question. Your progress is saved as you go." action={<div className={`timer-pill ${seconds<60?'urgent':''}`}><FiClock/> {fmt(seconds)}</div>}/><div className="exam-layout"><section className="question-panel"><div className="question-progress"><span>QUESTION {index+1} <small>OF {qs.length}</small></span><span>{Object.keys(answers).length} answered</span></div><div className="progress-track"><span style={{width:`${(index+1)/qs.length*100}%`}}/></div><h2>{q?.text}</h2><div className="answer-list">{q?.options.map((o,i)=><button key={i} className={`answer-option ${answers[q.id]===i?'chosen':''}`} onClick={()=>setAnswers({...answers,[q.id]:i})}><span className="option-letter">{String.fromCharCode(65+i)}</span>{o}{answers[q.id]===i&&<FiCheckCircle className="answer-check"/>}</button>)}</div><div className="question-controls"><button className="btn secondary" disabled={index===0} onClick={()=>setIndex(index-1)}>Previous</button>{index<qs.length-1?<button className="btn primary" onClick={()=>setIndex(index+1)}>Next question <FiArrowRight/></button>:<button className="btn primary" onClick={()=>window.confirm('Submit your examination?')&&finish()}>Submit exam</button>}</div></section><aside className="question-nav"><h3>Question palette</h3><p>Select a number to navigate.</p><div className="number-grid">{qs.map((x,i)=><button className={`${index===i?'current':''} ${answers[x.id]!==undefined?'answered':''}`} onClick={()=>setIndex(i)}>{i+1}</button>)}</div><div className="legend"><span><i className="dot answered-dot"/> Answered</span><span><i className="dot"/> Not answered</span></div><div className="palette-note"><FiClock/><span><strong>Time matters</strong><small>Your exam submits automatically when the timer ends.</small></span></div></aside></div></>
}
function Results({ results }) { return <><PageHeading eyebrow="PERFORMANCE" title="Your results" desc="Review your completed examination attempts."/><div className="stats-grid"><Stat icon={FiAward} label="Completed exams" value={results.length} note="Your exam history" tone="purple"/><Stat icon={FiCheckCircle} label="Average score" value={results.length?`${Math.round(results.reduce((a,r)=>a+r.percentage,0)/results.length)}%`:'—'} note="Across all attempts" tone="green"/></div>{results.length===0?<div className="empty-state"><div className="empty-icon"><FiAward/></div><h3>No results yet</h3><p>Complete an examination and your results will appear here.</p><NavLink className="btn primary" to="/exams">Browse examinations</NavLink></div>:<div className="table-wrap"><table><thead><tr><th>EXAMINATION</th><th>DATE</th><th>SCORE</th><th>RESULT</th></tr></thead><tbody>{[...results].reverse().map(r=><tr><td><strong>{r.title}</strong></td><td>{r.date}</td><td>{r.correct}/{r.total} ({r.percentage}%)</td><td><span className={`status ${r.percentage>=50?'active':'upcoming'}`}>{r.percentage>=50?'Passed':'Needs improvement'}</span></td></tr>)}</tbody></table></div>}</> }
export default App
