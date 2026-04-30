import { useState, useRef, useEffect } from "react";

const PAYPAL_LINKS = {
  pro:   "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WNKTBCYW7AA5A",
  elite: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VVRL4ZQMTQSRA",
};

const HABITS = [
  { id:"gym",        label:"Gym",          icon:"🏋️", pro:false },
  { id:"agua",       label:"2L agua",      icon:"💧", pro:false },
  { id:"lectura",    label:"Leer 20min",   icon:"📖", pro:false },
  { id:"meditacion", label:"Meditar",      icon:"🧘", pro:true  },
  { id:"frio",       label:"Ducha fría",   icon:"🧊", pro:true  },
  { id:"sinredes",   label:"Sin redes 2h", icon:"📵", pro:true  },
  { id:"proteina",   label:"Proteína",     icon:"🥩", pro:true  },
  { id:"dormir",     label:"8h sueño",     icon:"😴", pro:true  },
];

const GYM_PLAN = {
  Lunes:     { grupo:"PECHO + TRÍCEPS",  color:"#2563EB", ejercicios:["Press banca 4x8","Press inclinado 3x10","Aperturas 3x12","Fondos 3x12","Extensiones tríceps 3x15"] },
  Martes:    { grupo:"ESPALDA + BÍCEPS", color:"#16A34A", ejercicios:["Dominadas 4x8","Remo con barra 4x10","Jalón al pecho 3x12","Curl barra 4x10","Curl martillo 3x12"] },
  Miércoles: { grupo:"PIERNAS",          color:"#DC2626", ejercicios:["Sentadilla 5x5","Prensa 4x10","Zancadas 3x12","Curl femoral 3x12","Pantorrillas 4x20"] },
  Jueves:    { grupo:"HOMBROS",          color:"#7C3AED", ejercicios:["Press militar 4x8","Elevaciones laterales 4x12","Vuelos posteriores 3x15","Encogimientos 4x12","Face pull 3x15"] },
  Viernes:   { grupo:"FULL BODY",        color:"#D97706", ejercicios:["Peso muerto 5x5","Press banca 4x6","Dominadas 4x6","Sentadilla frontal 3x8","Plancha 3x60s"] },
  Sábado:    { grupo:"CARDIO + CORE",    color:"#DB2777", ejercicios:["HIIT 20min","Abdominales 4x20","Plancha lateral 3x45s","Mountain climbers 3x30","Saltar cuerda 10min"] },
  Domingo:   { grupo:"DESCANSO",         color:"#6B7280", ejercicios:["Caminata 30min","Estiramiento completo","Foam roller","Movilidad articular","Respiración profunda"] },
};

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const CHALLENGES = ["Haz 100 flexiones hoy. Sin excusas.","Ayuno 16 horas. Disciplina mental.","Habla con un extraño. Expande tu zona.","Sin azúcar todo el día.","Despierta 1 hora antes.","Escribe tus 3 metas principales.","Sin quejarte en todo el día."];
const SYSTEM_PROMPT = `Eres APEX, coach de élite para hombres. Directo, sin rodeos, brutal honestidad. Fitness, mentalidad, finanzas y relaciones. Español Latino. Máximo 3 párrafos. Siempre 1 acción concreta para HOY.`;

const ONBOARDING = [
  { icon:"⚡", title:"Bienvenido a APEX", sub:"El sistema de desarrollo masculino más completo. Sin excusas.", bg:"#1E3A5F", accent:"#60A5FA" },
  { icon:"🏋️", title:"Cuerpo de élite", sub:"Rutinas semanales, calculadora de macros y tracker de hábitos.", bg:"#14532D", accent:"#4ADE80" },
  { icon:"🧠", title:"Mentalidad ganadora", sub:"Coach IA disponible 24/7. Directo, sin filtros.", bg:"#3B1F5E", accent:"#C084FC" },
  { icon:"💰", title:"Finanzas y relaciones", sub:"Metas, diario personal y coaching en todas las áreas.", bg:"#3B2A1A", accent:"#FB923C" },
];

const todayKey  = () => new Date().toISOString().split("T")[0];
const todayName = () => DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

const BG    = "#F1F5F9";
const WHITE = "#FFFFFF";
const TEXT  = "#0F172A";
const MUTED = "#64748B";
const BORD  = "#E2E8F0";

