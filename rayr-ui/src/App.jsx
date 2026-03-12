import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine
} from "recharts";

/* ═══════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════ */
const C = {
  bg:"#06080F", surface:"#0A0F1C", card:"#0D1422", border:"#182030",
  borderMd:"#1E2D45", text:"#E4E8F2", textSub:"#7A8BA8", textDim:"#3D4E6A",
  gold:"#D4A755", goldDim:"rgba(212,167,85,0.10)",
  amber:"#F59E0B", amberDim:"rgba(245,158,11,0.10)",
  green:"#22C55E", greenDim:"rgba(34,197,94,0.08)",
  red:"#EF4444", redDim:"rgba(239,68,68,0.08)",
  blue:"#3B82F6", blueDim:"rgba(59,130,246,0.08)",
  teal:"#14B8A6", purple:"#A855F7",
  palette:["#D4A755","#14B8A6","#3B82F6","#A855F7","#F59E0B","#EF4444","#22C55E","#EC4899"],
};

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;overflow-x:hidden}
    body{background:#06080F;font-family:'Outfit',sans-serif}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1E2D45;border-radius:2px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
    @keyframes toastIn{0%{opacity:0;transform:translateX(110%)}8%{opacity:1;transform:translateX(0)}88%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(110%)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:1}}
    .fu{animation:fadeUp 0.38s ease both}
    .fu1{animation:fadeUp 0.38s 0.07s ease both}
    .fu2{animation:fadeUp 0.38s 0.14s ease both}
    .fu3{animation:fadeUp 0.38s 0.21s ease both}
    .sc{animation:scaleIn 0.32s ease both}
    .ch:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,0,0,0.45)}
    .ch{transition:transform 0.18s,box-shadow 0.18s,border-color 0.18s}
    .ni{transition:all 0.14s}
    .ni:hover{background:rgba(212,167,85,0.07)!important}
    input:focus,select:focus,textarea:focus{outline:none;border-color:#D4A755!important;box-shadow:0 0 0 2px rgba(212,167,85,0.14)}
    input[type=number]::-webkit-inner-spin-button{opacity:0.3}
    input[type=range]{accent-color:#D4A755}
    .blur-nums .blur-target{filter:blur(8px);transition:filter 0.2s}
    option{background:#0D1422;color:#E4E8F2}
    @media(max-width:768px){
      .sidebar-desktop{display:none!important}
      .main-padded{margin-left:0!important;padding:20px 14px 88px!important;width:100vw!important;box-sizing:border-box!important}
      .mobile-nav{display:flex!important}
      .page-grid-2{grid-template-columns:1fr!important}
      .stat-grid{grid-template-columns:1fr 1fr!important}
      .content-inner{max-width:100%!important}
    }
    @media(min-width:769px){
      .mobile-nav{display:none!important}
      .main-padded{margin-left:230px}
      .content-inner{max-width:1100px;margin:0 auto}
    }
    @media(min-width:1400px){
      .content-inner{max-width:1200px}
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
let _toast = () => {};
const toast = (msg, type = "info") => _toast(msg, type);
const Toasts = () => {
  const [list, setList] = useState([]);
  _toast = (msg, type) => {
    const id = Date.now() + Math.random();
    setList(l => [...l, { id, msg, type }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 3500);
  };
  const colors = { success: C.green, warn: C.amber, error: C.red, info: C.blue };
  return (
    <div style={{ position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none" }}>
      {list.map(t => (
        <div key={t.id} style={{ background:C.card,border:`1px solid ${(colors[t.type]||C.blue)}40`,borderLeft:`3px solid ${colors[t.type]||C.blue}`,borderRadius:10,padding:"11px 16px",fontSize:13,color:C.text,fontFamily:"'Outfit',sans-serif",boxShadow:"0 8px 28px rgba(0,0,0,0.5)",animation:"toastIn 3.5s ease forwards",minWidth:240,maxWidth:320 }}>{t.msg}</div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ERROR BOUNDARY — catches crashes, shows friendly message
═══════════════════════════════════════════════════════ */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) {
      return (
        <div style={{padding:40,textAlign:"center",fontFamily:"'Outfit',sans-serif"}}>
          <div style={{fontSize:32,marginBottom:12}}>⚠️</div>
          <div style={{fontSize:18,color:"#E4E8F2",marginBottom:8}}>Something went wrong</div>
          <div style={{fontSize:12,color:"#7A8BA8",marginBottom:20}}>{this.state.err.message}</div>
          <button onClick={()=>{ this.setState({err:null}); window.location.reload(); }}
            style={{background:"#D4A755",border:"none",borderRadius:9,padding:"10px 24px",fontSize:13,fontWeight:600,color:"#06080F",cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
            Reload RAYR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem("rayr_" + k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem("rayr_" + k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem("rayr_" + k); } catch {} },
};

/* ═══════════════════════════════════════════════════════
   AMFI NAV API  (free, no key, CORS-open)
   https://api.mfapi.in
═══════════════════════════════════════════════════════ */
const AMFI = {
  search: async (q) => {
    if (!q || q.length < 3) return [];
    try {
      const r = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(q)}`);
      if (!r.ok) return [];
      const data = await r.json();
      return (data || []).slice(0, 8).map(f => ({ code: f.schemeCode, name: f.schemeName }));
    } catch { return []; }
  },
  nav: async (code) => {
    try {
      const r = await fetch(`https://api.mfapi.in/mf/${code}/latest`);
      if (!r.ok) return null;
      const data = await r.json();
      return data?.data?.[0]?.nav ? parseFloat(data.data[0].nav) : null;
    } catch { return null; }
  },
};

/* ═══════════════════════════════════════════════════════
   GROQ AI
═══════════════════════════════════════════════════════ */
const Groq = {
  chat: async (apiKey, messages, system) => {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });
    if (!r.ok) throw new Error(`Groq error: ${r.status}`);
    const data = await r.json();
    return data.choices?.[0]?.message?.content || "No response";
  },
};

/* ═══════════════════════════════════════════════════════
   MONTE CARLO ENGINE
═══════════════════════════════════════════════════════ */
function normalRandom() {
  const u1 = Math.max(1e-10, Math.random());
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function runMonteCarlo(startValue, monthlySIP, years, annualReturn, annualVol, sims = 800) {
  const mr = annualReturn / 12;
  const mv = annualVol / Math.sqrt(12);
  const paths = [];
  for (let s = 0; s < sims; s++) {
    let v = startValue;
    const path = [v];
    for (let m = 0; m < years * 12; m++) {
      v = v * (1 + mr + mv * normalRandom()) + monthlySIP;
      if ((m + 1) % 12 === 0) path.push(Math.max(0, v));
    }
    paths.push(path);
  }
  const result = [];
  for (let y = 0; y <= years; y++) {
    const vals = paths.map(p => p[y]).sort((a, b) => a - b);
    const pct = (p) => vals[Math.floor(p * (sims - 1))];
    result.push({ year: y, p10: pct(0.10), p25: pct(0.25), p50: pct(0.50), p75: pct(0.75), p90: pct(0.90) });
  }
  return { chart: result, raw: paths };
}

function mcProbability(paths, targetValue) {
  const final = paths.map(p => p[p.length - 1]);
  const above = final.filter(v => v >= targetValue).length;
  return Math.round(above / final.length * 100);
}

/* ═══════════════════════════════════════════════════════
   PORTFOLIO ENGINE
═══════════════════════════════════════════════════════ */
function buildPortfolio(holdings, sip) {
  const total = holdings.reduce((s, h) => s + (parseFloat(h.value) || 0), 0);
  if (total === 0) return null;
  const rows = holdings.map(h => ({
    ...h, value: parseFloat(h.value) || 0,
    weight: +((parseFloat(h.value) || 0) / total * 100).toFixed(1),
    expRatio: parseFloat(h.expRatio) || 0,
    buyPrice: parseFloat(h.buyPrice) || 0,
    units: parseFloat(h.units) || 0,
    purchaseDate: h.purchaseDate || null,
    schemeCode: h.schemeCode || null,
    liveNav: h.liveNav || null,
  }));
  // Gain: use actual buy price if available, else show N/A
  const hasRealCost = rows.some(h => h.buyPrice > 0 && h.units > 0);
  const totalCost = hasRealCost
    ? rows.reduce((s,h) => s + (h.buyPrice > 0 && h.units > 0 ? h.buyPrice * h.units : h.value), 0)
    : null;
  const gain = totalCost ? total - totalCost : null;
  const gainPct = totalCost ? +((gain / totalCost) * 100).toFixed(1) : null;
  const secMap = {};
  rows.forEach(h => { const k = h.sector || "Other"; secMap[k] = +(((secMap[k] || 0) + h.weight)).toFixed(1); });
  const sectorData = Object.entries(secMap).map(([name, v]) => ({ name, value: +v })).sort((a, b) => b.value - a.value);
  const typeMap = {};
  rows.forEach(h => { const k = h.type || "MF"; typeMap[k] = +(((typeMap[k] || 0) + h.weight)).toFixed(1); });
  const assetData = Object.entries(typeMap).map(([name, value]) => ({ name, value: +value }));
  const nH = rows.length;
  const nS = Object.keys(secMap).length;
  const maxW = Math.max(...rows.map(h => h.weight));
  const topHolding = rows.find(h => h.weight === maxW);
  const hasD = rows.some(h => ["debt","bond"].some(w => (h.sector||"").toLowerCase().includes(w) || (h.type||"").toLowerCase() === "bond"));
  const avgEx = rows.filter(h => h.expRatio > 0).reduce((s, h) => s + h.expRatio * (h.weight / 100), 0);
  let sc = 38;
  sc += Math.min(18, nH * 3);
  sc += Math.min(15, nS * 3);
  if (maxW < 25) sc += 13; else if (maxW < 35) sc += 7;
  if (hasD) sc += 9;
  if (avgEx === 0 || avgEx < 0.5) sc += 10; else if (avgEx < 1.0) sc += 6; else sc += 2;
  sc = Math.min(93, Math.max(28, Math.round(sc)));
  const healthLabel = sc >= 80 ? "Excellent" : sc >= 70 ? "Good" : sc >= 55 ? "Fair" : "Needs Attention";
  const ms = sip || 10000;
  const sipData = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map((m, i) => ({
    month: m, invested: ms * (i+1),
    value: Math.round(ms * (i+1) * (1 + 0.009*(i+1))),
  }));
  const projData = Array.from({ length: 20 }, (_, i) => {
    const y = i + 1;
    const fd = Math.round(ms * 12 * ((Math.pow(1.07, y) - 1) / 0.07) * 1.07);
    return { y:`Y${y}`, fd, moderate: Math.round(ms * 12 * ((Math.pow(1.12, y) - 1) / 0.12) * 1.12), aggressive: Math.round(ms * 12 * ((Math.pow(1.16, y) - 1) / 0.16) * 1.16) };
  });
  const eqWt = rows.filter(h => !["bond","debt"].some(w => (h.sector||h.type||"").toLowerCase().includes(w))).reduce((s, h) => s + h.weight, 0);
  const stressData = [
    { name:"Nifty -20%", impact:+(-eqWt*0.12).toFixed(1), emoji:"📉", desc:"Broad equity selloff", prob:"Low (3–5% chance/yr)" },
    { name:"Banking crisis", impact:+(-((secMap["Banking"]||0)*0.16)).toFixed(1), emoji:"🏦", desc:"Banking sector shock", prob:"Very Low" },
    { name:"Rate hike +2%", impact:+(-(hasD?4.4:1.2)).toFixed(1), emoji:"📈", desc:"Bond prices fall", prob:"Medium" },
    { name:"Rupee -15%", impact:+((secMap["Technology"]||secMap["IT"]||0)*0.04).toFixed(1), emoji:"💱", desc:"IT/export stocks gain", prob:"Low" },
    { name:"Global recession", impact:+(-eqWt*0.19).toFixed(1), emoji:"🌍", desc:"Worst-case scenario", prob:"Very Low" },
    { name:"Inflation +5%", impact:-3.8, emoji:"🔥", desc:"Purchasing power loss", prob:"Medium" },
  ];
  const radarData = [
    { s:"Diversification", you:Math.min(90,nH*12), ideal:75 },
    { s:"Sector spread", you:Math.min(88,nS*14), ideal:72 },
    { s:"Debt cushion", you:hasD?70:18, ideal:65 },
    { s:"Cost efficiency", you:avgEx<0.5?88:avgEx<1?70:50, ideal:78 },
    { s:"Concentration", you:maxW<25?85:maxW<35?60:35, ideal:70 },
    { s:"Return quality", you:68, ideal:70 },
  ];
  const recs = [];
  if (!hasD) recs.push({ p:"High", action:"Add a debt fund", detail:"You have zero debt. When equity drops 25%, debt drops 1–2%. That cushion stops panic-selling — the #1 wealth destroyer.", impact:`₹${Math.round(total*0.15).toLocaleString("en-IN")} at 15% target` });
  if (maxW > 30 && topHolding) recs.push({ p:"High", action:`Trim ${topHolding.name}`, detail:`At ${maxW.toFixed(0)}% weight, one bad quarter hits you disproportionately. Target under 20%.`, impact:`Reduce by ₹${Math.round(total*(maxW-20)/100).toLocaleString("en-IN")}` });
  if (nS < 4) recs.push({ p:"Medium", action:"Add more sectors", detail:`Only ${nS} sector(s). A single sector event moves your entire portfolio. Target 5–7 distinct sectors.`, impact:"Lower sector risk" });
  if (avgEx > 1.0) recs.push({ p:"Low", action:"Switch to direct plans", detail:`Blended expense ratio: ${avgEx.toFixed(2)}%. Direct plans are 0.5–0.7% cheaper. On ₹${Math.round(total/100000).toFixed(0)}L portfolio that is real money.`, impact:`~₹${Math.round(total*(avgEx-0.75)/100).toLocaleString("en-IN")}/yr saved` });
  if (recs.length === 0) recs.push({ p:"Good", action:"Portfolio is well-structured", detail:"You have good diversification, a debt cushion, and reasonable costs. Keep SIPs running and review annually.", impact:"Stay the course" });
  return { rows, total, invested: totalCost ? +totalCost.toFixed(0) : null, gain, gainPct, hasRealCost, healthScore:sc, healthLabel, sectorData, assetData, sipData, projData, stressData, radarData, recs, nH, avgEx, hasD, maxW, isDemo:false };
}

/* Demo portfolio */
const DEMO_P = (() => {
  const h = [
    {name:"HDFC Flexi Cap Fund",type:"MF",value:182000,sector:"Diversified",expRatio:0.89},
    {name:"Mirae Asset Large Cap",type:"MF",value:156000,sector:"Large Cap",expRatio:0.55},
    {name:"Axis Small Cap Fund",type:"MF",value:98000,sector:"Small Cap",expRatio:1.20},
    {name:"SBI Banking ETF",type:"ETF",value:124000,sector:"Banking",expRatio:0.18},
    {name:"ICICI Pru Technology",type:"MF",value:87000,sector:"Technology",expRatio:1.15},
    {name:"Nippon India Gold ETF",type:"ETF",value:65000,sector:"Commodities",expRatio:0.12},
    {name:"Kotak Bond Fund",type:"Bond",value:89250,sector:"Debt",expRatio:0.42},
    {name:"Reliance Industries",type:"Stock",value:46000,sector:"Energy",expRatio:0},
  ];
  const p = buildPortfolio(h, 25000);
  return { ...p, total:847250, invested:724500, gain:122750, gainPct:16.9, hasRealCost:true, healthScore:72, healthLabel:"Good", isDemo:true };
})();

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const fmt  = n => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtK = n => n >= 10000000 ? "₹"+(n/10000000).toFixed(1)+"Cr" : n >= 100000 ? "₹"+(n/100000).toFixed(1)+"L" : fmt(n);

const Ring = ({ score, size=160 }) => {
  const r = size * 0.38, circ = 2*Math.PI*r, offset = circ - (score/100)*circ;
  const color = score>=80?C.green:score>=65?C.gold:score>=50?C.amber:C.red;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={10}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeDasharray={circ} style={{strokeDashoffset:offset,transform:"rotate(-90deg)",transformOrigin:"50% 50%",transition:"stroke-dashoffset 1.2s ease"}}/>
      <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" style={{fill:color,fontSize:size*0.22,fontWeight:700,fontFamily:"'Cormorant Garamond',serif"}}>{score}</text>
      <text x="50%" y="66%" dominantBaseline="middle" textAnchor="middle" style={{fill:C.textSub,fontSize:size*0.09,fontFamily:"'Outfit',sans-serif"}}>/100</text>
    </svg>
  );
};

const SH = ({ title, sub }) => (
  <div className="fu" style={{marginBottom:24}}>
    <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text,letterSpacing:"-0.02em",lineHeight:1}}>{title}</h2>
    {sub && <p style={{fontSize:13,color:C.textSub,marginTop:5,lineHeight:1.6}}>{sub}</p>}
  </div>
);

const Card = ({ children, style={}, className="" }) => (
  <div className={"ch "+className} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,...style}}>{children}</div>
);

const TT = ({ active, payload, label, money }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#111827",border:`1px solid ${C.borderMd}`,borderRadius:9,padding:"9px 13px",fontFamily:"'Outfit',sans-serif",fontSize:12}}>
      <div style={{color:C.textSub,marginBottom:5}}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{display:"flex",justifyContent:"space-between",gap:14,color:p.color||C.gold,marginBottom:2}}>
          <span style={{color:C.textSub}}>{p.name}</span>
          <strong>{money ? fmtK(p.value) : p.value+"%"}</strong>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   DEMO BANNER
═══════════════════════════════════════════════════════ */
const DemoBanner = ({ onReset }) => (
  <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.28)",borderRadius:10,padding:"10px 16px",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
    <span style={{fontSize:12,color:C.amber}}><strong>Demo Mode</strong><span style={{color:C.textSub}}> — Viewing a sample portfolio. Numbers shown are not real.</span></span>
    <button onClick={onReset} style={{background:C.amber,border:"none",borderRadius:7,padding:"6px 14px",fontSize:11,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer",whiteSpace:"nowrap"}}>Enter My Portfolio →</button>
  </div>
);

/* ═══════════════════════════════════════════════════════
   FUND SEARCH INPUT (AMFI powered)
═══════════════════════════════════════════════════════ */
const FundSearch = ({ value, onChange, onSelect, placeholder, style }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!value || value.length < 3) { setResults([]); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      const r = await AMFI.search(value);
      setResults(r);
      setLoading(false);
      setOpen(r.length > 0);
    }, 400);
    return () => clearTimeout(timer.current);
  }, [value]);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} style={{position:"relative"}}>
      <input
        style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:9,padding:"10px 12px",fontSize:13,color:C.text,width:"100%",fontFamily:"'Outfit',sans-serif",...style}}
        placeholder={placeholder || "Type fund name..."}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {loading && <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",width:14,height:14,border:`2px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
      {open && results.length > 0 && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:9,marginTop:3,zIndex:1000,maxHeight:220,overflowY:"auto",boxShadow:"0 12px 40px rgba(0,0,0,0.6)"}}>
          {results.map((f, i) => (
            <div key={i} onClick={() => { onSelect(f); setOpen(false); }}
              style={{padding:"10px 14px",fontSize:12,color:C.textSub,cursor:"pointer",borderBottom:`1px solid ${C.border}`,lineHeight:1.4}}
              onMouseEnter={e => e.currentTarget.style.background=C.goldDim}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{color:C.text,fontSize:12,fontWeight:500}}>{f.name}</div>
              <div style={{fontSize:10,color:C.textDim,marginTop:2}}>Code: {f.code} · AMFI verified ✓</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ONBOARDING — 3 steps
═══════════════════════════════════════════════════════ */
const Onboarding = ({ onDone }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [age,  setAge]  = useState("");
  const [risk, setRisk] = useState("Moderate");
  const [sip,  setSip]  = useState("");
  const BLANK = { name:"",type:"MF",value:"",sector:"",expRatio:"",units:"",buyPrice:"",purchaseDate:"",schemeCode:null,liveNav:null };
  const [rows, setRows] = useState([{...BLANK},{...BLANK}]);
  const [navLoading, setNavLoading] = useState({});

  const SECTORS = ["Diversified","Large Cap","Mid Cap","Small Cap","Banking","Technology","Healthcare","FMCG","Energy","Commodities","Debt","International","Pharma","Auto","PSU"];
  const TYPES   = ["MF","ETF","Stock","Bond","Other"];

  const F = {background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:9,padding:"10px 13px",fontSize:13,color:C.text,width:"100%",fontFamily:"'Outfit',sans-serif"};

  const addRow    = () => setRows(r => [...r, {...BLANK}]);
  const delRow    = i  => rows.length > 1 && setRows(r => r.filter((_,j) => j !== i));
  const upd       = (i, k, v) => setRows(r => r.map((row,j) => j===i ? {...row,[k]:v} : row));

  const onFundSelect = async (i, fund) => {
    upd(i, "name", fund.name);
    upd(i, "schemeCode", fund.code);
    setNavLoading(l => ({...l,[i]:true}));
    const nav = await AMFI.nav(fund.code);
    setNavLoading(l => ({...l,[i]:false}));
    if (nav) {
      upd(i, "liveNav", nav);
      toast(`Live NAV loaded: ₹${nav} (AMFI)`, "success");
    }
  };

  const submit = (useDemo) => {
    const user = { name:name.trim()||"Investor", city:city.trim()||"India", riskProfile:risk, monthlySIP:parseInt(sip)||10000, age:parseInt(age)||30 };
    if (useDemo) { onDone({ user, P: DEMO_P }); return; }
    const valid = rows.filter(r => r.name.trim() && parseFloat(r.value) > 0);
    if (!valid.length) { toast("Add at least one holding with a value","warn"); return; }
    const P = buildPortfolio(valid, parseInt(sip)||10000);
    if (!P) { toast("Could not compute portfolio. Check values.","error"); return; }
    LS.set("portfolio", valid);
    LS.set("user", user);
    toast("Portfolio saved to your device","success");
    onDone({ user, P });
  };

  const STEPS = ["Your Profile","Risk & SIP","Your Holdings"];

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"28%",left:"50%",transform:"translate(-50%,-50%)",width:800,height:800,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,167,85,0.032) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.012) 1px,transparent 0)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>

      <div className="sc" style={{width:"100%",maxWidth:step===3?700:460,position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:700,color:C.gold,letterSpacing:"-0.03em",lineHeight:1}}>RAYR</div>
          <div style={{fontSize:10,color:C.textDim,letterSpacing:"0.22em",marginTop:3,textTransform:"uppercase"}}>Portfolio Intelligence Engine</div>
        </div>

        <div style={{display:"flex",gap:5,marginBottom:24}}>
          {STEPS.map((l,i) => (
            <div key={i} style={{flex:1}}>
              <div style={{height:3,borderRadius:2,background:i+1<=step?C.gold:C.border,transition:"background 0.35s",marginBottom:4}}/>
              <div style={{fontSize:9,color:i+1===step?C.gold:C.textDim,textAlign:"center",letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:18,padding:step===3?"24px 20px":"32px 28px"}}>

          {/* STEP 1 */}
          {step===1 && (
            <div className="fu">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:C.text,marginBottom:5}}>Welcome. Your portfolio deserves honesty.</div>
              <div style={{fontSize:13,color:C.textSub,marginBottom:20,lineHeight:1.7}}>RAYR gives your portfolio a real health check — like a doctor, not a salesperson. Everything stays on your device.</div>
              <div style={{marginBottom:13}}>
                <label style={{fontSize:10,color:C.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}}>Your Name *</label>
                <input style={F} placeholder="Priya, Rohit, Kavya..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(2)} autoFocus/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                <div>
                  <label style={{fontSize:10,color:C.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}}>City</label>
                  <input style={F} placeholder="Bengaluru" value={city} onChange={e=>setCity(e.target.value)}/>
                </div>
                <div>
                  <label style={{fontSize:10,color:C.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}}>Age</label>
                  <input style={F} placeholder="28" type="number" value={age} onChange={e=>setAge(e.target.value)}/>
                </div>
              </div>
              <button onClick={()=>{if(!name.trim()){toast("Please enter your name","warn");return;}setStep(2);}} style={{width:"100%",background:C.gold,border:"none",borderRadius:11,padding:"13px",fontSize:15,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>Continue →</button>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div className="fu">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:C.text,marginBottom:5}}>Hi {name}. How do you invest?</div>
              <div style={{fontSize:13,color:C.textSub,marginBottom:20,lineHeight:1.7}}>This shapes every recommendation RAYR makes. No generic advice.</div>
              <div style={{marginBottom:18}}>
                <label style={{fontSize:10,color:C.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:9}}>Risk Appetite</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
                  {[{r:"Conservative",d:"FDs, bonds first"},{r:"Moderate",d:"Balanced mix"},{r:"Aggressive",d:"High equity"}].map(({r,d}) => (
                    <button key={r} onClick={()=>setRisk(r)} style={{padding:"12px 6px",borderRadius:10,cursor:"pointer",textAlign:"center",border:`1px solid ${risk===r?C.gold:C.borderMd}`,background:risk===r?C.goldDim:C.surface,fontFamily:"'Outfit',sans-serif",transition:"all 0.14s"}}>
                      <div style={{fontSize:12,color:risk===r?C.gold:C.textSub,fontWeight:risk===r?600:400,marginBottom:3}}>{r}</div>
                      <div style={{fontSize:10,color:C.textDim}}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:10,color:C.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}}>Monthly SIP (₹)</label>
                <input style={F} placeholder="e.g. 10000" type="number" value={sip} onChange={e=>setSip(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setStep(3)}/>
                <div style={{fontSize:10,color:C.textDim,marginTop:4}}>Used in wealth projections and Monte Carlo analysis.</div>
              </div>
              <div style={{display:"flex",gap:9}}>
                <button onClick={()=>setStep(1)} style={{flex:"0 0 auto",background:C.surface,border:`1px solid ${C.borderMd}`,borderRadius:11,padding:"13px 16px",fontSize:12,color:C.textSub,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>setStep(3)} style={{flex:1,background:C.gold,border:"none",borderRadius:11,padding:"13px",fontSize:15,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — THE REAL STEP */}
          {step===3 && (
            <div className="fu">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.text,marginBottom:4}}>Enter your investments</div>
              <div style={{fontSize:12,color:C.textSub,marginBottom:14,lineHeight:1.7}}>
                Open <strong style={{color:C.gold}}>Groww / Zerodha / Coin</strong> → copy current values. Type a fund name to get live NAV from AMFI.
                <strong style={{color:C.teal}}> Nothing leaves your device.</strong>
              </div>

              {/* Table header */}
              <div style={{display:"grid",gridTemplateColumns:"2fr 0.6fr 0.9fr 0.9fr 0.8fr 0.9fr 0.6fr 22px",gap:6,marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>
                {["Fund / Stock","Type","Curr. Value","Buy Price","Units","Sector","Exp %",""].map(h => (
                  <div key={h} style={{fontSize:9,color:C.textDim,letterSpacing:"0.06em",textTransform:"uppercase"}}>{h}</div>
                ))}
              </div>

              <div style={{maxHeight:280,overflowY:"auto",marginBottom:10}}>
                {rows.map((row, i) => (
                  <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 0.6fr 0.9fr 0.9fr 0.8fr 0.9fr 0.6fr 22px",gap:6,marginBottom:9,alignItems:"start"}}>
                    <div style={{position:"relative"}}>
                      <FundSearch
                        value={row.name}
                        onChange={v => upd(i,"name",v)}
                        onSelect={f => onFundSelect(i,f)}
                        placeholder="HDFC Flexi Cap..."
                        style={{padding:"8px 10px",fontSize:12}}
                      />
                      {navLoading[i] && <div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:12,height:12,border:`2px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>}
                      {row.liveNav && <div style={{fontSize:9,color:C.teal,marginTop:2}}>Live NAV ₹{row.liveNav} ✓</div>}
                    </div>
                    <select style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 4px",fontSize:11,color:C.text,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}} value={row.type} onChange={e=>upd(i,"type",e.target.value)}>
                      {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <input style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 8px",fontSize:12,color:C.text,fontFamily:"'Outfit',sans-serif",width:"100%"}} placeholder="182000" type="number" value={row.value} onChange={e=>upd(i,"value",e.target.value)} title="Current market value in ₹"/>
                    <div>
                      <input style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 8px",fontSize:12,color:C.text,fontFamily:"'Outfit',sans-serif",width:"100%"}} placeholder="156.40" type="number" step="0.01" value={row.buyPrice} onChange={e=>upd(i,"buyPrice",e.target.value)} title="Average buy price per unit/share"/>
                      <div style={{fontSize:9,color:C.textDim,marginTop:2}}>avg buy price</div>
                    </div>
                    <div>
                      <input style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 8px",fontSize:12,color:C.text,fontFamily:"'Outfit',sans-serif",width:"100%"}} placeholder="120.5" type="number" step="0.001" value={row.units} onChange={e=>upd(i,"units",e.target.value)} title="Number of units or shares held"/>
                      <div style={{fontSize:9,color:C.textDim,marginTop:2}}>units held</div>
                    </div>
                    <select style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 4px",fontSize:11,color:C.text,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}} value={row.sector} onChange={e=>upd(i,"sector",e.target.value)}>
                      <option value="">Sector</option>
                      {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <input style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:8,padding:"8px 6px",fontSize:12,color:C.text,fontFamily:"'Outfit',sans-serif",width:"100%"}} placeholder="0.89" type="number" step="0.01" value={row.expRatio} onChange={e=>upd(i,"expRatio",e.target.value)} title="Annual expense ratio % — find this on Value Research or AMFI"/>
                    <button onClick={()=>delRow(i)} style={{background:"transparent",border:"none",color:C.textDim,cursor:"pointer",fontSize:17,lineHeight:1,padding:0,fontFamily:"sans-serif"}} aria-label="Remove holding">×</button>
                  </div>
                ))}
              </div>

              <button onClick={addRow} style={{width:"100%",background:"transparent",border:`1px dashed ${C.borderMd}`,borderRadius:8,padding:"7px",fontSize:12,color:C.textSub,cursor:"pointer",fontFamily:"'Outfit',sans-serif",marginBottom:10}}>
                + Add another holding
              </button>
              <div style={{background:C.surface,borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:11,color:C.textSub,lineHeight:1.7}}>
                💡 <strong style={{color:C.gold}}>Buy price + units</strong> = RAYR calculates your real gain/loss. Skip them to just see portfolio structure. <strong style={{color:C.textSub}}>Expense ratio</strong> = annual fee % charged by the fund — find it on <a href="https://www.valueresearchonline.com" target="_blank" rel="noreferrer" style={{color:C.teal}}>Value Research</a>.
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                <button onClick={()=>setStep(2)} style={{background:C.surface,border:`1px solid ${C.borderMd}`,borderRadius:10,padding:"11px",fontSize:12,color:C.textSub,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>← Back</button>
                <button onClick={()=>submit(false)} style={{background:C.gold,border:"none",borderRadius:10,padding:"11px",fontSize:13,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>Analyse My Portfolio →</button>
              </div>

              <div style={{position:"relative",textAlign:"center",margin:"2px 0 9px"}}>
                <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:C.border}}/>
                <span style={{background:C.card,padding:"0 12px",fontSize:10,color:C.textDim,position:"relative"}}>OR</span>
              </div>
              <button onClick={()=>submit(true)} style={{width:"100%",background:"transparent",border:`1px solid ${C.borderMd}`,borderRadius:10,padding:"10px",fontSize:11,color:C.textSub,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>
                👁 Explore with sample portfolio first
              </button>
            </div>
          )}
        </div>

        <div style={{textAlign:"center",marginTop:14,fontSize:10,color:C.textDim,lineHeight:2}}>
          🔒 No login · No server · No sharing · Data on your device only
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════ */

/* DASHBOARD */
const Dashboard = ({ P, user, setPage, blurred }) => {
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const fdValue  = P.projData?.[9]?.fd || 0;
  const modValue = P.projData?.[9]?.moderate || 0;
  const extra    = modValue - fdValue;
  return (
    <div>
      <div className="fu" style={{marginBottom:22}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.text}}>{greeting}, {user.name} {P.isDemo?"👋":"✨"}</div>
        <div style={{fontSize:13,color:C.textSub,marginTop:3}}>{P.isDemo?"Viewing sample portfolio · ":""}{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>

      {/* FD comparison banner — the Indian user's #1 question */}
      {!P.isDemo && extra > 0 && (
        <div className="fu" style={{background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:10,padding:"10px 16px",marginBottom:18,fontSize:12,color:C.green,lineHeight:1.6}}>
          📊 <strong>vs Fixed Deposit:</strong> At 12% CAGR your SIP of {fmt(user.monthlySIP)} creates <span className={blurred?"blur-target":""}>{fmtK(extra)}</span> more wealth than a 7% FD over 10 years. RAYR shows you how to protect that gap.
        </div>
      )}

      {/* Stats */}
      <div className="fu1 stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        {[
          {l:"Portfolio Value",v:<span className={blurred?"blur-target":""}>{fmtK(P.total)}</span>,sub:P.isDemo?"Sample data":"Your holdings",c:C.gold,icon:"💼"},
          {l:"Estimated Gain",v:P.hasRealCost&&P.gain!=null?<span className={blurred?"blur-target":""}>{P.gain>=0?"+":""}{fmtK(P.gain)}</span>:<span style={{fontSize:12,color:C.textSub}}>Add buy price →</span>,sub:P.hasRealCost&&P.gainPct!=null?`${P.gainPct>=0?"+":""}${P.gainPct}% real return`:"Enter buy price for real gain",c:P.hasRealCost&&P.gain!=null?(P.gain>=0?C.green:C.red):C.textSub,icon:"📈"},
          {l:"Monthly SIP",v:<span className={blurred?"blur-target":""}>{fmt(user.monthlySIP)}</span>,sub:"Compounding monthly",c:C.teal,icon:"↻"},
          {l:"Health Score",v:`${P.healthScore}/100`,sub:P.healthLabel,c:P.healthScore>=70?C.green:P.healthScore>=55?C.amber:C.red,icon:"♥"},
        ].map((s,i) => (
          <div key={i} className="ch" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:9,color:C.textSub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>{s.l}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:10,color:C.textSub,marginTop:5}}>{s.sub}</div>
              </div>
              <span style={{fontSize:18,opacity:0.45}}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="fu2 page-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:14}}>SIP Growth</div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={P.sipData}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.28}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="month" tick={{fontSize:10,fill:C.textSub}}/>
              <YAxis tick={{fontSize:9,fill:C.textSub}} tickFormatter={v=>"₹"+(v/1000)+"K"}/>
              <Tooltip content={<TT money/>}/>
              <Area type="monotone" dataKey="value" name="Current Value" stroke={C.gold} fill="url(#gv)" strokeWidth={2}/>
              <Area type="monotone" dataKey="invested" name="Invested" stroke={C.teal} fill="none" strokeWidth={1.5} strokeDasharray="4 3"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:8}}>Asset Mix</div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={P.assetData} cx="50%" cy="50%" innerRadius={36} outerRadius={55} paddingAngle={3} dataKey="value">
                  {P.assetData.map((_,i) => <Cell key={i} fill={C.palette[i%C.palette.length]}/>)}
                </Pie>
                <Tooltip formatter={v=>v+"%"} contentStyle={{background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:11}} labelStyle={{color:C.textSub}} itemStyle={{color:C.text}}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1}}>
              {P.assetData.map((d,i) => (
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,color:C.textSub}}>
                    <div style={{width:8,height:8,borderRadius:2,background:C.palette[i%C.palette.length]}}/>
                    {d.name}
                  </div>
                  <span style={{color:C.text,fontWeight:600}}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Holdings table */}
      <Card className="fu3">
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:14}}>Your Holdings</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>{["Name","Type","Value","Weight","Sector"].map(h => <th key={h} style={{textAlign:"left",fontSize:9,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase",paddingBottom:10,paddingRight:14,fontWeight:500,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {P.rows.map((h,i) => (
                <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"11px 14px 11px 0",fontSize:12,color:C.text,fontWeight:500}}>{h.name}{h.liveNav&&<span style={{fontSize:9,color:C.teal,marginLeft:6}}>LIVE</span>}</td>
                  <td style={{padding:"11px 14px 11px 0"}}><span style={{background:C.goldDim,color:C.gold,border:`1px solid ${C.gold}25`,borderRadius:4,padding:"2px 7px",fontSize:10}}>{h.type}</span></td>
                  <td style={{padding:"11px 14px 11px 0",fontSize:13,color:C.text,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}} className={blurred?"blur-target":""}>{fmt(h.value)}</td>
                  <td style={{padding:"11px 14px 11px 0",minWidth:90}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,height:4,background:C.border,borderRadius:2}}><div style={{width:`${Math.min(100,h.weight)}%`,height:"100%",background:C.palette[i%C.palette.length],borderRadius:2}}/></div>
                      <span style={{fontSize:10,color:C.textSub,minWidth:30}}>{h.weight}%</span>
                    </div>
                  </td>
                  <td style={{padding:"11px 0",fontSize:11,color:C.textSub}}>{h.sector||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

/* HEALTH */
const HealthPage = ({ P }) => {
  const factors = [
    {l:"Diversification",v:Math.min(90,P.nH*12),help:"More distinct holdings = lower single-fund risk"},
    {l:"Sector spread",v:Math.min(88,P.sectorData.length*14),help:"More sectors = less correlated risk"},
    {l:"Debt cushion",v:P.hasD?70:18,help:"Debt/bonds absorb equity crash impact"},
    {l:"Cost efficiency",v:P.avgEx<0.5?88:P.avgEx<1?70:50,help:"Lower expense ratio = more of your money stays"},
    {l:"Concentration",v:P.maxW<25?85:P.maxW<35?60:35,help:"No single holding should dominate"},
  ];
  return (
    <div>
      <SH title="Portfolio Health Score" sub="Full diagnosis — what is working and what needs fixing, with precise reasons."/>
      <div className="fu page-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20,marginBottom:20}}>
        <Card style={{textAlign:"center",padding:"28px 20px"}}>
          <Ring score={P.healthScore} size={160}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.text,fontWeight:600,marginTop:10}}>{P.healthLabel} Health</div>
          <div style={{fontSize:11,color:C.textSub,marginTop:6,lineHeight:1.6}}>Your portfolio is in the <strong style={{color:C.gold}}>{P.healthScore>=70?"top third":"bottom half"}</strong> of retail investors with similar profile.</div>
          {!P.isDemo && <div style={{marginTop:14,fontSize:11,color:C.textDim,lineHeight:1.7}}>Score is calculated from your actual {P.nH} holdings across {P.sectorData.length} sectors.</div>}
        </Card>
        <div>
          <Card style={{marginBottom:16}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:16}}>Factor Breakdown</div>
            {factors.map((f,i) => {
              const color = f.v>=70?C.green:f.v>=50?C.amber:C.red;
              return (
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                    <div><span style={{color:C.textSub}}>{f.l}</span><span style={{fontSize:10,color:C.textDim,marginLeft:8}}>{f.help}</span></div>
                    <span style={{color,fontWeight:600,fontSize:13}}>{f.v}/100</span>
                  </div>
                  <div style={{height:5,background:C.border,borderRadius:3}}><div style={{width:`${f.v}%`,height:"100%",background:`linear-gradient(90deg,${color}70,${color})`,borderRadius:3,transition:"width 1.2s ease"}}/></div>
                </div>
              );
            })}
          </Card>
          <Card>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:14}}>vs Benchmark</div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={P.radarData}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="s" tick={{fontSize:10,fill:C.textSub}}/>
                <Radar name="Your Portfolio" dataKey="you" stroke={C.gold} fill={C.gold} fillOpacity={0.1} strokeWidth={2}/>
                <Radar name="Benchmark" dataKey="ideal" stroke={C.teal} fill={C.teal} fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 3"/>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:11}} labelStyle={{color:C.textSub}} itemStyle={{color:C.text}}/>
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* EXPOSURE */
const ExposurePage = ({ P }) => (
  <div>
    <SH title="Exposure Map" sub="Where exactly is your money? Understand your real sector concentration."/>
    <div className="fu page-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:14}}>Sector Weights</div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={P.sectorData} layout="vertical" margin={{left:8}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
            <XAxis type="number" tick={{fontSize:9,fill:C.textSub}} tickFormatter={v=>v+"%"}/>
            <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:C.textSub}} width={96}/>
            <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:11}} labelStyle={{color:C.textSub}} itemStyle={{color:C.text}} formatter={v=>v+"%"}/>
            <Bar dataKey="value" name="Allocation" radius={[0,4,4,0]}>{P.sectorData.map((_,i)=><Cell key={i} fill={C.palette[i%C.palette.length]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:14}}>Sector Detail</div>
        {P.sectorData.map((s,i) => {
          const warn = s.value > 30;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:9,height:9,borderRadius:2,background:C.palette[i%C.palette.length]}}/>
                <span style={{fontSize:12,color:C.textSub}}>{s.name}</span>
                {warn&&<span style={{fontSize:9,color:C.amber,background:"rgba(245,158,11,0.1)",borderRadius:4,padding:"1px 6px"}}>High</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,color:warn?C.amber:C.text,fontWeight:600}}>{s.value}%</div>
                <div style={{fontSize:10,color:C.textDim}}>{fmt(P.total*s.value/100)}</div>
              </div>
            </div>
          );
        })}
        {!P.hasD && (
          <div style={{marginTop:12,background:C.redDim,border:`1px solid ${C.red}30`,borderRadius:8,padding:"10px 12px",fontSize:11,color:C.red,lineHeight:1.6}}>
            ⚠️ <strong>No debt allocation detected.</strong> Debt funds act as crash cushion. When equity drops 20%, debt drops 1–2%. This protects you from panic-selling at the bottom.
          </div>
        )}
      </Card>
    </div>
  </div>
);

/* MONTE CARLO — THE STAR FEATURE */
const MonteCarloPage = ({ P, user }) => {
  const [running, setRunning] = useState(false);
  const [result, setResult]   = useState(null);
  const [years,  setYears]    = useState(15);
  const [vol,    setVol]      = useState(0.15);
  const [ret,    setRet]      = useState(0.12);

  const run = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const mc = runMonteCarlo(P.total, user.monthlySIP || 10000, years, ret, vol, 1000);
      setResult(mc);
      setRunning(false);
    }, 60);
  }, [P.total, user.monthlySIP, years, ret, vol]);

  useEffect(() => { if (result) run(); }, [years, ret, vol]);

  const target1Cr = 10000000;
  const target2Cr = 20000000;
  const prob1Cr   = result ? mcProbability(result.raw, target1Cr) : null;
  const prob2Cr   = result ? mcProbability(result.raw, target2Cr) : null;
  const median    = result ? result.chart[result.chart.length - 1].p50 : null;
  const best      = result ? result.chart[result.chart.length - 1].p90 : null;
  const worst     = result ? result.chart[result.chart.length - 1].p10 : null;

  return (
    <div>
      <SH title="Monte Carlo Simulation" sub={`Runs 1,000 different market scenarios to show your wealth probability range — not a single optimistic line.`}/>

      <div className="fu page-grid-2" style={{display:"grid",gridTemplateColumns:"1fr 2.4fr",gap:16,marginBottom:20}}>
        <Card style={{padding:"20px 18px"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.text,marginBottom:16}}>Simulation Settings</div>

          {[
            {l:"Time horizon",v:`${years} years`,min:5,max:30,val:years,setter:setYears,step:1},
            {l:"Expected return",v:`${(ret*100).toFixed(0)}% CAGR`,min:6,max:20,val:ret*100,setter:v=>setRet(v/100),step:1},
            {l:"Volatility",v:`${(vol*100).toFixed(0)}% std dev`,min:8,max:30,val:vol*100,setter:v=>setVol(v/100),step:1},
          ].map(s => (
            <div key={s.l} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textSub,marginBottom:5}}>
                <span>{s.l}</span><span style={{color:C.gold,fontWeight:600}}>{s.v}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.val} step={s.step} onChange={e=>s.setter(parseFloat(e.target.value))} style={{width:"100%",accentColor:C.gold}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textDim,marginTop:2}}>
                <span>{s.min}{s.l.includes("year")?" yrs":"%"}</span>
                <span>{s.max}{s.l.includes("year")?" yrs":"%"}</span>
              </div>
            </div>
          ))}

          {!result ? (
            <button onClick={run} disabled={running} style={{width:"100%",background:C.gold,border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:running?"not-allowed":"pointer",opacity:running?0.7:1}}>
              {running?"Running 1,000 paths...":"Run Simulation"}
            </button>
          ) : (
            <div style={{fontSize:11,color:C.textDim,textAlign:"center",marginTop:4}}>Recalculates automatically</div>
          )}

          {result && (
            <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Median (50%)",v:fmtK(median),c:C.gold},{l:"Optimistic (90%)",v:fmtK(best),c:C.green},{l:"Pessimistic (10%)",v:fmtK(worst),c:C.red},{l:"SIP invested",v:fmtK(user.monthlySIP*years*12),c:C.textSub}].map(d=>(
                <div key={d.l} style={{background:C.surface,borderRadius:8,padding:"10px 10px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{d.l}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:d.c}}>{d.v}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:4}}>Wealth probability cone · {years}-year horizon</div>
          <div style={{fontSize:11,color:C.textSub,marginBottom:14}}>Band = 80% of simulated outcomes. The wider it gets, the more uncertainty over time.</div>
          {!result ? (
            <div style={{height:280,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
              {running ? (
                <>
                  <div style={{width:36,height:36,border:`3px solid ${C.gold}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
                  <div style={{fontSize:12,color:C.textSub}}>Running 1,000 market scenarios...</div>
                </>
              ) : (
                <div style={{fontSize:13,color:C.textDim,textAlign:"center"}}>Hit "Run Simulation" to see your probability cone</div>
              )}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={result.chart}>
                <defs>
                  <linearGradient id="g90" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.18}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                  <linearGradient id="g10" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.1}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="year" tick={{fontSize:10,fill:C.textSub}} tickFormatter={v=>`Y${v}`}/>
                <YAxis tick={{fontSize:9,fill:C.textSub}} tickFormatter={v=>fmtK(v)}/>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:11}} labelStyle={{color:C.textSub}} itemStyle={{color:C.text}} formatter={v=>fmtK(v)} labelFormatter={v=>`Year ${v}`}/>
                <Area type="monotone" dataKey="p90" name="Optimistic (90%)" stroke={C.green} fill="url(#g90)" strokeWidth={1.5}/>
                <Area type="monotone" dataKey="p75" name="Good (75%)" stroke={C.teal} fill="none" strokeWidth={1} strokeDasharray="4 3"/>
                <Area type="monotone" dataKey="p50" name="Median (50%)" stroke={C.gold} fill="none" strokeWidth={2.5}/>
                <Area type="monotone" dataKey="p25" name="Below avg (25%)" stroke={C.amber} fill="none" strokeWidth={1} strokeDasharray="4 3"/>
                <Area type="monotone" dataKey="p10" name="Pessimistic (10%)" stroke={C.red} fill="url(#g10)" strokeWidth={1.5}/>
              </AreaChart>
            </ResponsiveContainer>
          )}

          {result && prob1Cr !== null && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
              <div style={{background:prob1Cr>=60?C.greenDim:C.redDim,border:`1px solid ${prob1Cr>=60?C.green:C.red}30`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:9,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Probability of reaching ₹1Cr</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:prob1Cr>=60?C.green:C.red}}>{prob1Cr}%</div>
              </div>
              <div style={{background:prob2Cr>=40?C.greenDim:C.redDim,border:`1px solid ${prob2Cr>=40?C.green:C.red}30`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                <div style={{fontSize:9,color:C.textSub,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Probability of reaching ₹2Cr</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:prob2Cr>=40?C.green:C.red}}>{prob2Cr}%</div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="fu1" style={{background:"rgba(59,130,246,0.05)",border:`1px solid ${C.blue}25`}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.blue,marginBottom:6}}>What Monte Carlo actually means</div>
        <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
          A single projected line ("your portfolio will be ₹1.2Cr in 20 years at 12%") is a lie. Markets do not move smoothly. Monte Carlo runs 1,000 different possible futures — some crash in year 3, some have 5 good years then a bear market, some boom all the way. The result is a probability range. When it says <strong style={{color:C.gold}}>78% chance of ₹1Cr</strong>, that means in 780 of the 1,000 simulated futures, you crossed ₹1Cr. The other 220 did not. Knowing this lets you plan correctly, not optimistically.
        </div>
      </Card>
    </div>
  );
};

/* RISK SIMULATOR */
const RiskPage = ({ P }) => {
  const [active, setActive] = useState(null);
  return (
    <div>
      <SH title="Risk Simulator" sub="How does your portfolio behave in real crisis scenarios? Click to see the rupee impact."/>
      <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:20}}>
        {P.stressData.map((s,i) => {
          const isPos  = s.impact >= 0;
          const color  = isPos ? C.green : Math.abs(s.impact) > 15 ? C.red : C.amber;
          const rupee  = (s.impact/100)*P.total;
          const isAct  = active === i;
          return (
            <div key={i} onClick={()=>setActive(isAct?null:i)} className="ch"
              style={{background:isAct?`${color}10`:C.card,border:`1px solid ${isAct?color+"40":C.border}`,borderRadius:13,padding:18,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:20}}>{s.emoji}</span>
                  <div style={{fontSize:13,color:C.text,fontWeight:500}}>{s.name}</div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color}}>{isPos?"+":""}{s.impact}%</div>
              </div>
              {isAct ? (
                <div className="fu" style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span style={{fontSize:12,color:C.textSub}}>Your portfolio impact</span>
                    <span style={{fontSize:17,fontWeight:700,color,fontFamily:"'Cormorant Garamond',serif"}}>{isPos?"+":""}{fmt(rupee)}</span>
                  </div>
                  <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>{s.desc}</div>
                  <div style={{fontSize:10,color:C.textDim}}>Probability: {s.prob}</div>
                </div>
              ) : (
                <div style={{fontSize:11,color:C.textDim}}>{s.desc} · Tap to expand</div>
              )}
            </div>
          );
        })}
      </div>
      <Card style={{background:"rgba(34,197,94,0.04)",border:`1px solid ${C.green}20`}}>
        <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
          💡 <strong style={{color:C.text}}>The most important investing insight:</strong> These are paper losses only. Every crash in history — 2020 COVID (−38%), 2008 GFC (−60%), 2001 dot-com — recovered fully within 3–5 years. The investors who stayed invested and kept their SIPs running through the crash earned the most. The ones who panic-sold locked in their losses permanently.
        </div>
      </Card>
    </div>
  );
};

/* SIP PAGE */
const SipPage = ({ P, user }) => {
  const ms = user.monthlySIP || 10000;
  return (
    <div>
      <SH title="SIP Tracker" sub="Your systematic investment plan — current progress and 20-year wealth path compared to a Fixed Deposit."/>
      <Card className="fu" style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:16}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text}}>Last 7 Months</div>
          <div style={{display:"flex",gap:20}}>
            {[{l:"Monthly SIP",v:fmt(ms),c:C.gold},{l:"Current Value",v:fmtK(P.sipData.at(-1)?.value||ms),c:C.green}].map(d=>(
              <div key={d.l} style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.07em"}}>{d.l}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:d.c,fontWeight:700}}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={P.sipData}>
            <defs>
              <linearGradient id="sip1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.28}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:C.textSub}}/>
            <YAxis tick={{fontSize:9,fill:C.textSub}} tickFormatter={v=>"₹"+(v/1000)+"K"}/>
            <Tooltip content={<TT money/>}/>
            <Area type="monotone" dataKey="value" name="Current Value" stroke={C.gold} fill="url(#sip1)" strokeWidth={2}/>
            <Area type="monotone" dataKey="invested" name="Invested" stroke={C.teal} fill="none" strokeWidth={1.5} strokeDasharray="4 3"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="fu1">
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:4}}>
          20-Year Projection vs Fixed Deposit
        </div>
        <div style={{fontSize:11,color:C.textSub,marginBottom:16}}>
          Orange line = FD at 7%. The gap between FD and equity is your actual reward for taking risk.
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={P.projData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="y" tick={{fontSize:9,fill:C.textSub}} interval={3}/>
            <YAxis tick={{fontSize:9,fill:C.textSub}} tickFormatter={v=>fmtK(v)}/>
            <Tooltip content={<TT money/>}/>
            <Line type="monotone" dataKey="fd" name="FD 7%" stroke={C.amber} strokeWidth={1.5} dot={false} strokeDasharray="5 4"/>
            <Line type="monotone" dataKey="moderate" name="12% CAGR" stroke={C.gold} strokeWidth={2.5} dot={false}/>
            <Line type="monotone" dataKey="aggressive" name="16% CAGR" stroke={C.green} strokeWidth={1.5} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:14}}>
          {[
            {n:"FD (7%)",v:P.projData.at(-1)?.fd,c:C.amber,label:"Baseline"},
            {n:"Equity 12%",v:P.projData.at(-1)?.moderate,c:C.gold,label:"Moderate"},
            {n:"Equity 16%",v:P.projData.at(-1)?.aggressive,c:C.green,label:"Aggressive"},
          ].map(d=>(
            <div key={d.n} style={{background:C.surface,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:9,color:C.textDim,marginBottom:3}}>{d.label} · at year 20</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:d.c}}>{fmtK(d.v||0)}</div>
              <div style={{fontSize:10,color:C.textSub,marginTop:2}}>{d.n}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:11,color:C.textDim,lineHeight:1.7,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
          <strong style={{color:C.textSub}}>Note:</strong> These projections are illustrative. Actual returns depend on fund selection, market conditions, and consistency of SIPs. Past performance does not guarantee future results. RAYR is not a SEBI-registered advisor.
        </div>
      </Card>
    </div>
  );
};

/* GOALS */
const GoalsPage = ({ user }) => {
  const ms = user.monthlySIP || 10000;
  const goals = [
    {icon:"🏠",name:"Buy a Home",target:5000000,saved:ms*36,years:8,color:C.blue,detail:"20% down payment on ₹2.5Cr home"},
    {icon:"✈️",name:"Dream Trip",target:300000,saved:ms*8,years:1,color:C.teal,detail:"Europe/Japan — 15 days"},
    {icon:"🎓",name:"Child's Education",target:3000000,saved:ms*24,years:14,color:C.purple,detail:"Undergraduate fees + living"},
    {icon:"🏖️",name:"Retirement",target:30000000,saved:ms*60,years:28,color:C.gold,detail:"25× annual expenses corpus"},
  ];
  return (
    <div>
      <SH title="Goals Tracker" sub="Your life goals mapped to your investment timeline. Are you on track?"/>
      <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:18}}>
        {goals.map((g,i) => {
          const pct = Math.min(100,Math.round(g.saved/g.target*100));
          const status = pct>=70?"On track":pct>=35?"Progressing":"Behind";
          const statusColor = pct>=70?C.green:pct>=35?C.amber:C.red;
          return (
            <Card key={i}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <span style={{fontSize:26}}>{g.icon}</span>
                  <div>
                    <div style={{fontSize:14,color:C.text,fontWeight:500}}>{g.name}</div>
                    <div style={{fontSize:10,color:C.textDim,marginTop:1}}>{g.detail}</div>
                  </div>
                </div>
                <div style={{background:`${statusColor}15`,border:`1px solid ${statusColor}30`,borderRadius:6,padding:"3px 8px",fontSize:10,color:statusColor,fontWeight:600,whiteSpace:"nowrap"}}>{status}</div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textSub,marginBottom:5}}>
                  <span>Saved: {fmtK(g.saved)}</span><span>Target: {fmtK(g.target)}</span>
                </div>
                <div style={{height:6,background:C.border,borderRadius:3}}>
                  <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${g.color}70,${g.color})`,borderRadius:3,transition:"width 1.2s ease"}}/>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textDim}}>
                <span>{g.years}-year horizon</span><span style={{color:g.color,fontWeight:600}}>{pct}% funded</span>
              </div>
            </Card>
          );
        })}
      </div>
      <Card style={{background:"rgba(212,167,85,0.04)",border:`1px solid ${C.gold}20`}}>
        <div style={{fontSize:12,color:C.textSub,lineHeight:1.8}}>
          💡 Goals are estimated from your {fmt(ms)}/month SIP. To link specific funds to specific goals and get exact tracking, enter purchase dates and ISIN codes in the holdings screen. That feature is on our roadmap for Pro.
        </div>
      </Card>
    </div>
  );
};

/* OPTIMIZER */
const OptimizerPage = ({ P }) => (
  <div>
    <SH title="Portfolio Optimizer" sub="Specific, ranked actions — each explained with real rupee impact from your portfolio."/>
    <div className="fu">
      {P.recs.map((r,i) => {
        const color = r.p==="High"?C.red:r.p==="Medium"?C.amber:r.p==="Good"?C.green:C.teal;
        return (
          <Card key={i} style={{marginBottom:12,border:`1px solid ${color}25`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                  <span style={{background:`${color}15`,border:`1px solid ${color}30`,borderRadius:5,padding:"2px 9px",fontSize:10,color,fontWeight:700}}>{r.p}</span>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,fontWeight:600}}>{r.action}</div>
                </div>
                <div style={{fontSize:12,color:C.textSub,lineHeight:1.7,maxWidth:560}}>{r.detail}</div>
              </div>
              <div style={{background:C.surface,borderRadius:9,padding:"9px 14px",textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Impact</div>
                <div style={{fontSize:12,color,fontWeight:600}}>{r.impact}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
    <Card style={{background:"rgba(59,130,246,0.04)",border:`1px solid ${C.blue}20`}}>
      <div style={{fontSize:11,color:C.textSub,lineHeight:1.8}}>
        <strong style={{color:C.blue}}>Disclosure:</strong> Recommendations are algorithmic suggestions based on diversification principles. They are not personalised investment advice. RAYR is not SEBI-registered. Consult a registered advisor before making changes.
      </div>
    </Card>
  </div>
);

/* DR. RAYR — GROQ POWERED */
const AdvisorPage = ({ P, user, groqKey }) => {
  const [msgs,   setMsgs]   = useState([]);
  const [input,  setInput]  = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, typing]);

  const SYSTEM = `You are Dr. RAYR, an honest Indian portfolio advisor. You are direct, warm, and never salesy. You speak like a trusted doctor — never recommend specific mutual fund schemes by name, but give clear principled advice. You know the user's portfolio:

Name: ${user.name}, Age: ${user.age||"unknown"}, City: ${user.city}, Risk: ${user.riskProfile}
Portfolio: ₹${Math.round(P.total).toLocaleString("en-IN")} across ${P.nH} holdings
Monthly SIP: ₹${(user.monthlySIP||10000).toLocaleString("en-IN")}
Health Score: ${P.healthScore}/100 (${P.healthLabel})
Has debt: ${P.hasD?"Yes":"No — this is a gap"}
Top sector: ${P.sectorData[0]?.name||"unknown"} at ${P.sectorData[0]?.value||0}%
Blended expense ratio: ${P.avgEx.toFixed(2)}%
Biggest issues: ${P.recs.slice(0,2).map(r=>r.action).join(", ")}

Keep replies under 5 sentences. Be specific to their portfolio. Never say "I cannot provide financial advice" — give real, honest guidance. Always compare to the FD baseline (7%) when relevant. Respect that Indians value privacy about money.`;

  const QUICK = [
    {icon:"🎯",q:"What is my biggest risk right now?"},
    {icon:"💡",q:"Am I investing enough for retirement?"},
    {icon:"💸",q:"How much am I losing to fees every year?"},
    {icon:"📊",q:"How does my portfolio compare to an FD?"},
    {icon:"⚠️",q:"What should I fix first?"},
    {icon:"🏆",q:"What is my portfolio doing right?"},
  ];

  const FALLBACK = {
    "biggest risk": `Your biggest risk right now is ${!P.hasD?"having zero debt allocation — you have no crash cushion. When equity drops 25%, your entire portfolio drops.":P.maxW>30?`${P.sectorData[0]?.name} concentration at ${P.maxW.toFixed(0)}% — one sector event hits you from multiple angles.`:"moderate and distributed well across your holdings."}`,
    "fee": `On ₹${fmtK(P.total)} with a ${P.avgEx.toFixed(2)}% blended expense ratio, you are paying approximately ₹${Math.round(P.total*P.avgEx/100).toLocaleString("en-IN")}/year in fees. Industry benchmark is 0.5–0.8%. If any of your funds are regular plans, switching to direct plans saves 0.5–0.7% per fund — that is real money.`,
    "fd": `Your ₹${fmt(user.monthlySIP||10000)}/month SIP at 12% CAGR becomes ${fmtK(P.projData?.at(-1)?.moderate||0)} in 20 years. The same amount in a 7% FD becomes ${fmtK(P.projData?.at(-1)?.fd||0)}. The difference — ${fmtK((P.projData?.at(-1)?.moderate||0)-(P.projData?.at(-1)?.fd||0))} — is your reward for tolerating market volatility. That is what RAYR helps you protect.`,
    "default": `Based on your portfolio of ${fmtK(P.total)} with a health score of ${P.healthScore}/100: the most important action is ${P.recs[0]?.action||"maintaining your SIPs"}. ${P.recs[0]?.detail||""} Keep asking me — I know your exact numbers.`,
  };

  const send = async (text) => {
    const q = text.trim();
    if (!q) return;
    setMsgs(m => [...m, {role:"user",content:q}]);
    setInput("");
    setTyping(true);
    try {
      if (groqKey) {
        const history = msgs.map(m => ({role:m.role,content:m.content}));
        const reply = await Groq.chat(groqKey, [...history, {role:"user",content:q}], SYSTEM);
        setMsgs(m => [...m, {role:"assistant",content:reply}]);
      } else {
        await new Promise(r => setTimeout(r, 900 + Math.random()*600));
        const lower = q.toLowerCase();
        let reply = FALLBACK.default;
        if (/risk|danger|crash|worst/i.test(lower))   reply = FALLBACK["biggest risk"];
        else if (/fee|cost|expense|ratio/i.test(lower)) reply = FALLBACK["fee"];
        else if (/fd|fixed deposit|compare|better/i.test(lower)) reply = FALLBACK["fd"];
        setMsgs(m => [...m, {role:"assistant",content:reply}]);
        if (!groqKey && msgs.length === 1) {
          setTimeout(() => toast("Add your Groq API key in Settings for real AI answers", "info"), 1200);
        }
      }
    } catch (e) {
      setMsgs(m => [...m, {role:"assistant",content:`Sorry, there was an error: ${e.message}. Check your Groq API key in Settings.`}]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div>
      <SH title="Dr. RAYR" sub={groqKey?"Real AI — powered by Groq Llama 3.3. Knows your exact portfolio.":"Scripted responses · Add Groq key in Settings for real AI answers."}/>

      {!groqKey && (
        <div style={{background:"rgba(59,130,246,0.07)",border:`1px solid ${C.blue}30`,borderRadius:10,padding:"11px 16px",marginBottom:16,fontSize:12,color:C.blue,lineHeight:1.7}}>
          🔑 <strong>Upgrade to real AI:</strong> Go to Settings → paste your free Groq API key → Dr. RAYR becomes a real AI that knows your portfolio and answers any question. <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{color:C.gold}}>Get free key at console.groq.com →</a>
        </div>
      )}

      {/* Quick questions */}
      <div className="fu" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10,marginBottom:18}}>
        {QUICK.map((c,i) => (
          <div key={i} onClick={()=>send(c.q)} className="ch"
            style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 15px",cursor:"pointer",display:"flex",gap:9,alignItems:"flex-start"}}>
            <span style={{fontSize:18}}>{c.icon}</span>
            <span style={{fontSize:12,color:C.textSub,lineHeight:1.5}}>{c.q}</span>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <Card style={{overflow:"hidden",padding:0}}>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:C.goldDim,border:`1px solid ${C.gold}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🩺</div>
          <div>
            <div style={{fontSize:12,color:C.text,fontWeight:600}}>Dr. RAYR</div>
            <div style={{fontSize:10,color:groqKey?C.green:C.textSub}}>{groqKey?"● Live AI · Groq Llama 3.3":"● Scripted mode · Add Groq key for real AI"}</div>
          </div>
        </div>
        <div style={{padding:18,minHeight:200,maxHeight:320,overflowY:"auto"}}>
          {msgs.length===0 && (
            <div style={{textAlign:"center",padding:"36px 0",color:C.textDim,fontSize:12}}>Click a question above or type below to start.</div>
          )}
          {msgs.map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
              <div style={{maxWidth:"80%",background:m.role==="user"?C.goldDim:C.surface,border:`1px solid ${m.role==="user"?C.gold+"30":C.border}`,borderRadius:m.role==="user"?"13px 13px 3px 13px":"13px 13px 13px 3px",padding:"9px 13px",fontSize:12,color:C.text,lineHeight:1.7}}>{m.content}</div>
            </div>
          ))}
          {typing && (
            <div style={{display:"flex",gap:4,padding:"8px 13px",background:C.surface,borderRadius:"13px 13px 13px 3px",width:"fit-content"}}>
              {[0,0.2,0.4].map((d,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.gold,animation:`shimmer 1s ${d}s infinite`}}/>)}
            </div>
          )}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,display:"flex",gap:9}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&input.trim()&&send(input.trim())}
            placeholder="Ask anything about your portfolio..."
            style={{flex:1,background:C.surface,border:`1px solid ${C.borderMd}`,borderRadius:9,padding:"9px 13px",fontSize:12,color:C.text,fontFamily:"'Outfit',sans-serif"}}/>
          <button onClick={()=>input.trim()&&send(input.trim())} style={{background:C.gold,border:"none",borderRadius:9,padding:"9px 16px",fontSize:12,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>Send</button>
        </div>
      </Card>
    </div>
  );
};

