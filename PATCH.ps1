# RAYR PATCH.ps1 — Fixes all issues in App.jsx using precise line matching
# Run from: C:\Users\adith\Desktop\akka\RAYR – AI Portfolio Intelligence\rayr

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$APP  = "$ROOT\rayr-ui\src\App.jsx"

Write-Host ""
Write-Host "RAYR Patch Script" -ForegroundColor Yellow
Write-Host "Patching: $APP" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path $APP)) {
    Write-Host "ERROR: App.jsx not found. Make sure you are in the rayr folder." -ForegroundColor Red
    exit 1
}

$lines = Get-Content $APP -Encoding UTF8
$out   = [System.Collections.Generic.List[string]]::new()
$i     = 0

while ($i -lt $lines.Count) {
    $line = $lines[$i]

    # FIX 1: Replace const USER = { ... }; with let USER using DEFAULT_USER
    if ($line -eq 'const USER = {') {
        $out.Add('const DEFAULT_USER = {')
        $i++
        while ($i -lt $lines.Count -and $lines[$i] -ne '};') {
            $out.Add($lines[$i])
            $i++
        }
        $out.Add('};')
        $out.Add('// USER is updated dynamically after onboarding')
        $out.Add('let USER = Object.assign({}, DEFAULT_USER);')
        $i++
        continue
    }

    # FIX 2: Fix Twitter share button
    if ($line -match "action:\(\)=>toast\(`"Opening Twitter") {
        $out.Add('          {label:"Share on Twitter",icon:"\u{1F426}",action:()=>{ var t=encodeURIComponent("My RAYR portfolio health score is 72/100. I beat Nifty 50 this year. Check yours free at https://rayr-06.github.io/rayr-Fin"); window.open("https://twitter.com/intent/tweet?text="+t,"_blank"); },color:T.blue},')
        $i++
        continue
    }

    # FIX 3: Fix WhatsApp share button
    if ($line -match "action:\(\)=>toast\(`"Opening WhatsApp") {
        $out.Add('          {label:"Share on WhatsApp",icon:"\u{1F4AC}",action:()=>{ var t=encodeURIComponent("My portfolio health score is 72/100 on RAYR. Check yours free: https://rayr-06.github.io/rayr-Fin"); window.open("https://wa.me/?text="+t,"_blank"); },color:T.green},')
        $i++
        continue
    }

    # FIX 4: Fix hardcoded timestamp
    if ($line -match '"Live · Updated 2 min ago"') {
        $fixed = $line -replace '"Live \xB7 Updated 2 min ago"', '`Live \xB7 ${new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}`'
        $out.Add($fixed)
        $i++
        continue
    }

    # FIX 5: Fix wrong Kotak Bond tax note
    if ($line -match 'Taxed at slab rate if STCG') {
        $fixed = $line -replace 'Taxed at slab rate if STCG', 'Taxed at income slab rate (Finance Act 2023)'
        $out.Add($fixed)
        $i++
        continue
    }

    # FIX 6: Insert OnboardingScreen before MAIN APP comment
    if ($line -match '\/\*.*MAIN APP') {
        # Insert the entire OnboardingScreen component here
        $out.Add('/* ══════════════════════════════════════════════════════')
        $out.Add('   ONBOARDING SCREEN')
        $out.Add('══════════════════════════════════════════════════════ */')
        $out.Add('const OnboardingScreen = ({ onComplete }) => {')
        $out.Add('  const [name, setName] = useState("");')
        $out.Add('  const [city, setCity] = useState("");')
        $out.Add('  const [risk, setRisk] = useState("Moderate");')
        $out.Add('  const [sip,  setSip]  = useState("25000");')
        $out.Add('  const [step, setStep] = useState(1);')
        $out.Add('  const inp = { background:T.card, border:`1px solid ${T.borderMd}`, borderRadius:12, padding:"14px 18px", fontSize:15, color:T.text, width:"100%", outline:"none", fontFamily:"''Outfit'',sans-serif" };')
        $out.Add('  const next = () => {')
        $out.Add('    if (step===1 && name.trim().length < 2) { toast("Enter your name to continue","warn"); return; }')
        $out.Add('    if (step < 2) { setStep(s=>s+1); return; }')
        $out.Add('    onComplete({ name:name.trim(), city:city.trim()||"India", riskProfile:risk, experience:"New User", monthlyIncome:150000, monthlySIP:parseInt(sip)||25000, memberSince:new Date().toLocaleDateString("en-IN",{month:"short",year:"numeric"}) });')
        $out.Add('  };')
        $out.Add('  return (')
        $out.Add('    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>')
        $out.Add('      <div style={{position:"absolute",top:"35%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,167,85,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>') 
        $out.Add('      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.018) 1px,transparent 0)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>') 
        $out.Add('      <div className="sc" style={{width:"100%",maxWidth:460,position:"relative"}}>')
        $out.Add('        <div style={{textAlign:"center",marginBottom:36}}>')
        $out.Add('          <div style={{fontFamily:"''Cormorant Garamond'',serif",fontSize:52,fontWeight:700,color:T.gold,letterSpacing:"-0.03em",lineHeight:1}}>RAYR</div>')
        $out.Add('          <div style={{fontSize:11,color:T.textDim,letterSpacing:"0.2em",marginTop:6,textTransform:"uppercase"}}>Portfolio Intelligence Engine</div>')
        $out.Add('        </div>')
        $out.Add('        <div style={{background:T.card,border:`1px solid ${T.borderMd}`,borderRadius:20,padding:"36px 32px"}}>')
        $out.Add('          <div style={{display:"flex",gap:8,marginBottom:32}}>')
        $out.Add('            {[1,2].map(s=>(<div key={s} style={{flex:1,height:3,borderRadius:2,background:s<=step?T.gold:T.border,transition:"background 0.3s"}}/>))};')
        $out.Add('          </div>')
        $out.Add('          {step===1&&(<div className="fu">')
        $out.Add('            <div style={{fontFamily:"''Cormorant Garamond'',serif",fontSize:26,fontWeight:600,color:T.text,marginBottom:8}}>Welcome. What is your name?</div>')
        $out.Add('            <div style={{fontSize:14,color:T.textSub,marginBottom:28,lineHeight:1.7}}>RAYR personalises every insight for you. Your data stays in your browser only.</div>')
        $out.Add('            <div style={{marginBottom:20}}>')
        $out.Add('              <label style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>Your Name</label>')
        $out.Add('              <input className="input-field" style={inp} placeholder="e.g. Priya, Rohit, Kavya..." value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&next()} autoFocus/>')
        $out.Add('            </div>')
        $out.Add('            <div style={{marginBottom:28}}>')
        $out.Add('              <label style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>City (optional)</label>')
        $out.Add('              <input className="input-field" style={inp} placeholder="e.g. Bengaluru, Mumbai, Delhi..." value={city} onChange={e=>setCity(e.target.value)} onKeyDown={e=>e.key==="Enter"&&next()}/>')
        $out.Add('            </div>')
        $out.Add('          </div>)}')
        $out.Add('          {step===2&&(<div className="fu">')
        $out.Add('            <div style={{fontFamily:"''Cormorant Garamond'',serif",fontSize:26,fontWeight:600,color:T.text,marginBottom:8}}>Hi {name}! Quick setup.</div>')
        $out.Add('            <div style={{fontSize:14,color:T.textSub,marginBottom:28,lineHeight:1.7}}>30 seconds. Makes every insight specific to your situation.</div>')
        $out.Add('            <div style={{marginBottom:20}}>')
        $out.Add('              <label style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:10}}>Risk Appetite</label>')
        $out.Add('              <div style={{display:"flex",gap:10}}>')
        $out.Add('                {["Conservative","Moderate","Aggressive"].map(r=>(<button key={r} onClick={()=>setRisk(r)} style={{flex:1,padding:"12px 4px",borderRadius:10,border:`1px solid ${risk===r?T.gold:T.borderMd}`,background:risk===r?T.goldDim:T.surface,color:risk===r?T.gold:T.textSub,fontFamily:"''Outfit'',sans-serif",fontSize:12,fontWeight:risk===r?600:400,cursor:"pointer"}}>{r}</button>))}')
        $out.Add('              </div>')
        $out.Add('            </div>')
        $out.Add('            <div style={{marginBottom:28}}>')
        $out.Add('              <label style={{fontSize:11,color:T.textSub,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>Monthly SIP (Rs)</label>')
        $out.Add('              <input className="input-field" style={inp} placeholder="e.g. 10000" value={sip} type="number" onChange={e=>setSip(e.target.value)} onKeyDown={e=>e.key==="Enter"&&next()}/>')
        $out.Add('            </div>')
        $out.Add('          </div>)}')
        $out.Add('          <button className="btn-primary" onClick={next} style={{width:"100%",background:T.gold,border:"none",borderRadius:12,padding:"15px",fontSize:16,fontWeight:600,color:"#06080F",fontFamily:"''Outfit'',sans-serif"}}>')
        $out.Add('            {step===1?"Continue \u2192":"Show My Portfolio Health Score \u2192"}')
        $out.Add('          </button>')
        $out.Add('          {step===2&&<button onClick={()=>setStep(1)} style={{width:"100%",background:"transparent",border:"none",color:T.textSub,fontSize:13,marginTop:12,cursor:"pointer",fontFamily:"''Outfit'',sans-serif"}}>\u2190 Back</button>}')
        $out.Add('        </div>')
        $out.Add('        <div style={{textAlign:"center",marginTop:20,fontSize:12,color:T.textDim,lineHeight:1.9}}>')
        $out.Add('          Demo with sample portfolio data \xB7 Name used for display only<br/>No account needed \xB7 Nothing stored \xB7 Free forever')
        $out.Add('        </div>')
        $out.Add('      </div>')
        $out.Add('    </div>')
        $out.Add('  );')
        $out.Add('};')
        $out.Add('')
        # Now add the MAIN APP comment and continue
        $out.Add($line)
        $i++
        continue
    }

    # FIX 7: Replace the export default function App() opening to add login state
    if ($line -eq 'export default function App() {') {
        $out.Add('export default function App() {')
        $out.Add('  const [loggedInUser, setLoggedInUser] = useState(null);')
        # Skip the next line which is the old [page,setPage] line
        $i++
        if ($i -lt $lines.Count -and $lines[$i] -match 'const \[page,setPage\]') {
            $out.Add('  const [page,setPage]=useState("dashboard");')
            $out.Add('')
            $out.Add('  useEffect(()=>{')
            $out.Add('    if(loggedInUser){')
            $out.Add('      USER.name        = loggedInUser.name;')
            $out.Add('      USER.city        = loggedInUser.city;')
            $out.Add('      USER.riskProfile = loggedInUser.riskProfile;')
            $out.Add('      USER.monthlySIP  = loggedInUser.monthlySIP;')
            $out.Add('      USER.memberSince = loggedInUser.memberSince;')
            $out.Add('    }')
            $out.Add('  },[loggedInUser]);')
            $out.Add('')
            $out.Add('  if(!loggedInUser) return(')
            $out.Add('    <>')
            $out.Add('      <GlobalStyles/>')
            $out.Add('      <ToastManager/>')
            $out.Add('      <OnboardingScreen onComplete={setLoggedInUser}/>')
            $out.Add('    </>')
            $out.Add('  );')
            $out.Add('')
        }
        $i++
        continue
    }

    $out.Add($line)
    $i++
}

Set-Content $APP -Value $out -Encoding UTF8

Write-Host "All patches applied!" -ForegroundColor Green
Write-Host ""
Write-Host "Lines in patched App.jsx: $($out.Count)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Now restart dev server:" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl+C in the terminal running npm run dev" -ForegroundColor Cyan
Write-Host "  2. Run: npm run dev" -ForegroundColor Cyan
Write-Host "  3. Open: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  4. You should see the RAYR onboarding screen first." -ForegroundColor Green
