import { useState, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid, LineChart, Line
} from "recharts";

/* ══════════════════════════════════════════════════════
   FONTS & GLOBAL STYLES
══════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #06080F; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 2px; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
    @keyframes slideIn  { from { opacity:0; transform:translateX(-16px) } to { opacity:1; transform:translateX(0) } }
    @keyframes scaleIn  { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes countUp  { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
    @keyframes toast    { 0%{opacity:0;transform:translateX(120%)} 10%{opacity:1;transform:translateX(0)} 85%{opacity:1;transform:translateX(0)} 100%{opacity:0;transform:translateX(120%)} }
    @keyframes ringFill { from{stroke-dashoffset:var(--circ)} to{stroke-dashoffset:var(--offset)} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes dotBounce{ 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(212,167,85,0.2)} 50%{box-shadow:0 0 40px rgba(212,167,85,0.5)} }

    .fu  { animation: fadeUp  0.45s ease both; }
    .fu1 { animation: fadeUp  0.45s 0.06s ease both; }
    .fu2 { animation: fadeUp  0.45s 0.12s ease both; }
    .fu3 { animation: fadeUp  0.45s 0.18s ease both; }
    .fu4 { animation: fadeUp  0.45s 0.24s ease both; }
    .fu5 { animation: fadeUp  0.45s 0.30s ease both; }
    .si  { animation: slideIn 0.35s ease both; }
    .sc  { animation: scaleIn 0.4s ease both; }

    .card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }

    .nav-item { transition: all 0.15s ease; }
    .nav-item:hover { background: rgba(212,167,85,0.08) !important; }

    .btn-primary { transition: all 0.15s ease; }
    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }

    .holding-row { transition: background 0.12s; }
    .holding-row:hover { background: rgba(255,255,255,0.03) !important; }

    .input-field:focus { border-color: rgba(212,167,85,0.5) !important; box-shadow: 0 0 0 3px rgba(212,167,85,0.08); }

    .toast-anim { animation: toast 4s ease forwards; }

    .dot1 { animation: dotBounce 1.2s 0.0s infinite ease; }
    .dot2 { animation: dotBounce 1.2s 0.2s infinite ease; }
    .dot3 { animation: dotBounce 1.2s 0.4s infinite ease; }

    .glow-ring { animation: glow 3s infinite; }
    .float-anim { animation: float 4s infinite ease-in-out; }

    .shimmer-line {
      background: linear-gradient(90deg, #1A2535 25%, #243048 50%, #1A2535 75%);
      background-size: 400px 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    .tag { display:inline-flex; align-items:center; padding:2px 8px; border-radius:5px; font-size:11px; font-weight:600; letter-spacing:0.05em; }
    .progress-bar { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
    select { appearance: none; }
    input::placeholder { color: #3D4E6A; }
    textarea::placeholder { color: #3D4E6A; }
    textarea { resize: none; }
    table { border-collapse: collapse; width: 100%; }
    button { cursor: pointer; }
  `}</style>
);

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════ */
const T = {
  bg:       "#06080F",
  surface:  "#0A0F1C",
  card:     "#0D1422",
  cardHigh: "#101828",
  border:   "#182030",
  borderMd: "#1E2D45",
  borderHi: "#253650",

  gold:     "#D4A755",
  goldBr:   "#E8C070",
  goldDim:  "rgba(212,167,85,0.12)",
  goldGlow: "rgba(212,167,85,0.25)",

  teal:     "#34C6A5",
  tealDim:  "rgba(52,198,165,0.1)",

  red:      "#E05555",
  redDim:   "rgba(224,85,85,0.1)",
  redBr:    "#FF6B6B",

  green:    "#48C78E",
  greenDim: "rgba(72,199,142,0.1)",

  blue:     "#5B90E0",
  blueDim:  "rgba(91,144,224,0.1)",

  purple:   "#9B7FD4",
  purpleDim:"rgba(155,127,212,0.1)",

  amber:    "#F59E0B",
  amberDim: "rgba(245,158,11,0.1)",

  text:     "#E4E8F2",
  textSub:  "#7A8BA8",
  textDim:  "#3D4E6A",
  textTiny: "#273040",

  palette: ["#5B90E0","#D4A755","#34C6A5","#E05555","#9B7FD4","#48C78E","#F59E0B","#E87DD0","#60C3E8","#E8905B"],
};

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const USER = {
  name: "Arjun", age: 32, city: "Bengaluru",
  riskProfile: "Moderate", experience: "3 years",
  monthlyIncome: 150000, monthlySIP: 25000,
  memberSince: "Jan 2022",
};

const HOLDINGS = [
  { id:1, name:"HDFC Flexi Cap Fund",       type:"MF",    value:182000, weight:21.5, sector:"Diversified", risk:"Moderate", returns1Y:14.2, returns3Y:18.4, expRatio:0.89, overlap:0.68, color:T.palette[0] },
  { id:2, name:"Mirae Asset Large Cap",      type:"MF",    value:156000, weight:18.4, sector:"Large Cap",   risk:"Low",      returns1Y:11.8, returns3Y:15.1, expRatio:0.55, overlap:0.61, color:T.palette[1] },
  { id:3, name:"Axis Small Cap Fund",        type:"MF",    value:98000,  weight:11.6, sector:"Small Cap",   risk:"High",     returns1Y:22.4, returns3Y:28.7, expRatio:1.20, overlap:0.18, color:T.palette[2] },
  { id:4, name:"SBI Banking ETF",            type:"ETF",   value:124000, weight:14.6, sector:"Banking",     risk:"High",     returns1Y:8.1,  returns3Y:12.3, expRatio:0.18, overlap:0.42, color:T.palette[3] },
  { id:5, name:"ICICI Pru Technology",       type:"MF",    value:87000,  weight:10.3, sector:"Technology",  risk:"High",     returns1Y:19.7, returns3Y:24.1, expRatio:1.15, overlap:0.22, color:T.palette[4] },
  { id:6, name:"Nippon India Gold ETF",      type:"ETF",   value:65000,  weight:7.7,  sector:"Commodities", risk:"Moderate", returns1Y:16.3, returns3Y:10.8, expRatio:0.12, overlap:0.04, color:T.palette[5] },
  { id:7, name:"Kotak Bond Fund",            type:"MF",    value:89250,  weight:10.5, sector:"Debt",        risk:"Low",      returns1Y:7.2,  returns3Y:8.1,  expRatio:0.42, overlap:0.02, color:T.palette[6] },
  { id:8, name:"Reliance Industries",        type:"Stock", value:46000,  weight:5.4,  sector:"Energy",      risk:"Moderate", returns1Y:12.1, returns3Y:22.6, expRatio:0,    overlap:0.31, color:T.palette[7] },
];

const TOTAL_VALUE    = HOLDINGS.reduce((s,h)=>s+h.value,0); // 847250
const INVESTED       = 724500;
const TOTAL_GAIN     = TOTAL_VALUE - INVESTED;
const TOTAL_GAIN_PCT = ((TOTAL_GAIN / INVESTED)*100).toFixed(1);

const SECTOR_DATA = [
  { name:"Banking",    value:28.4 }, { name:"Technology", value:18.2 },
  { name:"Consumer",   value:14.1 }, { name:"Energy",     value:12.3 },
  { name:"Healthcare", value:9.8  }, { name:"Debt",       value:10.5 },
  { name:"Commodities",value:6.7  },
];

const PERF_DATA = [
  { month:"Aug 24", p:720000, n:712000 }, { month:"Sep 24", p:735000, n:718000 },
  { month:"Oct 24", p:748000, n:728000 }, { month:"Nov 24", p:762000, n:735000 },
  { month:"Dec 24", p:758000, n:731000 }, { month:"Jan 25", p:791000, n:748000 },
  { month:"Feb 25", p:812000, n:756000 }, { month:"Mar 25", p:847250, n:769000 },
];

const SIP_DATA = [
  { month:"Sep",invested:25000,value:25900 }, { month:"Oct",invested:50000,value:53200 },
  { month:"Nov",invested:75000,value:81400 }, { month:"Dec",invested:100000,value:104800 },
  { month:"Jan",invested:125000,value:133500 },{ month:"Feb",invested:150000,value:163200 },
  { month:"Mar",invested:175000,value:191600 },
];

const RADAR_DATA = [
  { s:"Diversification", you:62, ideal:75 }, { s:"Risk Balance",  you:58, ideal:70 },
  { s:"Sector Spread",   you:55, ideal:72 }, { s:"Cost Efficiency",you:82, ideal:78 },
  { s:"Return Quality",  you:76, ideal:70 }, { s:"Debt Cushion",   you:48, ideal:65 },
];

const GOALS = [
  { name:"Dream Home 🏠", target:5000000, saved:847250, monthly:25000, years:7,  color:T.blue   },
  { name:"Retirement 🌅",  target:20000000,saved:847250, monthly:40000, years:25, color:T.teal   },
  { name:"Child Education 🎓",target:3000000,saved:0,   monthly:8000,  years:15, color:T.purple },
  { name:"Emergency Fund 🛡",target:600000, saved:380000,monthly:5000,  years:1,  color:T.green  },
];

const TAX_DATA = [
  { holding:"HDFC Flexi Cap",  type:"Equity", holdDays:420, gain:22400, taxable:"LTCG", taxRate:"10%", taxAmt:0,    note:"Under ₹1L LTCG limit" },
  { holding:"Mirae Large Cap", type:"Equity", holdDays:380, gain:18200, taxable:"LTCG", taxRate:"10%", taxAmt:0,    note:"Under ₹1L LTCG limit" },
  { holding:"Axis Small Cap",  type:"Equity", holdDays:290, gain:12100, taxable:"STCG", taxRate:"20%", taxAmt:2420, note:"Book after 1 year to save ₹2,420" },
  { holding:"SBI Banking ETF", type:"Equity", holdDays:310, gain:9800,  taxable:"LTCG", taxRate:"10%", taxAmt:0,    note:"Under ₹1L LTCG limit" },
  { holding:"ICICI Pru Tech",  type:"Equity", holdDays:185, gain:8700,  taxable:"STCG", taxRate:"20%", taxAmt:1740, note:"Book after 1 year to save ₹1,740" },
  { holding:"Kotak Bond Fund", type:"Debt",   holdDays:510, gain:6200,  taxable:"LTCG", taxRate:"20%", taxAmt:1240, note:"Taxed at slab rate if STCG" },
];