/* SETTINGS */
const SettingsPage = ({ groqKey, setGroqKey, onReset, blurred, setBlurred }) => {
  const [key, setKey] = useState(groqKey||"");
  const [show, setShow] = useState(false);
  const save = () => {
    LS.set("groqKey", key.trim());
    setGroqKey(key.trim());
    toast(key.trim()?"Groq API key saved — Dr. RAYR is now real AI":"Groq key removed","success");
  };
  return (
    <div>
      <SH title="Settings" sub="Customise RAYR — privacy controls, API keys, data management."/>
      <div style={{display:"grid",gap:14}}>
        {/* Privacy */}
        <Card className="fu">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:16}}>🔒 Privacy Controls</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontSize:13,color:C.text,fontWeight:500}}>Blur Mode</div>
              <div style={{fontSize:11,color:C.textSub,marginTop:2}}>Hide all rupee values on screen — for working in public or shared screens</div>
            </div>
            <button onClick={()=>setBlurred(b=>!b)} style={{background:blurred?C.gold:C.surface,border:`1px solid ${blurred?C.gold:C.borderMd}`,borderRadius:20,padding:"6px 16px",fontSize:12,fontWeight:600,color:blurred?"#06080F":C.textSub,fontFamily:"'Outfit',sans-serif",cursor:"pointer",transition:"all 0.2s"}}>
              {blurred?"ON — values hidden":"OFF"}
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}>
            <div>
              <div style={{fontSize:13,color:C.text,fontWeight:500}}>Data Storage</div>
              <div style={{fontSize:11,color:C.textSub,marginTop:2}}>Your portfolio is stored locally in this browser only. Nothing is on any server.</div>
            </div>
            <span style={{fontSize:11,color:C.green,background:C.greenDim,border:`1px solid ${C.green}30`,borderRadius:6,padding:"4px 10px"}}>Local only</span>
          </div>
        </Card>

        {/* Groq API */}
        <Card className="fu1">
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:6}}>🤖 Groq API Key (Free)</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:14,lineHeight:1.7}}>
            Unlocks real AI in Dr. RAYR — powered by Llama 3.3 70B, the best free LLM available. Get your key free at <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{color:C.gold}}>console.groq.com</a> → API Keys → Create Key. Takes 2 minutes.
          </div>
          <div style={{display:"flex",gap:9,marginBottom:12}}>
            <div style={{flex:1,position:"relative"}}>
              <input
                type={show?"text":"password"}
                value={key}
                onChange={e=>setKey(e.target.value)}
                placeholder="gsk_••••••••••••••••••••••••••••••••"
                style={{background:"#0A0F1C",border:"1px solid #1E2D45",borderRadius:9,padding:"10px 40px 10px 13px",fontSize:12,color:C.text,width:"100%",fontFamily:"'Outfit',sans-serif"}}
              />
              <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",fontSize:14,color:C.textSub}}>{show?"🙈":"👁"}</button>
            </div>
            <button onClick={save} style={{background:C.gold,border:"none",borderRadius:9,padding:"10px 18px",fontSize:12,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>Save</button>
          </div>
          {groqKey && (
            <div style={{fontSize:11,color:C.green,display:"flex",alignItems:"center",gap:5}}>
              <span>●</span> Groq connected · Dr. RAYR is using real AI
            </div>
          )}
          <div style={{marginTop:14,background:C.surface,borderRadius:8,padding:"10px 13px",fontSize:11,color:C.textDim,lineHeight:1.7}}>
            Your API key is stored only in your browser localStorage. It is never sent to any RAYR server because RAYR has no server.
          </div>
        </Card>

        {/* Reset */}
        <Card className="fu2" style={{border:`1px solid ${C.red}25`}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.text,marginBottom:6}}>⚠️ Reset Portfolio</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:14}}>Clear all saved data and start fresh. This deletes your portfolio from localStorage — irreversible.</div>
          <button onClick={()=>{LS.del("portfolio");LS.del("user");onReset();}} style={{background:C.redDim,border:`1px solid ${C.red}40`,borderRadius:9,padding:"10px 18px",fontSize:12,fontWeight:500,color:C.red,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>
            Delete My Portfolio & Start Over
          </button>
        </Card>
      </div>
    </div>
  );
};

