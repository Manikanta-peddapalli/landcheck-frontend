import { useState, useEffect, createContext, useContext } from "react";

const T = {
  en: { appName:"LandCheck", tagline:"Verify Land. Stop Fraud. Protect Families.", login:"Login", register:"Register", logout:"Logout", fieldScan:"Field Scanner", dashboard:"Dashboard" },
  te: { appName:"LandCheck", tagline:"భూమి ధృవీకరించండి. మోసం ఆపండి.", login:"లాగిన్", register:"నమోదు", logout:"లాగౌట్", fieldScan:"భూమి స్కాన్", dashboard:"డాష్‌బోర్డ్" }
};

const LangCtx = createContext();
const AuthCtx = createContext();
function useLang(){ return useContext(LangCtx); }
function useAuth(){ return useContext(AuthCtx); }

const FOREST="#2D5A1E", GOLD="#C8860C", CREAM="#F5F0E8", ERR="#C0392B", OK="#2D7A3A";

const DEMO_PLOTS = [
  { surveyNumber:"441/2A", ownerName:"Ravi Kumar Reddy", extent:"2.50 Acres", landType:"Agricultural", riskLevel:"Low", riskScore:12, soilType:"Black Cotton Soil", waterSource:"Canal Irrigation", cropGrown:"Paddy", marketValue:"₹45,00,000", ecStatus:"Clear — No encumbrances", bankLoan:"No active loan", courtCase:"No disputes", boundaries:{north:"Survey 441/1 — Gopal Rao",south:"Canal Road",east:"Survey 442",west:"Village Road"}, previousOwners:["Gopal Rao (1985–2001)","Suresh Rao (2001–2015)","Ravi Kumar Reddy (2015–Now)"] },
  { surveyNumber:"441/3", ownerName:"Suresh Rao", extent:"1.20 Acres", landType:"Agricultural", riskLevel:"Medium", riskScore:44, soilType:"Red Soil", waterSource:"Borewell", cropGrown:"Cotton", marketValue:"₹22,00,000", ecStatus:"Clear", bankLoan:"No loan", courtCase:"Minor boundary dispute", boundaries:{north:"Survey 441/2A",south:"Road",east:"Survey 442",west:"Field"}, previousOwners:["Hanumaiah (1980–2005)","Suresh Rao (2005–Now)"] },
  { surveyNumber:"442/1", ownerName:"Lakshmi Devi", extent:"0.80 Acres", landType:"Residential", riskLevel:"High", riskScore:78, soilType:"Black Soil", waterSource:"None", cropGrown:"None", marketValue:"₹85,00,000", ecStatus:"⚠ Gap 2005–2012 detected!", bankLoan:"⚠ SBI Mortgage active", courtCase:"⚠ Civil dispute pending", boundaries:{north:"Road",south:"Building",east:"Survey 443",west:"Survey 441"}, previousOwners:["Ramaiah (1990–2005)","⚠ UNKNOWN (2005–2012) — FRAUD RISK!","Lakshmi Devi (2012–Now)"] },
  { surveyNumber:"443/2B", ownerName:"Venkata Subba Rao", extent:"3.75 Acres", landType:"Agricultural", riskLevel:"Low", riskScore:18, soilType:"Alluvial Soil", waterSource:"Canal + Borewell", cropGrown:"Cotton, Chilli", marketValue:"₹62,00,000", ecStatus:"Clear", bankLoan:"No loan", courtCase:"No disputes", boundaries:{north:"Survey 443/1",south:"Survey 444",east:"Canal",west:"Village Path"}, previousOwners:["Hanumaiah (1978–1999)","Venkata Subba Rao (1999–Now)"] },
  { surveyNumber:"444/1A", ownerName:"Hanumaiah Naidu", extent:"1.50 Acres", landType:"Agricultural", riskLevel:"Low", riskScore:8, soilType:"Sandy Loam", waterSource:"Rain-fed", cropGrown:"Groundnut", marketValue:"₹18,00,000", ecStatus:"Clear", bankLoan:"No loan", courtCase:"No disputes", boundaries:{north:"Survey 443",south:"Survey 445",east:"Road",west:"Field"}, previousOwners:["Hanumaiah Naidu (1970–Now)"] },
];

const RC={Low:OK,Medium:"#C8760C",High:ERR};
const RB={Low:"#E8F5E9",Medium:"#FFF3E0",High:"#FFEBEE"};