const NEWS = [
  { headline:"RBI holds repo rate at 6.5%; positive for bond funds", relevance:["Kotak Bond Fund"], sentiment:"positive", time:"2h ago", source:"ET Markets" },
  { headline:"Banking sector faces headwinds from rising NPAs in Q3", relevance:["SBI Banking ETF"], sentiment:"negative", time:"4h ago", source:"Mint" },
  { headline:"IT sector outlook brightens on US demand recovery", relevance:["ICICI Pru Technology"], sentiment:"positive", time:"6h ago", source:"Business Standard" },
  { headline:"Gold hits ₹75,000/10g — analysts see further upside",   relevance:["Nippon India Gold ETF"], sentiment:"positive", time:"8h ago", source:"CNBC TV18" },
  { headline:"Small cap valuations remain stretched — exercise caution", relevance:["Axis Small Cap Fund"], sentiment:"negative", time:"12h ago", source:"Value Research" },
  { headline:"Reliance Q3 profit up 12% — telecom and retail drive growth", relevance:["Reliance Industries"], sentiment:"positive", time:"1d ago", source:"Moneycontrol" },
];

const OVERLAP_PAIRS = [
  { f1:"HDFC Flexi Cap", f2:"Mirae Asset Large Cap", pct:67, cost:2400, stocks:["Infosys","HDFC Bank","Reliance","TCS","ICICI Bank","Bajaj Finance"] },
  { f1:"HDFC Flexi Cap", f2:"SBI Banking ETF",       pct:42, cost:900,  stocks:["HDFC Bank","ICICI Bank","Kotak Bank"] },
  { f1:"ICICI Pru Tech", f2:"Axis Small Cap",         pct:18, cost:320,  stocks:["Tech Mahindra","Persistent Systems"] },
];

const STRESS = [
  { name:"Nifty -20% Crash",  impact:-14.8, emoji:"📉", desc:"Broad equity selloff", prob:"Low — 3-5% annually" },
  { name:"Banking Crisis",     impact:-18.6, emoji:"🏦", desc:"Your 28% banking exposure magnifies losses", prob:"Very Low" },
  { name:"Rate Hike +2%",      impact:-6.2,  emoji:"📈", desc:"Bonds drop, financials pressured", prob:"Medium — RBI watch" },
  { name:"Rupee -15% Crash",   impact:+3.1,  emoji:"💱", desc:"Exports, IT & gold benefit", prob:"Low" },
  { name:"Global Recession",   impact:-22.4, emoji:"🌍", desc:"Worst case — prolonged bear market", prob:"Low — 18m horizon" },
  { name:"Inflation +5%",      impact:-4.1,  emoji:"🔥", desc:"Purchasing power erosion, rate risk", prob:"Medium" },
];

const AI_INSIGHTS = [
  { type:"warn",  icon:"⚠️",  title:"Banking Overexposure",       badge:"High Priority",
    detail:"28.4% in banking — 3× the ideal weight for your profile. In a banking event like 2020, you'd lose ₹1.57L from this sector alone.",
    action:"Reduce SBI Banking ETF by ₹40K. Move to a diversified large-cap fund.", saving:"Reduces max drawdown by ~4%" },
  { type:"warn",  icon:"🔍",  title:"Hidden ₹2,400/yr Waste",     badge:"High Priority",
    detail:"HDFC Flexi Cap + Mirae Asset share 67% stocks. You're paying two expense ratios for one portfolio. Silent drain every year.",
    action:"Exit Mirae Asset (₹1.56L). Consolidate into HDFC Flexi Cap.", saving:"Saves ₹2,400/yr in unnecessary costs" },
  { type:"tax",   icon:"💰",  title:"Save ₹4,160 in Taxes Now",   badge:"Act Before Mar 31",
    detail:"Axis Small Cap & ICICI Tech have short-term gains attracting 20% STCG tax. Waiting just 75–110 more days converts them to LTCG.",
    action:"Hold Axis Small Cap until Day 365. Hold ICICI Tech until Day 365.", saving:"Saves ₹4,160 in FY25 tax" },
  { type:"good",  icon:"🛡️", title:"Your Safety Net is Working",  badge:"Looking Good",
    detail:"Kotak Bond Fund (10.5%) behaved perfectly in Nov-Dec volatility — held flat while equity dropped 3%. It earned its place.",
    action:"Consider increasing to 15% before your next major expense.", saving:"Better downside protection" },
  { type:"good",  icon:"✨",  title:"Gold Hedge Performing Well",  badge:"On Track",
    detail:"Your 7.7% gold allocation returned 16.3% last year — better than most equity funds — while being uncorrelated to your portfolio.",
    action:"No action needed. This is textbook portfolio construction.", saving:"Inflation hedge working" },
  { type:"oppty", icon:"💊",  title:"Healthcare Gap — Miss 10%",   badge:"Opportunity",
    detail:"You have zero healthcare exposure. India's hospital sector grew 18% last year. Pharma is one of the most resilient sectors in volatility.",
    action:"Add ₹30K to Mirae Asset Healthcare Fund or a Pharma ETF.", saving:"Improves sector balance score by +8pts" },
];

const OPTIMIZATIONS = [
  { p:"High",   action:"Reduce SBI Banking ETF",          from:"14.6%", to:"8%",    delta:"-6.6%", type:"reduce",   impact:"Drawdown risk ↓ 4%",              amt:56000 },
  { p:"High",   action:"Exit Mirae Asset Large Cap",       from:"₹1.56L",to:"₹0",   delta:"exit",  type:"exit",     impact:"Overlap eliminated · ₹2,400 saved",amt:156000 },
  { p:"Medium", action:"Add Mirae Healthcare Fund",        from:"0%",    to:"5%",   delta:"+5%",   type:"add",      impact:"Sector score +8pts",               amt:42000 },
  { p:"Medium", action:"Increase Kotak Bond Fund",         from:"10.5%", to:"15%",  delta:"+4.5%", type:"increase", impact:"Recession shield ↑",               amt:38000 },
  { p:"Medium", action:"Trim Axis Small Cap",              from:"11.6%", to:"8%",   delta:"-3.6%", type:"reduce",   impact:"Risk score improves",              amt:30000 },
  { p:"Low",    action:"Add Midcap 150 Index Fund",        from:"0%",    to:"7%",   delta:"+7%",   type:"add",      impact:"Midcap gap filled",                amt:59000 },
];

const PEER = { percentile:67, avgAge32Score:64, topQuartileScore:81 };

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
const fmt  = n => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtL = n => n>=10000000?`₹${(n/10000000).toFixed(1)}Cr`:n>=100000?`₹${(n/100000).toFixed(1)}L`:`₹${(n/1000).toFixed(0)}K`;
const pct  = n => (n>=0?"+":"")+n.toFixed(1)+"%";

const Badge = ({ label, color, bg }) => (
  <span className="tag" style={{ color: color||T.textSub, background: bg||T.border, border:`1px solid ${color||T.borderMd}30` }}>{label}</span>
);

const RiskBadge = ({ risk }) => {
  const m = { Low:[T.green,T.greenDim], Moderate:[T.gold,T.goldDim], High:[T.red,T.redDim] };
  const [c,bg] = m[risk]||[T.textSub,T.border];
  return <Badge label={risk} color={c} bg={bg}/>;
};

const PrioBadge = ({ p }) => {
  const m = { High:[T.red,T.redDim], Medium:[T.gold,T.goldDim], Low:[T.teal,T.tealDim] };
  const [c,bg] = m[p]||[T.textSub,T.border];
  return <Badge label={p} color={c} bg={bg}/>;
};

/* ══════════════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════════════ */
const ToastCtx = { listeners:[] };
const toast = (msg, type="info") => ToastCtx.listeners.forEach(fn=>fn({msg,type,id:Date.now()}));

const ToastManager = () => {
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{
    const handler = t => { setToasts(p=>[...p,t]); setTimeout(()=>setToasts(p=>p.filter(x=>x.id!==t.id)),4000); };
    ToastCtx.listeners.push(handler);
    return ()=>{ ToastCtx.listeners=ToastCtx.listeners.filter(x=>x!==handler); };
  },[]);
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} className="toast-anim" style={{
          background:t.type==="success"?T.greenDim:t.type==="warn"?T.amberDim:T.card,
          border:`1px solid ${t.type==="success"?T.green:t.type==="warn"?T.amber:T.borderMd}`,
          borderRadius:12,padding:"12px 18px",color:T.text,
          fontFamily:"'Outfit',sans-serif",fontSize:14,maxWidth:320,
          boxShadow:"0 8px 32px rgba(0,0,0,0.6)",backdropFilter:"blur(12px)",
        }}>
          {t.type==="success"?"✓ ":t.type==="warn"?"⚡ ":"ℹ "}{t.msg}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SCORE RING
══════════════════════════════════════════════════════ */
const ScoreRing = ({ score, size=140, stroke=10, label="Health Score" }) => {
  const [v,setV]=useState(0);
  const r=((size/2)-stroke-4), circ=2*Math.PI*r;
  const offset=circ-(v/100)*circ;
  const color=v>=80?T.green:v>=60?T.gold:T.red;
  useEffect(()=>{
    let i=0; const id=setTimeout(()=>{
      const tick=()=>{ i+=1.5; setV(Math.min(i,score)); if(i<score)requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    },300);
    return ()=>clearTimeout(id);
  },[score]);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 0.04s linear",filter:`drop-shadow(0 0 10px ${color}70)`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:size*0.22,fontWeight:700,color,lineHeight:1}}>{v}</span>
        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.textSub,marginTop:2}}>{label}</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   CHART TOOLTIP