/* SHARE */
const SharePage = ({ P, user }) => {
  const score = P.healthScore;
  const color = score>=80?C.green:score>=65?C.gold:C.amber;
  const pct   = score>=80?"Top 15%":score>=65?"Top 35%":"Top 50%";
  return (
    <div>
      <SH title="Your Portfolio Report Card" sub="A private summary you can screenshot or share — no actual numbers shown unless you choose."/>

      {/* Share card — no rupee values, just score */}
      <div className="fu" style={{display:"flex",justifyContent:"center",marginBottom:24}}>
        <div style={{background:"linear-gradient(135deg,#0A1628,#0D1F3C)",border:`2px solid ${color}30`,borderRadius:22,padding:"38px 44px",textAlign:"center",minWidth:300,boxShadow:`0 0 50px ${color}12`}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:C.gold,marginBottom:3}}>RAYR</div>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:24}}>Portfolio Intelligence</div>
          <Ring score={score} size={130}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.text,marginTop:12,marginBottom:3}}>{P.healthLabel} Health</div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:20}}>{pct} of retail investors · {user.city}</div>
          <div style={{display:"flex",gap:14,justifyContent:"center"}}>
            {[{l:"Holdings",v:P.nH,c:C.teal},{l:"Sectors",v:P.sectorData.length,c:C.blue},{l:"Has Debt",v:P.hasD?"Yes":"No",c:P.hasD?C.green:C.amber}].map(d=>(
              <div key={d.l}>
                <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{d.l}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:d.c}}>{d.v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:18,fontSize:9,color:C.textDim}}>No rupee values shown · rayr-06.github.io/rayr-Fin</div>
        </div>
      </div>

      <div style={{background:"rgba(212,167,85,0.06)",border:`1px solid ${C.gold}25`,borderRadius:10,padding:"11px 16px",marginBottom:18,fontSize:12,color:C.textSub,lineHeight:1.7}}>
        🔒 <strong style={{color:C.gold}}>Privacy by design:</strong> This share card shows only your health score and fund count — zero rupee values. Indians don't share money with others. RAYR respects that.
      </div>

      <div className="fu1" style={{display:"flex",gap:11,flexWrap:"wrap"}}>
        {[
          {label:"Share on WhatsApp",icon:"💬",color:C.green,fn:()=>{const t=encodeURIComponent(`My portfolio health score is ${score}/100 on RAYR — a free AI portfolio check. Try yours: https://rayr-06.github.io/rayr-Fin`);window.open("https://wa.me/?text="+t,"_blank");}},
          {label:"Share on Twitter",icon:"𝕏",color:C.blue,fn:()=>{const t=encodeURIComponent(`My RAYR portfolio health score: ${score}/100 (${P.healthLabel}). Free check for Indian investors → https://rayr-06.github.io/rayr-Fin`);window.open("https://twitter.com/intent/tweet?text="+t,"_blank");}},
          {label:"Copy Link",icon:"🔗",color:C.teal,fn:()=>{navigator.clipboard?.writeText("https://rayr-06.github.io/rayr-Fin");toast("Link copied!","success");}},
        ].map(b=>(
          <button key={b.label} onClick={b.fn} style={{background:`${b.color}12`,border:`1px solid ${b.color}35`,borderRadius:11,padding:"12px 20px",fontSize:13,color:b.color,fontFamily:"'Outfit',sans-serif",cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:8}}>
            <span>{b.icon}</span>{b.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   NAV ITEMS
═══════════════════════════════════════════════════════ */
const NAV = [
  {id:"dashboard",icon:"◈",label:"Overview",       sub:"Your pulse"},
  {id:"health",   icon:"♥",label:"Health Score",   sub:"Full diagnosis"},
  {id:"exposure", icon:"◎",label:"Exposure Map",   sub:"Where your money is"},
  {id:"montecarlo",icon:"⟡",label:"Monte Carlo",  sub:"1,000 futures"},
  {id:"risk",     icon:"△",label:"Risk Simulator", sub:"Stress test"},
  {id:"sip",      icon:"↻",label:"SIP Tracker",    sub:"Growth path"},
  {id:"goals",    icon:"◇",label:"Goals",          sub:"Are you on track?"},
  {id:"optimize", icon:"✦",label:"Optimizer",      sub:"Action plan"},
  {id:"advisor",  icon:"🩺",label:"Dr. RAYR",      sub:"Ask anything"},
  {id:"share",    icon:"↗",label:"Share",          sub:"Report card"},
  {id:"settings", icon:"⚙",label:"Settings",       sub:"API key & privacy"},
];

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const savedUser = LS.get("user", null);
  const savedPort = LS.get("portfolio", null);
  const [session,  setSession]  = useState(null);
  const [page,     setPage]     = useState("dashboard");
  const [groqKey,  setGroqKeyS] = useState(() => LS.get("groqKey",""));
  const [blurred,  setBlurred]  = useState(false);

  const setGroqKey = (k) => { setGroqKeyS(k); LS.set("groqKey", k); };

  // Restore from localStorage on mount
  useEffect(() => {
    if (savedUser && savedPort) {
      const P = buildPortfolio(savedPort, savedUser.monthlySIP || 10000);
      if (P) setSession({ user: savedUser, P });
    }
  }, []);

  if (!session) {
    return (
      <>
        <GS/>
        <Toasts/>
        <Onboarding onDone={({user,P}) => {
          setSession({user, P});
          setPage("dashboard");
        }}/>
      </>
    );
  }

  const { user, P } = session;
  const isDemo = P.isDemo;

  const PAGES = {
    dashboard:  <Dashboard   P={P} user={user} setPage={setPage} blurred={blurred}/>,
    health:     <HealthPage  P={P}/>,
    exposure:   <ExposurePage P={P}/>,
    montecarlo: <MonteCarloPage P={P} user={user}/>,
    risk:       <RiskPage    P={P}/>,
    sip:        <SipPage     P={P} user={user}/>,
    goals:      <GoalsPage   user={user}/>,
    optimize:   <OptimizerPage P={P}/>,
    advisor:    <AdvisorPage P={P} user={user} groqKey={groqKey}/>,
    share:      <SharePage   P={P} user={user}/>,
    settings:   <SettingsPage groqKey={groqKey} setGroqKey={setGroqKey} onReset={()=>{setSession(null);setPage("dashboard");}} blurred={blurred} setBlurred={setBlurred}/>,
  };

  return (
    <ErrorBoundary>
    <div className={blurred?"blur-nums":""} style={{minHeight:"100vh",background:C.bg,display:"flex"}}>
      <GS/>
      <Toasts/>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar-desktop" style={{width:230,minHeight:"100vh",background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,zIndex:100}}>
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:25,fontWeight:700,color:C.gold,letterSpacing:"-0.03em"}}>RAYR</div>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.15em",marginTop:2,textTransform:"uppercase"}}>Portfolio Intelligence</div>
        </div>

        {/* User card */}
        <div style={{padding:"11px 14px 13px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.goldDim,border:`2px solid ${C.gold}35`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.gold,fontWeight:700,flexShrink:0}}>
              {(user.name||"?")[0].toUpperCase()}
            </div>
            <div style={{overflow:"hidden"}}>
              <div style={{fontSize:13,color:C.text,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{fontSize:10,color:C.textSub}}>{user.riskProfile} · {user.city}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <div style={{flex:1,background:C.goldDim,border:`1px solid ${C.gold}22`,borderRadius:7,padding:"5px 7px",textAlign:"center"}}>
              <div style={{fontSize:8,color:C.textSub,marginBottom:1}}>Health</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.gold}}>{P.healthScore}</div>
            </div>
            <div style={{flex:1,background:C.greenDim,border:`1px solid ${C.green}22`,borderRadius:7,padding:"5px 7px",textAlign:"center"}}>
              <div style={{fontSize:8,color:C.textSub,marginBottom:1}}>Return</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:C.green}}>+{P.gainPct}%</div>
            </div>
            <div onClick={()=>setBlurred(b=>!b)} title="Toggle blur mode" style={{flex:"0 0 auto",background:blurred?C.amberDim:C.surface,border:`1px solid ${blurred?C.amber:C.border}`,borderRadius:7,padding:"5px 7px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:15}}>{blurred?"🙈":"👁"}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{padding:"6px",flex:1,overflowY:"auto"}}>
          {NAV.map(item => {
            const isA = page===item.id;
            return (
              <div key={item.id} onClick={()=>setPage(item.id)} className="ni"
                role="button" aria-label={item.label} aria-current={isA?"page":undefined}
                style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",borderRadius:9,cursor:"pointer",background:isA?C.goldDim:"transparent",border:`1px solid ${isA?C.gold+"35":"transparent"}`,marginBottom:1}}>
                <span style={{fontSize:12,color:isA?C.gold:C.textSub,width:15,textAlign:"center",flexShrink:0}}>{item.icon}</span>
                <div style={{overflow:"hidden"}}>
                  <div style={{fontSize:12,color:isA?C.gold:C.textSub,fontWeight:isA?600:400,whiteSpace:"nowrap"}}>{item.label}</div>
                  <div style={{fontSize:9,color:C.textDim,whiteSpace:"nowrap"}}>{item.sub}</div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
          {isDemo && <div style={{fontSize:9,color:C.amber,textAlign:"center",marginBottom:6}}>DEMO MODE</div>}
          <button onClick={()=>{setSession(null);setPage("dashboard");}} style={{width:"100%",background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"7px",fontSize:10,color:C.textDim,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
            ← {isDemo?"Enter My Portfolio":"Switch Portfolio"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-padded" style={{flex:1,padding:"32px 36px",minHeight:"100vh"}}>
        <div className="content-inner">
        {isDemo && <DemoBanner onReset={()=>{setSession(null);setPage("dashboard");}}/>}
        <div key={page} className="sc">
          {PAGES[page] || <Dashboard P={P} user={user} setPage={setPage} blurred={blurred}/>}
        </div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:C.surface,borderTop:`1px solid ${C.border}`,zIndex:200,display:"flex",justifyContent:"space-around",padding:"8px 0 calc(8px + env(safe-area-inset-bottom))",overflow:"hidden"}}>
        {[
          {id:"dashboard",icon:"◈",label:"Home"},
          {id:"health",icon:"♥",label:"Health"},
          {id:"montecarlo",icon:"⟡",label:"Monte Carlo"},
          {id:"advisor",icon:"🩺",label:"Dr.RAYR"},
          {id:"settings",icon:"⚙",label:"More"},
        ].map(item => {
          const isA = page===item.id;
          return (
            <div key={item.id} onClick={()=>setPage(item.id)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 12px",cursor:"pointer",flex:1}}>
              <span style={{fontSize:16,color:isA?C.gold:C.textDim}}>{item.icon}</span>
              <span style={{fontSize:9,color:isA?C.gold:C.textDim,letterSpacing:"0.02em"}}>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
    </ErrorBoundary>
  );
}