function RiskBadge({level,score}){
  return <span style={{background:RB[level],color:RC[level],padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{level==="Low"?"✅":level==="High"?"🚨":"⚠️"} {level} {score}/100</span>;
}

// ── PDF REPORT ───────────────────────────────────────────────
function downloadReport(plot, gps, isTe){
  const date = new Date().toLocaleDateString('en-IN');
  const time = new Date().toLocaleTimeString('en-IN');
  const riskColor = plot.riskLevel==="High"?"#C0392B":plot.riskLevel==="Medium"?"#C8760C":"#2D7A3A";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>LandCheck Report - ${plot.surveyNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu&family=Inter:wght@400;600;700;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#F5F0E8;color:#1a1a1a;padding:20px}
  .page{background:white;max-width:800px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}
  .header{background:#2D5A1E;padding:28px 32px;color:white}
  .logo{font-size:32px;margin-bottom:6px}
  .title{font-size:24px;font-weight:900;margin-bottom:4px}
  .sub{font-size:13px;opacity:.8}
  .risk-banner{background:${riskColor};padding:20px 32px;color:white;display:flex;justify-content:space-between;align-items:center}
  .risk-label{font-size:13px;opacity:.8;margin-bottom:4px}
  .risk-value{font-size:22px;font-weight:900}
  .risk-score{font-size:48px;font-weight:900}
  .content{padding:28px 32px}
  .section{margin-bottom:24px;border:1px solid #E8ECF0;border-radius:12px;overflow:hidden}
  .section-title{background:#F8F9FA;padding:12px 16px;font-weight:700;font-size:14px;color:#2D5A1E;border-bottom:1px solid #E8ECF0}
  .row{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #F5F5F5}
  .row:last-child{border-bottom:none}
  .key{font-size:13px;color:#666}
  .val{font-size:13px;font-weight:600;text-align:right;max-width:55%;color:${riskColor=="#C0392B"&&'.includes("⚠")'?"#C0392B":"#1a1a1a"}}
  .val.warn{color:#C0392B;font-weight:700}
  .owners{padding:12px 16px}
  .owner-item{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}
  .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
  .boundaries{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 16px}
  .boundary-box{background:#F8F9FA;border-radius:8px;padding:10px 12px}
  .boundary-dir{font-size:10px;color:#888;font-weight:700;margin-bottom:2px}
  .boundary-val{font-size:12px;color:#1a1a1a}
  .disclaimer{background:#FFF8E1;border:1px solid #FFB300;border-radius:10px;padding:14px;margin-top:20px;font-size:11px;color:#E65100;line-height:1.6}
  .footer{background:#F8F9FA;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#888;border-top:1px solid #E8ECF0}
  .watermark{font-weight:700;color:#2D5A1E;font-size:13px}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">🌾</div>
    <div class="title">LandCheck Verification Report</div>
    <div class="sub">Generated on ${date} at ${time} | landcheck-frontend.vercel.app</div>
  </div>

  <div class="risk-banner">
    <div>
      <div class="risk-label">RISK ASSESSMENT</div>
      <div class="risk-value">${plot.riskLevel==="Low"?"LOW RISK ✅":plot.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️"}</div>
      <div style="font-size:13px;opacity:.8;margin-top:4px">Survey: ${plot.surveyNumber} | ${gps?.village||""}, ${gps?.district||""}</div>
    </div>
    <div class="risk-score">${plot.riskScore}<span style="font-size:16px">/100</span></div>
  </div>

  <div class="content">

    <div class="section">
      <div class="section-title">📋 Land Details</div>
      ${[["Survey Number",plot.surveyNumber],["Owner Name",plot.ownerName],["Village",gps?.village||""],["Mandal",gps?.mandal||""],["District",gps?.district||""],["Land Type",plot.landType],["Extent",plot.extent],["Market Value",plot.marketValue]].map(([k,v])=>`<div class="row"><span class="key">${k}</span><span class="val ${String(v||"").includes("⚠")?"warn":""}">${v||"—"}</span></div>`).join("")}
    </div>

    <div class="section">
      <div class="section-title">🌱 Agricultural Details</div>
      ${[["Soil Type",plot.soilType],["Water Source",plot.waterSource],["Crop Grown",plot.cropGrown]].map(([k,v])=>`<div class="row"><span class="key">${k}</span><span class="val">${v||"—"}</span></div>`).join("")}
    </div>

    <div class="section">
      <div class="section-title">⚖️ Legal Status</div>
      ${[["EC Status",plot.ecStatus],["Bank Loan",plot.bankLoan],["Court Case",plot.courtCase]].map(([k,v])=>`<div class="row"><span class="key">${k}</span><span class="val ${String(v||"").includes("⚠")?"warn":""}">${v||"—"}</span></div>`).join("")}
    </div>

    <div class="section">
      <div class="section-title">👥 Previous Owners Chain</div>
      <div class="owners">
        ${plot.previousOwners?.map(o=>`<div class="owner-item"><div class="dot" style="background:${o.includes("UNKNOWN")?"#C0392B":"#2D7A3A"}"></div><span style="color:${o.includes("UNKNOWN")?"#C0392B":"#1a1a1a"};font-weight:${o.includes("UNKNOWN")?700:400}">${o}</span></div>`).join("") || ""}
      </div>
    </div>

    <div class="section">
      <div class="section-title">🧭 Boundaries</div>
      <div class="boundaries">
        <div class="boundary-box"><div class="boundary-dir">↑ NORTH</div><div class="boundary-val">${plot.boundaries?.north||"—"}</div></div>
        <div class="boundary-box"><div class="boundary-dir">↓ SOUTH</div><div class="boundary-val">${plot.boundaries?.south||"—"}</div></div>
        <div class="boundary-box"><div class="boundary-dir">→ EAST</div><div class="boundary-val">${plot.boundaries?.east||"—"}</div></div>
        <div class="boundary-box"><div class="boundary-dir">← WEST</div><div class="boundary-val">${plot.boundaries?.west||"—"}</div></div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚖️ Legal Disclaimer:</strong> This report is generated for informational purposes only based on available data. LandCheck does not provide legal advice. The data may not be 100% accurate or complete. Always verify with official government records and consult a qualified lawyer before making any land-related decisions. LandCheck is not liable for any decisions made based on this report.
    </div>

  </div>

  <div class="footer">
    <div class="watermark">🌾 LandCheck — Verify Land. Stop Fraud.</div>
    <div>Report ID: LC-${Date.now()} | ${date}</div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "LandCheck-Report-" + plot.surveyNumber.replace("/","-") + "-" + date.replace(/\//g,"-") + ".html";
  a.click();
  URL.revokeObjectURL(url);
}

function LandScanner({onClose}){
  const {isTe}=useLang();
  const [step,setStep]=useState("home");
  const [gps,setGps]=useState(null);
  const [plots,setPlots]=useState([]);
  const [sel,setSel]=useState(null);
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState("");
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";

  const handleGPS=()=>{
    setLoading(true);
    if(!navigator.geolocation){setLoading(false);return;}
    navigator.geolocation.getCurrentPosition(async(pos)=>{
      const {latitude:lat,longitude:lon}=pos.coords;
      try{
        const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,{headers:{"User-Agent":"LandCheck/1.0"}});
        const d=await r.json();const a=d.address||{};
        setGps({village:a.village||a.hamlet||a.town||"Magandlapalle",mandal:a.county||"Punganur",district:a.state_district||"Annamayya",lat,lon});
      }catch(e){setGps({village:"Magandlapalle",mandal:"Punganur",district:"Annamayya",lat,lon});}
      setPlots(DEMO_PLOTS);setLoading(false);setStep("plots");
    },()=>{
      setGps({village:"Magandlapalle",mandal:"Punganur",district:"Annamayya",lat:13.34,lon:78.53});
      setPlots(DEMO_PLOTS);setLoading(false);setStep("plots");
    },{timeout:10000,maximumAge:60000});
  };

  const filtered=search?plots.filter(p=>p.ownerName.toLowerCase().includes(search.toLowerCase())||p.surveyNumber.includes(search)):plots;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.8)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 -8px 48px rgba(0,0,0,.3)"}}>
        <div style={{background:FOREST,borderRadius:"20px 20px 0 0",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:40,height:40,background:GOLD,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📍</div>
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:16,fontFamily:ff}}>{step==="detail"?(isTe?"భూమి వివరాలు":"Land Details"):(isTe?"భూమి స్కాన్":"Field Scanner")}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{step==="plots"?`${filtered.length} ${isTe?"రికార్డులు":"records"}`:step==="detail"?`Survey: ${sel?.surveyNumber}`:(isTe?"GPS ఆటోమేటిక్":"GPS Automatic")}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {(step==="plots"||step==="detail")&&<button onClick={()=>{if(step==="detail")setStep("plots");else{setStep("home");setGps(null);setPlots([]);setSearch("");}}} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>← {isTe?"వెనక్కి":"Back"}</button>}
            <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button>
          </div>
        </div>
        <div style={{padding:20}}>
          {step==="home"&&(
            <div>
              <button onClick={handleGPS} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${FOREST},#4A8B35)`,color:"white",border:"none",borderRadius:16,padding:"28px",cursor:"pointer",textAlign:"center",marginBottom:16}}>
                {loading?(<div><div style={{width:48,height:48,border:"4px solid rgba(255,255,255,.3)",borderTop:"4px solid white",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 12px"}}/><div style={{fontWeight:700,fontFamily:ff}}>{isTe?"GPS గుర్తిస్తున్నాం...":"Detecting GPS..."}</div></div>):(
                  <div>
                    <div style={{fontSize:52,marginBottom:10}}>📍</div>
                    <div style={{fontWeight:800,fontSize:20,fontFamily:ff,marginBottom:6}}>{isTe?"నా భూమి వివరాలు చూడండి":"Check My Land"}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,.85)",fontFamily:ff}}>{isTe?"GPS నొక్కండి → అన్ని వివరాలు!":"Tap GPS → See all land details!"}</div>
                  </div>
                )}
              </button>
              <button onClick={()=>window.open("https://meebhoomi.ap.gov.in","_blank")} style={{width:"100%",background:"#E3F2FD",color:"#1565C0",border:"1.5px solid #90CAF9",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:13}}>
                🌐 {isTe?"MeeBhoomi నేరుగా తెరవండి":"Open MeeBhoomi Directly"}
              </button>
            </div>
          )}
          {step==="plots"&&(
            <div>
              {gps&&<div style={{background:"#E8F5E9",border:"2px solid #2D7A3A",borderRadius:12,padding:12,marginBottom:14,display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:24}}>📍</div><div><div style={{fontWeight:700,fontSize:14,color:"#2D7A3A",fontFamily:ff}}>{gps.village}</div><div style={{fontSize:12,color:"#666",fontFamily:ff}}>{gps.mandal} • {gps.district}</div></div></div>}
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isTe?"పేరు లేదా సర్వే నంబర్...":"Search name or survey no..."} style={{width:"100%",padding:"11px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:14,marginBottom:12}}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {filtered.map((p,i)=>(
                  <button key={i} onClick={()=>{setSel(p);setStep("detail");}} style={{background:"white",border:`1.5px solid ${p.riskLevel==="High"?"#FFCDD2":p.riskLevel==="Medium"?"#FFE0B2":"#C8E6C9"}`,borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"left"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontWeight:700,fontSize:14,fontFamily:ff}}>{p.ownerName}</div>
                      <RiskBadge level={p.riskLevel} score={p.riskScore}/>
                    </div>
                    <div style={{fontSize:12,color:"#666",fontFamily:ff}}>📋 {p.surveyNumber} &nbsp;•&nbsp; 📐 {p.extent} &nbsp;•&nbsp; 🌱 {p.landType}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step==="detail"&&sel&&(
            <div>
              <div style={{background:RB[sel.riskLevel],border:`2px solid ${RC[sel.riskLevel]}`,borderRadius:12,padding:"14px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:11,fontWeight:700,color:RC[sel.riskLevel],fontFamily:ff}}>RISK LEVEL</div><div style={{fontSize:20,fontWeight:800,color:RC[sel.riskLevel],fontFamily:ff}}>{sel.riskLevel==="Low"?"LOW RISK ✅":sel.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️"}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:36,fontWeight:800,color:RC[sel.riskLevel],fontFamily:ff}}>{sel.riskScore}</div><div style={{fontSize:11,color:"#666"}}>/100</div></div>
              </div>
              {[
                [isTe?"భూమి వివరాలు":"Land Details","📋",[[isTe?"సర్వే నంబర్":"Survey No",sel.surveyNumber],[isTe?"యజమాని":"Owner",sel.ownerName],[isTe?"గ్రామం":"Village",gps?.village],[isTe?"మండలం":"Mandal",gps?.mandal],[isTe?"జిల్లా":"District",gps?.district],[isTe?"భూమి రకం":"Land Type",sel.landType],[isTe?"విస్తీర్ణం":"Extent",sel.extent],[isTe?"మార్కెట్ విలువ":"Market Value",sel.marketValue]]],
                [isTe?"వ్యవసాయం":"Agriculture","🌱",[[isTe?"నేల రకం":"Soil Type",sel.soilType],[isTe?"నీటి వనరు":"Water Source",sel.waterSource],[isTe?"పంట":"Crop",sel.cropGrown]]],
                [isTe?"చట్టపరమైన స్థితి":"Legal Status","⚖️",[[isTe?"EC స్థితి":"EC Status",sel.ecStatus],[isTe?"బ్యాంక్ రుణం":"Bank Loan",sel.bankLoan],[isTe?"కోర్టు కేసు":"Court Case",sel.courtCase]]],
              ].map(([title,icon,rows])=>(
                <div key={title} style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff}}>{icon} {title}</div>
                  {rows.map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:7,marginBottom:7,borderBottom:"1px solid #F5F5F5"}}><span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span><span style={{fontSize:12,fontWeight:600,color:String(v||"").includes("⚠")?ERR:"#1a1a1a",fontFamily:ff,textAlign:"right",maxWidth:"58%"}}>{v}</span></div>))}
                </div>
              ))}
              <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff}}>👥 {isTe?"గత యజమానులు":"Previous Owners"}</div>
                {sel.previousOwners?.map((o,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><div style={{width:8,height:8,borderRadius:"50%",background:o.includes("UNKNOWN")?ERR:OK,flexShrink:0}}/><span style={{fontSize:12,color:o.includes("UNKNOWN")?ERR:"#1a1a1a",fontFamily:ff,fontWeight:o.includes("UNKNOWN")?700:400}}>{o}</span></div>))}
              </div>
              <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff}}>🧭 {isTe?"హద్దులు":"Boundaries"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["north","↑ North"],["south","↓ South"],["east","→ East"],["west","← West"]].map(([d,l])=>(<div key={d} style={{background:"#F8F9FA",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:10,color:"#666",fontWeight:700,marginBottom:2}}>{l}</div><div style={{fontSize:11,fontFamily:ff}}>{sel.boundaries?.[d]||"—"}</div></div>))}
                </div>
              </div>
              {gps?.lat&&(
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <a href={`https://www.google.com/maps?q=${gps.lat},${gps.lon}&z=18&t=k`} target="_blank" rel="noopener noreferrer" style={{flex:1,background:"#1565C0",color:"white",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,fontFamily:ff,textDecoration:"none",textAlign:"center",display:"block"}}>🛰 {isTe?"శాటిలైట్ వ్యూ":"Satellite View"}</a>
                  <a href={`https://maps.google.com/?q=${gps.lat},${gps.lon}`} target="_blank" rel="noopener noreferrer" style={{flex:1,background:OK,color:"white",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,fontFamily:ff,textDecoration:"none",textAlign:"center",display:"block"}}>🗺 {isTe?"దారి చూపించు":"Get Directions"}</a>
                </div>
              )}
              <button onClick={()=>downloadReport(sel,gps,isTe)} style={{width:"100%",background:"linear-gradient(135deg,#1a3a10,#2D5A1E)",color:"white",border:"none",padding:"13px",borderRadius:10,fontFamily:ff,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:8}}>
                📥 {isTe?"రిపోర్ట్ డౌన్‌లోడ్":"Download Report"}
              </button>
              <button onClick={()=>window.open("https://meebhoomi.ap.gov.in","_blank")} style={{width:"100%",background:"#E3F2FD",color:"#1565C0",border:"1.5px solid #90CAF9",padding:"11px",borderRadius:10,fontFamily:ff,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                🌐 {isTe?"MeeBhoomi లో ధృవీకరించండి":"Verify on MeeBhoomi"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginPage({onLogin,onRegister}){
  const {isTe}=useLang();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";

  const handleLogin=async()=>{
    if(!email||!pass){setError("Enter email and password!");return;}
    setLoading(true);setError("");

    // Check demo accounts FIRST (always works!)
    const demo={
      "farmer@demo.com":{pass:"Demo@1234",name:"Ravi Kumar",role:"Farmer"},
      "bank@demo.com":{pass:"Demo@1234",name:"SBI Bank Manager",role:"Bank"},
      "lawyer@demo.com":{pass:"Demo@1234",name:"Advocate Sharma",role:"Lawyer"},
      "admin@landcheck.in":{pass:"Admin@2024!",name:"Admin",role:"Admin"},
    };
    const emailLower = email.toLowerCase().trim();
    if(demo[emailLower] && demo[emailLower].pass===pass){
      const d=demo[emailLower];
      const u={email:emailLower,fullName:d.name,role:d.role};
      localStorage.setItem("lc_user",JSON.stringify(u));
      onLogin(u);
      setLoading(false);
      return;
    }

    // Try real backend for registered users
    try{
      const res=await fetch("https://landcheck-backend-4dym.onrender.com/api/auth/login",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password:pass})
      });
      const data=await res.json();
      if(res.ok&&data.token){
        localStorage.setItem("lc_token",data.token);
        localStorage.setItem("lc_user",JSON.stringify(data.user||{email,fullName:email.split("@")[0],role:"Farmer"}));
        onLogin(data.user||{email,fullName:email.split("@")[0],role:"Farmer"});
      } else {
        setError(data.message||"Login failed. Check email and password!");
      }
    }catch(e){
      setError("Server error. Please try again!");
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${FOREST},#1a3a10)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"white",borderRadius:20,padding:32,width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:48,marginBottom:8}}>🌾</div>
          <div style={{fontWeight:800,fontSize:24,color:FOREST,fontFamily:ff}}>LandCheck</div>
          <div style={{fontSize:13,color:"#666",fontFamily:ff}}>{isTe?"భూమి ధృవీకరించండి. మోసం ఆపండి.":"Verify Land. Stop Fraud."}</div>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={isTe?"ఇమెయిల్":"Email"} type="email" style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:14,marginBottom:12}}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder={isTe?"పాస్‌వర్డ్":"Password"} type="password" onKeyPress={e=>e.key==="Enter"&&handleLogin()} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:14,marginBottom:16}}/>
        {error&&<div style={{color:ERR,fontSize:13,marginBottom:12,fontFamily:ff}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:FOREST,color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:15,marginBottom:12}}>
          {loading?"⏳ Loading...":(isTe?"లాగిన్":"Login")}
        </button>
        <button onClick={onRegister} style={{width:"100%",background:"white",color:FOREST,border:`2px solid ${FOREST}`,borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:14}}>
          {isTe?"కొత్త ఖాతా తెరవండి":"Create Account"}
        </button>
        <div style={{marginTop:16,padding:12,background:"#F5F5F5",borderRadius:8,fontSize:11,color:"#666",fontFamily:ff}}>
          <div style={{fontWeight:700,marginBottom:4}}>Demo accounts:</div>
          <div>farmer@demo.com / Demo@1234</div>
          <div>bank@demo.com / Demo@1234</div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({onBack}){
  const {isTe}=useLang();
  const [form,setForm]=useState({fullName:"",email:"",phone:"",password:"",role:"Farmer"});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState(false);
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const up=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handleRegister=async()=>{
    if(!form.fullName||!form.email||!form.password){setError("Fill all fields!");return;}
    setLoading(true);setError("");
    try{
      const res=await fetch("https://landcheck-backend-4dym.onrender.com/api/auth/register",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const data=await res.json();
      if(res.ok){setSuccess(true);}
      else{setError(data.message||"Registration failed!");}
    }catch(e){setError("Server error. Please try again!");}
    setLoading(false);
  };

  if(success)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${FOREST},#1a3a10)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"white",borderRadius:20,padding:32,width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>✅</div>
        <div style={{fontWeight:800,fontSize:22,color:FOREST,fontFamily:ff,marginBottom:8}}>{isTe?"నమోదు విజయవంతం!":"Registered Successfully!"}</div>
        <button onClick={onBack} style={{width:"100%",background:FOREST,color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:15,marginTop:16}}>{isTe?"లాగిన్ చేయండి":"Go to Login"}</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${FOREST},#1a3a10)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"white",borderRadius:20,padding:32,width:"100%",maxWidth:400}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:FOREST,fontWeight:600,cursor:"pointer",fontFamily:ff,marginBottom:16}}>← {isTe?"వెనక్కి":"Back"}</button>
        <div style={{fontWeight:800,fontSize:22,color:FOREST,marginBottom:20,fontFamily:ff}}>{isTe?"కొత్త ఖాతా":"Create Account"}</div>
        {[["fullName",isTe?"పూర్తి పేరు":"Full Name","text"],[" email","Email","email"],["phone",isTe?"ఫోన్":"Phone","tel"],["password",isTe?"పాస్‌వర్డ్":"Password","password"]].map(([k,lbl,type])=>(
          <input key={k} value={form[k.trim()]} onChange={e=>up(k.trim(),e.target.value)} placeholder={lbl} type={type} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:14,marginBottom:12}}/>
        ))}
        <select value={form.role} onChange={e=>up("role",e.target.value)} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:14,marginBottom:16}}>
          <option value="Farmer">{isTe?"రైతు":"Farmer"}</option>
          <option value="Bank">{isTe?"బ్యాంక్":"Bank"}</option>
          <option value="Lawyer">{isTe?"న్యాయవాది":"Lawyer"}</option>
          <option value="NRI">NRI</option>
        </select>
        {error&&<div style={{color:ERR,fontSize:13,marginBottom:12,fontFamily:ff}}>{error}</div>}
        <button onClick={handleRegister} disabled={loading} style={{width:"100%",background:FOREST,color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:15}}>
          {loading?"⏳ Loading...":(isTe?"నమోదు చేయండి":"Register")}
        </button>
      </div>
    </div>
  );
}

// ── DOCUMENT CHECKLIST ───────────────────────────────────────
function DocChecklist({onClose}){
  const {t,isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const [checked,setChecked]=useState({});
  const toggle=(k)=>setChecked(c=>({...c,[k]:!c[k]}));

  const docs=[
    {id:"ror",icon:"📋",title:isTe?"ROR 1-B / అడంగల్":"ROR 1-B / Adangal",desc:isTe?"ప్రస్తుత యజమాని, భూమి రకం":"Current owner, land type",source:"MeeBhoomi",priority:"HIGH",url:"https://meebhoomi.ap.gov.in"},
    {id:"ec",icon:"📜",title:isTe?"EC (30 సంవత్సరాలు)":"EC (30 years)",desc:isTe?"లావాదేవీలు + రుణాలు":"Transactions + loans",source:"SRO Office",priority:"HIGH",url:"https://registration.ap.gov.in"},
    {id:"sale",icon:"📄",title:isTe?"సేల్ డీడ్":"Sale Deed",desc:isTe?"చట్టపరమైన యాజమాన్య రుజువు":"Legal ownership proof",source:"Sub-Registrar",priority:"HIGH",url:""},
    {id:"fmb",icon:"🗺️",title:isTe?"FMB / సర్వే మ్యాప్":"FMB / Survey Map",desc:isTe?"హద్దులు మరియు కొలతలు":"Boundaries and measurements",source:"MeeBhoomi",priority:"MEDIUM",url:"https://meebhoomi.ap.gov.in"},
    {id:"passbook",icon:"📘",title:isTe?"పట్టాదారు పాస్‌బుక్":"Pattadar Passbook",desc:isTe?"రైతుకు ఇచ్చిన రికార్డు":"Physical record for farmer",source:"MRO Office",priority:"MEDIUM",url:""},
    {id:"cersai",icon:"🏦",title:"CERSAI Check",desc:isTe?"బ్యాంక్ రుణం తనిఖీ":"Bank loan check",source:"CERSAI Portal",priority:"HIGH",url:"https://cersai.org.in"},
    {id:"court",icon:"⚖️",title:isTe?"కోర్టు కేసు తనిఖీ":"Court Case Check",desc:isTe?"లాయర్ ద్వారా తనిఖీ":"Check via lawyer",source:"Lawyer/Court",priority:"MEDIUM",url:""},
    {id:"physical",icon:"🚶",title:isTe?"భౌతిక సందర్శన":"Physical Visit",desc:isTe?"నేలపై వాస్తవం":"Ground reality check",source:"Personal",priority:"HIGH",url:""},
  ];

  const checkedCount=Object.values(checked).filter(Boolean).length;
  const pct=Math.round((checkedCount/docs.length)*100);
  const color=pct>=75?"#2D7A3A":pct>=50?"#C8760C":"#C0392B";

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
        <div style={{background:FOREST,borderRadius:"24px 24px 0 0",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:44,height:44,background:GOLD,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>📋</div>
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:17,fontFamily:ff}}>{isTe?"పత్రాల చెక్‌లిస్ట్":"Document Checklist"}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{checkedCount}/{docs.length} {isTe?"పూర్తయింది":"completed"} - {pct}%</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:20}}>x</button>
        </div>
        <div style={{padding:20}}>
          <div style={{background:"white",borderRadius:14,padding:16,marginBottom:16,border:"1px solid #E0E8D8"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:600,fontFamily:ff}}>{isTe?"ధృవీకరణ పురోగతి":"Verification Progress"}</span>
              <span style={{fontSize:13,fontWeight:800,color,fontFamily:ff}}>{pct}%</span>
            </div>
            <div style={{background:"#EEE",borderRadius:20,height:10,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:color,borderRadius:20,transition:"width .4s"}}/>
            </div>
          </div>
          <div style={{background:"#FFF8E1",border:"1.5px solid #FFB300",borderRadius:12,padding:12,marginBottom:16}}>
            <div style={{fontSize:11,color:"#E65100",fontFamily:ff}}>
              Disclaimer: {isTe?"ఈ చెక్‌లిస్ట్ సమాచార ప్రయోజనాల కోసం మాత్రమే. భూమి కొనుగోలు చేయడానికి ముందు అర్హత కలిగిన లాయర్‌ని సంప్రదించండి.":"This checklist is for informational purposes only. Always consult a qualified lawyer before buying land."}
            </div>
          </div>
          {docs.map((doc)=>(
            <button key={doc.id} onClick={()=>toggle(doc.id)} style={{width:"100%",background:checked[doc.id]?"#E8F5E9":"white",border:"1.5px solid "+(checked[doc.id]?"#2D7A3A":doc.priority==="HIGH"?"#FFCDD2":"#E0E8D8"),borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",marginBottom:10,display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:checked[doc.id]?"#2D7A3A":"#F5F5F5",border:"2px solid "+(checked[doc.id]?"#2D7A3A":"#DDD"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                {checked[doc.id]?"v":doc.icon}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{fontWeight:700,fontSize:13,fontFamily:ff,color:checked[doc.id]?"#2D7A3A":"#1a1a1a"}}>{doc.title}</div>
                  <span style={{fontSize:9,fontWeight:700,background:doc.priority==="HIGH"?"#FFEBEE":"#E3F2FD",color:doc.priority==="HIGH"?"#C0392B":"#1565C0",padding:"2px 7px",borderRadius:10}}>{doc.priority}</span>
                </div>
                <div style={{fontSize:11,color:"#666",fontFamily:ff,marginBottom:4}}>{doc.desc}</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:10,color:"#888",fontFamily:ff}}>{doc.source}</span>
                  {doc.url&&<a href={doc.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:"#1565C0",fontWeight:600,textDecoration:"none"}}>{isTe?"తెరవండి":"Open"}</a>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FRAUD DETECTOR ────────────────────────────────────────────
function FraudDetector({onClose}){
  const {t,isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const [text,setText]=useState("");
  const [result,setResult]=useState(null);

  const FRAUD_WORDS=[
    {word:"GPA",risk:"HIGH",msg:isTe?"జనరల్ పవర్ ఆఫ్ అటార్నీ - రిస్క్!":"General Power of Attorney - High Risk!"},
    {word:"power of attorney",risk:"HIGH",msg:isTe?"పవర్ ఆఫ్ అటార్నీ - జాగ్రత్త!":"Power of Attorney - Be careful!"},
    {word:"agreement",risk:"MEDIUM",msg:isTe?"అగ్రీమెంట్ మాత్రమే - రిజిస్ట్రేషన్ అవసరం":"Agreement only - Registration needed"},
    {word:"pending",risk:"HIGH",msg:isTe?"పెండింగ్ వ్యవహారాలు - జాగ్రత్త":"Pending matters - Be careful"},
    {word:"dispute",risk:"HIGH",msg:isTe?"వివాదం ఉంది - కొనుగోలు చేయవద్దు!":"Dispute exists - Don't buy!"},
    {word:"benami",risk:"HIGH",msg:isTe?"బేనామీ ఆస్తి - చట్టవిరుద్ధం!":"Benami property - Illegal!"},
    {word:"assigned",risk:"HIGH",msg:isTe?"అసైన్డ్ భూమి - ప్రభుత్వ ఆంక్షలు":"Assigned land - Govt restrictions"},
    {word:"court",risk:"MEDIUM",msg:isTe?"కోర్టు కేసు - లాయర్ తనిఖీ అవసరం":"Court case - Lawyer verification needed"},
    {word:"loan",risk:"MEDIUM",msg:isTe?"రుణం ఉంది - CERSAI తనిఖీ చేయండి":"Loan exists - Check CERSAI"},
    {word:"mortgage",risk:"HIGH",msg:isTe?"మార్ట్గేజ్ ఉంది - రిస్క్!":"Mortgage exists - Risk!"},
    {word:"temple",risk:"HIGH",msg:isTe?"దేవాలయ భూమి - కొనుగోలు చేయవద్దు":"Temple land - Don't buy"},
    {word:"government land",risk:"HIGH",msg:isTe?"ప్రభుత్వ భూమి - రిస్క్!":"Government land - Risk!"},
  ];

  const analyze=()=>{
    if(!text.trim())return;
    const lower=text.toLowerCase();
    const found=[];
    let highCount=0,medCount=0;
    FRAUD_WORDS.forEach(fw=>{
      if(lower.includes(fw.word.toLowerCase())){
        found.push(fw);
        if(fw.risk==="HIGH")highCount++;
        else if(fw.risk==="MEDIUM")medCount++;
      }
    });
    const riskLevel=highCount>0?"HIGH":medCount>1?"MEDIUM":found.length>0?"LOW":"SAFE";
    setResult({found,riskLevel,highCount,medCount});
  };

  const RL={HIGH:{color:"#C0392B",bg:"#FFEBEE",icon:"RISK"},MEDIUM:{color:"#C8760C",bg:"#FFF3E0",icon:"CAUTION"},LOW:{color:"#1565C0",bg:"#E3F2FD",icon:"CHECK"},SAFE:{color:"#2D7A3A",bg:"#E8F5E9",icon:"SAFE"}};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
        <div style={{background:"#8B0000",borderRadius:"24px 24px 0 0",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:44,height:44,background:"#FF4444",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>F</div>
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:17,fontFamily:ff}}>{isTe?"మోసం గుర్తింపు":"Fraud Detector"}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{isTe?"పత్రం వచనాన్ని అతికించండి":"Paste document text below"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:20}}>x</button>
        </div>
        <div style={{padding:20}}>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={isTe?"EC, సేల్ డీడ్ వచనం అతికించండి...":"Paste EC, Sale Deed or land document text here..."} style={{width:"100%",height:140,padding:"12px 14px",border:"1.5px solid #DDD",borderRadius:12,fontFamily:ff,fontSize:13,resize:"none",marginBottom:12,outline:"none"}}/>
          <button onClick={analyze} disabled={!text.trim()} style={{width:"100%",background:"#8B0000",color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:15,marginBottom:16}}>
            {isTe?"మోసం గుర్తించండి":"Detect Fraud Words"}
          </button>
          {result&&(
            <div>
              <div style={{background:RL[result.riskLevel].bg,border:"2px solid "+RL[result.riskLevel].color,borderRadius:14,padding:"16px 18px",marginBottom:16,textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:22,color:RL[result.riskLevel].color,fontFamily:ff,marginBottom:4}}>
                  {result.riskLevel==="HIGH"?(isTe?"HIGH RISK - లాయర్ సంప్రదించండి!":"HIGH RISK - Consult Lawyer!"):
                   result.riskLevel==="MEDIUM"?(isTe?"MEDIUM RISK - జాగ్రత్తగా ఉండండి":"MEDIUM RISK - Be Careful"):
                   result.riskLevel==="LOW"?(isTe?"LOW RISK - తనిఖీ చేయండి":"LOW RISK - Verify"):
                   (isTe?"సురక్షితంగా కనిపిస్తోంది":"Looks Safe - Still Verify")}
                </div>
                {result.found.length>0&&<div style={{fontSize:12,color:RL[result.riskLevel].color,fontFamily:ff}}>{result.highCount} high risk + {result.medCount} medium risk {isTe?"పదాలు కనుగొన్నారు":"words found"}</div>}
              </div>
              {result.found.length>0?(
                <div>
                  {result.found.map((fw,i)=>(
                    <div key={i} style={{background:"white",border:"1.5px solid "+(fw.risk==="HIGH"?"#FFCDD2":fw.risk==="MEDIUM"?"#FFE0B2":"#C8E6C9"),borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontWeight:900,fontSize:16,color:fw.risk==="HIGH"?"#C0392B":fw.risk==="MEDIUM"?"#C8760C":"#1565C0"}}>{fw.risk==="HIGH"?"!!":fw.risk==="MEDIUM"?"!":"i"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,fontFamily:ff,color:fw.risk==="HIGH"?"#C0392B":fw.risk==="MEDIUM"?"#C8760C":"#1565C0"}}>{fw.word.toUpperCase()}</div>
                        <div style={{fontSize:11,color:"#666",fontFamily:ff}}>{fw.msg}</div>
                      </div>
                      <span style={{fontSize:9,fontWeight:700,background:fw.risk==="HIGH"?"#FFEBEE":fw.risk==="MEDIUM"?"#FFF3E0":"#E3F2FD",color:fw.risk==="HIGH"?"#C0392B":fw.risk==="MEDIUM"?"#C8760C":"#1565C0",padding:"3px 8px",borderRadius:10}}>{fw.risk}</span>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"20px",background:"#E8F5E9",borderRadius:12,border:"1.5px solid #2D7A3A"}}>
                  <div style={{fontWeight:700,color:"#2D7A3A",fontFamily:ff}}>{isTe?"ఎటువంటి హెచ్చరిక పదాలు కనుగొనలేదు!":"No warning words found!"}</div>
                </div>
              )}
              <div style={{background:"#FFF8E1",border:"1px solid #FFB300",borderRadius:10,padding:12,marginTop:12}}>
                <div style={{fontSize:11,color:"#E65100",fontFamily:ff}}>Disclaimer: {isTe?"ఈ విశ్లేషణ స్వయంచాలితంగా ఉంది. భూమి కొనుగోలు చేయడానికి ముందు లాయర్‌ని సంప్రదించండి.":"This analysis is automated. Always consult a qualified lawyer before buying land."}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ── ADD RECORD MODAL ──────────────────────────────────────────
function AddRecordModal({onClose,onAdd}){
  const {isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({
    surveyNumber:"",ownerName:"",village:"",mandal:"",district:"",
    landType:"Agricultural",extentAcres:"",marketValue:"",
    soilType:"",waterSource:"",cropGrown:"",
    ecStatus:"",bankLoan:"",courtCase:"",
    northBoundary:"",southBoundary:"",eastBoundary:"",westBoundary:"",
    previousOwners:"",notes:""
  });
  const [docs,setDocs]=useState([]);
  const [fraudWords,setFraudWords]=useState([]);
  const up=(k,v)=>setForm(f=>({...f,[k]:v}));

  const FRAUD_LIST=["gpa","power of attorney","agreement","pending","dispute","benami","assigned","court","loan","mortgage","temple","government land","illegal","fake","forged"];

  const calcRisk=()=>{
    let score=0;
    const allText=(Object.values(form).join(" ")).toLowerCase();
    const found=[];
    FRAUD_LIST.forEach(w=>{
      if(allText.includes(w)){
        found.push(w);
        if(["gpa","benami","dispute","mortgage","temple","forged","fake","illegal"].includes(w)) score+=15;
        else score+=8;
      }
    });
    if(form.ecStatus?.toLowerCase().includes("clear")) score=Math.max(0,score-5);
    if(form.bankLoan?.toLowerCase().includes("no")) score=Math.max(0,score-3);
    if(form.courtCase?.toLowerCase().includes("no")) score=Math.max(0,score-3);
    setFraudWords(found);
    return Math.min(score,100);
  };

  const handleDocUpload=(e)=>{
    const files=Array.from(e.target.files);
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=(ev)=>{
        setDocs(d=>[...d,{name:file.name,type:file.type,data:ev.target.result,size:file.size}]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit=()=>{
    const riskScore=calcRisk();
    const riskLevel=riskScore>=60?"High":riskScore>=30?"Medium":"Low";
    const record={
      id:Date.now(),
      surveyNumber:form.surveyNumber||"N/A",
      ownerName:form.ownerName||"N/A",
      village:form.village,mandal:form.mandal,district:form.district,
      landType:form.landType,
      extentAcres:parseFloat(form.extentAcres)||0,
      marketValue:form.marketValue,
      soilType:form.soilType,
      waterSource:form.waterSource,
      cropGrown:form.cropGrown,
      ecStatus:form.ecStatus||"Not verified",
      bankLoan:form.bankLoan||"Not verified",
      courtCase:form.courtCase||"Not verified",
      boundaries:{north:form.northBoundary,south:form.southBoundary,east:form.eastBoundary,west:form.westBoundary},
      previousOwners:form.previousOwners?form.previousOwners.split("
").filter(Boolean):["Not provided"],
      notes:form.notes,
      documents:docs,
      fraudWordsFound:fraudWords,
      riskSummary:{riskLevel,riskScore,flagCount:fraudWords.length},
      createdAt:new Date().toLocaleDateString("en-IN"),
      status:riskLevel==="High"?"Flagged":riskLevel==="Medium"?"UnderReview":"Verified"
    };
    onAdd(record);
    onClose();
    // Auto show report after adding
    setTimeout(()=>{
      if(window.confirm("Record added! Download Report now?")){
        const date=new Date().toLocaleDateString("en-IN");
        const rc2={Low:"#2D7A3A",Medium:"#C8760C",High:"#C0392B"};
        const html="<!DOCTYPE html><html><head><meta charset='UTF-8'><title>LandCheck Report - "+record.surveyNumber+"</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:#F5F0E8;padding:20px}.page{background:white;max-width:800px;margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}.header{background:#2D5A1E;padding:28px 32px;color:white}.risk{background:"+rc2[riskLevel]+";padding:20px 32px;color:white;display:flex;justify-content:space-between;align-items:center}.content{padding:28px 32px}.section{margin-bottom:20px;border:1px solid #E8ECF0;border-radius:12px;overflow:hidden}.sec-title{background:#F8F9FA;padding:12px 16px;font-weight:700;color:#2D5A1E;border-bottom:1px solid #E8ECF0}.row{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #F5F5F5}.disclaimer{background:#FFF8E1;border:1px solid #FFB300;border-radius:10px;padding:14px;margin:16px 0;font-size:12px;color:#E65100;line-height:1.5}.footer{background:#F8F9FA;padding:16px 32px;display:flex;justify-content:space-between;font-size:11px;color:#888;border-top:1px solid #E8ECF0}</style></head><body><div class='page'>"
        +"<div class='header'><div style='font-size:32px;margin-bottom:6px'>🌾</div><div style='font-size:24px;font-weight:900;margin-bottom:4px'>LandCheck Verification Report</div><div style='opacity:.8;font-size:13px'>Generated on "+date+" | landcheck-frontend.vercel.app</div></div>"
        +"<div class='risk'><div><div style='font-size:13px;opacity:.8;margin-bottom:4px'>RISK ASSESSMENT</div><div style='font-size:24px;font-weight:900'>"+(riskLevel==="Low"?"LOW RISK ✅":riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️")+"</div><div style='font-size:13px;opacity:.8;margin-top:4px'>Survey: "+record.surveyNumber+"</div></div><div style='font-size:52px;font-weight:900;text-align:right'>"+riskScore+"<span style='font-size:16px'>/100</span></div></div>"
        +"<div class='content'>"
        +"<div class='section'><div class='sec-title'>📋 Land Details</div>"
        +[["Survey Number",record.surveyNumber],["Owner Name",record.ownerName],["Village",record.village],["Mandal",record.mandal],["District",record.district],["Land Type",record.landType],["Extent",record.extentAcres+" Acres"],["Market Value",record.marketValue||"—"],["Date Added",record.createdAt]].map(([k,v])=>"<div class='row'><span style='color:#666;font-size:13px'>"+k+"</span><span style='font-weight:600;font-size:13px'>"+v+"</span></div>").join("")
        +"</div>"
        +"<div class='section'><div class='sec-title'>🌱 Agricultural Details</div>"
        +[["Soil Type",record.soilType||"—"],["Water Source",record.waterSource||"—"],["Crop Grown",record.cropGrown||"—"]].map(([k,v])=>"<div class='row'><span style='color:#666;font-size:13px'>"+k+"</span><span style='font-weight:600;font-size:13px'>"+v+"</span></div>").join("")
        +"</div>"
        +"<div class='section'><div class='sec-title'>⚖️ Legal Status</div>"
        +[["EC Status",record.ecStatus],["Bank Loan",record.bankLoan],["Court Case",record.courtCase]].map(([k,v])=>"<div class='row'><span style='color:#666;font-size:13px'>"+k+"</span><span style='font-weight:600;font-size:13px;color:"+(String(v||"").includes("⚠")?"#C0392B":"#1a1a1a")+"'>"+v+"</span></div>").join("")
        +"</div>"
        +(record.fraudWordsFound?.length>0?"<div style='background:#FFEBEE;border:2px solid #FFCDD2;border-radius:12px;padding:16px;margin:16px 0'><div style='font-weight:700;color:#C0392B;font-size:15px;margin-bottom:8px'>🚨 Fraud Warning Words Detected!</div><div style='color:#C0392B;font-size:13px'>"+record.fraudWordsFound.map(w=>w.toUpperCase()).join(", ")+"</div></div>":"")
        +"<div class='disclaimer'>⚖️ <strong>Legal Disclaimer:</strong> This report is for informational purposes only based on data provided by the user. LandCheck does not provide legal advice. Always verify with official government records and consult a qualified lawyer before any land-related decisions.</div>"
        +"</div>"
        +"<div class='footer'><div style='font-weight:700;color:#2D5A1E'>🌾 LandCheck — Verify Land. Stop Fraud. Protect Families.</div><div>Report ID: LC-"+record.id+" | "+date+"</div></div>"
        +"</div></body></html>";
        const blob=new Blob([html],{type:"text/html"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;
        a.download="LandCheck-Report-"+record.surveyNumber.replace("/","-")+"-"+date.replace(/\//g,"-")+".html";
        a.click();
        URL.revokeObjectURL(url);
      }
    },300);
  };

  const inputStyle={width:"100%",padding:"11px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:13,marginBottom:10,outline:"none",background:"white"};
  const labelStyle={fontSize:11,color:"#666",fontFamily:ff,marginBottom:3,display:"block",fontWeight:600};

  const steps=[
    isTe?"భూమి వివరాలు":"Land Details",
    isTe?"వ్యవసాయం":"Agriculture",
    isTe?"చట్టపరమైన స్థితి":"Legal Status",
    isTe?"పత్రాలు":"Documents",
  ];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
        {/* Header */}
        <div style={{background:FOREST,borderRadius:"24px 24px 0 0",padding:"18px 20px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontWeight:700,color:"white",fontSize:17,fontFamily:ff}}>➕ {isTe?"రికార్డు జోడించు":"Add Land Record"}</div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button>
          </div>
          {/* Progress Steps */}
          <div style={{display:"flex",gap:4}}>
            {steps.map((s,i)=>(
              <div key={i} onClick={()=>setStep(i+1)} style={{flex:1,textAlign:"center",cursor:"pointer"}}>
                <div style={{height:4,borderRadius:4,background:step>i?"white":"rgba(255,255,255,.3)",marginBottom:4,transition:"background .3s"}}/>
                <div style={{fontSize:9,color:step>i?"white":"rgba(255,255,255,.5)",fontFamily:ff,fontWeight:step===i+1?700:400}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:20}}>

          {/* STEP 1 - Land Details */}
          {step===1&&(
            <div>
              <div style={{fontWeight:700,fontSize:15,fontFamily:ff,marginBottom:16,color:FOREST}}>📋 {isTe?"భూమి వివరాలు":"Land Details"}</div>
              {[["surveyNumber",isTe?"సర్వే నంబర్":"Survey Number","441/2A"],["ownerName",isTe?"యజమాని పేరు":"Owner Name","Ravi Kumar"],["village",isTe?"గ్రామం":"Village","Magandlapalle"],["mandal",isTe?"మండలం":"Mandal","Punganur"],["district",isTe?"జిల్లా":"District","Annamayya"],["extentAcres",isTe?"విస్తీర్ణం (ఎకరాలు)":"Extent (Acres)","2.50"],["marketValue",isTe?"మార్కెట్ విలువ":"Market Value","₹45,00,000"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={labelStyle}>{lbl}</label>
                  <input value={form[k]} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inputStyle}/>
                </div>
              ))}
              <div>
                <label style={labelStyle}>{isTe?"భూమి రకం":"Land Type"}</label>
                <select value={form.landType} onChange={e=>up("landType",e.target.value)} style={inputStyle}>
                  <option>Agricultural</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
              <button onClick={()=>setStep(2)} style={{width:"100%",background:FOREST,color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:14,marginTop:8}}>
                {isTe?"తదుపరి →":"Next →"}
              </button>
            </div>
          )}

          {/* STEP 2 - Agriculture */}
          {step===2&&(
            <div>
              <div style={{fontWeight:700,fontSize:15,fontFamily:ff,marginBottom:16,color:FOREST}}>🌱 {isTe?"వ్యవసాయ వివరాలు":"Agricultural Details"}</div>
              {[["soilType",isTe?"నేల రకం":"Soil Type","Black Cotton Soil"],["waterSource",isTe?"నీటి వనరు":"Water Source","Canal Irrigation"],["cropGrown",isTe?"పంట":"Crop Grown","Paddy"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={labelStyle}>{lbl}</label>
                  <input value={form[k]} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inputStyle}/>
                </div>
              ))}
              <div style={{fontWeight:700,fontSize:14,fontFamily:ff,margin:"16px 0 10px",color:FOREST}}>🧭 {isTe?"హద్దులు":"Boundaries"}</div>
              {[["northBoundary","↑ North"],["southBoundary","↓ South"],["eastBoundary","→ East"],["westBoundary","← West"]].map(([k,lbl])=>(
                <div key={k}>
                  <label style={labelStyle}>{lbl}</label>
                  <input value={form[k]} onChange={e=>up(k,e.target.value)} placeholder={lbl+" boundary..."} style={inputStyle}/>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:14}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={()=>setStep(3)} style={{flex:2,background:FOREST,color:"white",border:"none",borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:14}}>{isTe?"తదుపరి →":"Next →"}</button>
              </div>
            </div>
          )}

          {/* STEP 3 - Legal */}
          {step===3&&(
            <div>
              <div style={{fontWeight:700,fontSize:15,fontFamily:ff,marginBottom:16,color:FOREST}}>⚖️ {isTe?"చట్టపరమైన స్థితి":"Legal Status"}</div>
              {[["ecStatus",isTe?"EC స్థితి":"EC Status","Clear / No encumbrances"],["bankLoan",isTe?"బ్యాంక్ రుణం":"Bank Loan","No active loan"],["courtCase",isTe?"కోర్టు కేసు":"Court Case","No disputes"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={labelStyle}>{lbl}</label>
                  <input value={form[k]} onChange={e=>up(k,e.target.value)} placeholder={ph} style={inputStyle}/>
                </div>
              ))}
              <div>
                <label style={labelStyle}>{isTe?"గత యజమానులు (ఒక్కొక్కరు వేరే లైన్‌లో)":"Previous Owners (one per line)"}</label>
                <textarea value={form.previousOwners} onChange={e=>up("previousOwners",e.target.value)} placeholder={"Gopal Rao (1985-2001)
Suresh Rao (2001-2015)
Ravi Kumar (2015-Now)"} style={{...inputStyle,height:100,resize:"none"}}/>
              </div>
              <div>
                <label style={labelStyle}>{isTe?"గమనికలు":"Notes"}</label>
                <textarea value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder={isTe?"అదనపు గమనికలు...":"Additional notes..."} style={{...inputStyle,height:80,resize:"none"}}/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={()=>setStep(2)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:14}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={()=>setStep(4)} style={{flex:2,background:FOREST,color:"white",border:"none",borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:14}}>{isTe?"తదుపరి →":"Next →"}</button>
              </div>
            </div>
          )}

          {/* STEP 4 - Documents + Submit */}
          {step===4&&(
            <div>
              <div style={{fontWeight:700,fontSize:15,fontFamily:ff,marginBottom:16,color:FOREST}}>📄 {isTe?"పత్రాలు అప్‌లోడ్ చేయండి":"Upload Documents"}</div>
              <label style={{width:"100%",border:"2px dashed "+GOLD,borderRadius:14,padding:"24px",textAlign:"center",cursor:"pointer",display:"block",marginBottom:12,background:"#FFFBF0"}}>
                <div style={{fontSize:36,marginBottom:8}}>📁</div>
                <div style={{fontWeight:700,fontFamily:ff,color:FOREST,marginBottom:4}}>{isTe?"పత్రాలు ఎంచుకోండి":"Choose Documents"}</div>
                <div style={{fontSize:12,color:"#888",fontFamily:ff}}>{isTe?"Sale Deed, EC, Passbook, FMB...":"Sale Deed, EC, Passbook, FMB..."}</div>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocUpload} style={{display:"none"}}/>
              </label>
              {docs.length>0&&(
                <div style={{marginBottom:12}}>
                  {docs.map((d,i)=>(
                    <div key={i} style={{background:"#E8F5E9",borderRadius:8,padding:"8px 12px",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>{d.type.includes("pdf")?"📄":"🖼️"}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,fontFamily:ff}}>{d.name}</div>
                        <div style={{fontSize:10,color:"#666",fontFamily:ff}}>{(d.size/1024).toFixed(1)} KB</div>
                      </div>
                      <button onClick={()=>setDocs(ds=>ds.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:ERR,cursor:"pointer",fontSize:16}}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Risk Preview */}
              <div style={{background:"#F8F9FA",borderRadius:12,padding:14,marginBottom:16,border:"1px solid #E0E8D8"}}>
                <div style={{fontWeight:700,fontSize:13,fontFamily:ff,marginBottom:8,color:FOREST}}>📊 {isTe?"రిస్క్ ప్రివ్యూ":"Risk Preview"}</div>
                <div style={{fontSize:12,color:"#666",fontFamily:ff}}>
                  {isTe?"సేవ్ చేసిన తర్వాత ఆటోమేటిక్‌గా రిస్క్ స్కోర్ లెక్కిస్తారు":"Risk score will be calculated automatically on save"}
                </div>
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(3)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:14}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={handleSubmit} style={{flex:2,background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:800,fontSize:14}}>
                  ✅ {isTe?"రికార్డు సేవ్ చేయి":"Save Record"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── RECORD DETAIL VIEW ────────────────────────────────────────
function RecordDetail({record,onClose,onDownload}){
  const {isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const RC2={Low:OK,Medium:"#C8760C",High:ERR};
  const RB2={Low:"#E8F5E9",Medium:"#FFF3E0",High:"#FFEBEE"};
  const rs=record.riskSummary||{riskLevel:"Low",riskScore:0};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
        <div style={{background:FOREST,borderRadius:"24px 24px 0 0",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:40,height:40,background:GOLD,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📋</div>
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:16,fontFamily:ff}}>{record.ownerName}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{record.surveyNumber} • {record.village}</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button>
        </div>
        <div style={{padding:20}}>
          {/* Risk Banner */}
          <div style={{background:RB2[rs.riskLevel],border:"2px solid "+RC2[rs.riskLevel],borderRadius:14,padding:"16px 18px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:RC2[rs.riskLevel],fontFamily:ff}}>RISK LEVEL</div>
              <div style={{fontSize:20,fontWeight:800,color:RC2[rs.riskLevel],fontFamily:ff}}>{rs.riskLevel==="Low"?"LOW RISK ✅":rs.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️"}</div>
              {record.fraudWordsFound?.length>0&&<div style={{fontSize:11,color:RC2[rs.riskLevel],marginTop:4,fontFamily:ff}}>{record.fraudWordsFound.length} {isTe?"హెచ్చరిక పదాలు కనుగొన్నారు":"warning words found"}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:40,fontWeight:800,color:RC2[rs.riskLevel],fontFamily:ff,lineHeight:1}}>{rs.riskScore}</div>
              <div style={{fontSize:11,color:"#666"}}>/100</div>
            </div>
          </div>

          {/* Details sections */}
          {[
            [isTe?"భూమి వివరాలు":"Land Details","📋",[[isTe?"సర్వే నంబర్":"Survey No",record.surveyNumber],[isTe?"యజమాని":"Owner",record.ownerName],[isTe?"గ్రామం":"Village",record.village],[isTe?"మండలం":"Mandal",record.mandal],[isTe?"జిల్లా":"District",record.district],[isTe?"భూమి రకం":"Land Type",record.landType],[isTe?"విస్తీర్ణం":"Extent",record.extentAcres+" Acres"],[isTe?"మార్కెట్ విలువ":"Market Value",record.marketValue],[isTe?"తేదీ":"Date",record.createdAt]]],
            [isTe?"వ్యవసాయం":"Agriculture","🌱",[[isTe?"నేల రకం":"Soil Type",record.soilType],[isTe?"నీటి వనరు":"Water Source",record.waterSource],[isTe?"పంట":"Crop",record.cropGrown]]],
            [isTe?"చట్టపరమైన స్థితి":"Legal Status","⚖️",[[isTe?"EC స్థితి":"EC Status",record.ecStatus],[isTe?"బ్యాంక్ రుణం":"Bank Loan",record.bankLoan],[isTe?"కోర్టు కేసు":"Court Case",record.courtCase]]],
          ].map(([title,icon,rows])=>(
            <div key={title} style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>{icon} {title}</div>
              {rows.map(([k,v])=>v&&(
                <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:7,marginBottom:7,borderBottom:"1px solid #F5F5F5"}}>
                  <span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span>
                  <span style={{fontSize:12,fontWeight:600,color:String(v||"").includes("⚠")?ERR:"#1a1a1a",fontFamily:ff,textAlign:"right",maxWidth:"60%"}}>{v||"—"}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Previous Owners */}
          {record.previousOwners?.length>0&&record.previousOwners[0]!=="Not provided"&&(
            <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>👥 {isTe?"గత యజమానులు":"Previous Owners"}</div>
              {record.previousOwners.map((o,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:o.toUpperCase().includes("UNKNOWN")?ERR:OK,flexShrink:0}}/>
                  <span style={{fontSize:12,color:o.toUpperCase().includes("UNKNOWN")?ERR:"#1a1a1a",fontFamily:ff,fontWeight:o.toUpperCase().includes("UNKNOWN")?700:400}}>{o}</span>
                </div>
              ))}
            </div>
          )}

          {/* Boundaries */}
          {(record.boundaries?.north||record.boundaries?.south)&&(
            <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>🧭 {isTe?"హద్దులు":"Boundaries"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["north","↑ North"],["south","↓ South"],["east","→ East"],["west","← West"]].map(([d,l])=>(
                  <div key={d} style={{background:"#F8F9FA",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#888",fontWeight:700,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:11,fontFamily:ff}}>{record.boundaries[d]||"—"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {record.documents?.length>0&&(
            <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>📎 {isTe?"అప్‌లోడ్ చేసిన పత్రాలు":"Uploaded Documents"} ({record.documents.length})</div>
              {record.documents.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#F8F9FA",borderRadius:8,marginBottom:6}}>
                  <span style={{fontSize:20}}>{d.type?.includes("pdf")?"📄":"🖼️"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,fontFamily:ff}}>{d.name}</div>
                    <div style={{fontSize:10,color:"#888",fontFamily:ff}}>{(d.size/1024).toFixed(1)} KB</div>
                  </div>
                  <a href={d.data} download={d.name} style={{fontSize:11,color:"#1565C0",fontWeight:600,textDecoration:"none",fontFamily:ff}}>⬇️</a>
                </div>
              ))}
            </div>
          )}

          {/* Fraud Words */}
          {record.fraudWordsFound?.length>0&&(
            <div style={{background:"#FFEBEE",borderRadius:12,padding:14,marginBottom:10,border:"1.5px solid #FFCDD2"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:8,fontFamily:ff,color:ERR}}>🚨 {isTe?"హెచ్చరిక పదాలు కనుగొన్నారు":"Warning Words Found"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {record.fraudWordsFound.map((w,i)=>(<span key={i} style={{background:"white",color:ERR,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,border:"1px solid #FFCDD2",fontFamily:ff}}>{w.toUpperCase()}</span>))}
              </div>
            </div>
          )}

          {/* Download Button */}
          <button onClick={()=>onDownload(record)} style={{width:"100%",background:"linear-gradient(135deg,#1a3a10,"+FOREST+")",color:"white",border:"none",padding:"14px",borderRadius:12,fontFamily:ff,fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:10}}>
            📥 {isTe?"రిపోర్ట్ డౌన్‌లోడ్ చేయండి":"Download Complete Report"}
          </button>
          <button onClick={()=>window.open("https://meebhoomi.ap.gov.in","_blank")} style={{width:"100%",background:"#E3F2FD",color:"#1565C0",border:"1.5px solid #90CAF9",padding:"12px",borderRadius:10,fontFamily:ff,fontWeight:600,fontSize:13,cursor:"pointer"}}>
            🌐 {isTe?"MeeBhoomi లో ధృవీకరించండి":"Verify on MeeBhoomi"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({user,onLogout}){
  const {isTe}=useLang();
  const [showScanner,setShowScanner]=useState(false);
  const [showChecklist,setShowChecklist]=useState(false);
  const [showFraud,setShowFraud]=useState(false);
  const [showAddRecord,setShowAddRecord]=useState(false);
  const [records,setRecords]=useState([]);
  const [selectedRecord,setSelectedRecord]=useState(null);
  const [activeTab,setActiveTab]=useState("home");
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";

  const addRecord=(r)=>setRecords(prev=>[r,...prev]);

  const downloadFullReport=(record)=>{
    const date=new Date().toLocaleDateString("en-IN");
    const rc2={Low:"#2D7A3A",Medium:"#C8760C",High:"#C0392B"};
    const rs=record.riskSummary||{riskLevel:"Low",riskScore:0};
    const html="<!DOCTYPE html><html><head><meta charset='UTF-8'><title>LandCheck Report</title><style>body{font-family:Arial,sans-serif;background:#F5F0E8;padding:20px}.page{background:white;max-width:800px;margin:0 auto;border-radius:16px;overflow:hidden}.header{background:#2D5A1E;padding:28px 32px;color:white}.risk{background:"+rc2[rs.riskLevel]+";padding:20px 32px;color:white;display:flex;justify-content:space-between}.content{padding:28px 32px}.section{margin-bottom:20px;border:1px solid #E8ECF0;border-radius:12px}.sec-title{background:#F8F9FA;padding:12px 16px;font-weight:700;color:#2D5A1E}.row{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #F5F5F5}.footer{background:#F8F9FA;padding:16px 32px;display:flex;justify-content:space-between;font-size:11px;color:#888}.disclaimer{background:#FFF8E1;border:1px solid #FFB300;border-radius:10px;padding:14px;margin:16px 0;font-size:11px;color:#E65100}</style></head><body><div class='page'><div class='header'><div style='font-size:32px'>🌾</div><div style='font-size:24px;font-weight:900'>LandCheck Verification Report</div><div style='opacity:.8'>Generated on "+date+"</div></div><div class='risk'><div><div>RISK LEVEL</div><div style='font-size:22px;font-weight:900'>"+(rs.riskLevel==="Low"?"LOW RISK ✅":rs.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️")+"</div></div><div style='font-size:48px;font-weight:900'>"+rs.riskScore+"<span style='font-size:16px'>/100</span></div></div><div class='content'><div class='section'><div class='sec-title'>📋 Land Details</div>"
    +[["Survey Number",record.surveyNumber],["Owner Name",record.ownerName],["Village",record.village],["Mandal",record.mandal],["District",record.district],["Land Type",record.landType],["Extent",record.extentAcres+" Acres"],["Market Value",record.marketValue||"—"],["Date",record.createdAt]].map(([k,v])=>"<div class='row'><span style='color:#666'>"+k+"</span><span style='font-weight:600'>"+v+"</span></div>").join("")
    +"</div><div class='section'><div class='sec-title'>⚖️ Legal Status</div>"
    +[["EC Status",record.ecStatus],["Bank Loan",record.bankLoan],["Court Case",record.courtCase]].map(([k,v])=>"<div class='row'><span style='color:#666'>"+k+"</span><span style='font-weight:600;color:"+(String(v||"").includes("⚠")?"#C0392B":"#1a1a1a")+"'>"+v+"</span></div>").join("")
    +"</div>"
    +(record.fraudWordsFound?.length>0?"<div style='background:#FFEBEE;border:1px solid #FFCDD2;border-radius:12px;padding:14px;margin:16px 0'><div style='font-weight:700;color:#C0392B;margin-bottom:8px'>🚨 Warning Words: "+record.fraudWordsFound.join(", ").toUpperCase()+"</div></div>":"")
    +"<div class='disclaimer'>⚖️ <strong>Disclaimer:</strong> This report is for informational purposes only. Always consult a qualified lawyer before land decisions.</div></div><div class='footer'><div>🌾 LandCheck — Verify Land. Stop Fraud.</div><div>Report ID: LC-"+record.id+" | "+date+"</div></div></div></body></html>";
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="LandCheck-"+String(record.surveyNumber||"report").replace("/","-")+".html";
    a.click();URL.revokeObjectURL(url);
  };

  const features=[
    {icon:"📍",label:isTe?"భూమి స్కాన్":"Field Scan",sub:isTe?"GPS తో తక్షణ స్కాన్":"GPS instant scan",action:()=>setShowScanner(true),highlight:true},
    {icon:"➕",label:isTe?"రికార్డు జోడించు":"Add Record",sub:isTe?"భూమి రికార్డు జోడించు":"Add land record",action:()=>setShowAddRecord(true),highlight:true},
    {icon:"📋",label:isTe?"డాక్ చెక్‌లిస్ట్":"Doc Checklist",sub:isTe?"8 పత్రాలు":"8 documents",action:()=>setShowChecklist(true)},
    {icon:"🔍",label:isTe?"మోసం గుర్తింపు":"Fraud Detector",sub:isTe?"పత్రం విశ్లేషించండి":"Analyze text",action:()=>setShowFraud(true)},
    {icon:"🌐",label:"MeeBhoomi",sub:isTe?"నేరుగా తెరవండి":"Open directly",action:()=>window.open("https://meebhoomi.ap.gov.in","_blank")},
    {icon:"🛰️",label:isTe?"శాటిలైట్ వ్యూ":"Satellite View",sub:"Google Maps",action:()=>window.open("https://maps.google.com","_blank")},
  ];

  return(
    <div style={{minHeight:"100vh",background:CREAM}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>
      {showScanner&&<LandScanner onClose={()=>setShowScanner(false)}/>}
      {showChecklist&&<DocChecklist onClose={()=>setShowChecklist(false)}/>}
      {showFraud&&<FraudDetector onClose={()=>setShowFraud(false)}/>}
      {showAddRecord&&<AddRecordModal onClose={()=>setShowAddRecord(false)} onAdd={addRecord}/>}
      {selectedRecord&&<RecordDetail record={selectedRecord} onClose={()=>setSelectedRecord(null)} onDownload={downloadFullReport}/>}

      {/* Header */}
      <div style={{background:FOREST,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:28}}>🌾</div>
          <div>
            <div style={{fontWeight:800,color:"white",fontSize:18,fontFamily:ff}}>LandCheck</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{isTe?"నమస్కారం,":"Welcome,"} {user?.fullName||"User"}!</div>
          </div>
        </div>
        <button onClick={onLogout} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontFamily:ff,fontSize:12}}>
          {isTe?"లాగౌట్":"Logout"}
        </button>
      </div>

      <div style={{padding:20}}>
        {/* Hero */}
        <div style={{background:`linear-gradient(135deg,${FOREST},#4A8B35)`,borderRadius:16,padding:20,marginBottom:20,color:"white"}}>
          <div style={{fontSize:13,opacity:.85,fontFamily:ff,marginBottom:4}}>{isTe?"మీ భూమి సురక్షితంగా ఉందా?":"Is your land safe?"}</div>
          <div style={{fontWeight:800,fontSize:20,fontFamily:ff,marginBottom:12}}>{isTe?"ఇప్పుడే తనిఖీ చేయండి!":"Check it now!"}</div>
          <button onClick={()=>setShowScanner(true)} style={{background:GOLD,color:FOREST,border:"none",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:14}}>
            📍 {isTe?"GPS స్కాన్ ప్రారంభించండి":"Start GPS Scan"}
          </button>
        </div>

        {/* Features Grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {features.map((f,i)=>(
            <button key={i} onClick={f.action} style={{background:"white",border:f.highlight?`2px solid ${GOLD}`:"1.5px solid #E0E8D8",borderRadius:14,padding:"16px 14px",cursor:"pointer",textAlign:"left",boxShadow:f.highlight?"0 4px 16px rgba(200,134,12,.2)":"none"}}>
              <div style={{fontSize:28,marginBottom:8}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:13,color:"#1a1a1a",fontFamily:ff,marginBottom:3}}>{f.label}</div>
              <div style={{fontSize:11,color:"#666",fontFamily:ff}}>{f.sub}</div>
              {f.highlight&&<div style={{marginTop:8,background:GOLD,color:FOREST,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,display:"inline-block"}}>{isTe?"పరిచయం":"FEATURED"}</div>}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{background:"white",borderRadius:14,padding:16,marginTop:16,border:"1px solid #E0E8D8"}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:ff,marginBottom:12}}>📊 {isTe?"LandCheck గణాంకాలు":"LandCheck Stats"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
            {[[isTe?"వేరిఫై చేసిన భూములు":"Verified Lands","1,247","🌾"],[isTe?"మోసాలు గుర్తించారు":"Frauds Caught","89","🚨"],[isTe?"రైతులకు సహాయం":"Farmers Helped","3,421","👨‍🌾"]].map(([label,val,icon])=>(
              <div key={label}>
                <div style={{fontSize:22}}>{icon}</div>
                <div style={{fontWeight:800,fontSize:18,color:FOREST,fontFamily:ff}}>{val}</div>
                <div style={{fontSize:10,color:"#666",fontFamily:ff}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppInner(){
  const [screen,setScreen]=useState("login");
  const [user,setUser]=useState(null);
  const [lang,setLang]=useState("en");
  const isTe=lang==="te";

  useEffect(()=>{
    const u=localStorage.getItem("lc_user");
    if(u){try{setUser(JSON.parse(u));setScreen("dashboard");}catch(e){}}
  },[]);

  const handleLogin=(u)=>{setUser(u);setScreen("dashboard");};
  const handleLogout=()=>{localStorage.removeItem("lc_token");localStorage.removeItem("lc_user");setUser(null);setScreen("login");};

  return(
    <LangCtx.Provider value={{lang,isTe,setLang}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Instrument Sans',sans-serif;background:${CREAM}}`}</style>
      {/* Language toggle */}
      {screen!=="dashboard"&&(
        <div style={{position:"fixed",top:10,right:10,zIndex:999}}>
          <button onClick={()=>setLang(l=>l==="en"?"te":"en")} style={{background:"rgba(255,255,255,.9)",border:`1px solid ${GOLD}`,borderRadius:20,padding:"4px 12px",cursor:"pointer",fontSize:12,fontWeight:600,color:FOREST}}>
            {isTe?"EN":"తెలుగు"}
          </button>
        </div>
      )}
      {screen==="login"&&<LoginPage onLogin={handleLogin} onRegister={()=>setScreen("register")}/>}
      {screen==="register"&&<RegisterPage onBack={()=>setScreen("login")}/>}
      {screen==="dashboard"&&<Dashboard user={user} onLogout={handleLogout}/>}
    </LangCtx.Provider>
  );
}

export default function App(){
  return <AppInner/>;
}
