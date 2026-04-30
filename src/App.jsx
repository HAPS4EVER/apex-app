import { useState, useRef, useEffect } from "react";

// ─── CONFIGURACIÓN PAYPAL ─────────────────────────────────────────────────────
// 👇 REEMPLAZA ESTOS LINKS CON TUS LINKS REALES DE PAYPAL
const PAYPAL_LINKS = {
  pro:   "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=TU_EMAIL@gmail.com&item_name=APEX+PRO&a3=9.99&p3=1&t3=M&src=1&currency_code=USD",
  elite: "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=TU_EMAIL@gmail.com&item_name=APEX+ELITE&a3=29.99&p3=1&t3=M&src=1&currency_code=USD",
};
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#E8FF00";
const BG = "#080808";
const CARD = "#111111";
const BORDER = "#1E1E1E";

const PLANS = [
  { id:"free",  name:"GRATIS", price:"$0",     period:"",     color:"#555",    features:["5 msgs al coach/día","3 metas activas","Hábitos básicos (3)","Rutina semanal","Reto diario"] },
  { id:"pro",   name:"PRO",    price:"$9.99",  period:"/mes", color:ACCENT,    badge:"MÁS POPULAR", features:["Coach IA ilimitado","Hábitos completos (8)","Calculadora de macros","Metas ilimitadas","Diario personal","Sin restricciones"] },
  { id:"elite", name:"ELITE",  price:"$29.99", period:"/mes", color:"#FF4D00", badge:"MÁXIMO PODER", features:["Todo lo de Pro","Rutinas avanzadas IA","Planes personalizados","Análisis de progreso","Soporte prioritario","Comunidad privada"] },
];

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
  Lunes:     { grupo:"PECHO + TRÍCEPS",  ejercicios:["Press banca 4x8","Press inclinado 3x10","Aperturas 3x12","Fondos 3x12","Extensiones tríceps 3x15"] },
  Martes:    { grupo:"ESPALDA + BÍCEPS", ejercicios:["Dominadas 4x8","Remo con barra 4x10","Jalón al pecho 3x12","Curl barra 4x10","Curl martillo 3x12"] },
  Miércoles: { grupo:"PIERNAS",          ejercicios:["Sentadilla 5x5","Prensa 4x10","Zancadas 3x12","Curl femoral 3x12","Pantorrillas 4x20"] },
  Jueves:    { grupo:"HOMBROS",          ejercicios:["Press militar 4x8","Elevaciones laterales 4x12","Vuelos posteriores 3x15","Encogimientos 4x12","Face pull 3x15"] },
  Viernes:   { grupo:"FULL BODY FUERZA", ejercicios:["Peso muerto 5x5","Press banca 4x6","Dominadas 4x6","Sentadilla frontal 3x8","Plancha 3x60s"] },
  Sábado:    { grupo:"CARDIO + CORE",    ejercicios:["HIIT 20min","Abdominales 4x20","Plancha lateral 3x45s","Mountain climbers 3x30","Saltar cuerda 10min"] },
  Domingo:   { grupo:"DESCANSO ACTIVO",  ejercicios:["Caminata 30min","Estiramiento completo","Foam roller","Movilidad articular","Respiración profunda"] },
};

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const CHALLENGES = ["100 flexiones hoy. Sin excusas.","Ayuno 16h. Disciplina mental.","Habla con un extraño hoy.","Sin azúcar todo el día.","Despierta 1 hora antes.","Escribe tus 3 metas principales.","Sin quejarte en todo el día."];
const SYSTEM_PROMPT = `Eres APEX, coach de élite para hombres. Directo, sin rodeos, brutal honestidad. Fitness, mentalidad, finanzas y relaciones. Español Latino. Máximo 3 párrafos. Siempre 1 acción concreta para HOY.`;

const todayKey  = () => new Date().toISOString().split("T")[0];
const todayName = () => DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