function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const cur = ONBOARDING[step];
  const isLast = step === ONBOARDING.length - 1;
  return (
    <div style={{ minHeight:"100vh", background:cur.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 28px", transition:"background 0.5s ease", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, display:"flex", gap:6, padding:"52px 28px 0" }}>
        {ONBOARDING.map((_,i) => (
          <div key={i} style={{ height:3, flex:1, borderRadius:2, background:i<=step?cur.accent:"rgba(255,255,255,0.15)", transition:"background 0.4s" }} />
        ))}
      </div>
      <div style={{ textAlign:"center", maxWidth:320 }}>
        <div style={{ fontSize:88, marginBottom:24, lineHeight:1 }}>{cur.icon}</div>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:36, fontWeight:900, letterSpacing:1, lineHeight:1.1, marginBottom:14, color:"#FFF" }}>{cur.title}</div>
        <div style={{ fontFamily:"Barlow", fontSize:16, color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:48 }}>{cur.sub}</div>
        <button onClick={() => isLast ? onDone() : setStep(s=>s+1)} style={{ width:"100%", background:cur.accent, color:"#000", border:"none", borderRadius:14, padding:"17px", fontFamily:"'Barlow Condensed'", fontSize:19, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>
          {isLast ? "EMPEZAR →" : "SIGUIENTE →"}
        </button>
        {step > 0 && <button onClick={() => setStep(s=>s-1)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"Barlow", fontSize:14, marginTop:14 }}>← Atrás</button>}
      </div>
    </div>
  );
}

// ⚠️ PAYWALL FIXED: cerrar sin pagar NO da acceso
function PaywallModal({ onClose, onPaid }) {
  const [selected, setSelected] = useState("pro");
  const [clicked, setClicked]   = useState(false);
  const plans = [
    { id:"pro",   name:"PRO",   price:"$9.99",  period:"/mes", color:"#2563EB", badge:"MÁS POPULAR",  features:["Coach IA ilimitado","8 hábitos de élite","Calculadora de macros","Metas ilimitadas","Diario personal"] },
    { id:"elite", name:"ELITE", price:"$29.99", period:"/mes", color:"#DC2626", badge:"MÁXIMO PODER", features:["Todo lo de Pro","Planes personalizados","Rutinas avanzadas","Soporte prioritario","Comunidad privada"] },
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, overflowY:"auto", backdropFilter:"blur(8px)" }}>
      <div style={{ padding:"48px 20px 60px", maxWidth:480, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>⚡</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, letterSpacing:4, color:"#60A5FA", fontWeight:700, marginBottom:8 }}>DESBLOQUEA TODO</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:40, fontWeight:900, lineHeight:1, color:"#FFF" }}>SUBE DE NIVEL HOY.</div>
        </div>
        {plans.map(plan => (
          <div key={plan.id} onClick={() => setSelected(plan.id)} style={{ background:selected===plan.id?"#1E293B":"#0F172A", border:`2px solid ${selected===plan.id?plan.color:"#1E293B"}`, borderRadius:16, padding:"20px", marginBottom:12, cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
            {plan.badge && <div style={{ position:"absolute", top:-10, right:14, background:plan.color, color:"#FFF", fontSize:9, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:1, fontFamily:"'Barlow Condensed'" }}>{plan.badge}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, color:plan.color, letterSpacing:1 }}>{plan.name}</span>
              <div><span style={{ fontFamily:"'Barlow Condensed'", fontSize:30, fontWeight:900, color:"#FFF" }}>{plan.price}</span><span style={{ fontSize:13, color:"#64748B" }}>{plan.period}</span></div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {plan.features.map(f => <span key={f} style={{ background:"#1E293B", borderRadius:20, padding:"4px 10px", fontSize:11, color:"#94A3B8", fontFamily:"Barlow" }}>✓ {f}</span>)}
            </div>
          </div>
        ))}
        <button onClick={() => { setClicked(true); window.open(PAYPAL_LINKS[selected], "_blank"); }} style={{ width:"100%", background:selected==="pro"?"#2563EB":"#DC2626", color:"#FFF", border:"none", borderRadius:14, padding:"18px", fontFamily:"'Barlow Condensed'", fontSize:19, fontWeight:900, cursor:"pointer", letterSpacing:1, marginTop:6, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          🅿️ PAGAR CON PAYPAL →
        </button>

        {/* Solo si ya pagó puede activar */}
        {clicked && (
          <div style={{ background:"#0F2A1A", border:"1px solid #16A34A", borderRadius:12, padding:"14px 16px", marginTop:14, textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, color:"#4ADE80", marginBottom:6 }}>✓ SE ABRIÓ PAYPAL</div>
            <div style={{ fontFamily:"Barlow", fontSize:13, color:"#6B7280", marginBottom:12 }}>Completá el pago y volvé aquí.</div>
            <button onClick={() => onPaid(selected)} style={{ background:"#16A34A", color:"#FFF", border:"none", borderRadius:10, padding:"10px 22px", fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:900, cursor:"pointer" }}>✓ YA PAGUÉ — ACTIVAR</button>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:16 }}>
          {/* Cerrar sin pagar NO activa ningún plan */}
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontFamily:"Barlow", fontSize:13 }}>Continuar gratis por ahora</button>
        </div>
      </div>
    </div>
  );
}

