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

  const w = window.open("","_blank");
  if(w){ w.document.write(html); w.document.close(); }
  else {
    const blob = new Blob([html], {type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "LandCheck-Report.html";
    a.style.display="none"; document.body.appendChild(a);
    a.click(); setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); },1000);
  }
}

function LandScanner({onClose}){
  const {isTe}=useLang();
  const [step,setStep]=useState("home");
  const [gps,setGps]=useState(null);
  const [loading,setLoading]=useState(false);
  const [clickedPoint,setClickedPoint]=useState(null);
  const [nearbySurveys,setNearbySurveys]=useState([]);
  const [selSurvey,setSelSurvey]=useState(null);
  const [fetchingData,setFetchingData]=useState(false);
  const [confirmed,setConfirmed]=useState(null);
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";

  // ── Nearby surveys — just numbers + distance (NO owner/risk yet!)
  const getNearby=(lat,lon)=>[
    {surveyNo:"441/2A",dist:"~12m",acres:"2.50",lat,lon},
    {surveyNo:"441/3",dist:"~45m",acres:"1.20",lat:lat+0.0003,lon:lon+0.0002},
    {surveyNo:"442/1",dist:"~78m",acres:"0.80",lat:lat-0.0004,lon:lon+0.0003},
    {surveyNo:"443/2B",dist:"~110m",acres:"3.75",lat:lat+0.0005,lon:lon-0.0001},
  ];

  // ── Full data AFTER user selects (simulates MeeBhoomi fetch)
  const FULL_DATA={
    "441/2A":{owner:"Ravi Kumar Reddy",landType:"Agricultural",soilType:"Black Cotton Soil",waterSource:"Canal Irrigation",cropGrown:"Paddy",marketValue:"₹45,00,000",ecStatus:"Clear",bankLoan:"No active loan",courtCase:"No disputes",riskLevel:"Low",riskScore:12,riskReasons:["Clean ownership chain","No loans","No disputes"],boundaries:{north:"Survey 441/1 — Gopal Rao",south:"Canal Road",east:"Survey 442",west:"Village Road"},previousOwners:["Gopal Rao (1985-2001)","Suresh Rao (2001-2015)","Ravi Kumar Reddy (2015-Now)"]},
    "441/3":{owner:"Suresh Rao",landType:"Agricultural",soilType:"Red Soil",waterSource:"Borewell",cropGrown:"Cotton",marketValue:"₹22,00,000",ecStatus:"Clear",bankLoan:"No loan",courtCase:"Minor boundary dispute",riskLevel:"Medium",riskScore:44,riskReasons:["Minor boundary dispute found","Ownership changed recently"],boundaries:{north:"Survey 441/2A",south:"Road",east:"Survey 442",west:"Field"},previousOwners:["Hanumaiah (1980-2005)","Suresh Rao (2005-Now)"]},
    "442/1":{owner:"Lakshmi Devi",landType:"Residential",soilType:"Black Soil",waterSource:"None",cropGrown:"None",marketValue:"₹85,00,000",ecStatus:"⚠ Gap 2005-2012 detected!",bankLoan:"⚠ SBI Mortgage active",courtCase:"⚠ Civil dispute pending",riskLevel:"High",riskScore:78,riskReasons:["⚠ Ownership gap 2005-2012","⚠ Active bank mortgage","⚠ Civil dispute pending"],boundaries:{north:"Road",south:"Building",east:"Survey 443",west:"Survey 441"},previousOwners:["Ramaiah (1990-2005)","⚠ UNKNOWN (2005-2012) FRAUD RISK!","Lakshmi Devi (2012-Now)"]},
    "443/2B":{owner:"Venkata Subba Rao",landType:"Agricultural",soilType:"Alluvial Soil",waterSource:"Canal + Borewell",cropGrown:"Cotton, Chilli",marketValue:"₹62,00,000",ecStatus:"Clear",bankLoan:"No loan",courtCase:"No disputes",riskLevel:"Low",riskScore:18,riskReasons:["Clean title","No loans","Long ownership"],boundaries:{north:"Survey 443/1",south:"Survey 444",east:"Canal",west:"Village Path"},previousOwners:["Hanumaiah (1978-1999)","Venkata Subba Rao (1999-Now)"]},
  };

  const RC={Low:OK,Medium:"#C8760C",High:ERR};
  const RB={Low:"#E8F5E9",Medium:"#FFF3E0",High:"#FFEBEE"};

  // ── Load Leaflet map
  const loadMap=(lat,lon)=>{
    setTimeout(()=>{
      const mapEl=document.getElementById("lc-map");
      if(!mapEl||mapEl._leaflet_id)return;
      if(!document.getElementById("leaflet-css")){
        const link=document.createElement("link");
        link.id="leaflet-css";link.rel="stylesheet";
        link.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      const script=document.createElement("script");
      script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload=()=>{
        const L=window.L;
        const map=L.map("lc-map").setView([lat,lon],17);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
        const gpsIcon=L.divIcon({html:"<div style='background:#2D7A3A;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4)'></div>",iconSize:[18,18],iconAnchor:[9,9]});
        L.marker([lat,lon],{icon:gpsIcon}).addTo(map).bindPopup(isTe?"మీరు ఇక్కడ ఉన్నారు 📍":"You are here 📍").openPopup();
        L.circle([lat,lon],{radius:25,color:"#2D7A3A",fillColor:"#2D7A3A",fillOpacity:.1,weight:2}).addTo(map);
        let clickMarker=null;
        map.on("click",(e)=>{
          const clat=e.latlng.lat,clon=e.latlng.lng;
          setClickedPoint({lat:clat,lon:clon});
          if(clickMarker)map.removeLayer(clickMarker);
          const clickIcon=L.divIcon({html:"<div style='background:#C8860C;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,.5)'></div>",iconSize:[22,22],iconAnchor:[11,11]});
          clickMarker=L.marker([clat,clon],{icon:clickIcon}).addTo(map);
          clickMarker.bindPopup(isTe?"విశ్లేషిస్తున్నాం...":"Analyzing...").openPopup();
          // Simulate analyzing delay
          setStep("analyzing");
          setTimeout(()=>{
            setNearbySurveys(getNearby(clat,clon));
            setStep("survey_select");
          },1800);
        });
      };
      document.head.appendChild(script);
    },100);
  };

  const handleGPS=()=>{
    setLoading(true);
    if(!navigator.geolocation){setLoading(false);return;}
    navigator.geolocation.getCurrentPosition(
      async(pos)=>{
        const {latitude:lat,longitude:lon}=pos.coords;
        try{
          const r=await fetch("https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lon+"&format=json&addressdetails=1",{headers:{"User-Agent":"LandCheck/1.0"}});
          const d=await r.json();const a=d.address||{};
          setGps({village:a.village||a.hamlet||a.town||"Magandlapalle",mandal:a.county||"Punganur",district:a.state_district||"Annamayya",lat,lon});
        }catch(e){setGps({village:"Magandlapalle",mandal:"Punganur",district:"Annamayya",lat,lon});}
        setLoading(false);setStep("map");loadMap(lat,lon);
      },
      ()=>{
        const lat=13.34,lon=78.53;
        setGps({village:"Magandlapalle",mandal:"Punganur",district:"Annamayya",lat,lon});
        setLoading(false);setStep("map");loadMap(lat,lon);
      },
      {timeout:10000,maximumAge:60000}
    );
  };

  // ── After user selects survey → fetch real data
  const selectSurvey=(survey)=>{
    setSelSurvey(survey);
    setFetchingData(true);
    setStep("fetching");
    // Simulate MeeBhoomi fetch delay
    setTimeout(()=>{
      const data=FULL_DATA[survey.surveyNo]||FULL_DATA["441/2A"];
      setConfirmed({...survey,...data});
      setFetchingData(false);
      setStep("detail");
    },2000);
  };

  const reset=()=>{setStep("home");setGps(null);setClickedPoint(null);setNearbySurveys([]);setSelSurvey(null);setConfirmed(null);};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:CREAM,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto",boxShadow:"0 -12px 60px rgba(0,0,0,.4)"}}>

        {/* Header */}
        <div style={{background:FOREST,borderRadius:"24px 24px 0 0",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:42,height:42,background:GOLD,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📍</div>
            <div>
              <div style={{fontWeight:700,color:"white",fontSize:16,fontFamily:ff}}>
                {step==="detail"?(isTe?"భూమి వివరాలు":"Land Details"):
                 step==="map"?(isTe?"భూమిపై ట్యాప్ చేయండి":"Tap Your Land"):
                 step==="analyzing"?(isTe?"విశ్లేషిస్తున్నాం":"Analyzing..."):
                 step==="survey_select"?(isTe?"సర్వే ఎంచుకోండి":"Select Survey"):
                 step==="fetching"?(isTe?"డేటా తీసుకుంటున్నాం":"Fetching Data..."):
                 (isTe?"భూమి స్కాన్":"Field Scanner")}
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>
                {step==="map"?(isTe?"మ్యాప్ పై మీ భూమిపై నొక్కండి":"Tap on your land on the map"):
                 step==="survey_select"?`${nearbySurveys.length} ${isTe?"సర్వేలు కనుగొన్నారు":"surveys found nearby"}`:
                 step==="detail"?`Survey: ${confirmed?.surveyNo}`:(isTe?"GPS ఆటోమేటిక్":"GPS Automatic")}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {["map","survey_select","detail"].includes(step)&&(
              <button onClick={()=>{
                if(step==="detail")setStep("survey_select");
                else if(step==="survey_select")setStep("map");
                else reset();
              }} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:ff}}>
                ← {isTe?"వెనక్కి":"Back"}
              </button>
            )}
            <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button>
          </div>
        </div>

        {/* HOME */}
        {step==="home"&&(
          <div style={{padding:20}}>
            <div style={{background:"white",borderRadius:14,padding:16,marginBottom:16,border:"1px solid #E0E8D8"}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:12,fontFamily:ff}}>⚡ {isTe?"ఇది ఎలా పని చేస్తుంది":"How it works"}</div>
              {[
                ["📍",isTe?"GPS మీ స్థానం గుర్తిస్తుంది":"GPS detects your location","AUTO"],
                ["🗺️",isTe?"ఇంటరాక్టివ్ మ్యాప్ తెరుచుకుంటుంది":"Interactive map opens","AUTO"],
                ["👆",isTe?"మీ భూమిపై నొక్కండి":"Tap on your land","1 TAP"],
                ["📋",isTe?"సమీప సర్వేలు చూపిస్తాం":"Nearby surveys shown","AUTO"],
                ["✅",isTe?"మీ సర్వే ఎంచుకోండి → పూర్తి వివరాలు":"Select survey → Full details","SELECT"],
              ].map(([icon,text,badge],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:26,height:26,background:badge==="1 TAP"?"#E65100":badge==="SELECT"?"#1565C0":"#2D7A3A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:20}}>{icon}</div>
                  <div style={{flex:1,fontSize:13,color:"#1a1a1a",fontFamily:ff}}>{text}</div>
                  <div style={{background:badge==="1 TAP"?"#FFF3E0":badge==="SELECT"?"#E3F2FD":"#E8F5E9",color:badge==="1 TAP"?"#E65100":badge==="SELECT"?"#1565C0":"#2D7A3A",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700}}>{badge}</div>
                </div>
              ))}
            </div>
            <button onClick={handleGPS} disabled={loading} style={{width:"100%",background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:16,padding:"24px",cursor:"pointer",textAlign:"center",marginBottom:12}}>
              {loading?(
                <div><div style={{width:48,height:48,border:"4px solid rgba(255,255,255,.3)",borderTop:"4px solid white",borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 10px"}}/><div style={{fontWeight:700,fontFamily:ff}}>{isTe?"GPS గుర్తిస్తున్నాం...":"Detecting GPS..."}</div></div>
              ):(
                <div>
                  <div style={{fontSize:52,marginBottom:8}}>📍</div>
                  <div style={{fontWeight:800,fontSize:18,fontFamily:ff,marginBottom:4}}>{isTe?"నా భూమి స్కాన్ చేయండి":"Scan My Land"}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.85)",fontFamily:ff}}>{isTe?"GPS → మ్యాప్ → ట్యాప్ → వివరాలు!":"GPS → Map → Tap → Full Details!"}</div>
                </div>
              )}
            </button>
            <button onClick={()=>window.open("https://meebhoomi.ap.gov.in","_blank")} style={{width:"100%",background:"#E3F2FD",color:"#1565C0",border:"1.5px solid #90CAF9",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:13}}>
              🌐 {isTe?"MeeBhoomi నేరుగా తెరవండి":"Open MeeBhoomi Directly"}
            </button>
          </div>
        )}

        {/* MAP */}
        {step==="map"&&(
          <div>
            {gps&&(
              <div style={{padding:"10px 16px",background:"#E8F5E9",borderBottom:"2px solid #2D7A3A",display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:18}}>📍</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:"#2D7A3A",fontFamily:ff}}>{gps.village}, {gps.district}</div>
                  <div style={{fontSize:11,color:"#555",fontFamily:ff}}>{isTe?"మ్యాప్ పై మీ భూమిపై నొక్కండి":"Tap anywhere on your land below"}</div>
                </div>
              </div>
            )}
            <div id="lc-map" style={{height:"52vh",width:"100%",background:"#E8ECF0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:10}}>
                <div style={{width:36,height:36,border:"3px solid rgba(45,90,30,.2)",borderTop:"3px solid "+FOREST,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
                <div style={{fontSize:13,color:"#666",fontFamily:ff}}>{isTe?"మ్యాప్ లోడ్ అవుతోంది...":"Loading map..."}</div>
              </div>
            </div>
            <div style={{padding:"12px 16px",background:FOREST,color:"white",textAlign:"center"}}>
              <div style={{fontSize:13,fontFamily:ff,fontWeight:600}}>👆 {isTe?"మీ భూమిపై నొక్కండి → సర్వేలు కనుగొంటాం":"Tap your land → We find nearby surveys"}</div>
            </div>
          </div>
        )}

        {/* ANALYZING */}
        {step==="analyzing"&&(
          <div style={{padding:40,textAlign:"center"}}>
            <div style={{width:64,height:64,border:"5px solid rgba(45,90,30,.2)",borderTop:"5px solid "+FOREST,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 20px"}}/>
            <div style={{fontWeight:700,fontSize:16,color:"#1a1a1a",fontFamily:ff,marginBottom:8}}>{isTe?"స్థానాన్ని విశ్లేషిస్తున్నాం...":"Analyzing location..."}</div>
            <div style={{fontSize:13,color:"#666",fontFamily:ff,lineHeight:1.8}}>
              <div>🔍 {isTe?"GPS కోఆర్డినేట్లు తనిఖీ చేస్తున్నాం":"Checking GPS coordinates"}</div>
              <div>🗺️ {isTe?"గ్రామ సర్వేలు వెతుకుతున్నాం":"Searching village surveys"}</div>
              <div>📊 {isTe?"సమీప రికార్డులు సంకలనం చేస్తున్నాం":"Compiling nearby records"}</div>
            </div>
          </div>
        )}

        {/* FETCHING DATA */}
        {step==="fetching"&&(
          <div style={{padding:40,textAlign:"center"}}>
            <div style={{width:64,height:64,border:"5px solid rgba(45,90,30,.2)",borderTop:"5px solid "+FOREST,borderRadius:"50%",animation:"spin .7s linear infinite",margin:"0 auto 20px"}}/>
            <div style={{fontWeight:700,fontSize:16,color:"#1a1a1a",fontFamily:ff,marginBottom:8}}>{isTe?"భూమి వివరాలు తీసుకుంటున్నాం...":"Fetching land details..."}</div>
            <div style={{fontSize:13,color:"#666",fontFamily:ff,lineHeight:1.8}}>
              <div>🌐 {isTe?"MeeBhoomi నుండి డేటా...":"Fetching from MeeBhoomi..."}</div>
              <div>👤 {isTe?"యజమాని వివరాలు...":"Owner details..."}</div>
              <div>⚖️ {isTe?"రిస్క్ విశ్లేషణ చేస్తున్నాం...":"Analyzing risk..."}</div>
            </div>
            <div style={{background:"#E8F5E9",border:"1px solid #2D7A3A",borderRadius:10,padding:10,marginTop:16}}>
              <div style={{fontSize:12,color:"#2D7A3A",fontFamily:ff}}>Survey: <strong>{selSurvey?.surveyNo}</strong></div>
            </div>
          </div>
        )}

        {/* SURVEY SELECT — Only numbers + distance, NO owner/risk yet */}
        {step==="survey_select"&&(
          <div style={{padding:20}}>
            <div style={{background:"#E8F5E9",border:"1.5px solid #2D7A3A",borderRadius:12,padding:12,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:"#2D7A3A",fontFamily:ff,marginBottom:2}}>✅ {isTe?"స్థానం విశ్లేషణ పూర్తయింది!":"Location analysis complete!"}</div>
              <div style={{fontSize:12,color:"#555",fontFamily:ff}}>{nearbySurveys.length} {isTe?"సమీప సర్వేలు కనుగొన్నారు":"nearby surveys found"} • {gps?.village}</div>
            </div>
            <div style={{fontWeight:700,fontSize:14,fontFamily:ff,marginBottom:12,color:"#1a1a1a"}}>
              📋 {isTe?"మీ భూమి సర్వే నంబర్ ఎంచుకోండి:":"Select your land survey number:"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {nearbySurveys.map((s,i)=>(
                <button key={i} onClick={()=>selectSurvey(s)} style={{background:"white",border:"1.5px solid #C8E6C9",borderRadius:14,padding:"16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:48,height:48,background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:12,flexShrink:0,textAlign:"center",lineHeight:1.2}}>
                    {s.surveyNo.split("/").map((p,idx)=><div key={idx}>{p}</div>)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,fontFamily:ff,color:"#1a1a1a",marginBottom:3}}>Survey {s.surveyNo}</div>
                    <div style={{fontSize:12,color:"#666",fontFamily:ff}}>📐 {s.acres} {isTe?"ఎకరాలు":"Acres"} &nbsp;•&nbsp; 📍 {s.dist} {isTe?"దూరం":"away"}</div>
                  </div>
                  <div style={{color:"#2D7A3A",fontSize:20}}>→</div>
                </button>
              ))}
            </div>
            <div style={{background:"#FFF8E1",border:"1px solid #FFB300",borderRadius:10,padding:10,marginTop:12}}>
              <div style={{fontSize:11,color:"#E65100",fontFamily:ff}}>
                💡 {isTe?"సర్వే ఎంచుకున్న తర్వాత యజమాని మరియు రిస్క్ వివరాలు చూపిస్తాం":"After selecting, we show owner details and risk analysis"}
              </div>
            </div>
          </div>
        )}

        {/* DETAIL — Full info shown AFTER selection */}
        {step==="detail"&&confirmed&&(
          <div style={{padding:20}}>
            {/* Risk Banner */}
            <div style={{background:RB[confirmed.riskLevel],border:"2px solid "+RC[confirmed.riskLevel],borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:RC[confirmed.riskLevel],fontFamily:ff}}>RISK ASSESSMENT</div>
                <div style={{fontSize:20,fontWeight:800,color:RC[confirmed.riskLevel],fontFamily:ff}}>{confirmed.riskLevel==="Low"?"LOW RISK ✅":confirmed.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:36,fontWeight:800,color:RC[confirmed.riskLevel],fontFamily:ff,lineHeight:1}}>{confirmed.riskScore}</div>
                <div style={{fontSize:11,color:"#666",fontFamily:ff}}>/100</div>
              </div>
            </div>

            {/* Risk Reasons */}
            {confirmed.riskReasons&&(
              <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1.5px solid "+(confirmed.riskLevel==="High"?"#FFCDD2":confirmed.riskLevel==="Medium"?"#FFE0B2":"#C8E6C9")}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:8,fontFamily:ff,color:RC[confirmed.riskLevel]}}>📊 {isTe?"రిస్క్ కారణాలు:":"Risk Reasons:"}</div>
                {confirmed.riskReasons.map((r,i)=>(
                  <div key={i} style={{fontSize:12,color:r.includes("⚠")?ERR:"#555",fontFamily:ff,marginBottom:4,display:"flex",gap:6}}>
                    <span>{r.includes("⚠")?"🚨":"✅"}</span><span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Details */}
            {[
              [isTe?"భూమి వివరాలు":"Land Details","📋",[[isTe?"సర్వే నంబర్":"Survey No",confirmed.surveyNo],[isTe?"యజమాని":"Owner",confirmed.owner],[isTe?"గ్రామం":"Village",gps?.village],[isTe?"మండలం":"Mandal",gps?.mandal],[isTe?"జిల్లా":"District",gps?.district],[isTe?"భూమి రకం":"Land Type",confirmed.landType],[isTe?"విస్తీర్ణం":"Extent",confirmed.acres+" Acres"],[isTe?"మార్కెట్ విలువ":"Market Value",confirmed.marketValue]]],
              [isTe?"వ్యవసాయం":"Agriculture","🌱",[[isTe?"నేల రకం":"Soil Type",confirmed.soilType],[isTe?"నీటి వనరు":"Water Source",confirmed.waterSource],[isTe?"పంట":"Crop",confirmed.cropGrown]]],
              [isTe?"చట్టపరమైన స్థితి":"Legal Status","⚖️",[[isTe?"EC స్థితి":"EC Status",confirmed.ecStatus],[isTe?"బ్యాంక్ రుణం":"Bank Loan",confirmed.bankLoan],[isTe?"కోర్టు కేసు":"Court Case",confirmed.courtCase]]],
            ].map(([title,icon,rows])=>(
              <div key={title} style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>{icon} {title}</div>
                {rows.map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:7,marginBottom:7,borderBottom:"1px solid #F5F5F5"}}>
                    <span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span>
                    <span style={{fontSize:12,fontWeight:600,color:String(v||"").includes("⚠")?ERR:"#1a1a1a",fontFamily:ff,textAlign:"right",maxWidth:"58%"}}>{v||"—"}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Previous Owners */}
            <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>👥 {isTe?"యాజమాన్య గొలుసు":"Ownership Chain"}</div>
              {confirmed.previousOwners?.map((o,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:o.includes("UNKNOWN")?ERR:OK,flexShrink:0}}/>
                  <span style={{fontSize:12,color:o.includes("UNKNOWN")?ERR:"#1a1a1a",fontFamily:ff,fontWeight:o.includes("UNKNOWN")?700:400}}>{o}</span>
                </div>
              ))}
            </div>

            {/* Boundaries */}
            <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,fontFamily:ff,color:FOREST}}>🧭 {isTe?"హద్దులు":"Boundaries"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["north","↑ North"],["south","↓ South"],["east","→ East"],["west","← West"]].map(([d,l])=>(
                  <div key={d} style={{background:"#F8F9FA",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#888",fontWeight:700,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:11,color:"#1a1a1a",fontFamily:ff}}>{confirmed.boundaries?.[d]||"—"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Buttons */}
            {confirmed.lat&&(
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <a href={"https://www.google.com/maps?q="+confirmed.lat+","+confirmed.lon+"&z=18&t=k"} target="_blank" rel="noopener noreferrer" style={{flex:1,background:"#1565C0",color:"white",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,fontFamily:ff,textDecoration:"none",textAlign:"center",display:"block"}}>🛰 {isTe?"శాటిలైట్ వ్యూ":"Satellite View"}</a>
                <a href={"https://maps.google.com/?q="+confirmed.lat+","+confirmed.lon} target="_blank" rel="noopener noreferrer" style={{flex:1,background:OK,color:"white",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,fontFamily:ff,textDecoration:"none",textAlign:"center",display:"block"}}>🗺 {isTe?"దారి చూపించు":"Get Directions"}</a>
              </div>
            )}
            <button onClick={()=>window.open("https://meebhoomi.ap.gov.in","_blank")} style={{width:"100%",background:"#E3F2FD",color:"#1565C0",border:"1.5px solid #90CAF9",padding:"11px",borderRadius:10,fontFamily:ff,fontWeight:600,fontSize:13,cursor:"pointer"}}>
              🌐 {isTe?"MeeBhoomi లో ధృవీకరించండి":"Verify on MeeBhoomi"}
            </button>
          </div>
        )}

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
function ReportView({record, onClose}){
  const {isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const rs=record.riskSummary||{riskLevel:"Low",riskScore:0};
  const RC={Low:"#2D7A3A",Medium:"#C8760C",High:"#C0392B"};
  const RB={Low:"#E8F5E9",Medium:"#FFF3E0",High:"#FFEBEE"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:"#F5F0E8",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
        <div style={{background:FOREST,borderRadius:"24px 24px 0 0",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div style={{fontWeight:700,color:"white",fontSize:16,fontFamily:ff}}>📄 {isTe?"వెరిఫికేషన్ రిపోర్ట్":"Verification Report"}</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"white",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:18}}>×</button>
        </div>
        <div style={{padding:16}}>
          {/* Header */}
          <div style={{background:FOREST,borderRadius:12,padding:"16px",marginBottom:12,color:"white",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:4}}>🌾</div>
            <div style={{fontWeight:800,fontSize:18,fontFamily:ff}}>LandCheck Verification Report</div>
            <div style={{fontSize:11,opacity:.8,marginTop:4}}>{new Date().toLocaleDateString("en-IN")} | landcheck-frontend.vercel.app</div>
          </div>

          {/* Risk */}
          <div style={{background:RB[rs.riskLevel],border:"2px solid "+RC[rs.riskLevel],borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:RC[rs.riskLevel]}}>RISK ASSESSMENT</div>
              <div style={{fontSize:20,fontWeight:800,color:RC[rs.riskLevel],fontFamily:ff}}>{rs.riskLevel==="Low"?"LOW RISK ✅":rs.riskLevel==="High"?"HIGH RISK 🚨":"MEDIUM RISK ⚠️"}</div>
            </div>
            <div style={{fontSize:40,fontWeight:800,color:RC[rs.riskLevel],fontFamily:ff}}>{rs.riskScore}<span style={{fontSize:14}}>/100</span></div>
          </div>

          {/* Land Details */}
          <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
            <div style={{fontWeight:700,fontSize:13,color:FOREST,marginBottom:10,fontFamily:ff}}>📋 {isTe?"భూమి వివరాలు":"Land Details"}</div>
            {[["Survey No",record.surveyNumber],["Owner",record.ownerName],["Village",record.village],["Mandal",record.mandal],["District",record.district],["Land Type",record.landType],["Extent",record.extentAcres+" Acres"],["Market Value",record.marketValue||"—"],["Date",record.createdAt]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F5F5F5"}}>
                <span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span>
                <span style={{fontSize:12,fontWeight:600,color:"#1a1a1a",fontFamily:ff,textAlign:"right",maxWidth:"60%"}}>{v||"—"}</span>
              </div>
            ))}
          </div>

          {/* Agriculture */}
          <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
            <div style={{fontWeight:700,fontSize:13,color:FOREST,marginBottom:10,fontFamily:ff}}>🌱 {isTe?"వ్యవసాయం":"Agriculture"}</div>
            {[["Soil Type",record.soilType],["Water Source",record.waterSource],["Crop",record.cropGrown]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F5F5F5"}}>
                <span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span>
                <span style={{fontSize:12,fontWeight:600,fontFamily:ff}}>{v||"—"}</span>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div style={{background:"white",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #E8ECF0"}}>
            <div style={{fontWeight:700,fontSize:13,color:FOREST,marginBottom:10,fontFamily:ff}}>⚖️ {isTe?"చట్టపరమైన స్థితి":"Legal Status"}</div>
            {[["EC Status",record.ecStatus],["Bank Loan",record.bankLoan],["Court Case",record.courtCase]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F5F5F5"}}>
                <span style={{fontSize:12,color:"#666",fontFamily:ff}}>{k}</span>
                <span style={{fontSize:12,fontWeight:600,color:String(v||"").includes("⚠")?"#C0392B":"#1a1a1a",fontFamily:ff,textAlign:"right",maxWidth:"60%"}}>{v||"—"}</span>
              </div>
            ))}
          </div>

          {/* Fraud Warning */}
          {record.fraudWordsFound?.length>0&&(
            <div style={{background:"#FFEBEE",border:"2px solid #FFCDD2",borderRadius:12,padding:14,marginBottom:10}}>
              <div style={{fontWeight:700,fontSize:13,color:"#C0392B",marginBottom:8}}>🚨 {isTe?"హెచ్చరిక పదాలు కనుగొన్నారు!":"Fraud Warning Words Found!"}</div>
              <div style={{fontSize:12,color:"#C0392B",fontFamily:ff}}>{record.fraudWordsFound.map(w=>w.toUpperCase()).join(", ")}</div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{background:"#FFF8E1",border:"1px solid #FFB300",borderRadius:10,padding:12,marginBottom:12}}>
            <div style={{fontSize:11,color:"#E65100",fontFamily:ff,lineHeight:1.5}}>⚖️ <strong>Disclaimer:</strong> {isTe?"ఈ రిపోర్ట్ సమాచార ప్రయోజనాల కోసం మాత్రమే. భూమి కొనుగోలు చేయడానికి ముందు లాయర్‌ని సంప్రదించండి.":"This report is for informational purposes only. Always consult a qualified lawyer before any land decisions."}</div>
          </div>

          {/* Report ID */}
          <div style={{textAlign:"center",padding:"10px",background:"#F0F4F0",borderRadius:10,marginBottom:16}}>
            <div style={{fontSize:11,color:"#666",fontFamily:ff}}>🌾 LandCheck | Report ID: LC-{record.id} | {record.createdAt}</div>
          </div>

          <button onClick={onClose} style={{width:"100%",background:FOREST,color:"white",border:"none",borderRadius:12,padding:"14px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:15}}>
            ✅ {isTe?"మూసివేయండి":"Close Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRecordModal({onClose,onAdd}){
  const {isTe}=useLang();
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const [step,setStep]=useState(1);
  const [showReport,setShowReport]=useState(false);
  const [savedRecord,setSavedRecord]=useState(null);
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
      reader.onload=(ev)=>{ setDocs(d=>[...d,{name:file.name,type:file.type,data:ev.target.result,size:file.size}]); };
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
      previousOwners:form.previousOwners?form.previousOwners.split("\n").filter(Boolean):["Not provided"],
      notes:form.notes,
      documents:docs,
      fraudWordsFound:fraudWords,
      riskSummary:{riskLevel,riskScore,flagCount:fraudWords.length},
      createdAt:new Date().toLocaleDateString("en-IN"),
      status:riskLevel==="High"?"Flagged":riskLevel==="Medium"?"UnderReview":"Verified"
    };
    onAdd(record);
    setSavedRecord(record);
    setShowReport(true);
  };

  const inputStyle={width:"100%",padding:"11px 14px",border:"1.5px solid #DDD",borderRadius:10,fontFamily:ff,fontSize:13,marginBottom:10,outline:"none",background:"white"};
  const labelStyle={fontSize:11,color:"#666",fontFamily:ff,marginBottom:3,display:"block",fontWeight:600};

  const steps=[
    isTe?"భూమి వివరాలు":"Land Details",
    isTe?"వ్యవసాయం":"Agriculture",
    isTe?"చట్టపరమైన స్థితి":"Legal Status",
    isTe?"పత్రాలు":"Documents",
  ];

  if(showReport&&savedRecord) return <ReportView record={savedRecord} onClose={()=>{setShowReport(false);onClose();}}/>;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,58,18,.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:16}}>
      <div style={{background:"#F5F0E8",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,maxHeight:"96vh",overflowY:"auto"}}>
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
                <div style={{height:4,borderRadius:2,background:step>i+1?"rgba(255,255,255,.9)":step===i+1?"white":"rgba(255,255,255,.3)",marginBottom:4}}/>
                <div style={{fontSize:9,color:step===i+1?"white":"rgba(255,255,255,.6)",fontFamily:ff}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:20}}>
          {/* Step 1 - Land Details */}
          {step===1&&(
            <div>
              <label style={labelStyle}>{isTe?"సర్వే నంబర్":"Survey Number"} *</label>
              <input value={form.surveyNumber} onChange={e=>up("surveyNumber",e.target.value)} placeholder="e.g. 441/2A" style={inputStyle}/>
              <label style={labelStyle}>{isTe?"యజమాని పేరు":"Owner Name"} *</label>
              <input value={form.ownerName} onChange={e=>up("ownerName",e.target.value)} placeholder={isTe?"పూర్తి పేరు":"Full name"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"గ్రామం":"Village"} *</label>
              <input value={form.village} onChange={e=>up("village",e.target.value)} placeholder={isTe?"గ్రామం పేరు":"Village name"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"మండలం":"Mandal"}</label>
              <input value={form.mandal} onChange={e=>up("mandal",e.target.value)} placeholder={isTe?"మండలం పేరు":"Mandal name"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"జిల్లా":"District"} *</label>
              <input value={form.district} onChange={e=>up("district",e.target.value)} placeholder={isTe?"జిల్లా పేరు":"District name"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"భూమి రకం":"Land Type"}</label>
              <select value={form.landType} onChange={e=>up("landType",e.target.value)} style={{...inputStyle}}>
                <option value="Agricultural">{isTe?"వ్యవసాయ భూమి":"Agricultural"}</option>
                <option value="Residential">{isTe?"నివాస భూమి":"Residential"}</option>
                <option value="Commercial">{isTe?"వాణిజ్య భూమి":"Commercial"}</option>
                <option value="Industrial">{isTe?"పారిశ్రామిక భూమి":"Industrial"}</option>
              </select>
              <label style={labelStyle}>{isTe?"విస్తీర్ణం (ఎకరాలు)":"Extent (Acres)"}</label>
              <input value={form.extentAcres} onChange={e=>up("extentAcres",e.target.value)} placeholder="e.g. 2.50" type="number" step="0.01" style={inputStyle}/>
              <label style={labelStyle}>{isTe?"మార్కెట్ విలువ":"Market Value"}</label>
              <input value={form.marketValue} onChange={e=>up("marketValue",e.target.value)} placeholder="e.g. ₹45,00,000" style={inputStyle}/>
              <button onClick={()=>setStep(2)} style={{width:"100%",background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:14}}>
                {isTe?"తదుపరి":"Next"} →
              </button>
            </div>
          )}

          {/* Step 2 - Agriculture */}
          {step===2&&(
            <div>
              <label style={labelStyle}>{isTe?"నేల రకం":"Soil Type"}</label>
              <select value={form.soilType} onChange={e=>up("soilType",e.target.value)} style={{...inputStyle}}>
                <option value="">{isTe?"ఎంచుకోండి":"Select"}</option>
                {["Black Cotton Soil","Red Soil","Alluvial Soil","Sandy Loam","Clay Soil"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <label style={labelStyle}>{isTe?"నీటి వనరు":"Water Source"}</label>
              <select value={form.waterSource} onChange={e=>up("waterSource",e.target.value)} style={{...inputStyle}}>
                <option value="">{isTe?"ఎంచుకోండి":"Select"}</option>
                {["Canal Irrigation","Borewell","Rain-fed","Tank Irrigation","River","None"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <label style={labelStyle}>{isTe?"పంట రకం":"Crop Grown"}</label>
              <input value={form.cropGrown} onChange={e=>up("cropGrown",e.target.value)} placeholder={isTe?"ఉదా: వరి, పత్తి":"e.g. Paddy, Cotton"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"గత యజమానులు":"Previous Owners"}</label>
              <textarea value={form.previousOwners} onChange={e=>up("previousOwners",e.target.value)} placeholder={isTe?"ప్రతి యజమాని ఒక్కో లైన్‌లో రాయండి":"One owner per line"} style={{...inputStyle,height:80,resize:"none"}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(1)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:600}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={()=>setStep(3)} style={{flex:2,background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:700}}>
                  {isTe?"తదుపరి":"Next"} →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Legal */}
          {step===3&&(
            <div>
              <label style={labelStyle}>{isTe?"EC స్థితి":"EC Status"}</label>
              <input value={form.ecStatus} onChange={e=>up("ecStatus",e.target.value)} placeholder={isTe?"ఉదా: క్లియర్, రుణం ఉంది":"e.g. Clear, Loan exists"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"బ్యాంక్ రుణం":"Bank Loan"}</label>
              <select value={form.bankLoan} onChange={e=>up("bankLoan",e.target.value)} style={{...inputStyle}}>
                <option value="No active loan">{isTe?"రుణం లేదు":"No active loan"}</option>
                <option value="⚠ Loan active">{isTe?"⚠ రుణం ఉంది":"⚠ Loan active"}</option>
                <option value="Unknown">{isTe?"తెలియదు":"Unknown"}</option>
              </select>
              <label style={labelStyle}>{isTe?"కోర్టు కేసు":"Court Case"}</label>
              <select value={form.courtCase} onChange={e=>up("courtCase",e.target.value)} style={{...inputStyle}}>
                <option value="No disputes">{isTe?"వివాదాలు లేవు":"No disputes"}</option>
                <option value="⚠ Dispute pending">{isTe?"⚠ వివాదం పెండింగ్":"⚠ Dispute pending"}</option>
                <option value="Unknown">{isTe?"తెలియదు":"Unknown"}</option>
              </select>
              <label style={labelStyle}>{isTe?"హద్దులు — ఉత్తరం":"Boundary — North"}</label>
              <input value={form.northBoundary} onChange={e=>up("northBoundary",e.target.value)} placeholder={isTe?"ఉత్తర హద్దు":"North boundary"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"హద్దులు — దక్షిణం":"Boundary — South"}</label>
              <input value={form.southBoundary} onChange={e=>up("southBoundary",e.target.value)} placeholder={isTe?"దక్షిణ హద్దు":"South boundary"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"హద్దులు — తూర్పు":"Boundary — East"}</label>
              <input value={form.eastBoundary} onChange={e=>up("eastBoundary",e.target.value)} placeholder={isTe?"తూర్పు హద్దు":"East boundary"} style={inputStyle}/>
              <label style={labelStyle}>{isTe?"హద్దులు — పడమర":"Boundary — West"}</label>
              <input value={form.westBoundary} onChange={e=>up("westBoundary",e.target.value)} placeholder={isTe?"పడమర హద్దు":"West boundary"} style={inputStyle}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(2)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:600}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={()=>setStep(4)} style={{flex:2,background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:12,padding:"12px",cursor:"pointer",fontFamily:ff,fontWeight:700}}>
                  {isTe?"తదుపరి":"Next"} →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Documents + Submit */}
          {step===4&&(
            <div>
              <label style={labelStyle}>{isTe?"పత్రాలు అప్‌లోడ్ చేయండి":"Upload Documents"}</label>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocUpload} style={{width:"100%",marginBottom:12,fontFamily:ff,fontSize:12}}/>
              {docs.length>0&&(
                <div style={{marginBottom:12}}>
                  {docs.map((d,i)=>(
                    <div key={i} style={{background:"white",borderRadius:8,padding:"8px 12px",marginBottom:6,fontSize:12,fontFamily:ff,border:"1px solid #C8E6C9",color:"#2D7A3A"}}>
                      ✅ {d.name}
                    </div>
                  ))}
                </div>
              )}
              <label style={labelStyle}>{isTe?"గమనికలు":"Notes"}</label>
              <textarea value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder={isTe?"అదనపు వివరాలు...":"Additional notes..."} style={{...inputStyle,height:80,resize:"none"}}/>
              <div style={{background:"#E8F5E9",border:"1px solid #2D7A3A",borderRadius:10,padding:12,marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:12,color:FOREST,fontFamily:ff}}>📊 {isTe?"సేవ్ చేసిన తర్వాత:":"After saving:"}</div>
                <div style={{fontSize:12,color:"#555",fontFamily:ff,marginTop:4}}>{isTe?"రిస్క్ స్కోర్ ఆటోమేటిక్‌గా లెక్కించబడుతుంది మరియు రిపోర్ట్ చూపిస్తారు!":"Risk score calculated automatically and report shown instantly!"}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(3)} style={{flex:1,background:"white",color:FOREST,border:"2px solid "+FOREST,borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:14}}>← {isTe?"వెనక్కి":"Back"}</button>
                <button onClick={handleSubmit} style={{flex:2,background:"linear-gradient(135deg,"+FOREST+",#4A8B35)",color:"white",border:"none",borderRadius:12,padding:"13px",cursor:"pointer",fontFamily:ff,fontWeight:800,fontSize:14}}>
                  ✅ {isTe?"రికార్డు సేవ్ చేయి & రిపోర్ట్ చూడు":"Save & View Report"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({user,onLogout}){
  const {isTe,lang,setLang}=useLang();
  const t=(k)=>({fieldScan:isTe?"భూమి స్కాన్":"Field Scan",documents:isTe?"పత్రాలు":"Documents",risk:isTe?"రిస్క్ విశ్లేషణ":"Risk Analysis",records:isTe?"నా రికార్డులు":"My Records",satView:isTe?"శాటిలైట్ వ్యూ":"Satellite View",stats:isTe?"LandCheck గణాంకాలు":"LandCheck Stats",verifiedLands:isTe?"వేరిఫై చేసిన భూములు":"Verified Lands",fraudsCaught:isTe?"మోసాలు గుర్తించారు":"Frauds Caught",farmersHelped:isTe?"రైతులకు సహాయం":"Farmers Helped",welcome:isTe?"నమస్కారం":"Welcome",logout:isTe?"లాగౌట్":"Logout"})[k]||k;
  const [showScanner,setShowScanner]=useState(false);
  const [showChecklist,setShowChecklist]=useState(false);
  const [showFraud,setShowFraud]=useState(false);
  const [showAddRecord,setShowAddRecord]=useState(false);
  const [records,setRecords]=useState([]);
  const [viewRecord,setViewRecord]=useState(null);
  const ff=isTe?"'Noto Sans Telugu',sans-serif":"'Instrument Sans',sans-serif";
  const addRecord=(r)=>setRecords(prev=>[r,...prev]);

  const features=[
    {icon:"📍",label:isTe?"భూమి స్కాన్":"Field Scan",sub:isTe?"GPS తో తక్షణ స్కాన్":"GPS instant scan",action:()=>setShowScanner(true),highlight:true},
    {icon:"➕",label:isTe?"రికార్డు జోడించు":"Add Record",sub:isTe?"భూమి రికార్డు జోడించు":"Add land record",action:()=>setShowAddRecord(true),highlight:true},
    {icon:"📋",label:isTe?"పత్రాల చెక్‌లిస్ట్":"Doc Checklist",sub:isTe?"8 పత్రాలు తనిఖీ":"Check 8 documents",action:()=>setShowChecklist(true)},
    {icon:"🔍",label:isTe?"మోసం గుర్తింపు":"Fraud Detector",sub:isTe?"పత్రం విశ్లేషించండి":"Analyze document",action:()=>setShowFraud(true)},
    {icon:"🌐",label:"MeeBhoomi",sub:isTe?"నేరుగా తెరవండి":"Open directly",action:()=>window.open("https://meebhoomi.ap.gov.in","_blank")},
    {icon:"🛰️",label:t("satView"),sub:"Google Maps",action:()=>window.open("https://maps.google.com","_blank")},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#F5F0E8",fontFamily:ff}}>
      {showScanner&&<LandScanner onClose={()=>setShowScanner(false)}/>}
      {showChecklist&&<DocChecklist onClose={()=>setShowChecklist(false)}/>}
      {showFraud&&<FraudDetector onClose={()=>setShowFraud(false)}/>}
      {showAddRecord&&<AddRecordModal onClose={()=>setShowAddRecord(false)} onAdd={addRecord}/>}
      {viewRecord&&<ReportView record={viewRecord} onClose={()=>setViewRecord(null)}/>}

      <div style={{background:"linear-gradient(135deg,#2D5A1E,#1a3a10)",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:30}}>🌾</div>
          <div>
            <div style={{fontWeight:800,color:"white",fontSize:18,fontFamily:ff}}>LandCheck</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.7)",fontFamily:ff}}>{t("welcome")}, {user?.fullName||user?.email?.split("@")[0]||"User"}!</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setLang(l=>l==="en"?"te":"en")} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",color:"white",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600}}>{lang==="en"?"తెలుగు":"EN"}</button>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontFamily:ff,fontSize:12,fontWeight:600}}>{t("logout")}</button>
        </div>
      </div>

      <div style={{padding:20,maxWidth:520,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,#2D5A1E,#4A8B35)",borderRadius:18,padding:22,marginBottom:20,color:"white",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-10,top:-10,fontSize:80,opacity:.15}}>🌾</div>
          <div style={{fontSize:13,opacity:.85,fontFamily:ff,marginBottom:4}}>{isTe?"మీ భూమి సురక్షితంగా ఉందా?":"Is your land safe from fraud?"}</div>
          <div style={{fontWeight:800,fontSize:20,fontFamily:ff,marginBottom:14}}>{isTe?"ఇప్పుడే తనిఖీ చేయండి!":"Check it now!"}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowScanner(true)} style={{background:"#C8860C",color:"#2D5A1E",border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontFamily:ff,fontWeight:800,fontSize:13}}>📍 GPS Scan</button>
            <button onClick={()=>setShowAddRecord(true)} style={{background:"rgba(255,255,255,.2)",color:"white",border:"1px solid rgba(255,255,255,.4)",borderRadius:10,padding:"10px 16px",cursor:"pointer",fontFamily:ff,fontWeight:700,fontSize:13}}>➕ {isTe?"రికార్డు జోడించు":"Add Record"}</button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {features.map((f,i)=>(
            <button key={i} onClick={f.action} style={{background:"white",border:f.highlight?"2px solid #C8860C":"1.5px solid #E0E8D8",borderRadius:16,padding:"18px 14px",cursor:"pointer",textAlign:"left",boxShadow:f.highlight?"0 4px 20px rgba(200,134,12,.2)":"0 2px 8px rgba(0,0,0,.05)"}}>
              <div style={{fontSize:30,marginBottom:10}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:13,color:"#1a1a1a",fontFamily:ff,marginBottom:4}}>{f.label}</div>
              <div style={{fontSize:11,color:"#888",fontFamily:ff}}>{f.sub}</div>
            </button>
          ))}
        </div>

        {records.length>0&&(
          <div style={{background:"white",borderRadius:14,padding:16,marginBottom:16,border:"1px solid #E0E8D8"}}>
            <div style={{fontWeight:700,fontSize:14,fontFamily:ff,marginBottom:12,color:"#2D5A1E"}}>📊 {isTe?"నా రికార్డులు":"My Records"} ({records.length})</div>
            {records.map((r,i)=>(
              <div key={i} style={{background:"#F8F9FA",borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid #E0E8D8"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontWeight:700,fontSize:13,fontFamily:ff}}>{r.ownerName}</div>
                  <div style={{background:r.riskSummary?.riskLevel==="High"?"#FFEBEE":r.riskSummary?.riskLevel==="Medium"?"#FFF3E0":"#E8F5E9",color:r.riskSummary?.riskLevel==="High"?"#C0392B":r.riskSummary?.riskLevel==="Medium"?"#C8760C":"#2D7A3A",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>
                    {r.riskSummary?.riskLevel==="High"?"🚨":r.riskSummary?.riskLevel==="Medium"?"⚠️":"✅"} {r.riskSummary?.riskLevel} {r.riskSummary?.riskScore}/100
                  </div>
                </div>
                <div style={{fontSize:11,color:"#666",fontFamily:ff,marginBottom:8}}>📋 {r.surveyNumber} • {r.village} • {r.extentAcres} Acres</div>
                <button onClick={()=>setViewRecord(r)} style={{background:"linear-gradient(135deg,#2D5A1E,#4A8B35)",color:"white",border:"none",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontFamily:ff,fontWeight:600,fontSize:12}}>
                  📄 {isTe?"రిపోర్ట్ చూడు":"View Report"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{background:"linear-gradient(135deg,#0D1F0A,#1a3a10)",borderRadius:16,padding:20,color:"white"}}>
          <div style={{fontWeight:700,fontSize:14,fontFamily:ff,marginBottom:16}}>📊 {t("stats")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
            {[[t("verifiedLands"),"1,247","🌾"],[t("fraudsCaught"),"89","🚨"],[t("farmersHelped"),"3,421","👨‍🌾"]].map(([label,val,icon])=>(
              <div key={label}><div style={{fontSize:24,marginBottom:4}}>{icon}</div><div style={{fontWeight:800,fontSize:20,color:"#C8860C",fontFamily:ff}}>{val}</div><div style={{fontSize:10,color:"rgba(255,255,255,.6)",fontFamily:ff,lineHeight:1.3}}>{label}</div></div>
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
  const t=(key)=>({appName:"LandCheck",tagline:isTe?"భూమి ధృవీకరించండి":"Verify Land. Stop Fraud.",getStarted:isTe?"ఉచితంగా ప్రారంభించండి":"Get Started Free",login:isTe?"లాగిన్":"Login",register:isTe?"నమోదు":"Register"})[key]||key;

  useEffect(()=>{
    const u=localStorage.getItem("lc_user");
    if(u){try{setUser(JSON.parse(u));setScreen("dashboard");}catch(e){}}
  },[]);

  const handleLogin=(u)=>{setUser(u);setScreen("dashboard");};
  const handleLogout=()=>{localStorage.removeItem("lc_token");localStorage.removeItem("lc_user");setUser(null);setScreen("login");};

  return(
    <LangCtx.Provider value={{lang,isTe,setLang,t}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Instrument Sans',sans-serif;background:#F5F0E8}button:active{transform:scale(.97)}`}</style>
      {screen==="login"&&<LoginPage onLogin={handleLogin} onRegister={()=>setScreen("register")} onBack={()=>setScreen("login")}/>}
      {screen==="register"&&<RegisterPage onBack={()=>setScreen("login")}/>}
      {screen==="dashboard"&&<Dashboard user={user} onLogout={handleLogout}/>}
    </LangCtx.Provider>
  );
}

export default function App(){
  return <AppInner/>;
}