function PaywallModal({ onClose }) {
  const [selected, setSelected] = useState("pro");
  const [clicked,  setClicked]  = useState(false);

  const handlePay = () => {
    setClicked(true);
    window.open(PAYPAL_LINKS[selected], "_blank");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:1000, overflowY:"auto" }}>
      <div style={{ padding:"40px 20px 50px", maxWidth:480, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>⚡</div>
          <div style={{ fontSize:11, letterSpacing:4, color:ACCENT, fontWeight:700, marginBottom:6 }}>DESBLOQUEA TODO</div>
          <div style={{ fontSize:34, fontWeight:900, lineHeight:1 }}>SUBE DE<br /><span style={{ color:ACCENT }}>NIVEL HOY.</span></div>
          <div style={{ fontFamily:"Barlow", fontSize:14, color:"#555", marginTop:10, lineHeight:1.5 }}>Los hombres de élite invierten en sí mismos.</div>
        </div>

        {PLANS.filter(p => p.id !== "free").map(plan => (
          <div key={plan.id} onClick={() => setSelected(plan.id)} style={{ background:selected===plan.id?"#0E0E00":CARD, border:`2px solid ${selected===plan.id?plan.color:BORDER}`, borderRadius:16, padding:"18px 18px", marginBottom:12, cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
            {plan.badge && <div style={{ position:"absolute", top:-10, right:14, background:plan.color, color:"#000", fontSize:9, fontWeight:900, padding:"3px 10px", borderRadius:20, letterSpacing:1 }}>{plan.badge}</div>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${plan.color}`, background:selected===plan.id?plan.color:"transparent", transition:"all 0.2s" }} />
                <span style={{ fontSize:20, fontWeight:900, color:plan.color, letterSpacing:1 }}>{plan.name}</span>
              </div>
              <div><span style={{ fontSize:28, fontWeight:900 }}>{plan.price}</span><span style={{ fontSize:13, color:"#555" }}>{plan.period}</span></div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {plan.features.map(f => <span key={f} style={{ background:"#1A1A1A", borderRadius:20, padding:"4px 10px", fontSize:11, color:"#888", fontFamily:"Barlow" }}>✓ {f}</span>)}
            </div>
          </div>
        ))}

        <button onClick={handlePay} style={{ width:"100%", background:selected==="pro"?ACCENT:"#FF4D00", color:"#000", border:"none", borderRadius:14, padding:"18px 20px", fontFamily:"Barlow Condensed", fontSize:20, fontWeight:900, cursor:"pointer", letterSpacing:2, marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>🅿️</span> PAGAR CON PAYPAL →
        </button>

        {clicked && (
          <div style={{ background:"#0A1A0A", border:"1px solid #00FFB3", borderRadius:12, padding:"14px 16px", marginTop:14, textAlign:"center" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#00FFB3", marginBottom:4 }}>✓ Se abrió PayPal</div>
            <div style={{ fontFamily:"Barlow", fontSize:12, color:"#666", lineHeight:1.5, marginBottom:12 }}>Completa el pago en PayPal. Luego vuelve y toca el botón de abajo.</div>
            <button onClick={onClose} style={{ background:"#00FFB3", color:"#000", border:"none", borderRadius:10, padding:"10px 24px", fontFamily:"Barlow Condensed", fontSize:14, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>
              ✓ YA PAGUÉ — ACTIVAR PLAN
            </button>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:14 }}>
          <div style={{ fontSize:11, color:"#333", fontFamily:"Barlow", marginBottom:10 }}>🔒 Pago seguro vía PayPal · Cancela cuando quieras</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#333", cursor:"pointer", fontFamily:"Barlow", fontSize:13 }}>Continuar gratis por ahora</button>
        </div>
      </div>
    </div>
  );
}

function InstallBanner({ onDismiss }) {
  return (
    <div style={{ background:"#0D0D00", border:`1px solid ${ACCENT}`, borderRadius:14, padding:"12px 14px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
      <div style={{ fontSize:26 }}>📲</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:900, color:ACCENT, marginBottom:2 }}>INSTALAR EN IPHONE</div>
        <div style={{ fontFamily:"Barlow", fontSize:11, color:"#666", lineHeight:1.4 }}>Safari → <strong style={{ color:"#AAA" }}>Compartir</strong> → <strong style={{ color:"#AAA" }}>"Añadir a inicio"</strong></div>
      </div>
      <button onClick={onDismiss} style={{ background:"none", border:"none", color:"#333", cursor:"pointer", fontSize:18 }}>✕</button>
    </div>
  );
}

function LockScreen({ color, feature, onUnlock }) {
  return (
    <div style={{ background:CARD, border:"2px dashed #222", borderRadius:16, padding:34, textAlign:"center" }}>
      <div style={{ fontSize:44, marginBottom:12 }}>🔒</div>
      <div style={{ fontSize:22, fontWeight:900, marginBottom:8, color }}>FUNCIÓN PRO</div>
      <div style={{ fontFamily:"Barlow", fontSize:14, color:"#555", marginBottom:22, lineHeight:1.6 }}>{feature}</div>
      <button onClick={onUnlock} style={{ background:color, color:"#000", border:"none", borderRadius:12, padding:"14px 28px", fontFamily:"Barlow Condensed", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>🅿️ DESBLOQUEAR CON PAYPAL</button>
    </div>
  );
}

export default function Apex() {
  const [tab,           setTab]           = useState("home");
  const [plan,          setPlan]          = useState("free");
  const [showPaywall,   setShowPaywall]   = useState(false);
  const [showInstall,   setShowInstall]   = useState(true);
  const [habits,        setHabits]        = useState({});
  const [goals,         setGoals]         = useState([
    { id:1, text:"Llegar a 80kg de músculo", progress:40 },
    { id:2, text:"Ahorrar $5,000 este año",  progress:25 },
    { id:3, text:"Leer 24 libros",           progress:60 },
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
  const messagesEndRef = useRef(null);

  const isPro     = plan === "pro" || plan === "elite";
  const challenge = CHALLENGES[new Date().getDay()];
  const todayH    = habits[todayKey()] || {};
  const doneCount = Object.values(todayH).filter(Boolean).length;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

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
    setGoals(p => [...p, { id:Date.now(), text:newGoal, progress:0 }]);
    setNewGoal("");
  };

  const saveJournal = () => {
    if (!isPro) { setShowPaywall(true); return; }
    if (!journalEntry.trim()) return;
    setJournal(p => [{ date:new Date().toLocaleDateString("es"), text:journalEntry, mood:journalMood }, ...p]);
    setJournalEntry("");
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (!isPro && msgCount >= 5) { setShowPaywall(true); return; }
    const userMsg = { role:"user", content:text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setChatInput(""); setLoading(true); setMsgCount(c=>c+1);
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYSTEM_PROMPT, messages:newMsgs }) });
      const data = await res.json();
      setMessages([...newMsgs, { role:"assistant", content:data.content?.[0]?.text||"Error." }]);
    } catch { setMessages([...newMsgs, { role:"assistant", content:"Error de conexión." }]); }
    setLoading(false);
  };

  const NavTab = ({ id, icon, label }) => (
    <button onClick={()=>setTab(id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 0", color:tab===id?ACCENT:"#3A3A3A", transition:"color 0.2s" }}>
      <span style={{ fontSize:17 }}>{icon}</span>
      <span style={{ fontSize:8, fontFamily:"Barlow Condensed", fontWeight:700, letterSpacing:0.5 }}>{label}</span>
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:BG, color:"#F0F0F0", fontFamily:"'Barlow Condensed',Impact,sans-serif", maxWidth:480, margin:"0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#222}
        .tap{transition:transform .15s;cursor:pointer}.tap:active{transform:scale(.96)}
        .fade{animation:fi .35s ease}@keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        input,textarea{outline:none}textarea{resize:none}
        .pulse{animation:pu 2s infinite}@keyframes pu{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      {showPaywall && <PaywallModal onClose={()=>{ setShowPaywall(false); setPlan("pro"); }} />}
      {isPro && <div style={{ position:"fixed", top:14, right:16, zIndex:50, background:plan==="elite"?"#FF4D00":ACCENT, color:"#000", fontSize:9, fontWeight:900, padding:"4px 10px", borderRadius:20, letterSpacing:1 }}>{plan.toUpperCase()} ⚡</div>}

      {/* HOME */}
      {tab==="home" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          {showInstall && <InstallBanner onDismiss={()=>setShowInstall(false)} />}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:ACCENT, fontWeight:700, marginBottom:6 }}>APEX PROTOCOL · 🇺🇾</div>
            <div style={{ fontSize:34, fontWeight:900, lineHeight:1 }}>HOY ES EL DÍA<br /><span style={{ color:ACCENT }}>QUE CAMBIA TODO.</span></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
            {[{l:"RACHA",v:streak,c:ACCENT},{l:"HÁBITOS",v:`${doneCount}/${HABITS.length}`,c:"#00FFB3"},{l:"METAS",v:goals.length,c:"#FF4D00"}].map(s=>(
              <div key={s.l} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"14px 10px", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:900, color:s.c, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginTop:3 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${ACCENT}`, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:9, letterSpacing:3, color:"#555", marginBottom:8, fontWeight:700 }}>⚡ RETO DEL DÍA</div>
            <div style={{ fontFamily:"Barlow", fontSize:14, color:"#DDD", lineHeight:1.5, marginBottom:12 }}>{challenge}</div>
            <button className="tap" onClick={()=>{ setChallengeDone(true); setStreak(s=>s+1); }} style={{ background:challengeDone?ACCENT:"transparent", border:`1px solid ${challengeDone?ACCENT:"#333"}`, color:challengeDone?"#000":"#555", borderRadius:8, padding:"7px 16px", fontFamily:"Barlow Condensed", fontWeight:700, fontSize:12, letterSpacing:1, cursor:"pointer" }}>
              {challengeDone?"✓ COMPLETADO":"MARCAR LISTO"}
            </button>
          </div>
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:9, letterSpacing:3, color:"#555", marginBottom:6, fontWeight:700 }}>🏋️ HOY — {todayName().toUpperCase()}</div>
            <div style={{ fontSize:18, fontWeight:900, color:"#FF4D00", marginBottom:8 }}>{GYM_PLAN[todayName()].grupo}</div>
            {GYM_PLAN[todayName()].ejercicios.slice(0,3).map((e,i)=>(
              <div key={i} style={{ fontFamily:"Barlow", fontSize:13, color:"#777", padding:"3px 0" }}><span style={{ color:ACCENT, marginRight:8 }}>{i+1}.</span>{e}</div>
            ))}
            <button onClick={()=>setTab("gym")} style={{ background:"none", border:"none", color:"#444", fontFamily:"Barlow", fontSize:11, cursor:"pointer", marginTop:8 }}>Ver rutina completa →</button>
          </div>
          {!isPro && (
            <button className="tap" onClick={()=>setShowPaywall(true)} style={{ width:"100%", background:`linear-gradient(135deg,${ACCENT},#FFB300)`, color:"#000", border:"none", borderRadius:14, padding:"16px 20px", fontFamily:"Barlow Condensed", fontSize:18, fontWeight:900, cursor:"pointer", letterSpacing:2, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              🅿️ APEX PRO — $9.99/mes con PayPal
            </button>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{icon:"✅",label:"Hábitos",sub:`${doneCount} completados`,t:"habitos",c:"#00FFB3"},{icon:"🎯",label:"Metas",sub:`${goals.length} activas`,t:"metas",c:"#FF4D00"},{icon:"🥩",label:"Macros",sub:isPro?"Calcular":"🔒 Pro",t:"macros",c:"#FFB300"},{icon:"📓",label:"Diario",sub:isPro?`${journal.length} entradas`:"🔒 Pro",t:"diario",c:"#C084FC"}].map(item=>(
              <div key={item.t} className="tap" onClick={()=>setTab(item.t)} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"14px 12px", cursor:"pointer" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{item.icon}</div>
                <div style={{ fontSize:14, fontWeight:900, color:item.c }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize:11, color:"#555", fontFamily:"Barlow", marginTop:2 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HÁBITOS */}
      {tab==="habitos" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:"#00FFB3", fontWeight:700, marginBottom:4 }}>HÁBITOS DIARIOS</div>
            <div style={{ fontSize:30, fontWeight:900, lineHeight:1 }}>LA DISCIPLINA<br /><span style={{ color:"#00FFB3" }}>ES LIBERTAD.</span></div>
          </div>
          <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontFamily:"Barlow", fontSize:13, color:"#777" }}>Progreso hoy</span>
              <span style={{ fontSize:16, fontWeight:900, color:"#00FFB3" }}>{doneCount}/{HABITS.length}</span>
            </div>
            <div style={{ background:"#1A1A1A", borderRadius:4, height:7, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(doneCount/HABITS.length)*100}%`, background:"#00FFB3", borderRadius:4, transition:"width 0.4s" }} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {HABITS.map(h => {
              const done = todayH[h.id]; const locked = h.pro && !isPro;
              return (
                <div key={h.id} className="tap" onClick={()=>toggleHabit(h)} style={{ background:done?"#0D2B1A":CARD, border:`1px solid ${done?"#00FFB3":locked?"#222":BORDER}`, borderRadius:14, padding:"16px 14px", cursor:"pointer", position:"relative", opacity:locked?.7:1 }}>
                  {done   && <div style={{ position:"absolute", top:10, right:12, color:"#00FFB3", fontWeight:900 }}>✓</div>}
                  {locked && <div style={{ position:"absolute", top:10, right:12, fontSize:13 }}>🔒</div>}
                  <div style={{ fontSize:26, marginBottom:6 }}>{h.icon}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:done?"#00FFB3":locked?"#444":"#DDD" }}>{h.label}</div>
                </div>
              );
            })}
          </div>
          {!isPro && <button className="tap" onClick={()=>setShowPaywall(true)} style={{ width:"100%", background:"#00FFB3", color:"#000", border:"none", borderRadius:14, padding:14, fontFamily:"Barlow Condensed", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1, marginTop:16 }}>🅿️ DESBLOQUEAR HÁBITOS PRO</button>}
        </div>
      )}

      {/* GYM */}
      {tab==="gym" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:"#FF4D00", fontWeight:700, marginBottom:4 }}>PLAN SEMANAL</div>
            <div style={{ fontSize:30, fontWeight:900, lineHeight:1 }}>RUTINA<br /><span style={{ color:"#FF4D00" }}>DE ÉLITE.</span></div>
          </div>
          {DAYS.map(day => {
            const isToday = day===todayName(); const p = GYM_PLAN[day];
            return (
              <div key={day} style={{ background:isToday?"#1A0800":CARD, border:`1px solid ${isToday?"#FF4D00":BORDER}`, borderRadius:14, padding:"13px 16px", marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:isToday?10:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14, fontWeight:900, color:isToday?"#FF4D00":"#CCC", letterSpacing:1 }}>{day.toUpperCase()}</span>
                    {isToday && <span style={{ fontSize:9, background:"#FF4D00", color:"#000", padding:"2px 7px", borderRadius:20, fontWeight:900 }}>HOY</span>}
                  </div>
                  <span style={{ fontSize:11, color:"#555", fontFamily:"Barlow" }}>{p.grupo}</span>
                </div>
                {isToday && p.ejercicios.map((e,i)=>(
                  <div key={i} style={{ fontFamily:"Barlow", fontSize:13, color:"#999", padding:"4px 0", borderBottom:i<p.ejercicios.length-1?"1px solid #1E0A00":"none" }}>
                    <span style={{ color:"#FF4D00", marginRight:8 }}>›</span>{e}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* MACROS */}
      {tab==="macros" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:"#FFB300", fontWeight:700, marginBottom:4 }}>NUTRICIÓN</div>
            <div style={{ fontSize:30, fontWeight:900, lineHeight:1 }}>COME PARA<br /><span style={{ color:"#FFB300" }}>GANAR.</span></div>
          </div>
          {!isPro ? <LockScreen color="#FFB300" feature="Calcula tus calorías y macros exactos según tu peso, altura y objetivo." onUnlock={()=>setShowPaywall(true)} /> : (
            <>
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:16, marginBottom:14 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  {[["PESO (kg)","75",weight,setWeight],["ALTURA (cm)","178",height,setHeight]].map(([lbl,ph,val,set])=>(
                    <div key={lbl}>
                      <div style={{ fontSize:10, letterSpacing:2, color:"#555", marginBottom:6 }}>{lbl}</div>
                      <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type="number" style={{ width:"100%", background:"#161616", border:`1px solid ${BORDER}`, borderRadius:10, color:"#FFF", padding:"10px 14px", fontSize:16, fontFamily:"Barlow Condensed", fontWeight:700 }} />
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  {[["muscle","🏋️ Músculo"],["cut","🔥 Definición"],["maint","⚖️ Mantener"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setGoalMacro(v)} style={{ flex:1, background:goalMacro===v?"#FFB300":"#161616", border:`1px solid ${goalMacro===v?"#FFB300":BORDER}`, color:goalMacro===v?"#000":"#777", borderRadius:10, padding:"8px 4px", fontSize:11, fontFamily:"Barlow Condensed", fontWeight:700, cursor:"pointer" }}>{l}</button>
                  ))}
                </div>
                <button className="tap" onClick={calcMacros} style={{ width:"100%", background:"#FFB300", color:"#000", border:"none", borderRadius:10, padding:13, fontFamily:"Barlow Condensed", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>CALCULAR</button>
              </div>
              {macros && (
                <div className="fade" style={{ background:CARD, border:"1px solid #FFB300", borderRadius:14, padding:16 }}>
                  <div style={{ fontSize:11, letterSpacing:3, color:"#FFB300", marginBottom:12, fontWeight:700 }}>TUS MACROS DIARIOS</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[{l:"CALORÍAS",v:macros.cal,u:"kcal",c:"#FFB300"},{l:"PROTEÍNA",v:macros.p,u:"g",c:"#FF4D00"},{l:"CARBOS",v:macros.c,u:"g",c:ACCENT},{l:"GRASAS",v:macros.f,u:"g",c:"#00FFB3"}].map(m=>(
                      <div key={m.l} style={{ background:"#161616", borderRadius:12, padding:"13px 12px" }}>
                        <div style={{ fontSize:26, fontWeight:900, color:m.c, lineHeight:1 }}>{m.v}<span style={{ fontSize:11 }}>{m.u}</span></div>
                        <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginTop:3 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* METAS */}
      {tab==="metas" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:"#FF4D00", fontWeight:700, marginBottom:4 }}>SISTEMA DE METAS</div>
            <div style={{ fontSize:30, fontWeight:900, lineHeight:1 }}>SIN META<br /><span style={{ color:"#FF4D00" }}>NO HAY RUMBO.</span></div>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <input value={newGoal} onChange={e=>setNewGoal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGoal()} placeholder={!isPro&&goals.length>=3?"🔒 Pro = metas ilimitadas":"Nueva meta..."} style={{ flex:1, background:CARD, border:`1px solid ${BORDER}`, borderRadius:10, color:"#FFF", padding:"10px 14px", fontSize:14, fontFamily:"Barlow" }} />
            <button className="tap" onClick={addGoal} style={{ background:"#FF4D00", border:"none", borderRadius:10, width:44, height:44, fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
          </div>
          {!isPro && <div style={{ fontFamily:"Barlow", fontSize:11, color:"#333", marginBottom:12, textAlign:"center" }}>Gratis: máx 3 · <span style={{ color:ACCENT, cursor:"pointer" }} onClick={()=>setShowPaywall(true)}>Pro = ilimitadas →</span></div>}
          {goals.map(g=>(
            <div key={g.id} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"13px 14px", marginBottom:10 }}>
              <div style={{ fontFamily:"Barlow", fontSize:14, color:"#DDD", marginBottom:10 }}>{g.text}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ flex:1, background:"#1A1A1A", borderRadius:4, height:6, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${g.progress}%`, background:g.progress>=100?"#00FFB3":"#FF4D00", borderRadius:4, transition:"width 0.3s" }} />
                </div>
                <span style={{ fontSize:14, fontWeight:900, color:"#FF4D00", minWidth:34 }}>{g.progress}%</span>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {[0,25,50,75,100].map(v=>(
                  <button key={v} onClick={()=>setGoals(p=>p.map(x=>x.id===g.id?{...x,progress:v}:x))} style={{ flex:1, background:g.progress===v?"#FF4D00":"#161616", border:`1px solid ${g.progress===v?"#FF4D00":BORDER}`, color:g.progress===v?"#000":"#555", borderRadius:6, padding:"5px 0", fontSize:10, cursor:"pointer", fontFamily:"Barlow Condensed", fontWeight:700 }}>{v}%</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIARIO */}
      {tab==="diario" && (
        <div className="fade" style={{ padding:"44px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, letterSpacing:4, color:"#C084FC", fontWeight:700, marginBottom:4 }}>DIARIO PERSONAL</div>
            <div style={{ fontSize:30, fontWeight:900, lineHeight:1 }}>REFLEXIONA,<br /><span style={{ color:"#C084FC" }}>EVOLUCIONA.</span></div>
          </div>
          {!isPro ? <LockScreen color="#C084FC" feature="Registra tus pensamientos, logros y reflexiones diarias con seguimiento de estado de ánimo." onUnlock={()=>setShowPaywall(true)} /> : (
            <>
              <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:16, marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  {["😤","😐","😊","💪","🔥"].map((e,i)=>(
                    <button key={i} onClick={()=>setJournalMood(i+1)} style={{ background:journalMood===i+1?"#1D0A2B":"transparent", border:`1px solid ${journalMood===i+1?"#C084FC":BORDER}`, borderRadius:10, padding:"8px 10px", fontSize:20, cursor:"pointer" }}>{e}</button>
                  ))}
                </div>
                <textarea value={journalEntry} onChange={e=>setJournalEntry(e.target.value)} placeholder="¿Qué pasó hoy? ¿Qué aprendiste? ¿Qué mejorarás mañana?" rows={4} style={{ width:"100%", background:"#161616", border:`1px solid ${BORDER}`, borderRadius:10, color:"#DDD", padding:"12px 14px", fontSize:14, fontFamily:"Barlow", lineHeight:1.6, marginBottom:10 }} />
                <button className="tap" onClick={saveJournal} style={{ width:"100%", background:"#C084FC", color:"#000", border:"none", borderRadius:10, padding:12, fontFamily:"Barlow Condensed", fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:1 }}>GUARDAR</button>
              </div>
              {journal.length===0 && <div style={{ textAlign:"center", color:"#333", fontFamily:"Barlow", fontSize:14, padding:20 }}>Aún no hay entradas. Empieza hoy.</div>}
              {journal.map((entry,i)=>(
                <div key={i} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:"12px 14px", marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:10, color:"#555", letterSpacing:2 }}>{entry.date}</span>
                    <span style={{ fontSize:16 }}>{"😤😐😊💪🔥"[entry.mood-1]}</span>
                  </div>
                  <div style={{ fontFamily:"Barlow", fontSize:13, color:"#888", lineHeight:1.5 }}>{entry.text}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* COACH */}
      {tab==="coach" && (
        <div style={{ display:"flex", flexDirection:"column", height:"100vh" }}>
          <div style={{ padding:"40px 18px 14px", borderBottom:`1px solid ${BORDER}`, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"#1A1A00", border:`2px solid ${ACCENT}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, letterSpacing:1 }}>APEX COACH</div>
                  <div style={{ fontSize:10, color:"#444", fontFamily:"Barlow", display:"flex", alignItems:"center", gap:4 }}><span className="pulse" style={{ color:"#22CC66" }}>●</span> En línea 24/7</div>
                </div>
              </div>
              {!isPro && (
                <button onClick={()=>setShowPaywall(true)} style={{ background:"#141400", border:`1px solid ${ACCENT}`, borderRadius:10, padding:"6px 12px", cursor:"pointer", textAlign:"right" }}>
                  <div style={{ fontSize:10, color:"#666", fontFamily:"Barlow" }}>{5-msgCount} gratis</div>
                  <div style={{ fontSize:11, color:ACCENT, fontFamily:"Barlow Condensed", fontWeight:700 }}>IR A PRO →</div>
                </button>
              )}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>
            {messages.map((msg,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
                {msg.role==="assistant" && <div style={{ width:28, height:28, borderRadius:8, background:"#1A1A00", border:`1px solid ${ACCENT}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, marginRight:8, marginTop:2 }}>⚡</div>}
                <div style={{ maxWidth:"80%", background:msg.role==="user"?ACCENT:"#141414", color:msg.role==="user"?"#000":"#DDD", borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontFamily:"Barlow", fontSize:14, lineHeight:1.6, border:msg.role==="assistant"?`1px solid ${BORDER}`:"none", whiteSpace:"pre-wrap" }}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:28, height:28, borderRadius:8, background:"#1A1A00", border:`1px solid ${ACCENT}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>⚡</div>
                <div style={{ background:"#141414", border:`1px solid ${BORDER}`, borderRadius:14, padding:"10px 14px", display:"flex", gap:5 }}>
                  {[0,1,2].map(j=><span key={j} style={{ width:6, height:6, borderRadius:"50%", background:ACCENT, animation:`pu 1.2s ${j*.2}s infinite`, display:"inline-block" }} />)}
                </div>
              </div>
            )}
            {!isPro && msgCount>=5 && (
              <div className="fade" style={{ background:"#141400", border:`1px solid ${ACCENT}`, borderRadius:14, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:15, fontWeight:900, marginBottom:6 }}>Límite diario alcanzado</div>
                <div style={{ fontFamily:"Barlow", fontSize:13, color:"#777", marginBottom:12 }}>Pro = mensajes ilimitados.</div>
                <button onClick={()=>setShowPaywall(true)} style={{ background:ACCENT, color:"#000", border:"none", borderRadius:10, padding:"10px 22px", fontFamily:"Barlow Condensed", fontSize:15, fontWeight:900, cursor:"pointer" }}>🅿️ PAGAR CON PAYPAL ⚡</button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length<=2 && (
            <div style={{ padding:"0 16px 8px", display:"flex", gap:8, overflowX:"auto", flexShrink:0 }}>
              {["Dame una rutina","Cómo ganar dinero","Más disciplina","Mejorar con mujeres"].map(q=>(
                <button key={q} onClick={()=>sendMessage(q)} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, color:"#666", padding:"6px 12px", fontSize:11, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"Barlow", flexShrink:0 }}>{q}</button>
              ))}
            </div>
          )}
          <div style={{ padding:"10px 16px 28px", background:BG, borderTop:`1px solid ${BORDER}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:10, background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:"8px 12px", alignItems:"flex-end" }}>
              <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(chatInput);}}} placeholder="Pregunta sin filtros..." rows={1} style={{ flex:1, background:"transparent", border:"none", color:"#E0E0E0", fontFamily:"Barlow", fontSize:14, lineHeight:1.5, maxHeight:90, overflowY:"auto" }} />
              <button onClick={()=>sendMessage(chatInput)} disabled={!chatInput.trim()||loading} style={{ background:chatInput.trim()&&!loading?ACCENT:"#1E1E1E", border:"none", borderRadius:10, width:36, height:36, cursor:chatInput.trim()&&!loading?"pointer":"default", color:chatInput.trim()&&!loading?"#000":"#444", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}>↑</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"#0A0A0A", borderTop:`1px solid ${BORDER}`, display:"flex", padding:"6px 0 18px", zIndex:100 }}>
        <NavTab id="home"    icon="🏠" label="INICIO"  />
        <NavTab id="habitos" icon="✅" label="HÁBITOS" />
        <NavTab id="gym"     icon="🏋️" label="GYM"    />
        <NavTab id="macros"  icon="🥩" label="MACROS"  />
        <NavTab id="metas"   icon="🎯" label="METAS"   />
        <NavTab id="diario"  icon="📓" label="DIARIO"  />
        <NavTab id="coach"   icon="⚡" label="COACH"   />
      </div>
    </div>
  );
}