══════════════════════════════════════════════════════ */
const CT = ({ active, payload, label, money }) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:"#131F35",border:`1px solid ${T.borderMd}`,borderRadius:10,padding:"10px 14px",fontFamily:"'Outfit',sans-serif",fontSize:13,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
      <div style={{color:T.textSub,marginBottom:6,fontSize:12}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,marginBottom:2,display:"flex",justifyContent:"space-between",gap:16}}>
          <span>{p.name}</span>
          <strong>{money?fmtL(p.value):p.value+"%"}</strong>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MINI STAT
══════════════════════════════════════════════════════ */
const MiniStat = ({ label, value, sub, subColor, icon, delay, onClick }) => (
  <div className={`card fu${delay||""}`} onClick={onClick}
    style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"18px 22px",flex:1,minWidth:0,cursor:onClick?"pointer":"default"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:T.text,lineHeight:1}}>{value}</div>
        {sub&&<div style={{fontSize:12,color:subColor||T.textSub,marginTop:6}}>{sub}</div>}
      </div>
      <div style={{fontSize:22,opacity:0.75,marginLeft:8}}>{icon}</div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════════════════ */
const SH = ({ title, sub, action }) => (
  <div className="fu" style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
    <div>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:T.text,lineHeight:1.1}}>{title}</h2>
      {sub&&<p style={{fontSize:14,color:T.textSub,marginTop:8,lineHeight:1.6,maxWidth:560}}>{sub}</p>}
    </div>
    {action&&action}
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: DASHBOARD
══════════════════════════════════════════════════════ */
const Dashboard = ({ setPage }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* WELCOME */}
      <div className="fu" style={{
        background:"linear-gradient(135deg,#101828 0%,#0D1622 50%,#091220 100%)",
        border:`1px solid ${T.borderMd}`,borderRadius:20,padding:"28px 32px",
        marginBottom:24,position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,167,85,0.07) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:-40,left:240,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(91,144,224,0.05) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.02) 1px,transparent 0)",backgroundSize:"24px 24px"}}/>
        <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontSize:12,color:T.gold,letterSpacing:"0.1em",marginBottom:8,textTransform:"uppercase"}}>{greeting}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:T.text,lineHeight:1.2}}>
              Welcome back, {USER.name} 👋
            </div>
            <div style={{fontSize:14,color:T.textSub,marginTop:8,lineHeight:1.7}}>
              Your portfolio is in <span style={{color:T.gold,fontWeight:600}}>safe hands</span>. 
              You've beaten Nifty 50 by <span style={{color:T.green,fontWeight:600}}>4.2%</span> this year.
              Here's everything you need to know.
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"flex-end"}}>
            <div style={{background:T.greenDim,border:`1px solid ${T.green}40`,borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
              <div style={{fontSize:11,color:T.textSub}}>You beat Nifty by</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:T.green,fontWeight:700}}>+4.2%</div>
            </div>
            <div style={{fontSize:11,color:T.textDim}}>Live · Updated 2 min ago</div>
          </div>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="fu1" style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <MiniStat delay="2" label="Portfolio Value"  value={fmt(TOTAL_VALUE)} sub={`↑ +₹3,240 today (0.38%)`} subColor={T.green}  icon="💼"/>
        <MiniStat delay="3" label="Total Returns"    value={`+${fmt(TOTAL_GAIN)}`} sub={`↑ +${TOTAL_GAIN_PCT}% all time`} subColor={T.green} icon="📈"/>
        <MiniStat delay="4" label="Monthly SIP"      value={fmt(USER.monthlySIP)} sub="Running since Sep 2024" subColor={T.teal}  icon="🔄" onClick={()=>setPage("sip")}/>
        <MiniStat delay="5" label="Active Alerts"    value="4 Insights" sub="2 urgent · Tap to review" subColor={T.red}   icon="🔔" onClick={()=>setPage("advisor")}/>
      </div>

      {/* MAIN GRID */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
        {/* Performance Chart */}
        <div className="card fu2" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Portfolio vs Nifty 50</div>
          <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>8-month performance — you're ahead by 10.2%</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PERF_DATA}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.gold}  stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={T.gold}  stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.blue}  stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={T.blue}  stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="month" stroke={T.textTiny} tick={{fontSize:11,fill:T.textSub,fontFamily:"Outfit"}}/>
              <YAxis stroke={T.textTiny} tick={{fontSize:10,fill:T.textSub,fontFamily:"Outfit"}} tickFormatter={v=>`₹${(v/100000).toFixed(1)}L`}/>
              <Tooltip content={<CT money/>}/>
              <Area type="monotone" dataKey="p" name="Your Portfolio" stroke={T.gold}  strokeWidth={2.5} fill="url(#gP)"/>
              <Area type="monotone" dataKey="n" name="Nifty 50"       stroke={T.blue}  strokeWidth={2}   fill="url(#gN)" strokeDasharray="5 3"/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:20,marginTop:12}}>
            {[["Your Portfolio",T.gold,"solid"],[" Nifty 50",T.blue,"dashed"]].map(([l,c,s])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.textSub}}>
                <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke={c} strokeWidth="2" strokeDasharray={s==="dashed"?"4 2":"none"}/></svg>{l}
              </div>
            ))}
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="card fu3" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Asset Mix</div>
          <div style={{fontSize:13,color:T.textSub,marginBottom:12}}>How your money is deployed</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[{name:"Equity MF",value:61.8},{name:"ETF",value:22.3},{name:"Stocks",value:5.4},{name:"Debt",value:10.5}]}
                cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                {T.palette.map((_,i)=><Cell key={i} fill={T.palette[i]}/>)}
              </Pie>
              <Tooltip formatter={v=>v+"%"} contentStyle={{background:"#131F35",border:`1px solid ${T.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          {[{n:"Equity MF",v:61.8,i:0},{n:"ETF",v:22.3,i:1},{n:"Stocks",v:5.4,i:2},{n:"Debt",v:10.5,i:3}].map(d=>(
            <div key={d.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.textSub}}>
                <div style={{width:8,height:8,borderRadius:2,background:T.palette[d.i]}}/>
                {d.n}
              </div>
              <span style={{fontSize:12,color:T.text,fontWeight:500}}>{d.v}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* PEER COMPARISON */}
      <div className="card fu3" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>How You Compare</div>
            <div style={{fontSize:13,color:T.textSub}}>vs other {USER.age}-year-old investors in India with similar portfolio size</div>
          </div>
          <div style={{background:T.goldDim,border:`1px solid ${T.gold}40`,borderRadius:12,padding:"10px 18px",textAlign:"center"}}>
            <div style={{fontSize:11,color:T.textSub}}>Your Percentile</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:T.gold}}>{PEER.percentile}th</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[
            {l:"Your Health Score",v:72,c:T.gold},
            {l:"Avg Score (Age 32)",v:PEER.avgAge32Score,c:T.blue},
            {l:"Top 25% Score",v:PEER.topQuartileScore,c:T.green},
          ].map(d=>(
            <div key={d.l} style={{background:T.surface,borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:T.textSub,marginBottom:8}}>{d.l}</div>
              <div style={{background:T.border,borderRadius:4,height:6,overflow:"hidden",marginBottom:6}}>
                <div className="progress-bar" style={{width:`${d.v}%`,height:"100%",background:d.c,borderRadius:4,boxShadow:`0 0 8px ${d.c}60`}}/>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:d.c}}>{d.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14,fontSize:13,color:T.textSub,lineHeight:1.6}}>
          You're in the <strong style={{color:T.gold}}>top 33%</strong> of investors your age. 
          Fixing the 2 flagged issues would put you in the <strong style={{color:T.green}}>top 15%</strong>.
        </div>
      </div>

      {/* HOLDINGS TABLE */}
      <div className="card fu4" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>All Holdings</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Complete breakdown — every rupee accounted for</div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Fund / Stock","Type","Value","Weight","1Y Returns","3Y Returns","Exp. Ratio","Risk"].map(h=>(
                  <th key={h} style={{fontSize:10,color:T.textDim,fontWeight:600,textAlign:"left",padding:"8px 12px",letterSpacing:"0.07em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h,i)=>(
                <tr key={i} className="holding-row" style={{borderBottom:`1px solid ${T.border}20`}}>
                  <td style={{padding:"14px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:4,height:32,borderRadius:2,background:h.color,flexShrink:0}}/>
                      <div>
                        <div style={{fontSize:13,color:T.text,fontWeight:500}}>{h.name}</div>
                        <div style={{fontSize:11,color:T.textSub}}>{h.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"14px 12px"}}><Badge label={h.type} color={T.blue} bg={T.blueDim}/></td>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{fmtL(h.value)}</td>
                  <td style={{padding:"14px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:50,height:3,background:T.border,borderRadius:2}}>
                        <div style={{width:`${Math.min(h.weight*3,100)}%`,height:"100%",background:T.gold,borderRadius:2}}/>
                      </div>
                      <span style={{fontSize:12,color:T.textSub}}>{h.weight}%</span>
                    </div>
                  </td>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.green,fontWeight:600}}>+{h.returns1Y}%</td>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.teal,fontWeight:600}}>+{h.returns3Y}%</td>
                  <td style={{padding:"14px 12px",fontSize:12,color:h.expRatio>1?T.red:T.textSub}}>{h.expRatio?h.expRatio+"%":"—"}</td>
                  <td style={{padding:"14px 12px"}}><RiskBadge risk={h.risk}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:16,padding:"12px 16px",background:T.surface,borderRadius:10,display:"flex",gap:24,flexWrap:"wrap"}}>
          <div style={{fontSize:12,color:T.textSub}}>Total invested: <strong style={{color:T.text}}>{fmt(INVESTED)}</strong></div>
          <div style={{fontSize:12,color:T.textSub}}>Current value: <strong style={{color:T.text}}>{fmt(TOTAL_VALUE)}</strong></div>
          <div style={{fontSize:12,color:T.textSub}}>Total gain: <strong style={{color:T.green}}>+{fmt(TOTAL_GAIN)} (+{TOTAL_GAIN_PCT}%)</strong></div>
          <div style={{fontSize:12,color:T.textSub}}>Avg expense ratio: <strong style={{color:T.text}}>0.64%</strong></div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION: HEALTH SCORE
══════════════════════════════════════════════════════ */
const HealthPage = () => (
  <div>
    <SH title="Portfolio Health Score" sub="A full-body checkup for your money. Understand every dimension of your portfolio's strength."/>
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:24,marginBottom:24}}>
      {/* Score card */}
      <div className="card fu" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"32px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:20,textAlign:"center"}}>
        <ScoreRing score={72}/>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:T.gold}}>Moderate Health</div>
          <div style={{fontSize:13,color:T.textSub,marginTop:8,lineHeight:1.7}}>Functional but with 3 fixable weaknesses. You're doing better than 67% of investors your age.</div>
        </div>
        <div style={{width:"100%",background:T.surface,borderRadius:12,padding:"16px"}}>
          <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>Potential score if you fix flagged issues</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:T.green,fontWeight:700}}>88</div>
          <div style={{fontSize:11,color:T.textSub}}>Top 15% of all investors</div>
        </div>
        <div style={{width:"100%",background:T.amberDim,border:`1px solid ${T.amber}30`,borderRadius:10,padding:"12px",fontSize:12,color:T.amber,lineHeight:1.6}}>
          ⚡ 2 urgent issues found.<br/>Estimated fix time: 15 minutes.
        </div>
      </div>

      {/* Radar */}
      <div className="card fu1" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Health Breakdown</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:8}}>Your portfolio vs an ideal diversified portfolio for your profile</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={RADAR_DATA}>
            <PolarGrid stroke={T.border}/>
            <PolarAngleAxis dataKey="s" tick={{fontFamily:"Outfit",fontSize:12,fill:T.textSub}}/>
            <Radar name="Your Portfolio" dataKey="you"  stroke={T.gold}  fill={T.gold}  fillOpacity={0.18}/>
            <Radar name="Ideal"          dataKey="ideal" stroke={T.teal} fill={T.teal} fillOpacity={0.07} strokeDasharray="4 3"/>
            <Tooltip contentStyle={{background:"#131F35",border:`1px solid ${T.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:12}}/>
          </RadarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:24,justifyContent:"center",marginTop:4}}>
          {[["Your Portfolio",T.gold],["Ideal Benchmark",T.teal]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.textSub}}>
              <div style={{width:14,height:2,background:c}}/>{l}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Component Scores */}
    <div className="card fu2" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:24}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:20}}>What Makes Up Your Score</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        {RADAR_DATA.map((d,i)=>{
          const c=d.you>=75?T.green:d.you>=55?T.gold:T.red;
          const s=d.you>=75?"✓ Good":d.you>=55?"⚡ Needs attention":"⚠ Weak area";
          const desc={
            "Diversification":"How spread out your money is across different assets",
            "Risk Balance":"Are your high-risk and low-risk assets in the right ratio?",
            "Sector Spread":"How evenly distributed across sectors like Banking, IT, Pharma",
            "Cost Efficiency":"How much you're paying in expense ratios and fees",
            "Return Quality":"Are your returns good relative to the risk taken?",
            "Debt Cushion":"Safety net during market downturns — your bond allocation",
          }[d.s];
          return (
            <div key={i} style={{background:T.surface,borderRadius:12,padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:14,color:T.text,fontWeight:500}}>{d.s}</span>
                <span style={{fontSize:13,color:c,fontWeight:700}}>{d.you}<span style={{color:T.textDim,fontWeight:400}}>/100</span></span>
              </div>
              <div style={{fontSize:11,color:T.textSub,marginBottom:10,lineHeight:1.5}}>{desc}</div>
              <div style={{background:T.border,borderRadius:4,height:5,overflow:"hidden",marginBottom:6}}>
                <div className="progress-bar" style={{width:`${d.you}%`,height:"100%",background:c,boxShadow:`0 0 8px ${c}50`}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:c}}>{s}</span>
                <span style={{fontSize:10,color:T.textDim}}>Ideal: {d.ideal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* What Needs Fixing */}
    <div className="fu3" style={{background:`linear-gradient(135deg,${T.redDim},transparent)`,border:`1px solid ${T.red}30`,borderRadius:16,padding:"24px"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.red,marginBottom:16}}>3 Things Holding Back Your Score</div>
      {[
        {issue:"Debt Cushion too low (48/100)",fix:"Add ₹40K to bond/debt funds to reach 15% allocation",pts:"+8 pts"},
        {issue:"Banking sector overweight (55/100)",fix:"Reduce banking exposure from 28% to ~15%",pts:"+7 pts"},
        {issue:"Fund overlap hurting diversification (62/100)",fix:"Exit Mirae Asset Large Cap — 67% duplicate of HDFC Flexi Cap",pts:"+9 pts"},
      ].map((x,i)=>(
        <div key={i} style={{display:"flex",gap:16,marginBottom:i<2?16:0,padding:"14px 16px",background:T.card,borderRadius:10}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:T.redDim,border:`1px solid ${T.red}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.red,fontWeight:700,flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:T.text,fontWeight:500,marginBottom:4}}>{x.issue}</div>
            <div style={{fontSize:13,color:T.textSub}}>{x.fix}</div>
          </div>
          <div style={{background:T.greenDim,border:`1px solid ${T.green}40`,borderRadius:8,padding:"6px 12px",fontSize:12,color:T.green,fontWeight:600,alignSelf:"center",whiteSpace:"nowrap"}}>{x.pts}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: EXPOSURE MAP
══════════════════════════════════════════════════════ */
const ExposurePage = () => (
  <div>
    <SH title="Exposure Map" sub="Exactly where your money lives — sector by sector, geography by geography, market cap by market cap."/>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
      <div className="card fu" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Sector Exposure</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Where concentration risk lives</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={SECTOR_DATA} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false}/>
            <XAxis type="number" stroke={T.textTiny} tick={{fontSize:11,fill:T.textSub,fontFamily:"Outfit"}} tickFormatter={v=>v+"%"} domain={[0,35]}/>
            <YAxis type="category" dataKey="name" stroke={T.textTiny} tick={{fontSize:11,fill:T.textSub,fontFamily:"Outfit"}} width={85}/>
            <Tooltip formatter={v=>v+"%"} contentStyle={{background:"#131F35",border:`1px solid ${T.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:12}}/>
            <Bar dataKey="value" radius={[0,5,5,0]}>
              {SECTOR_DATA.map((_,i)=><Cell key={i} fill={T.palette[i]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{background:T.redDim,border:`1px solid ${T.red}30`,borderRadius:8,padding:"10px 14px",marginTop:12,fontSize:12,color:T.red,lineHeight:1.6}}>
          ⚠ Banking at 28.4% — ideal is 12-15% for your profile. This is your biggest risk concentration.
        </div>
      </div>

      <div className="card fu1" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Market Cap Mix</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:12}}>Large / Mid / Small cap balance</div>
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={[{n:"Large Cap",v:48},{n:"Mid Cap",v:22},{n:"Small Cap",v:12},{n:"Debt/Gold",v:18}]}
              cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="v"
              label={({n,v})=>`${v}%`} labelLine={{stroke:T.borderMd}}>
              {T.palette.map((_,i)=><Cell key={i} fill={T.palette[i]}/>)}
            </Pie>
            <Tooltip formatter={v=>v+"%"} contentStyle={{background:"#131F35",border:`1px solid ${T.borderMd}`,borderRadius:8,fontFamily:"Outfit",fontSize:12}}/>
          </PieChart>
        </ResponsiveContainer>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8}}>
          {[{n:"Large Cap",v:48},{n:"Mid Cap",v:22},{n:"Small Cap",v:12},{n:"Debt/Gold",v:18}].map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.textSub}}>
              <div style={{width:7,height:7,borderRadius:1,background:T.palette[i],flexShrink:0}}/>{d.n} ({d.v}%)
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Heatmap tiles */}
    <div className="card fu2" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:20}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>Concentration Heatmap</div>
      <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Bigger = more exposure. Red = above ideal weight for your profile.</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {SECTOR_DATA.map((s,i)=>{
          const over=s.value>20;
          const a=0.25+(s.value/35)*0.6;
          return (
            <div key={i} style={{
              background:over?`rgba(224,85,85,${a*0.5})`:`rgba(91,144,224,${a*0.35})`,
              border:`1px solid ${over?T.red:T.blue}40`,borderRadius:14,
              padding:`${12+s.value*0.4}px ${16+s.value*0.35}px`,
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              transition:"all 0.2s",cursor:"default",
            }}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24+s.value*0.3,fontWeight:700,color:over?T.red:T.text,lineHeight:1}}>{s.value}%</div>
              <div style={{fontSize:11,color:T.textSub}}>{s.name}</div>
              {over&&<div style={{fontSize:10,color:T.red,background:T.redDim,borderRadius:4,padding:"1px 6px"}}>OVERWEIGHT</div>}
            </div>
          );
        })}
      </div>
    </div>

    {/* Missing sectors */}
    <div className="card fu3" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>What You're Missing</div>
      <div style={{fontSize:13,color:T.textSub,marginBottom:16}}>Sectors with zero exposure that could improve your diversification</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        {[
          {sector:"Healthcare / Pharma",growth:"18% sector growth in 2024",risk:"Low-Moderate",note:"Most recession-resistant sector"},
          {sector:"FMCG / Consumer",growth:"Steady 12-14% returns",risk:"Low",note:"Defensive — holds in downturns"},
          {sector:"Infrastructure",growth:"Govt capex tailwind",risk:"Moderate",note:"10-year India growth story"},
          {sector:"International / US",growth:"USD diversification",risk:"Moderate",note:"Hedges against INR depreciation"},
        ].map((s,i)=>(
          <div key={i} style={{background:T.surface,borderRadius:12,padding:"14px 16px",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:13,color:T.text,fontWeight:500,marginBottom:4}}>❌ {s.sector}</div>
            <div style={{fontSize:11,color:T.teal,marginBottom:4}}>{s.growth}</div>
            <div style={{fontSize:11,color:T.textSub}}>{s.note}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: OVERLAP
══════════════════════════════════════════════════════ */
const OverlapPage = () => (
  <div>
    <SH title="Fund Overlap Detector" sub="Are you paying for the same stocks twice? Most investors are. We checked your exact portfolio."/>
    <div className="fu" style={{background:`linear-gradient(135deg,${T.redDim},transparent)`,border:`1px solid ${T.red}30`,borderRadius:16,padding:"20px 24px",marginBottom:24}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.red,fontWeight:600,marginBottom:8}}>⚠ Critical Overlap Detected</div>
      <div style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>
        HDFC Flexi Cap and Mirae Asset Large Cap share <strong style={{color:T.text}}>67% of the same underlying stocks</strong>. 
        You're effectively running one portfolio while paying two expense ratios. 
        This costs you <strong style={{color:T.red}}>₹2,400 every year</strong> in completely unnecessary charges — silently draining your compounding.
      </div>
    </div>

    {OVERLAP_PAIRS.map((p,i)=>(
      <div key={i} className={`card fu${i+1}`} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{background:T.blueDim,border:`1px solid ${T.blue}30`,borderRadius:10,padding:"8px 14px",fontSize:14,color:T.text,fontWeight:500}}>{p.f1}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:T.textSub}}>∩</div>
            <div style={{background:T.tealDim,border:`1px solid ${T.teal}30`,borderRadius:10,padding:"8px 14px",fontSize:14,color:T.text,fontWeight:500}}>{p.f2}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:p.pct>50?T.red:p.pct>30?T.gold:T.green}}>{p.pct}%</div>
            <div style={{fontSize:12,color:T.textSub}}>overlap</div>
            <div style={{fontSize:11,color:T.red,marginTop:4}}>₹{p.cost.toLocaleString()}/yr wasted</div>
          </div>
        </div>
        <div style={{background:T.border,borderRadius:4,height:8,overflow:"hidden",marginBottom:16}}>
          <div style={{width:`${p.pct}%`,height:"100%",background:p.pct>50?T.red:p.pct>30?T.gold:T.green,borderRadius:4,boxShadow:`0 0 10px ${p.pct>50?T.red:T.gold}60`}}/>
        </div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8}}>Common stocks in both funds:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {p.stocks.map((s,j)=>(
            <span key={j} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 10px",fontSize:12,color:T.textSub}}>{s}</span>
          ))}
        </div>
        {p.pct>50&&(
          <div style={{marginTop:14,background:T.goldDim,border:`1px solid ${T.gold}40`,borderRadius:10,padding:"12px 14px",fontSize:13,color:T.gold,lineHeight:1.7}}>
            💡 <strong>Recommended fix:</strong> Exit {p.f2} entirely. Reinvest the ₹{(156000/1000).toFixed(0)}K into {p.f1} or a truly different fund (e.g. Midcap 150 Index). Net saving: ₹2,400/yr + better diversification.
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: RISK SIMULATOR
══════════════════════════════════════════════════════ */
const RiskPage = () => {
  const [sel,setSel]=useState(null);
  return (
    <div>
      <SH title="Risk Simulator" sub="What happens to your money when the market gets ugly? See it in rupees before it happens."/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        {STRESS.map((s,i)=>{
          const neg=s.impact<0, rupee=Math.round((s.impact/100)*TOTAL_VALUE);
          const isSel=sel===i;
          return (
            <div key={i} onClick={()=>setSel(isSel?null:i)}
              className="card"
              style={{
                background:isSel?(neg?T.redDim:T.greenDim):T.card,
                border:`1px solid ${isSel?(neg?T.red+"60":T.green+"60"):T.border}`,
                borderRadius:16,padding:"20px 22px",cursor:"pointer",transition:"all 0.2s",
              }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div>
                  <div style={{fontSize:18,marginBottom:6}}>{s.emoji}</div>
                  <div style={{fontSize:14,color:T.text,fontWeight:500,marginBottom:4}}>{s.name}</div>
                  <div style={{fontSize:12,color:T.textSub,marginBottom:6}}>{s.desc}</div>
                  <div style={{fontSize:11,color:T.textDim}}>Probability: {s.prob}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:neg?T.red:T.green}}>
                    {neg?"":"+"+""}{s.impact}%
                  </div>
                  <div style={{fontSize:12,color:neg?T.red:T.green,marginTop:2}}>
                    {neg?"-":"+"}{fmt(Math.abs(rupee))}
                  </div>
                </div>
              </div>
              {isSel&&(
                <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
                  <div style={{fontSize:12,color:T.textSub,marginBottom:10}}>Portfolio value changes from → to:</div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.text}}>{fmt(TOTAL_VALUE)}</span>
                    <span style={{color:T.textSub,fontSize:20}}>→</span>
                    <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:neg?T.red:T.green}}>{fmt(TOTAL_VALUE+rupee)}</span>
                  </div>
                  <div style={{background:T.border,borderRadius:6,height:10,overflow:"hidden"}}>
                    <div style={{width:`${Math.max(10,100+s.impact)}%`,maxWidth:"100%",height:"100%",background:neg?T.red:T.green,borderRadius:6,transition:"width 0.6s ease"}}/>
                  </div>
                  <div style={{marginTop:12,fontSize:12,color:T.textSub,lineHeight:1.6}}>
                    Recovery time estimate: <strong style={{color:T.text}}>{neg?Math.abs(s.impact)<10?"6-12 months":Math.abs(s.impact)<20?"12-24 months":"24-36 months":"Immediate gain"}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fu card" style={{background:T.card,border:`1px solid ${T.teal}30`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.teal,marginBottom:12}}>🛡️ Your Protection Plan</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          {[
            {risk:"Banking Crisis (your worst exposure)",action:"Reduce banking ETF from 14.6% → 8%",saves:"Cuts loss from -18.6% to ~-11%"},
            {risk:"Global Recession",action:"Increase debt buffer from 10.5% → 20%",saves:"Reduces recession impact by ~5%"},
            {risk:"Interest Rate Hike",action:"Shift to short-duration bonds in Kotak Fund",saves:"Limits bond losses to <2%"},
          ].map((x,i)=>(
            <div key={i} style={{background:T.surface,borderRadius:12,padding:"14px 16px",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:12,color:T.red,marginBottom:6}}>⚠ {x.risk}</div>
              <div style={{fontSize:13,color:T.text,fontWeight:500,marginBottom:4}}>{x.action}</div>
              <div style={{fontSize:11,color:T.green}}>{x.saves}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION: SIP TRACKER
══════════════════════════════════════════════════════ */
const SIPPage = () => {
  const sipTotal=175000, sipValue=191600, sipGain=sipValue-sipTotal;
  const projData=[];
  for(let y=1;y<=20;y++) projData.push({y:`Year ${y}`,conservative:Math.round(25000*12*((Math.pow(1+(8/100/12),y*12)-1)/(8/100/12))),moderate:Math.round(25000*12*((Math.pow(1+(12/100/12),y*12)-1)/(12/100/12))),aggressive:Math.round(25000*12*((Math.pow(1+(16/100/12),y*12)-1)/(16/100/12)))});

  return (
    <div>
      <SH title="SIP Tracker & Projections" sub="Your monthly investments are building a fortune. Here's exactly how much — and where it's heading."/>
      <div className="fu1" style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <MiniStat delay="2" label="Monthly SIP" value={fmt(USER.monthlySIP)} sub="Running since Sep 2024" subColor={T.teal} icon="🔄"/>
        <MiniStat delay="3" label="Total Invested via SIP" value={fmt(sipTotal)} sub="7 months of discipline" subColor={T.textSub} icon="💰"/>
        <MiniStat delay="4" label="Current SIP Value" value={fmt(sipValue)} sub={`↑ +${fmt(sipGain)} gain`} subColor={T.green} icon="📈"/>
        <MiniStat delay="5" label="SIP Return Rate" value="+9.5% p.a." sub="Better than FD by 3.5%" subColor={T.green} icon="✨"/>
      </div>

      <div className="card fu2" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:20}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>SIP Growth — Invested vs Value</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Every monthly installment and how it has grown</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SIP_DATA}>
            <defs>
              <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.blue} stopOpacity={0.2}/><stop offset="95%" stopColor={T.blue} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="month" stroke={T.textTiny} tick={{fontSize:11,fill:T.textSub,fontFamily:"Outfit"}}/>
            <YAxis stroke={T.textTiny} tick={{fontSize:10,fill:T.textSub,fontFamily:"Outfit"}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<CT money/>}/>
            <Area type="monotone" dataKey="value"    name="Portfolio Value" stroke={T.teal} strokeWidth={2.5} fill="url(#gV)"/>
            <Area type="monotone" dataKey="invested" name="Amount Invested"  stroke={T.blue} strokeWidth={2}   fill="url(#gI)" strokeDasharray="4 2"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card fu3" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:4}}>20-Year SIP Projection</div>
        <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>If you continue ₹25,000/month — the power of compounding visualized</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={projData.filter((_,i)=>i%2===0||i===projData.length-1)}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="y" stroke={T.textTiny} tick={{fontSize:10,fill:T.textSub,fontFamily:"Outfit"}}/>
            <YAxis stroke={T.textTiny} tick={{fontSize:10,fill:T.textSub,fontFamily:"Outfit"}} tickFormatter={v=>`₹${(v/10000000).toFixed(1)}Cr`}/>
            <Tooltip content={<CT money/>}/>
            <Line type="monotone" dataKey="conservative" name="Conservative (8%)" stroke={T.blue}   strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="moderate"     name="Moderate (12%)"    stroke={T.gold}   strokeWidth={2.5} dot={false}/>
            <Line type="monotone" dataKey="aggressive"   name="Aggressive (16%)"  stroke={T.green}  strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:16}}>
          {[["Conservative 8%",T.blue,projData[19]?.conservative],["Moderate 12%",T.gold,projData[19]?.moderate],["Aggressive 16%",T.green,projData[19]?.aggressive]].map(([l,c,v])=>(
            <div key={l} style={{background:T.surface,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>{l}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:c}}>{fmtL(v||0)}</div>
              <div style={{fontSize:10,color:T.textDim}}>in 20 years</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION: GOALS
══════════════════════════════════════════════════════ */
const GoalsPage = () => (
  <div>
    <SH title="Goal Tracker" sub="Every investment needs a purpose. Track your financial goals and see exactly if you're on track."/>
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {GOALS.map((g,i)=>{
        const pct2=Math.min((g.saved/g.target)*100,100);
        const monthsNeeded=Math.ceil((g.target-g.saved)/g.monthly);
        const onTrack=monthsNeeded<=(g.years*12);
        const projected=g.monthly*g.years*12*1.12+g.saved;
        return (
          <div key={i} className={`card fu${i+1}`} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:T.text,marginBottom:4}}>{g.name}</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:T.textSub}}>Target: <strong style={{color:T.text}}>{fmtL(g.target)}</strong></span>
                  <span style={{fontSize:12,color:T.textSub}}>Monthly SIP: <strong style={{color:T.text}}>{fmt(g.monthly)}</strong></span>
                  <span style={{fontSize:12,color:T.textSub}}>Timeline: <strong style={{color:T.text}}>{g.years} years</strong></span>
                </div>
              </div>
              <div style={{background:onTrack?T.greenDim:T.redDim,border:`1px solid ${onTrack?T.green:T.red}40`,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
                <div style={{fontSize:12,color:onTrack?T.green:T.red,fontWeight:600}}>{onTrack?"✓ On Track":"⚠ Review"}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:T.textSub}}>Progress</span>
              <span style={{fontSize:12,color:g.color,fontWeight:600}}>{pct2.toFixed(1)}%</span>
            </div>
            <div style={{background:T.border,borderRadius:6,height:8,overflow:"hidden",marginBottom:12}}>
              <div className="progress-bar" style={{width:`${pct2}%`,height:"100%",background:g.color,borderRadius:6,boxShadow:`0 0 10px ${g.color}50`}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {l:"Saved so far",v:fmtL(g.saved),c:T.text},
                {l:"Still needed",v:fmtL(Math.max(0,g.target-g.saved)),c:T.textSub},
                {l:"Projected value",v:fmtL(projected),c:g.color},
                {l:"Months to goal",v:monthsNeeded>0?monthsNeeded+" mo":"Done!",c:onTrack?T.green:T.amber},
              ].map((s,j)=>(
                <div key={j} style={{background:T.surface,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:10,color:T.textSub,marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:13,color:s.c,fontWeight:600}}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: TAX PLANNER
══════════════════════════════════════════════════════ */
const TaxPage = () => {
  const totalTaxSavable=4160;
  return (
    <div>
      <SH title="Tax Planner" sub="Your portfolio has hidden tax savings. Here's exactly what to do before March 31st."/>
      <div className="fu" style={{background:`linear-gradient(135deg,${T.goldDim},transparent)`,border:`1px solid ${T.gold}40`,borderRadius:16,padding:"20px 24px",marginBottom:24}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.gold,fontWeight:600,marginBottom:8}}>💰 You Can Save ₹4,160 in Tax — Right Now</div>
        <div style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>
          Two of your holdings have short-term capital gains (STCG) taxed at 20%. 
          If you wait just <strong style={{color:T.text}}>75–110 more days</strong>, they become long-term (LTCG) taxed at 10% (with ₹1L exemption). 
          That's <strong style={{color:T.gold}}>₹4,160 in your pocket</strong> for doing nothing.
        </div>
      </div>

      <div className="card fu1" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginBottom:20}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:20}}>Capital Gains Breakdown</div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Holding","Hold Days","Gain","Tax Type","Tax Rate","Tax Due","Action"].map(h=>(
                  <th key={h} style={{fontSize:10,color:T.textDim,fontWeight:600,textAlign:"left",padding:"8px 12px",letterSpacing:"0.06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TAX_DATA.map((t,i)=>(
                <tr key={i} className="holding-row" style={{borderBottom:`1px solid ${T.border}20`}}>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.text,fontWeight:500}}>{t.holding}</td>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.textSub}}>{t.holdDays} days</td>
                  <td style={{padding:"14px 12px",fontSize:13,color:T.green,fontWeight:500}}>{fmt(t.gain)}</td>
                  <td style={{padding:"14px 12px"}}>
                    <Badge label={t.taxable} color={t.taxable==="STCG"?T.red:T.teal} bg={t.taxable==="STCG"?T.redDim:T.tealDim}/>
                  </td>
                  <td style={{padding:"14px 12px",fontSize:13,color:t.taxable==="STCG"?T.red:T.textSub}}>{t.taxRate}</td>
                  <td style={{padding:"14px 12px",fontSize:13,color:t.taxAmt>0?T.red:T.green,fontWeight:500}}>{t.taxAmt>0?fmt(t.taxAmt):"₹0"}</td>
                  <td style={{padding:"14px 12px",fontSize:12,color:T.gold,maxWidth:200}}>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginTop:20}}>
          {[
            {l:"Total Gains",v:fmt(TAX_DATA.reduce((s,t)=>s+t.gain,0)),c:T.green},
            {l:"Tax if you sell today",v:fmt(TAX_DATA.reduce((s,t)=>s+t.taxAmt,0)),c:T.red},
            {l:"Tax if you wait",v:"₹0",c:T.green},
            {l:"You save",v:fmt(totalTaxSavable),c:T.gold},
          ].map((s,i)=>(
            <div key={i} style={{background:T.surface,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>{s.l}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION: NEWS
══════════════════════════════════════════════════════ */
const NewsPage = () => (
  <div>
    <SH title="News That Matters to YOU" sub="Not all the noise — only news directly relevant to what you actually own. Filtered for your portfolio."/>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {NEWS.map((n,i)=>(
        <div key={i} className={`card fu${Math.min(i,4)}`} style={{
          background:T.card,
          border:`1px solid ${n.sentiment==="positive"?T.green+"30":T.red+"30"}`,
          borderLeft:`3px solid ${n.sentiment==="positive"?T.green:T.red}`,
          borderRadius:14,padding:"18px 22px",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                {n.relevance.map((r,j)=>(
                  <Badge key={j} label={`Affects: ${r}`} color={T.blue} bg={T.blueDim}/>
                ))}
                <Badge label={n.sentiment==="positive"?"↑ Bullish":"↓ Bearish"} color={n.sentiment==="positive"?T.green:T.red} bg={n.sentiment==="positive"?T.greenDim:T.redDim}/>
              </div>
              <div style={{fontSize:15,color:T.text,fontWeight:500,lineHeight:1.5,marginBottom:8}}>{n.headline}</div>
              <div style={{display:"flex",gap:12,fontSize:11,color:T.textDim}}>
                <span>{n.source}</span>
                <span>·</span>
                <span>{n.time}</span>
              </div>
            </div>
            <div style={{fontSize:20}}>{n.sentiment==="positive"?"📈":"📉"}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="fu" style={{marginTop:20,padding:"16px 20px",background:T.surface,borderRadius:12,fontSize:13,color:T.textSub,lineHeight:1.7}}>
      <strong style={{color:T.text}}>How this works:</strong> RAYR monitors news from ET Markets, Mint, CNBC TV18, Business Standard and Moneycontrol and matches headlines to your exact fund holdings and stocks. You only see what affects your money — nothing else.
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: OPTIMIZER
══════════════════════════════════════════════════════ */
const OptimizerPage = () => (
  <div>
    <SH title="Portfolio Optimizer" sub="Not generic advice. Every recommendation below is calculated from YOUR exact holdings, YOUR risk profile, YOUR goals."/>

    <div className="fu" style={{background:`linear-gradient(135deg,${T.greenDim},transparent)`,border:`1px solid ${T.green}30`,borderRadius:16,padding:"20px 24px",marginBottom:24}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:T.green,fontWeight:600,marginBottom:8}}>Health Score: 72 → 88 if you do this</div>
      <div style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>
        Implementing all 6 recommendations below is estimated to: 
        reduce your worst-case drawdown by <strong style={{color:T.text}}>~8%</strong>, 
        improve annual returns by <strong style={{color:T.text}}>1.2–1.8%</strong>, 
        and save <strong style={{color:T.gold}}>₹6,560/year</strong> in fees and taxes.
      </div>
    </div>

    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {OPTIMIZATIONS.map((o,i)=>{
        const tc={reduce:T.red,exit:T.red,add:T.green,increase:T.teal}[o.type];
        const tl={reduce:"REDUCE",exit:"EXIT POSITION",add:"ADD NEW",increase:"INCREASE"}[o.type];
        return (
          <div key={i} className={`card fu${Math.min(i,4)}`} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <Badge label={tl} color={tc} bg={tc+"18"}/>
                  <PrioBadge p={o.p}/>
                </div>
                <div style={{fontSize:16,color:T.text,fontWeight:500,marginBottom:6}}>{o.action}</div>
                <div style={{fontSize:13,color:T.textSub,marginBottom:4}}>
                  {o.from} → <strong style={{color:T.text}}>{o.to}</strong>
                  {o.amt>0&&<span style={{color:T.textDim}}> (approx. {fmtL(o.amt)})</span>}
                </div>
              </div>
              <div style={{background:T.greenDim,border:`1px solid ${T.green}30`,borderRadius:12,padding:"12px 16px",textAlign:"center",minWidth:170,flexShrink:0}}>
                <div style={{fontSize:10,color:T.textSub,marginBottom:4}}>Expected Outcome</div>
                <div style={{fontSize:13,color:T.green,fontWeight:500,lineHeight:1.5}}>{o.impact}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Optimized portfolio preview */}
    <div className="card fu" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"24px",marginTop:24}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:T.text,marginBottom:16}}>After Optimization — New Allocation</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
        {[
          {n:"HDFC Flexi Cap",w:25,c:T.palette[0]},
          {n:"Axis Small Cap",w:8,c:T.palette[2]},
          {n:"SBI Banking ETF",w:8,c:T.palette[3]},
          {n:"ICICI Pru Tech",w:10,c:T.palette[4]},
          {n:"Nippon Gold ETF",w:8,c:T.palette[5]},
          {n:"Kotak Bond Fund",w:15,c:T.palette[6]},
          {n:"Reliance Ind.",w:5,c:T.palette[7]},
          {n:"Mirae Healthcare",w:5,c:T.palette[8]},
          {n:"Midcap 150 Index",w:7,c:T.palette[9]},
          {n:"International ETF",w:9,c:T.purple},
        ].map((f,i)=>(
          <div key={i} style={{background:T.surface,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${f.c}`}}>
            <div style={{fontSize:11,color:T.textSub,marginBottom:4}}>{f.n}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:f.c}}>{f.w}%</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,fontSize:12,color:T.textSub,lineHeight:1.7}}>
        This optimized allocation achieves: <strong style={{color:T.text}}>10 funds</strong>, true diversification across sectors, 
        <strong style={{color:T.green}}> 0% overlap</strong>, <strong style={{color:T.teal}}>15% debt cushion</strong>, and balanced risk distribution.
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SECTION: DR. RAYR (AI ADVISOR)
══════════════════════════════════════════════════════ */
const AdvisorPage = () => {
  const [msgs,setMsgs]=useState([
    { role:"rayr", text:`Hello ${USER.name} — I've analyzed every holding in your portfolio. I want to be direct with you: you're doing **better than most investors your age**, but you have 3 issues that are quietly costing you money. I've flagged them below, and I'm ready to answer any question you have — no jargon, just honest answers.` }
  ]);
  const [inp,setInp]=useState(""),  [loading,setLoading]=useState(false);
  const endRef=useRef();
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const QQ=["Is my portfolio risky?","Why is my score 72?","Where am I overexposed?","What's my worst case?","Should I add more debt?","When should I sell?","Am I beating inflation?","Is my SIP enough?"];

  const RESP={
    risk:`Your portfolio is **moderately aggressive** — I'd rate it 6.5/10 on risk. Here's why: you have 62% in equity, which is appropriate for your age and 7+ year horizon. But within that equity, your banking concentration (28%) is what worries me most. A single sector event could hit you hard from 3 directions simultaneously — your ETF, your large-cap funds, and your direct stocks all have banking exposure. The silver lining? Your Gold ETF and Bond Fund are performing their protective role well.`,
    score:`Your 72 comes from 6 factors. You score well on **Cost Efficiency (82)** — your expense ratios are low overall. And **Return Quality (76)** is solid — you're getting paid for the risk you take. Where you lose points: **Debt Cushion (48)** is too thin — you need more bonds as a shock absorber. **Sector Spread (55)** is hurt by your banking concentration. **Diversification (62)** is dragged down by the 67% overlap between your two large-cap funds. Fix those three and you're at 88 easily.`,
    exposed:`Banking is your biggest exposure issue — **28.4% of your total portfolio**. The recommended max for your profile is 12-15%. What makes it worse: it's not just your Banking ETF. Your large-cap funds (HDFC, Mirae) also hold 30-35% banking stocks internally. So when you see 28.4%, the actual effective banking exposure is closer to **35-38%** when you account for the underlying fund holdings.`,
    worst:`Your worst realistic scenario is a **Global Recession**, which historically would drop your portfolio by approximately 22%. That's ₹8.47L → ₹6.57L — a paper loss of ₹1.9L. The word "paper" is key here. In the 2020 crash, portfolios like yours recovered fully within **18 months**. Your Bond Fund and Gold ETF would cushion maybe 4-5% of that fall. You'd need to stay calm, keep your SIP running, and let compounding do its work.`,
    debt:`Yes — I'd suggest increasing from 10.5% to **15-18%**. Here's the honest truth most apps won't tell you: debt in a portfolio isn't about returns. It's about keeping you from panicking and selling during crashes. When your equity drops 20%, your Bond Fund drops 1-2%. That stability keeps you invested. That's worth far more than the 2% lower return on the debt portion. I'd add ₹42,000 to Kotak Bond Fund or a short-duration debt fund.`,
    sell:`Smart question. For **tax efficiency**, don't sell Axis Small Cap or ICICI Tech for 75-110 more days — that converts STCG to LTCG and saves you ₹4,160 in tax. For **portfolio rebalancing**, the one holding I'd prioritize exiting is Mirae Asset Large Cap — not because it's a bad fund, but because 67% of it is already in your HDFC Flexi Cap. You're not getting diversification, you're getting duplication.`,
    inflation:`Yes — **your portfolio is beating inflation comfortably**. India's average inflation is 5-6%. Your portfolio returned **+16.9% all-time** and your 1-year equity returns range from 8% to 22%. Your real return (after inflation) is approximately **+7-11% annually**. Gold (16.3% last year) is specifically inflation-protection and is working perfectly. Your Bond Fund (7.2%) beats inflation marginally — it's not meant to beat it significantly, just preserve.`,
    sip:`Your ₹25,000/month SIP is good but may not be enough depending on your goals. For **Dream Home in 7 years** — you're on track if you increase SIP by ₹5,000/month as your income grows. For **Retirement at 55** — your ₹25K SIP at 12% returns gives you ₹2.3Cr at retirement. That's a decent base but below a comfortable retirement corpus for Bengaluru in today's terms. I'd suggest stepping up your SIP by 10% every year — a habit that has outsized impact over 20+ years.`,
  };

  const send=async(q)=>{
    const msg=q||inp.trim(); if(!msg) return;
    setInp(""); setMsgs(p=>[...p,{role:"user",text:msg}]); setLoading(true);
    await new Promise(r=>setTimeout(r,900+Math.random()*500));
    const l=msg.toLowerCase();
    let r=`Great question. Based on your specific portfolio of ₹8.47L across ${HOLDINGS.length} holdings — every number I give you is calculated from your actual data, not generic averages. What specific aspect of "${msg}" would you like me to dig deeper into?`;
    if(l.includes("risk")||l.includes("risky")) r=RESP.risk;
    else if(l.includes("score")||l.includes("72")) r=RESP.score;
    else if(l.includes("expos")||l.includes("overex")||l.includes("where")) r=RESP.exposed;
    else if(l.includes("worst")||l.includes("crash")||l.includes("market")) r=RESP.worst;
    else if(l.includes("debt")||l.includes("bond")) r=RESP.debt;
    else if(l.includes("sell")||l.includes("exit")||l.includes("when")) r=RESP.sell;
    else if(l.includes("inflat")) r=RESP.inflation;
    else if(l.includes("sip")||l.includes("enough")||l.includes("monthly")) r=RESP.sip;
    setMsgs(p=>[...p,{role:"rayr",text:r}]); setLoading(false);
  };

  return (
    <div>
      <SH title="Dr. RAYR — Your Portfolio Advisor" sub="1000 years of financial wisdom, applied to your exact portfolio. Ask anything. Get honest, plain-English answers."/>

      {/* Insight cards */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        {AI_INSIGHTS.map((ins,i)=>{
          const bc=ins.type==="warn"?T.red:ins.type==="good"?T.green:ins.type==="tax"?T.gold:T.purple;
          return (
            <div key={i} className={`card fu${Math.min(i,4)}`}
              style={{background:T.card,border:`1px solid ${bc}25`,borderLeft:`3px solid ${bc}`,borderRadius:14,padding:"18px 22px"}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{fontSize:20,lineHeight:1,flexShrink:0}}>{ins.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,color:T.text,fontWeight:500}}>{ins.title}</span>
                    <Badge label={ins.badge} color={bc} bg={bc+"15"}/>
                  </div>
                  <div style={{fontSize:13,color:T.textSub,lineHeight:1.75,marginBottom:8}}>{ins.detail}</div>
                  <div style={{background:bc+"12",border:`1px solid ${bc}25`,borderRadius:8,padding:"10px 14px",fontSize:13,color:bc,lineHeight:1.6}}>
                    💡 <strong>Action: </strong>{ins.action}
                    <span style={{color:T.textSub,marginLeft:8}}>· {ins.saving}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat */}
      <div className="fu" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:T.surface,padding:"14px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
          <div className="glow-ring" style={{width:40,height:40,borderRadius:"50%",background:T.goldDim,border:`2px solid ${T.gold}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✦</div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.text,fontWeight:500}}>Dr. RAYR</div>
            <div style={{fontSize:11,color:T.teal}}>● Online · Knows your full portfolio · No conflicts of interest</div>
          </div>
          <div style={{marginLeft:"auto",background:T.greenDim,border:`1px solid ${T.green}30`,borderRadius:8,padding:"4px 10px",fontSize:11,color:T.green}}>
            Powered by AI · Free forever
          </div>
        </div>

        {/* Messages */}
        <div style={{padding:"20px",height:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeIn 0.3s ease"}}>
              <div style={{
                maxWidth:"76%",
                background:m.role==="user"?T.goldDim:T.surface,
                border:`1px solid ${m.role==="user"?T.gold+"40":T.border}`,
                borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
                padding:"12px 16px",fontSize:14,color:T.text,lineHeight:1.75,
              }}>
                {m.text.split("**").map((part,j)=>j%2===1?<strong key={j} style={{color:T.goldBr}}>{part}</strong>:part)}
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",justifyContent:"flex-start"}}>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"16px 16px 16px 4px",padding:"14px 18px",display:"flex",gap:4,alignItems:"center"}}>
                <span className="dot1" style={{width:7,height:7,borderRadius:"50%",background:T.gold,display:"block"}}/>
                <span className="dot2" style={{width:7,height:7,borderRadius:"50%",background:T.gold,display:"block"}}/>
                <span className="dot3" style={{width:7,height:7,borderRadius:"50%",background:T.gold,display:"block"}}/>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Quick questions */}
        <div style={{padding:"4px 20px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
          {QQ.map((q,i)=>(
            <button key={i} onClick={()=>send(q)} style={{
              background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,
              padding:"6px 12px",fontSize:12,color:T.textSub,transition:"all 0.15s",
            }}
              onMouseEnter={e=>{e.target.style.borderColor=T.gold+"70";e.target.style.color=T.gold;}}
              onMouseLeave={e=>{e.target.style.borderColor=T.border;e.target.style.color=T.textSub;}}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{padding:"8px 20px 20px",display:"flex",gap:10}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask anything about your portfolio..."
            className="input-field"
            style={{flex:1,background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 16px",fontSize:14,color:T.text,outline:"none",fontFamily:"'Outfit',sans-serif",transition:"all 0.2s"}}/>
          <button onClick={()=>send()} className="btn-primary"
            style={{background:T.gold,border:"none",borderRadius:12,padding:"12px 22px",fontSize:14,fontWeight:600,color:"#06080F",fontFamily:"'Outfit',sans-serif"}}>
            Ask →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SECTION: SHARE CARD (VIRAL FEATURE)
══════════════════════════════════════════════════════ */
const SharePage = () => {
  const [copied,setCopied]=useState(false);
  const copy=()=>{ setCopied(true); toast("Portfolio report card copied!","success"); setTimeout(()=>setCopied(false),2000); };
  return (
    <div>
      <SH title="Share Your Portfolio Report Card" sub="The viral feature — share your health score and invite friends to check their portfolios."/>

      {/* The shareable card */}
      <div className="fu" id="shareCard" style={{
        background:"linear-gradient(135deg,#0D1830 0%,#0A1020 40%,#0D1525 100%)",
        border:`1px solid ${T.borderMd}`,borderRadius:24,padding:"36px 40px",
        maxWidth:540,margin:"0 auto 32px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",background:`radial-gradient(circle,${T.goldGlow} 0%,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,rgba(91,144,224,0.12) 0%,transparent 70%)`}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.015) 1px,transparent 0)",backgroundSize:"20px 20px"}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:T.gold,letterSpacing:"-0.02em"}}>RAYR</div>
            <div style={{fontSize:11,color:T.textSub,letterSpacing:"0.1em"}}>PORTFOLIO INTELLIGENCE</div>
          </div>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.textSub,marginBottom:16}}>{USER.name}'s Portfolio Health</div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
              <ScoreRing score={72} size={160} stroke={12} label="Health Score"/>
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:T.gold,fontWeight:600,marginBottom:4}}>Moderate Health</div>
            <div style={{fontSize:13,color:T.textSub}}>Better than 67% of investors aged 32</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28}}>
            {[
              {l:"Portfolio Value",v:fmtL(TOTAL_VALUE),c:T.text},
              {l:"Total Returns",v:`+${TOTAL_GAIN_PCT}%`,c:T.green},
              {l:"Vs Nifty 50",v:"+4.2%",c:T.teal},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px",textAlign:"center",border:`1px solid ${T.borderMd}`}}>
                <div style={{fontSize:10,color:T.textSub,marginBottom:4}}>{s.l}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",fontSize:12,color:T.textDim}}>rayr.app · Get your free portfolio checkup</div>
        </div>
      </div>

      {/* Share options */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,maxWidth:540,margin:"0 auto"}}>
        {[
          {label:"Copy Report Card",icon:"📋",action:copy,color:T.gold},
          {label:"Share on Twitter",icon:"🐦",action:()=>toast("Opening Twitter...","success"),color:T.blue},
          {label:"Share on WhatsApp",icon:"💬",action:()=>toast("Opening WhatsApp...","success"),color:T.green},
          {label:"Download as Image",icon:"⬇️",action:()=>toast("Downloading...","success"),color:T.purple},
        ].map((s,i)=>(
          <button key={i} className="btn-primary" onClick={s.action}
            style={{background:s.color+"18",border:`1px solid ${s.color}40`,borderRadius:12,padding:"14px 16px",
              fontSize:14,color:s.color,fontFamily:"'Outfit',sans-serif",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {s.icon} {i===0&&copied?"Copied!":s.label}
          </button>
        ))}
      </div>

      <div className="fu" style={{marginTop:32,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 24px",maxWidth:540,margin:"32px auto 0"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:T.text,fontWeight:600,marginBottom:8}}>Why This Goes Viral</div>
        <div style={{fontSize:13,color:T.textSub,lineHeight:1.8}}>
          Share your score with friends. Challenge them to check theirs. 
          Every person who sees this card is a potential RAYR user — because every investor is curious about their health score. 
          This is your <strong style={{color:T.gold}}>growth flywheel</strong>.
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SIDEBAR NAVIGATION
══════════════════════════════════════════════════════ */
const NAV = [
  { id:"dashboard", icon:"◈", label:"Overview",    sub:"Your pulse" },
  { id:"health",    icon:"♥", label:"Health Score", sub:"Full diagnosis" },
  { id:"exposure",  icon:"◎", label:"Exposure Map", sub:"Where your money is" },
  { id:"overlap",   icon:"⊕", label:"Overlap",      sub:"Hidden duplicates" },
  { id:"risk",      icon:"△", label:"Risk Simulator",sub:"Stress test" },
  { id:"sip",       icon:"↻", label:"SIP Tracker",  sub:"Monthly investments" },
  { id:"goals",     icon:"◇", label:"Goals",        sub:"Are you on track?" },
  { id:"tax",       icon:"₹", label:"Tax Planner",  sub:"Save ₹4,160" },
  { id:"news",      icon:"◉", label:"News For You", sub:"Only what matters" },
  { id:"optimize",  icon:"✦", label:"Optimizer",    sub:"Your action plan" },
  { id:"advisor",   icon:"🩺", label:"Dr. RAYR",    sub:"Ask anything" },
  { id:"share",     icon:"↗", label:"Share",        sub:"Go viral" },
];

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [page,setPage]=useState("dashboard");

  const pages={
    dashboard:<Dashboard setPage={setPage}/>,
    health:   <HealthPage/>,
    exposure: <ExposurePage/>,
    overlap:  <OverlapPage/>,
    risk:     <RiskPage/>,
    sip:      <SIPPage/>,
    goals:    <GoalsPage/>,
    tax:      <TaxPage/>,
    news:     <NewsPage/>,
    optimize: <OptimizerPage/>,
    advisor:  <AdvisorPage/>,
    share:    <SharePage/>,
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex"}}>
      <GlobalStyles/>
      <ToastManager/>

      {/* SIDEBAR */}
      <aside style={{
        width:230,minHeight:"100vh",background:T.surface,
        borderRight:`1px solid ${T.border}`,
        display:"flex",flexDirection:"column",
        position:"fixed",top:0,left:0,zIndex:100,
      }}>
        {/* Brand */}
        <div style={{padding:"24px 20px 20px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:T.gold,letterSpacing:"-0.03em",lineHeight:1}}>RAYR</div>
          <div style={{fontSize:9,color:T.textDim,letterSpacing:"0.15em",marginTop:3}}>PORTFOLIO INTELLIGENCE ENGINE</div>
        </div>

        {/* User */}
        <div style={{padding:"14px 20px 16px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:T.goldDim,border:`2px solid ${T.gold}40`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:T.gold,fontWeight:700,flexShrink:0}}>
              {USER.name[0]}
            </div>
            <div>
              <div style={{fontSize:14,color:T.text,fontWeight:500}}>{USER.name}</div>
              <div style={{fontSize:11,color:T.textSub}}>{USER.riskProfile} · {USER.experience}</div>
            </div>
          </div>
          <div style={{marginTop:10,display:"flex",gap:8}}>
            <div style={{flex:1,background:T.goldDim,border:`1px solid ${T.gold}30`,borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
              <div style={{fontSize:9,color:T.textSub}}>Health</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.gold}}>72</div>
            </div>
            <div style={{flex:1,background:T.greenDim,border:`1px solid ${T.green}30`,borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
              <div style={{fontSize:9,color:T.textSub}}>Returns</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:T.green}}>+17%</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{padding:"10px 10px",flex:1,overflowY:"auto"}}>
          {NAV.map(item=>{
            const isA=page===item.id;
            const isTax=item.id==="tax", isAlert=item.id==="advisor";
            return (
              <div key={item.id} onClick={()=>setPage(item.id)}
                className="nav-item"
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  padding:"9px 10px",borderRadius:10,cursor:"pointer",
                  background:isA?T.goldDim:"transparent",
                  border:`1px solid ${isA?T.gold+"40":"transparent"}`,
                  marginBottom:3,position:"relative",
                }}>
                <span style={{fontSize:13,color:isA?T.gold:T.textSub,width:16,textAlign:"center",flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:12,color:isA?T.gold:T.textSub,fontWeight:isA?600:400,lineHeight:1.2}}>{item.label}</div>
                  <div style={{fontSize:10,color:T.textDim}}>{item.sub}</div>
                </div>
                {isTax&&<div style={{marginLeft:"auto",background:T.gold,borderRadius:"50%",width:6,height:6,flexShrink:0}}/>}
                {isAlert&&<div style={{marginLeft:"auto",background:T.red,borderRadius:"50%",width:6,height:6,flexShrink:0}}/>}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.textDim,marginBottom:4,letterSpacing:"0.06em"}}>DATA SOURCES</div>
          <div style={{fontSize:11,color:T.teal}}>● NSE · BSE · AMFI · RBI</div>
          <div style={{fontSize:10,color:T.textDim,marginTop:4}}>Refreshed 2 min ago · Secure</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main key={page} style={{marginLeft:230,flex:1,padding:"36px 40px",maxWidth:"calc(100vw - 230px)",minHeight:"100vh"}}>
        {pages[page]||<Dashboard setPage={setPage}/>}
      </main>
    </div>
  );
}
