import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const appId = 'aura-personal-assistant';
  const apiKey = ""; // Chiave API di Gemini

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Stato per aprire/chiudere il menu sul telefono
  
  const [userProfile, setUserProfile] = useState({
    name: 'Utente',
    avatarColor: 'from-violet-500 to-indigo-600',
    assistantName: 'Aura',
    personality: 'Premuroso',
    voice: 'Kore',
    autoSpeak: false,
    notificationsEnabled: false
  });

  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([
    { date: 'Ieri', mood: 'Produttivo' },
    { date: '2 giorni fa', mood: 'Felice' },
    { date: '3 giorni fa', mood: 'Rilassato' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Bere 2 litri d\'acqua', category: 'Salute', priority: 'Alta', completed: false, date: '2026-06-13', time: '08:30' },
    { id: 2, title: 'Pianificare la settimana di lavoro', category: 'Lavoro', priority: 'Media', completed: true, date: '2026-06-13', time: '10:00' },
    { id: 3, title: 'Mezz\'ora di lettura serale', category: 'Personale', priority: 'Bassa', completed: false, date: '2026-06-13', time: '21:30' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Personale');
  const [newTaskPriority, setNewTaskPriority] = useState('Media');
  const [newTaskDate, setNewTaskDate] = useState('2026-06-13');
  const [newTaskTime, setNewTaskTime] = useState('09:00');
  const [taskFilter, setTaskFilter] = useState('Tutte');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-06-13');

  const [notes, setNotes] = useState([
    { id: 1, title: 'Idee per il weekend', content: 'Fare una passeggiata in montagna se il tempo è bello...', date: '12 Giu 2026', category: 'Personale' }
  ]);

  const [habits, setHabits] = useState([
    { id: 1, name: 'Meditazione 10 min', category: 'Mente', streak: 5, completedToday: true },
    { id: 2, name: 'Attività Fisica', category: 'Corpo', streak: 2, completedToday: false }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Ciao! Sono Aura, la tua assistente personale.', timestamp: '08:00' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([{ id: Date.now(), title: newTaskTitle, category: newTaskCategory, priority: newTaskPriority, completed: false, date: newTaskDate, time: newTaskTime }, ...tasks]);
    setNewTaskTitle('');
  };

  return (
    <div className="min-h-screen flex bg-[#0b0f19] text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* SFONDO OSCURANTE QUANDO IL MENU COMPARE SUL TELEFONO */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR SINISTRA RIPOSIZIONATA (RESPONSIVE) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1422] border-r border-slate-800/60 p-4 flex flex-col justify-between h-screen transition-transform duration-300 ease-in-out shrink-0
        md:sticky md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          {/* Logo compatto + tasto chiudi per mobile */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">A</div>
              <div>
                <h1 className="font-bold text-sm tracking-tight">Aura Assistente</h1>
                <p className="text-[10px] text-indigo-400 font-medium">Pianificazione, Voce & Notifiche</p>
              </div>
            </div>
            {/* Tasto chiudi menu visibile solo su telefono */}
            <button className="md:hidden text-slate-400 text-lg p-1" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>

          {/* Menu Principale */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Menu principale</p>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🎛️' },
              { id: 'ai-chat', label: 'Assistente IA', icon: '💬', badge: 'Voce' },
              { id: 'tasks', label: 'Attività & Agenda', icon: '📋', count: 5 },
              { id: 'notes', label: 'Diario & Note', icon: '📝' },
              { id: 'habits', label: 'Abitudini', icon: '⚡', percentage: '50%' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Chiude in automatico su telefono dopo il clic
                }} 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && <span className="bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                {item.count && <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-md">{item.count}</span>}
                {item.percentage && <span className="text-emerald-500 text-[10px]">{item.percentage}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Impostazioni in basso sulla Sidebar */}
        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Impostazioni Aura</p>
          <div className="space-y-2.5 px-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Nome Assistente</label>
              <input type="text" value={userProfile.assistantName} onChange={e => setUserProfile({...userProfile, assistantName: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Personalità IA</label>
              <select value={userProfile.personality} onChange={e => setUserProfile({...userProfile, personality: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none">
                <option value="Premuroso">🥰 Premurosa</option>
                <option value="Pratico">⚡ Pratica</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Voce Sintesi Vocale</label>
              <select value={userProfile.voice} onChange={e => setUserProfile({...userProfile, voice: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none">
                <option value="Kore">Kore (Femminile Chiara)</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Lettura automatica</span>
              <input type="checkbox" checked={userProfile.autoSpeak} onChange={e => setUserProfile({...userProfile, autoSpeak: e.target.checked})} className="rounded bg-slate-900 border-slate-800 text-indigo-600" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>🔔 Notifiche</span>
              <input type="checkbox" checked={userProfile.notificationsEnabled} onChange={e => setUserProfile({...userProfile, notificationsEnabled: e.target.checked})} className="rounded bg-slate-900 border-slate-800 text-indigo-600" />
            </div>
          </div>
        </div>
      </aside>

      {/* AREA CONTENUTO PRINCIPALE ADATTATA PER IL TELEFONO */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* TOP BAR CON TASTO APRI MENU PER TELEFONO */}
        <header className="h-14 border-b border-slate-800/60 px-4 md:px-8 flex items-center justify-between bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="flex items-center space-x-3">
            {/* Pulsante Hamburger visible solo sui display piccoli */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 bg-[#0f1422] border border-slate-800/80 rounded-lg text-slate-200 text-sm md:hidden"
            >
              ☰
            </button>
            <div className="text-[11px] md:text-xs text-slate-400 font-medium truncate max-w-[180px] md:max-w-none">
              {currentTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} • Sabato 13 Giugno 2026
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-yellow-400 text-xs">☀️</button>
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">U</div>
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Utente</span>
            </div>
          </div>
        </header>

        {/* CONTAINER CON SPAZIATURE RESE RESPONSIVE */}
        <main className="p-4 md:p-8 flex-1 overflow-y-auto max-w-5xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Banner Principale */}
              <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white relative overflow-hidden shadow-xl shadow-indigo-500/5">
                <span className="bg-white/10 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">PANORAMICA GIORNALIERA</span>
                <h2 className="text-xl md:text-2xl font-extrabold mt-2">Ciao, Utente! 👋</h2>
                <p className="text-white/80 text-xs mt-1.5 max-w-xl leading-relaxed">
                  Oggi è il momento perfetto per prenderti cura di ti. Hai <span className="font-bold underline">5 attività</span> aperte e hai completato il <span className="font-bold underline">50%</span> delle tue abitudini quotidiane.
                </p>
                <button onClick={() => setActiveTab('ai-chat')} className="mt-4 bg-white text-indigo-600 font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 hover:bg-slate-100 transition-all">
                  <span>💬</span> <span>Parla con Aura</span>
                </button>
              </div>

              {/* Ispirazione */}
              <div className="p-4 md:p-5 rounded-2xl bg-[#0f1422] border border-slate-800/60 shadow-sm">
                <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-wider block mb-1">ISPIRAZIONE</span>
                <p className="italic text-xs opacity-90 leading-relaxed">"La felicità non è qualcosa di pronto. Viene dalle tue stesse azioni."</p>
                <p className="text-[10px] font-bold text-right text-indigo-400 mt-1">— Dalai Lama</p>
              </div>

              {/* GRIGLIA INTELLIGENTE: 1 COLONNA SU MOBILE, 2 COLONNE SU PC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* Umore */}
                <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/60 flex flex-col justify-between min-h-[140px]">
                  <div>
                    <h3 className="font-bold text-xs tracking-tight">Come ti senti oggi?</h3>
                    <p className="text-[10px] opacity-50">Registra il tuo stato d'animo per calibrare Aura.</p>
                  </div>
                  <div className="flex justify-start gap-2 my-3 overflow-x-auto pb-1">
                    {['😊', '⚡', '🍃', '🥱', '🤯'].map((emoji, idx) => (
                      <button key={idx} className="p-2 bg-[#0b0f19] border border-slate-800/60 hover:border-indigo-500 rounded-xl text-lg transition-all shrink-0">{emoji}</button>
                    ))}
                  </div>
                  <p className="text-[10px] text-indigo-400 font-semibold cursor-pointer hover:underline">Scegli un umore</p>
                </div>

                {/* Avanzamento Abitudini */}
                <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/60 flex items-center space-x-5 min-h-[140px]">
                  <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                      <circle cx="28" cy="28" r="24" stroke="#6366f1" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * 0.5} />
                    </svg>
                    <span className="text-xs font-black">50%</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs tracking-tight">Avanzamento Abitudini</h3>
                    <p className="text-[10px] opacity-50">Mantenere le abitudini genera disciplina.</p>
                    <p className="text-[11px] font-bold text-slate-200 pt-1">2 su 4 completate</p>
                    <p className="text-[10px] text-emerald-500 font-medium">Ottimo ritmo!</p>
                    <p onClick={() => setActiveTab('habits')} className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer pt-1">Vedi tutte le abitudini →</p>
                  </div>
                </div>

                {/* Completamento Task */}
                <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/60 flex flex-col justify-between min-h-[130px]">
                  <div>
                    <h3 className="font-bold text-xs tracking-tight">Completamento Task</h3>
                    <p className="text-[10px] opacity-50">Le tue priorità quotidiane pianificate.</p>
                  </div>
                  <div className="space-y-1.5 my-2">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Eseguite</span>
                      <span className="font-semibold">1/6</span>
                    </div>
                    <div className="w-full bg-[#0b0f19] border border-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[16%]"></div>
                    </div>
                  </div>
                  <p onClick={() => setActiveTab('tasks')} className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer">Gestisci attività →</p>
                </div>

                {/* Riflessioni & Note */}
                <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800/60 flex flex-col justify-between min-h-[130px]">
                  <div>
                    <h3 className="font-bold text-xs tracking-tight">Riflessioni & Note</h3>
                    <p className="text-[10px] opacity-50">Fermare i pensieri riduce l'ansia.</p>
                  </div>
                  <div className="my-1">
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1"><span>🍂</span> Idee per il weekend</p>
                    <p className="text-[10px] opacity-50 line-clamp-1 mt-0.5">Fare una passeggiata in montagna se il tempo è...</p>
                  </div>
                  <p onClick={() => setActiveTab('notes')} className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer">Apri diario →</p>
                </div>

              </div>
            </>
          )}

          {/* ALTRE TAB DI SERVIZIO REATTIVE */}
          {activeTab === 'ai-chat' && (
            <div className="p-4 md:p-6 rounded-2xl bg-[#0f1422] border border-slate-800/60 h-96 flex flex-col justify-between">
              <div className="text-xs opacity-60">Pannello Conversazione Assistente IA attiva.</div>
              <div className="flex gap-2">
                <input type="text" placeholder="Scrivi a Aura..." className="flex-1 bg-[#0b0f19] border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                <button className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors">Invia</button>
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && <div className="p-6 text-xs opacity-60">Tab Attività ed Agenda Caricata.</div>}
          {activeTab === 'notes' && <div className="p-6 text-xs opacity-60">Tab Diario e Note Caricata.</div>}
          {activeTab === 'habits' && <div className="p-6 text-xs opacity-60">Tab Gestione Abitudini Caricata.</div>}
        </main>
      </div>
    </div>
  );
}