export default function Apex() {
  const [onboarded,     setOnboarded]     = useState(false);
  const [tab,           setTab]           = useState("home");
  const [plan,          setPlan]          = useState("free"); // free | pro | elite
  const [showPaywall,   setShowPaywall]   = useState(false);
  const [habits,        setHabits]        = useState({});
  const [goals,         setGoals]         = useState([
    { id:1, text:"Llegar a 80kg de músculo", progress:40, color:"#2563EB" },
    { id:2, text:"Ahorrar $5,000 este año",  progress:25, color:"#16A34A" },
    { id:3, text:"Leer 24 libros",           progress:60, color:"#7C3AED" },
  ]);
  const [newGoal,       setNewGoal]       = useState("");
  const [journal,       setJournal]       = useState([]);
  const [journalEntry,  setJournalEntry]  = useState("");
  const [journalMood,   setJournalMood]   = useState(3);
  const [messages,      setMessages]      = useState([{ role:"assistant", content:"Soy APEX. Sin excusas, sin zonas de confort. ¿Qué vas a mejorar hoy?" }]);
  const [chatInput,     setChatInput]     = useState("");
  const [loading,       setLoading]       = useState(false);
  const [msgCount,      setMsgCount]      = useState(0);
  const [weight,        setWeight]        = useState("");
  const [height,        setHeight]        = useState("");
  const [macros,        setMacros]        = useState(null);
  const [goalMacro,     setGoalMacro]     = useState("muscle");
  const [streak,        setStreak]        = useState(7);
  const [challengeDone, setChallengeDone] = useState(false);
  const [gymDay,        setGymDay]        = useState(todayName());
  const chatContainerRef = useRef(null);
  const messagesEndRef   = useRef(null);

  // isPro solo es true si el plan fue activado mediante pago
  const isPro     = plan === "pro" || plan === "elite";
  const challenge = CHALLENGES[new Date().getDay()];
  const todayH    = habits[todayKey()] || {};
  const doneCount = Object.values(todayH).filter(Boolean).length;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleHabit = (h) => {
    if (h.pro && !isPro) { setShowPaywall(true); return; }
    const k = todayKey();
    setHabits(p => ({ ...p, [k]:{ ...(p[k]||{}), [h.id]:!todayH[h.id] } }));
  };

  const calcMacros = () => {
    if (!isPro) { setShowPaywall(true); return; }
    if (!weight || !height) return;
    const w = parseFloat(weight), h = parseFloat(height);
    const tdee = Math.round((10*w + 6.25*h - 5*25 + 5) * 1.55);
    const t = {
      muscle:{ cal:tdee+300, p:Math.round(w*2.2), c:Math.round((tdee+300)*.45/4), f:Math.round((tdee+300)*.25/9) },
      cut:   { cal:tdee-400, p:Math.round(w*2.5), c:Math.round((tdee-400)*.35/4), f:Math.round((tdee-400)*.30/9) },
      maint: { cal:tdee,     p:Math.round(w*1.8), c:Math.round(tdee*.45/4),       f:Math.round(tdee*.30/9) },
    };
    setMacros(t[goalMacro]);
  };

  const addGoal = () => {
    if (!isPro && goals.length >= 3) { setShowPaywall(true); return; }
    if (!newGoal.trim()) return;
    const colors = ["#2563EB","#16A34A","#7C3AED","#D97706","#DB2777"];
    setGoals(p => [...p, { id:Date.now(), text:newGoal, progress:0, color:colors[p.length%colors.length] }]);
    setNewGoal("");
  };

  const saveJournal = () => {
    if (!isPro) { setShowPaywall(true); return; }
    if (!journalEntry.trim()) return;
    setJournal(p => [{ date:new Date().toLocaleDateString("es"), text:journalEntry, mood:journalMood }, ...p]);
    setJournalEntry("");
  };

  // ✅ COACH FIXED: usa /api/chat correctamente
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (!isPro && msgCount >= 5) { setShowPaywall(true); return; }
    const userMsg = { role:"user", content:text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setChatInput("");
    setLoading(true);
    setMsgCount(c => c+1);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: newMsgs }),
      });
      if (!res.ok) throw new Error("Error del servidor: " + res.status);
      const data = await res.json();
      const reply = data?.content?.[0]?.text || data?.error?.message || "Sin respuesta del servidor.";
      setMessages([...newMsgs, { role:"assistant", content:reply }]);
    } catch(e) {
      setMessages([...newMsgs, { role:"assistant", content:"No se pudo conectar con el coach. Intentá de nuevo." }]);
    }
    setLoading(false);
  };

  if (!onboarded) return <OnboardingScreen onDone={() => setOnboarded(true)} />;

  const NAV_ITEMS = [
    { id:"home",    icon:"🏠", label:"Inicio"  },
    { id:"habitos", icon:"✅", label:"Hábitos" },
    { id:"gym",     icon:"🏋️", label:"Gym"    },
    { id:"macros",  icon:"🥩", label:"Macros"  },
    { id:"metas",   icon:"🎯", label:"Metas"   },
    { id:"diario",  icon:"📓", label:"Diario"  },
    { id:"coach",   icon:"⚡", label:"Coach"   },
  ];

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:"'Barlow Condensed', sans-serif", maxWidth:480, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:4px}
        .tap{transition:transform .15s;cursor:pointer}.tap:active{transform:scale(.97)}
        .fade{animation:fi .35s ease}@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        input,textarea{outline:none}textarea{resize:none}
        .pulse{animation:pu 2s infinite}@keyframes pu{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}   // solo cierra, NO activa plan
          onPaid={(p) => { setPlan(p); setShowPaywall(false); }} // activa plan solo si pagó
        />
      )}

      {isPro && (
        <div style={{ position:"fixed", top:14, right:14, zIndex:50, background:plan==="elite"?"#DC2626":"#2563EB", color:"#FFF", fontSize:9, fontWeight:900, padding:"5px 12px", borderRadius:20, letterSpacing:2, fontFamily:"'Barlow Condensed'" }}>
          {plan.toUpperCase()} ⚡
        </div>
      )}

      {/* HOME */}
      {tab==="home" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:"linear-gradient(135deg,#1E3A5F,#2563EB)", padding:"52px 24px 32px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>APEX PROTOCOL · 🇺🇾</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:42, fontWeight:900, lineHeight:1, marginBottom:6 }}>HOY ES EL DÍA<br /><span style={{ color:"#93C5FD" }}>QUE CAMBIA TODO.</span></div>
            <div style={{ fontFamily:"Barlow", fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:10 }}>{new Date().toLocaleDateString("es",{weekday:"long",day:"numeric",month:"long"})}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:20 }}>
              {[{l:"RACHA",v:streak},{l:"HÁBITOS",v:`${doneCount}/${HABITS.length}`},{l:"METAS",v:goals.length}].map(s=>(
                <div key={s.l} style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:28, fontWeight:900, lineHeight:1 }}>{s.v}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", letterSpacing:2, marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"20px 20px 0" }}>
            <div style={{ background:WHITE, borderRadius:18, padding:"18px", marginBottom:14, boxShadow:"0 1px 8px rgba(0,0,0,0.06)", borderLeft:"4px solid #2563EB" }}>
              <div style={{ fontSize:10, letterSpacing:3, color:"#2563EB", marginBottom:8, fontWeight:700 }}>⚡ RETO DEL DÍA</div>
              <div style={{ fontFamily:"Barlow", fontSize:15, color:TEXT, lineHeight:1.6, marginBottom:14 }}>{challenge}</div>
              <button className="tap" onClick={()=>{ setChallengeDone(true); setStreak(s=>s+1); }} style={{ background:challengeDone?"#2563EB":"transparent", border:`1.5px solid ${challengeDone?"#2563EB":BORD}`, color:challengeDone?"#FFF":MUTED, borderRadius:10, padding:"8px 18px", fontFamily:"'Barlow Condensed'", fontWeight:700, fontSize:13, letterSpacing:1, cursor:"pointer", transition:"all 0.2s" }}>
                {challengeDone?"✓ COMPLETADO":"MARCAR LISTO"}
              </button>
            </div>
            <div style={{ background:WHITE, borderRadius:18, padding:"18px", marginBottom:14, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:10, letterSpacing:3, color:GYM_PLAN[todayName()].color, marginBottom:8, fontWeight:700 }}>🏋️ HOY — {todayName().toUpperCase()}</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, color:GYM_PLAN[todayName()].color, marginBottom:12 }}>{GYM_PLAN[todayName()].grupo}</div>
              {GYM_PLAN[todayName()].ejercicios.slice(0,3).map((e,i)=>(
                <div key={i} style={{ fontFamily:"Barlow", fontSize:13, color:MUTED, padding:"5px 0", borderBottom:i<2?`1px solid ${BORD}`:"none", display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ background:GYM_PLAN[todayName()].color, color:"#FFF", borderRadius:6, width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</span>{e}
                </div>
              ))}
              <button onClick={()=>setTab("gym")} style={{ background:"none", border:"none", color:"#2563EB", fontFamily:"Barlow", fontSize:12, cursor:"pointer", marginTop:12, fontWeight:600 }}>Ver rutina completa →</button>
            </div>
            {!isPro && (
              <button className="tap" onClick={()=>setShowPaywall(true)} style={{ width:"100%", background:"linear-gradient(135deg,#1D4ED8,#7C3AED)", color:"#FFF", border:"none", borderRadius:16, padding:"17px 20px", fontFamily:"'Barlow Condensed'", fontSize:18, fontWeight:900, cursor:"pointer", letterSpacing:1, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 20px rgba(37,99,235,0.3)" }}>
                🅿️ APEX PRO — $9.99/mes
              </button>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{icon:"✅",label:"Hábitos",sub:`${doneCount}/${HABITS.length} hoy`,t:"habitos",c:"#2563EB"},{icon:"🎯",label:"Metas",sub:`${goals.length} activas`,t:"metas",c:"#EA580C"},{icon:"🥩",label:"Macros",sub:isPro?"Calcular":"🔒 Pro",t:"macros",c:"#16A34A"},{icon:"📓",label:"Diario",sub:isPro?`${journal.length} entradas`:"🔒 Pro",t:"diario",c:"#7C3AED"}].map(item=>(
                <div key={item.t} className="tap" onClick={()=>setTab(item.t)} style={{ background:WHITE, borderRadius:18, padding:"18px 16px", cursor:"pointer", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", border:`1.5px solid ${BORD}` }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{item.icon}</div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:900, color:item.c, marginBottom:4 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontFamily:"Barlow", fontSize:12, color:MUTED }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HÁBITOS */}
      {tab==="habitos" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:"linear-gradient(135deg,#14532D,#16A34A)", padding:"52px 24px 28px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>HÁBITOS DIARIOS</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:38, fontWeight:900, lineHeight:1 }}>LA DISCIPLINA<br />ES LIBERTAD.</div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, height:8, marginTop:18, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(doneCount/HABITS.length)*100}%`, background:"#FFF", borderRadius:10, transition:"width 0.5s ease" }} />
            </div>
            <div style={{ fontFamily:"Barlow", fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:6 }}>{doneCount} de {HABITS.length} completados</div>
          </div>
          <div style={{ padding:"20px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {HABITS.map(h=>{
                const done=todayH[h.id]; const locked=h.pro&&!isPro;
                return (
                  <div key={h.id} className="tap" onClick={()=>toggleHabit(h)} style={{ background:done?"#F0FDF4":WHITE, border:`1.5px solid ${done?"#16A34A":locked?"#F1F5F9":BORD}`, borderRadius:18, padding:"20px 16px", cursor:"pointer", position:"relative", transition:"all 0.2s", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
                    {done && <div style={{ position:"absolute", top:12, right:12, background:"#16A34A", color:"#FFF", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900 }}>✓</div>}
                    {locked && <div style={{ position:"absolute", top:12, right:12, fontSize:14 }}>🔒</div>}
                    <div style={{ fontSize:30, marginBottom:10 }}>{h.icon}</div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:15, fontWeight:700, color:done?"#16A34A":locked?"#CBD5E1":TEXT }}>{h.label}</div>
                    {locked && <div style={{ fontFamily:"Barlow", fontSize:10, color:"#CBD5E1", marginTop:2 }}>Solo en Pro</div>}
                  </div>
                );
              })}
            </div>
            {!isPro && <button className="tap" onClick={()=>setShowPaywall(true)} style={{ width:"100%", background:"#16A34A", color:"#FFF", border:"none", borderRadius:14, padding:14, fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1, marginTop:14, boxShadow:"0 4px 16px rgba(22,163,74,0.3)" }}>🔓 DESBLOQUEAR HÁBITOS PRO</button>}
          </div>
        </div>
      )}

      {/* GYM */}
      {tab==="gym" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:`linear-gradient(135deg,#1E1B4B,${GYM_PLAN[gymDay].color})`, padding:"52px 24px 24px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>PLAN SEMANAL</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:38, fontWeight:900, lineHeight:1 }}>RUTINA DE ÉLITE.</div>
          </div>
          <div style={{ padding:"20px" }}>
            <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:18, paddingBottom:4 }}>
              {DAYS.map(day=>(
                <button key={day} onClick={()=>setGymDay(day)} style={{ background:gymDay===day?GYM_PLAN[day].color:WHITE, border:`1.5px solid ${gymDay===day?GYM_PLAN[day].color:BORD}`, color:gymDay===day?"#FFF":MUTED, borderRadius:12, padding:"9px 14px", fontSize:12, fontFamily:"'Barlow Condensed'", fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, transition:"all 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                  {day===todayName()?"HOY":day.substring(0,3).toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ background:WHITE, borderRadius:18, padding:"22px 20px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${GYM_PLAN[gymDay].color}` }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:26, fontWeight:900, color:GYM_PLAN[gymDay].color, marginBottom:4 }}>{GYM_PLAN[gymDay].grupo}</div>
              <div style={{ fontFamily:"Barlow", fontSize:12, color:MUTED, marginBottom:18 }}>{gymDay}{gymDay===todayName()?" · HOY":""}</div>
              {GYM_PLAN[gymDay].ejercicios.map((e,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:i<GYM_PLAN[gymDay].ejercicios.length-1?`1px solid ${BORD}`:"none" }}>
                  <div style={{ width:30, height:30, borderRadius:10, background:GYM_PLAN[gymDay].color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontFamily:"'Barlow Condensed'", fontWeight:900, color:"#FFF", flexShrink:0 }}>{i+1}</div>
                  <div style={{ fontFamily:"Barlow", fontSize:14, color:TEXT, fontWeight:500 }}>{e}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MACROS */}
      {tab==="macros" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:"linear-gradient(135deg,#78350F,#D97706)", padding:"52px 24px 28px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>NUTRICIÓN</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:38, fontWeight:900, lineHeight:1 }}>COME PARA GANAR.</div>
          </div>
          <div style={{ padding:"20px" }}>
            {!isPro ? (
              <div style={{ background:WHITE, borderRadius:18, padding:30, textAlign:"center", boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:24, fontWeight:900, marginBottom:8 }}>FUNCIÓN PRO</div>
                <div style={{ fontFamily:"Barlow", fontSize:14, color:MUTED, marginBottom:22, lineHeight:1.6 }}>Calcula tus calorías y macros exactos según tu objetivo.</div>
                <button className="tap" onClick={()=>setShowPaywall(true)} style={{ background:"#D97706", color:"#FFF", border:"none", borderRadius:12, padding:"13px 28px", fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>🅿️ DESBLOQUEAR CON PRO</button>
              </div>
            ) : (
              <>
                <div style={{ background:WHITE, borderRadius:18, padding:20, marginBottom:14, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                    {[["PESO (kg)","75",weight,setWeight],["ALTURA (cm)","178",height,setHeight]].map(([lbl,ph,val,set])=>(
                      <div key={lbl}>
                        <div style={{ fontFamily:"Barlow", fontSize:11, color:MUTED, marginBottom:6, fontWeight:600 }}>{lbl}</div>
                        <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type="number" style={{ width:"100%", background:BG, border:`1.5px solid ${BORD}`, borderRadius:12, color:TEXT, padding:"11px 14px", fontSize:18, fontFamily:"'Barlow Condensed'", fontWeight:700 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                    {[["muscle","🏋️ Músculo"],["cut","🔥 Definición"],["maint","⚖️ Mantener"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setGoalMacro(v)} style={{ flex:1, background:goalMacro===v?"#D97706":BG, border:`1.5px solid ${goalMacro===v?"#D97706":BORD}`, color:goalMacro===v?"#FFF":MUTED, borderRadius:12, padding:"9px 4px", fontSize:11, fontFamily:"'Barlow Condensed'", fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>{l}</button>
                    ))}
                  </div>
                  <button className="tap" onClick={calcMacros} style={{ width:"100%", background:"#D97706", color:"#FFF", border:"none", borderRadius:12, padding:13, fontFamily:"'Barlow Condensed'", fontSize:17, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>CALCULAR MACROS</button>
                </div>
                {macros && (
                  <div style={{ background:WHITE, borderRadius:18, padding:20, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, letterSpacing:3, color:MUTED, marginBottom:14, fontWeight:700 }}>TUS MACROS DIARIOS</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[{l:"CALORÍAS",v:macros.cal,u:"kcal",c:"#D97706",bg:"#FFFBEB"},{l:"PROTEÍNA",v:macros.p,u:"g",c:"#DC2626",bg:"#FEF2F2"},{l:"CARBOS",v:macros.c,u:"g",c:"#2563EB",bg:"#EFF6FF"},{l:"GRASAS",v:macros.f,u:"g",c:"#16A34A",bg:"#F0FDF4"}].map(m=>(
                        <div key={m.l} style={{ background:m.bg, borderRadius:14, padding:"16px 14px", border:`1px solid ${m.c}22` }}>
                          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:30, fontWeight:900, color:m.c, lineHeight:1 }}>{m.v}<span style={{ fontSize:12, fontWeight:400 }}>{m.u}</span></div>
                          <div style={{ fontFamily:"Barlow", fontSize:10, color:MUTED, marginTop:5, fontWeight:600 }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* METAS */}
      {tab==="metas" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:"linear-gradient(135deg,#7C2D12,#EA580C)", padding:"52px 24px 28px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>SISTEMA DE METAS</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:38, fontWeight:900, lineHeight:1 }}>SIN META,<br />NO HAY RUMBO.</div>
          </div>
          <div style={{ padding:"20px" }}>
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <input value={newGoal} onChange={e=>setNewGoal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGoal()} placeholder={!isPro&&goals.length>=3?"🔒 Pro = metas ilimitadas":"Nueva meta..."} style={{ flex:1, background:WHITE, border:`1.5px solid ${BORD}`, borderRadius:14, color:TEXT, padding:"12px 16px", fontSize:14, fontFamily:"Barlow", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }} />
              <button className="tap" onClick={addGoal} style={{ background:"#EA580C", border:"none", borderRadius:14, width:48, height:48, fontSize:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#FFF" }}>+</button>
            </div>
            {!isPro && <div style={{ fontFamily:"Barlow", fontSize:12, color:MUTED, marginBottom:12, textAlign:"center" }}>Gratis: máx 3 · <span style={{ color:"#2563EB", cursor:"pointer", fontWeight:600 }} onClick={()=>setShowPaywall(true)}>Pro = ilimitadas →</span></div>}
            {goals.map(g=>(
              <div key={g.id} style={{ background:WHITE, borderRadius:18, padding:"18px", marginBottom:12, boxShadow:"0 1px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${g.color}` }}>
                <div style={{ fontFamily:"Barlow", fontSize:14, color:TEXT, fontWeight:500, marginBottom:14 }}>{g.text}</div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ flex:1, background:BG, borderRadius:6, height:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${g.progress}%`, background:g.color, borderRadius:6, transition:"width 0.4s ease" }} />
                  </div>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:18, fontWeight:900, color:g.color, minWidth:40 }}>{g.progress}%</span>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {[0,25,50,75,100].map(v=>(
                    <button key={v} onClick={()=>setGoals(p=>p.map(x=>x.id===g.id?{...x,progress:v}:x))} style={{ flex:1, background:g.progress===v?g.color:BG, border:`1px solid ${g.progress===v?g.color:BORD}`, color:g.progress===v?"#FFF":MUTED, borderRadius:8, padding:"6px 0", fontSize:10, cursor:"pointer", fontFamily:"'Barlow Condensed'", fontWeight:700, transition:"all 0.2s" }}>{v}%</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIARIO */}
      {tab==="diario" && (
        <div className="fade" style={{ paddingBottom:90 }}>
          <div style={{ background:"linear-gradient(135deg,#4C1D95,#7C3AED)", padding:"52px 24px 28px", color:"#FFF" }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:8 }}>DIARIO PERSONAL</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:38, fontWeight:900, lineHeight:1 }}>REFLEXIONA,<br />EVOLUCIONA.</div>
          </div>
          <div style={{ padding:"20px" }}>
            {!isPro ? (
              <div style={{ background:WHITE, borderRadius:18, padding:30, textAlign:"center", boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:44, marginBottom:14 }}>🔒</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:24, fontWeight:900, marginBottom:8 }}>FUNCIÓN PRO</div>
                <div style={{ fontFamily:"Barlow", fontSize:14, color:MUTED, marginBottom:22, lineHeight:1.6 }}>Registra tus reflexiones diarias con tracker de estado de ánimo.</div>
                <button className="tap" onClick={()=>setShowPaywall(true)} style={{ background:"#7C3AED", color:"#FFF", border:"none", borderRadius:12, padding:"13px 28px", fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>🅿️ DESBLOQUEAR CON PRO</button>
              </div>
            ) : (
              <>
                <div style={{ background:WHITE, borderRadius:18, padding:20, marginBottom:14, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontFamily:"Barlow", fontSize:12, color:MUTED, marginBottom:12, fontWeight:600 }}>¿CÓMO ESTÁS HOY?</div>
                  <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                    {[["😤","Mal"],["😐","Regular"],["😊","Bien"],["💪","Fuerte"],["🔥","Imparable"]].map(([e,l],i)=>(
                      <button key={i} onClick={()=>setJournalMood(i+1)} style={{ background:journalMood===i+1?"#EDE9FE":BG, border:`1.5px solid ${journalMood===i+1?"#7C3AED":BORD}`, borderRadius:12, padding:"8px 6px", fontSize:22, cursor:"pointer", flex:1, transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                        {e}<span style={{ fontSize:8, color:journalMood===i+1?"#7C3AED":MUTED, fontFamily:"Barlow", fontWeight:600 }}>{l}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={journalEntry} onChange={e=>setJournalEntry(e.target.value)} placeholder="¿Qué pasó hoy? ¿Qué aprendiste? ¿Qué mejorarás mañana?" rows={5} style={{ width:"100%", background:BG, border:`1.5px solid ${BORD}`, borderRadius:14, color:TEXT, padding:"13px 16px", fontSize:14, fontFamily:"Barlow", lineHeight:1.7, marginBottom:12 }} />
                  <button className="tap" onClick={saveJournal} style={{ width:"100%", background:"#7C3AED", color:"#FFF", border:"none", borderRadius:12, padding:13, fontFamily:"'Barlow Condensed'", fontSize:17, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>GUARDAR ENTRADA</button>
                </div>
                {journal.length===0 && <div style={{ textAlign:"center", color:MUTED, fontFamily:"Barlow", fontSize:14, padding:30 }}>Aún no hay entradas. Empieza hoy.</div>}
                {journal.map((entry,i)=>(
                  <div key={i} style={{ background:WHITE, borderRadius:16, padding:"16px 18px", marginBottom:10, boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontFamily:"Barlow", fontSize:11, color:MUTED, fontWeight:600 }}>{entry.date}</span>
                      <span style={{ fontSize:20 }}>{"😤😐😊💪🔥"[entry.mood-1]}</span>
                    </div>
                    <div style={{ fontFamily:"Barlow", fontSize:13, color:MUTED, lineHeight:1.6 }}>{entry.text}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* COACH - ✅ FIXED: input siempre visible, scroll correcto */}
      {tab==="coach" && (
        <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, height:"100vh", display:"flex", flexDirection:"column", background:BG, zIndex:10 }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#1E3A5F,#2563EB)", padding:"44px 20px 16px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>⚡</div>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, letterSpacing:1, color:"#FFF" }}>APEX COACH</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontFamily:"Barlow", display:"flex", alignItems:"center", gap:5 }}>
                    <span className="pulse" style={{ color:"#4ADE80", fontSize:8 }}>●</span> En línea · Sin filtros
                  </div>
                </div>
              </div>
              {!isPro && (
                <button onClick={()=>setShowPaywall(true)} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:12, padding:"8px 14px", cursor:"pointer", textAlign:"right" }}>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", fontFamily:"Barlow" }}>{5-msgCount} msgs gratis</div>
                  <div style={{ fontSize:12, color:"#FFF", fontFamily:"'Barlow Condensed'", fontWeight:700 }}>IR A PRO →</div>
                </button>
              )}
            </div>
          </div>

          {/* Messages — scrollable area */}
          <div ref={chatContainerRef} style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12, minHeight:0 }}>
            {messages.map((msg,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
                {msg.role==="assistant" && (
                  <div style={{ width:32, height:32, borderRadius:10, background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, color:"#FFF" }}>⚡</div>
                )}
                <div style={{ maxWidth:"78%", background:msg.role==="user"?"#2563EB":WHITE, color:msg.role==="user"?"#FFF":TEXT, borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"12px 16px", fontFamily:"Barlow", fontSize:14, lineHeight:1.65, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", whiteSpace:"pre-wrap" }}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#FFF" }}>⚡</div>
                <div style={{ background:WHITE, borderRadius:"18px 18px 18px 4px", padding:"12px 18px", display:"flex", gap:5, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
                  {[0,1,2].map(j=><span key={j} style={{ width:7, height:7, borderRadius:"50%", background:"#2563EB", animation:`pu 1.2s ${j*.2}s infinite`, display:"inline-block" }} />)}
                </div>
              </div>
            )}
            {!isPro && msgCount>=5 && (
              <div style={{ background:"#EFF6FF", border:"1.5px solid #2563EB", borderRadius:16, padding:18, textAlign:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:18, fontWeight:900, marginBottom:6 }}>Límite diario alcanzado</div>
                <div style={{ fontFamily:"Barlow", fontSize:13, color:MUTED, marginBottom:14 }}>Pro = mensajes ilimitados.</div>
                <button onClick={()=>setShowPaywall(true)} style={{ background:"#2563EB", color:"#FFF", border:"none", borderRadius:12, padding:"11px 24px", fontFamily:"'Barlow Condensed'", fontSize:16, fontWeight:900, cursor:"pointer" }}>🅿️ IR A PRO ⚡</button>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height:1 }} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div style={{ padding:"0 14px 8px", display:"flex", gap:8, overflowX:"auto", flexShrink:0 }}>
              {["Dame una rutina","Cómo ganar dinero","Más disciplina","Mejorar con mujeres"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{ background:WHITE, border:`1px solid ${BORD}`, borderRadius:20, color:MUTED, padding:"7px 14px", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"Barlow", flexShrink:0, fontWeight:600, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>{q}</button>
              ))}
            </div>
          )}

          {/* ✅ Input SIEMPRE visible al fondo */}
          <div style={{ padding:"10px 14px 28px", background:WHITE, borderTop:`1px solid ${BORD}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:10, background:BG, border:`1.5px solid ${BORD}`, borderRadius:18, padding:"8px 12px", alignItems:"flex-end" }}>
              <textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(chatInput); } }}
                placeholder="Escribe tu pregunta..."
                rows={1}
                style={{ flex:1, background:"transparent", border:"none", color:TEXT, fontFamily:"Barlow", fontSize:15, lineHeight:1.5, maxHeight:90, overflowY:"auto" }}
              />
              <button
                onClick={() => sendMessage(chatInput)}
                disabled={!chatInput.trim() || loading}
                style={{ background:chatInput.trim()&&!loading?"#2563EB":"#E2E8F0", border:"none", borderRadius:12, width:38, height:38, cursor:chatInput.trim()&&!loading?"pointer":"default", color:chatInput.trim()&&!loading?"#FFF":"#94A3B8", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}
              >↑</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV — se oculta en coach porque coach ocupa toda la pantalla */}
      {tab !== "coach" && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:WHITE, borderTop:`1px solid ${BORD}`, display:"flex", padding:"8px 0 18px", zIndex:100, boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"6px 0", color:tab===item.id?"#2563EB":"#94A3B8", transition:"color 0.2s" }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:9, fontFamily:"'Barlow Condensed'", fontWeight:700, letterSpacing:0.5 }}>{item.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Nav visible también en coach (abajo del input) */}
      {tab === "coach" && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:WHITE, borderTop:`1px solid ${BORD}`, display:"flex", padding:"8px 0 18px", zIndex:5, boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"6px 0", color:tab===item.id?"#2563EB":"#94A3B8", transition:"color 0.2s" }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:9, fontFamily:"'Barlow Condensed'", fontWeight:700, letterSpacing:0.5 }}>{item.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
