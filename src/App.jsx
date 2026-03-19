import { useState, useEffect, useRef, createContext, useContext } from "react";

const T = {
    en: {
        appName: "LandCheck", tagline: "Verify Land. Stop Fraud. Protect Families.", taglineSub: "India's land fraud prevention platform",
        chooseLanguage: "Choose Your Language", chooseLanguageSub: "Select the language you are comfortable with", continueBtn: "Continue →",
        welcomeBack: "Welcome back", signInSub: "Sign in to your LandCheck account", email: "Email Address", password: "Password",
        signIn: "Sign In →", noAccount: "Don't have an account?", registerHere: "Register here", quickDemo: "⚡ Quick Demo Login", signingIn: "Signing in…",
        createAccount: "Create Account", whoAreYou: "Who are you?", whoAreYouSub: "Select your role", yourDetails: "Your details",
        fullName: "Full Name", fullNamePlaceholder: "As per Aadhaar", phone: "Mobile Number", phonePlaceholder: "10-digit mobile",
        organisation: "Organisation Name", organisationPlaceholder: "Bank / firm name", passwordPlaceholder: "Min 8 characters",
        confirmPassword: "Confirm Password", confirmPasswordPlaceholder: "Repeat password", creating: "Creating…",
        createAccountBtn: "Create Account 🎉", alreadyRegistered: "Already registered?", signInLink: "Sign in", back: "← Back", continue: "Continue →",
        farmer: "Farmer", farmerDesc: "Own / buy agricultural land", bank: "Bank / NBFC", bankDesc: "Verify before loan",
        lawyer: "Advocate", lawyerDesc: "Land dispute analysis", realEstate: "Real Estate", realEstateDesc: "Property transactions",
        nri: "NRI", nriDesc: "Remote land verification",
        goodMorning: "Good morning", goodAfternoon: "Good afternoon", goodEvening: "Good evening",
        searchPlaceholder: "Search survey no., village, owner…", totalRecords: "Total Records", verified: "Verified",
        flagged: "Flagged", documents: "Documents", landRecords: "Land Records", addRecord: "+ Add", loading: "Loading records…",
        noRecords: "No records found", noRecordsSub: "Add your first land record", overview: "Overview",
        riskDistribution: "Risk Distribution", lowRisk: "Low Risk", mediumRisk: "Medium Risk", highRisk: "High Risk",
        analytics: "Analytics", reports: "Reports", profile: "Profile", records: "Records",
        landDetails: "Land Details", landType: "Land Type", extent: "Extent", currentOwner: "Current Owner",
        uploaded: "uploaded", added: "Added", riskAnalysis: "Risk Analysis", runAnalysis: "🔍 Run Risk Analysis",
        analyzing: "🔄 Analyzing…", cleanChain: "✓ Clean chain. No issues detected.", ownershipTimeline: "Ownership Timeline",
        downloadReport: "📥 Download Risk Report (PDF)", verifyMeeBhoomi: "🌐 Verify on MeeBhoomi",
        overview2: "📋 Overview", chain: "🔗 Chain", docs: "📄 Documents", uploadDocument: "📤 Upload Document",
        noDocuments: "No documents uploaded yet", deleteRecord: "Delete",
        lowRiskLabel: "LOW RISK", mediumRiskLabel: "MEDIUM RISK", highRiskLabel: "HIGH RISK", criticalLabel: "CRITICAL",
        verifiedStatus: "VERIFIED", flaggedStatus: "FLAGGED", underReview: "UNDER REVIEW", pending: "PENDING", disputed: "DISPUTED",
        signOut: "🚪 Sign Out", language: "Language", enabled: "Enabled",
        assistantName: "LandCheck Assistant",
        assistantGreeting: "Hello! I am your LandCheck Assistant. Ask me anything about land records, documents, or fraud prevention.",
        assistantPlaceholder: "Ask me anything about land…", askAssistant: "Ask", thinking: "Thinking…", suggestedQuestions: "Suggested Questions",
        legalNote: "⚖️ LandCheck provides AI-assisted risk analysis ONLY. Final ownership can only be confirmed by government authorities.",
    },
    te: {
        appName: "లాండ్‌చెక్", tagline: "భూమిని ధృవీకరించండి. మోసాన్ని ఆపండి. కుటుంబాలను రక్షించండి.", taglineSub: "భారతదేశపు భూమి మోసం నివారణ వేదిక",
        chooseLanguage: "మీ భాషను ఎంచుకోండి", chooseLanguageSub: "మీకు సౌకర్యంగా ఉన్న భాషను ఎంచుకోండి", continueBtn: "కొనసాగించు →",
        welcomeBack: "మళ్ళీ స్వాగతం", signInSub: "మీ లాండ్‌చెక్ ఖాతాలోకి లాగిన్ అవ్వండి", email: "ఇమెయిల్ చిరునామా", password: "పాస్‌వర్డ్",
        signIn: "లాగిన్ అవ్వండి →", noAccount: "ఖాతా లేదా?", registerHere: "ఇక్కడ నమోదు చేసుకోండి", quickDemo: "⚡ త్వరిత డెమో లాగిన్", signingIn: "లాగిన్ అవుతున్నది…",
        createAccount: "ఖాతా తెరవండి", whoAreYou: "మీరు ఎవరు?", whoAreYouSub: "మీ పాత్రను ఎంచుకోండి", yourDetails: "మీ వివరాలు",
        fullName: "పూర్తి పేరు", fullNamePlaceholder: "ఆధార్ ప్రకారం", phone: "మొబైల్ నంబర్", phonePlaceholder: "10 అంకెల మొబైల్",
        organisation: "సంస్థ పేరు", organisationPlaceholder: "బ్యాంకు / సంస్థ పేరు", passwordPlaceholder: "కనీసం 8 అక్షరాలు",
        confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి", confirmPasswordPlaceholder: "పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి", creating: "తయారు చేస్తున్నది…",
        createAccountBtn: "ఖాతా తెరవండి 🎉", alreadyRegistered: "ఇప్పటికే నమోదు అయ్యారా?", signInLink: "లాగిన్ అవ్వండి", back: "← వెనుకకు", continue: "కొనసాగించు →",
        farmer: "రైతు", farmerDesc: "వ్యవసాయ భూమి కొనండి / అమ్మండి", bank: "బ్యాంకు / NBFC", bankDesc: "రుణం ఇవ్వడానికి ముందు ధృవీకరించండి",
        lawyer: "న్యాయవాది", lawyerDesc: "భూమి వివాద విశ్లేషణ", realEstate: "రియల్ ఎస్టేట్", realEstateDesc: "ఆస్తి లావాదేవీలు",
        nri: "NRI", nriDesc: "దూరంగా ఉండి భూమిని ధృవీకరించండి",
        goodMorning: "శుభోదయం", goodAfternoon: "శుభ మధ్యాహ్నం", goodEvening: "శుభ సాయంత్రం",
        searchPlaceholder: "సర్వే నం., గ్రామం, యజమాని వెతకండి…", totalRecords: "మొత్తం రికార్డులు", verified: "ధృవీకరించబడింది",
        flagged: "గుర్తించబడింది", documents: "పత్రాలు", landRecords: "భూమి రికార్డులు", addRecord: "+ జోడించు", loading: "రికార్డులు లోడ్ అవుతున్నాయి…",
        noRecords: "రికార్డులు కనుగొనబడలేదు", noRecordsSub: "మీ మొదటి భూమి రికార్డును జోడించండి", overview: "సమీక్ష",
        riskDistribution: "ప్రమాద పంపిణీ", lowRisk: "తక్కువ ప్రమాదం", mediumRisk: "మధ్యస్థ ప్రమాదం", highRisk: "అధిక ప్రమాదం",
        analytics: "విశ్లేషణలు", reports: "నివేదికలు", profile: "ప్రొఫైల్", records: "రికార్డులు",
        landDetails: "భూమి వివరాలు", landType: "భూమి రకం", extent: "విస్తీర్ణం", currentOwner: "ప్రస్తుత యజమాని",
        uploaded: "అప్‌లోడ్ చేయబడింది", added: "జోడించబడింది", riskAnalysis: "ప్రమాద విశ్లేషణ", runAnalysis: "🔍 ప్రమాద విశ్లేషణ చేయండి",
        analyzing: "🔄 విశ్లేషిస్తున్నది…", cleanChain: "✓ స్వచ్ఛమైన గొలుసు. సమస్యలు లేవు.", ownershipTimeline: "యాజమాన్య చరిత్ర",
        downloadReport: "📥 ప్రమాద నివేదిక డౌన్‌లోడ్ చేయండి", verifyMeeBhoomi: "🌐 మీభూమిలో ధృవీకరించండి",
        overview2: "📋 సమీక్ష", chain: "🔗 గొలుసు", docs: "📄 పత్రాలు", uploadDocument: "📤 పత్రం అప్‌లోడ్ చేయండి",
        noDocuments: "పత్రాలు అప్‌లోడ్ చేయబడలేదు", deleteRecord: "తొలగించు",
        lowRiskLabel: "తక్కువ ప్రమాదం", mediumRiskLabel: "మధ్యస్థ ప్రమాదం", highRiskLabel: "అధిక ప్రమాదం", criticalLabel: "విమర్శనాత్మక",
        verifiedStatus: "ధృవీకరించబడింది", flaggedStatus: "గుర్తించబడింది", underReview: "సమీక్షలో ఉంది", pending: "పెండింగ్", disputed: "వివాదంలో ఉంది",
        signOut: "🚪 లాగ్ అవుట్", language: "భాష", enabled: "అందుబాటులో ఉంది",
        assistantName: "లాండ్‌చెక్ సహాయకుడు",
        assistantGreeting: "నమస్కారం! నేను మీ లాండ్‌చెక్ సహాయకుడిని. భూమి రికార్డులు, పత్రాలు లేదా మోసం నివారణ గురించి ఏదైనా అడగండి.",
        assistantPlaceholder: "భూమి గురించి ఏదైనా అడగండి…", askAssistant: "అడగండి", thinking: "ఆలోచిస్తున్నది…", suggestedQuestions: "సూచించిన ప్రశ్నలు",
        legalNote: "⚖️ లాండ్‌చెక్ AI-సహాయక రిస్క్ విశ్లేషణ మాత్రమే అందిస్తుంది. తుది యాజమాన్యాన్ని ప్రభుత్వ అధికారులు మాత్రమే నిర్ధారించగలరు.",
    }
};

const ASSISTANT_RESPONSES = {
    en: {
        default: "I can help you with land records, document verification, and fraud prevention. Please ask a specific question.",
        ec: "An Encumbrance Certificate (EC) shows all registered transactions on a property. It proves there are no legal dues or mortgages on the land. Always verify EC before buying land.",
        fraud: "Common land frauds in AP/Telangana: 1) Fake survey numbers, 2) Same land sold to multiple buyers, 3) Forged sale deeds, 4) Missing ownership chain links. LandCheck detects all of these.",
        owner: "To find the real owner: 1) Check MeeBhoomi portal, 2) Visit local MRO office, 3) Use Surepass API in LandCheck, 4) Check Sub-Registrar office records.",
        safe: "Before buying land check: 1) EC for last 30 years, 2) Original Sale Deed, 3) ROR 1B, 4) Adangal, 5) Passbook. LandCheck analyzes all of these.",
        meebhoomi: "MeeBhoomi (meebhoomi.ap.gov.in) is AP government's official land records portal. You can check Adangal, ROR 1B, and Village Maps for free.",
    },
    te: {
        default: "నేను భూమి రికార్డులు, పత్రాల ధృవీకరణ మరియు మోసం నివారణలో మీకు సహాయం చేయగలను.",
        ec: "ఎన్‌కంబ్రెన్స్ సర్టిఫికేట్ (EC) అనేది ఒక ఆస్తిపై జరిగిన అన్ని నమోదైన లావాదేవీలను చూపిస్తుంది. భూమి కొనే ముందు ఎల్లప్పుడూ EC ధృవీకరించండి.",
        fraud: "సాధారణ భూమి మోసాలు: 1) నకిలీ సర్వే నంబర్లు, 2) ఒకే భూమిని అనేక మందికి అమ్మడం, 3) నకిలీ సేల్ డీడ్లు. లాండ్‌చెక్ వీటన్నింటినీ గుర్తిస్తుంది.",
        owner: "నిజమైన యజమానిని కనుగొనడానికి: 1) మీభూమి పోర్టల్ చెక్ చేయండి, 2) స్థానిక MRO కార్యాలయాన్ని సందర్శించండి.",
        safe: "భూమి కొనే ముందు చెక్ చేయండి: 1) గత 30 సంవత్సరాల EC, 2) అసలు సేల్ డీడ్, 3) ROR 1B, 4) అడంగల్, 5) పాస్‌బుక్.",
        meebhoomi: "మీభూమి (meebhoomi.ap.gov.in) AP ప్రభుత్వ అధికారిక భూమి రికార్డుల పోర్టల్. అడంగల్, ROR 1B ఉచితంగా చెక్ చేయవచ్చు.",
    }
};

const SUGGESTED_QUESTIONS = {
    en: ["What is an EC?", "How to detect land fraud?", "How to find real owner?", "Is this land safe to buy?", "What is MeeBhoomi?"],
    te: ["EC అంటే ఏమిటి?", "భూమి మోసాన్ని ఎలా గుర్తించాలి?", "నిజమైన యజమానిని ఎలా కనుగొనాలి?", "మీభూమి అంటే ఏమిటి?"]
};

const API_BASE = "https://localhost:58473/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --forest:#1C3A12;--green:#2D5A1E;--gmd:#4A8B35;--glt:#7BBD5E;
    --gold:#C8960C;--gldlt:#F0B429;--cream:#FAF8F2;--paper:#F0EAD8;
    --ink:#181810;--ink2:#3A3A28;--muted:#7A7A60;--border:rgba(45,90,30,.15);
    --shadow:0 4px 24px rgba(28,58,18,.10);--shadow-lg:0 12px 48px rgba(28,58,18,.16);
    --err:#C0392B;--err-bg:#FDEDEC;--warn:#C8960C;--warn-bg:#FFF8E1;
    --ok:#2D7A3A;--ok-bg:#E8F5E9;--blue:#1565C0;--blue-bg:#E3F2FD;
  }
  body{font-family:'Instrument Sans',sans-serif;background:var(--cream);color:var(--ink)}
  .telugu{font-family:'Noto Sans Telugu','Instrument Sans',sans-serif}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--gmd);border-radius:3px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
`;

const DEMO_RECORDS = [
    {
        id: 1, surveyNumber: "SY-2024-001", village: "Nellore", mandal: "Kovur", district: "SPSR Nellore", extentAcres: 2.50, landType: "Agricultural", currentOwner: "Ravi Kumar Reddy", status: "Verified", documentCount: 3, createdAt: "2024-01-10", riskSummary: { riskLevel: "Low", riskScore: 12, flagCount: 0 }, ownershipChain: [
            { id: 1, ownerName: "Gopal Rao", transferDate: "1985", endDate: "2001", documentType: "Manual Register", documentRef: "MR-1985/441", transferType: "ManualRegister", isVerified: true },
            { id: 2, ownerName: "Suresh Rao", transferDate: "2001", endDate: "2015", documentType: "Sale Deed", documentRef: "SD-4521/2001", transferType: "RegisteredSaleDeed", isVerified: true },
            { id: 3, ownerName: "Ravi Kumar Reddy", transferDate: "2015", endDate: null, documentType: "EC", documentRef: "EC-2015/778", transferType: "OnlineTransfer", isVerified: true }
        ]
    },
    {
        id: 2, surveyNumber: "SY-2023-045", village: "Vijayawada", mandal: "Krishna", district: "Krishna", extentAcres: 1.20, landType: "Residential Plot", currentOwner: "Lakshmi Devi", status: "Flagged", documentCount: 2, createdAt: "2023-06-15", riskSummary: { riskLevel: "High", riskScore: 78, flagCount: 3 }, ownershipChain: [
            { id: 4, ownerName: "Ramaiah", transferDate: "1990", endDate: "2005", documentType: "SLR Record", documentRef: "SLR-1990/112", transferType: "ManualRegister", isVerified: true },
            { id: 5, ownerName: "UNKNOWN", transferDate: "2005", endDate: "2012", documentType: "Missing", documentRef: "", transferType: "Unknown", isVerified: false, notes: "CHAIN BREAK" },
            { id: 6, ownerName: "Lakshmi Devi", transferDate: "2012", endDate: null, documentType: "Sale Deed", documentRef: "SD-9012/2012", transferType: "RegisteredSaleDeed", isVerified: false }
        ]
    },
    {
        id: 3, surveyNumber: "SY-2022-112", village: "Guntur", mandal: "Tenali", district: "Guntur", extentAcres: 3.75, landType: "Agricultural", currentOwner: "Venkata Subba Rao", status: "UnderReview", documentCount: 1, createdAt: "2022-03-20", riskSummary: { riskLevel: "Medium", riskScore: 44, flagCount: 1 }, ownershipChain: [
            { id: 7, ownerName: "Hanumaiah", transferDate: "1978", endDate: "1999", documentType: "Adangal", documentRef: "ADG-1978/221", transferType: "ManualRegister", isVerified: true },
            { id: 8, ownerName: "Venkata Subba Rao", transferDate: "1999", endDate: null, documentType: "Passbook", documentRef: "PB-5541/1999", transferType: "RegisteredSaleDeed", isVerified: true }
        ]
    },
];

const DEMO_USERS = {
    "farmer@demo.com": { id: 1, fullName: "Ravi Kumar", email: "farmer@demo.com", phone: "9876543210", role: "Farmer", roleIcon: "🌾", isVerified: true, permissions: ["view:own_records", "create:record", "upload:document", "view:risk_report"] },
    "bank@demo.com": { id: 2, fullName: "AP Grameena Bank", email: "bank@demo.com", phone: "9876500001", role: "Bank", roleIcon: "🏦", organisation: "AP Grameena Bank", isVerified: true, permissions: ["view:all_records", "create:record", "run:risk_analysis", "download:report", "view:dashboard"] },
    "lawyer@demo.com": { id: 3, fullName: "Advocate Srinivas Rao", email: "lawyer@demo.com", phone: "9876500002", role: "Lawyer", roleIcon: "⚖️", organisation: "Rao & Associates", isVerified: true, permissions: ["view:all_records", "view:risk_report", "run:risk_analysis", "download:report"] },
    "admin@landcheck.in": { id: 4, fullName: "LandCheck Admin", email: "admin@landcheck.in", phone: "9876500000", role: "Government", roleIcon: "🏛", organisation: "LandCheck Platform", isVerified: true, permissions: ["view:all_records", "manage:users", "view:dashboard", "run:risk_analysis"] },
};
const DEMO_PASSWORDS = { "farmer@demo.com": "Demo@1234", "bank@demo.com": "Demo@1234", "lawyer@demo.com": "Demo@1234", "admin@landcheck.in": "Admin@2024!" };

const LangCtx = createContext(null);
const useLang = () => useContext(LangCtx);
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

function LangProvider({ children }) {
    const [lang, setLang] = useState(null);
    const t = lang ? T[lang] : T.en;
    const isTe = lang === "te";
    return <LangCtx.Provider value={{ lang, setLang, t, isTe }}>{children}</LangCtx.Provider>;
}

function AuthProvider({ children }) {
    const [auth, setAuth] = useState(null);
    const login = async (email, password) => {
        await new Promise(r => setTimeout(r, 900));
        const user = DEMO_USERS[email.toLowerCase()];
        if (!user || DEMO_PASSWORDS[email.toLowerCase()] !== password) throw new Error("Invalid email or password");
        const result = { user, accessToken: "demo-token" };
        setAuth(result);
        return result;
    };
    const logout = () => setAuth(null);
    return <AuthCtx.Provider value={{ auth, login, logout, user: auth?.user }}>{children}</AuthCtx.Provider>;
}

const Spin = ({ s = 20, c = "white" }) => <div style={{ width: s, height: s, border: `2px solid rgba(255,255,255,.2)`, borderTop: `2px solid ${c}`, borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0 }} />;

const RISK_CFG = { Low: ["#2D7A3A", "#E8F5E9"], Medium: ["#C8760C", "#FFF3E0"], High: ["#C0392B", "#FFEBEE"], Critical: ["#7B0000", "#FCE4EC"] };
const STATUS_CFG = { Verified: ["#2D7A3A", "#E8F5E9"], Flagged: ["#C0392B", "#FFEBEE"], UnderReview: ["#C8760C", "#FFF3E0"], Pending: ["#888", "#F5F5F5"], Disputed: ["#6A1B9A", "#F3E5F5"] };

function RiskBadge({ level, score }) {
    const { t } = useLang();
    const cfg = RISK_CFG[level] || ["#888", "#eee"];
    const labels = { Low: t.lowRiskLabel, Medium: t.mediumRiskLabel, High: t.highRiskLabel, Critical: t.criticalLabel };
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: cfg[1], color: cfg[0], fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: .8, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{labels[level] || level}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 55, height: 5, background: "#E0D8C8", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${score}%`, height: "100%", background: cfg[0], transition: "width .8s ease" }} /></div>
                <span style={{ fontSize: 11, color: cfg[0], fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{score}</span>
            </div>
        </div>
    );
}

function StatusChip({ status }) {
    const { t } = useLang();
    const cfg = STATUS_CFG[status] || ["#888", "#eee"];
    const labels = { Verified: t.verifiedStatus, Flagged: t.flaggedStatus, UnderReview: t.underReview, Pending: t.pending, Disputed: t.disputed };
    return <span style={{ background: cfg[1], color: cfg[0], fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: .6, fontFamily: "'DM Mono',monospace" }}>{labels[status] || status}</span>;
}

function Input({ label, type = "text", value, onChange, placeholder, error, icon, required }) {
    const [focused, setFocused] = useState(false);
    const { isTe } = useLang();
    return (
        <div style={{ marginBottom: 14 }}>
            {label && <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily: isTe ? "'Noto Sans Telugu',sans-serif" : "inherit" }}>{label}{required && <span style={{ color: "var(--gold)", marginLeft: 2 }}>*</span>}</label>}
            <div style={{ position: "relative" }}>
                {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: .5 }}>{icon}</span>}
                <input type={type} value={value} onChange={onChange} placeholder={placeholder}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ width: "100%", padding: `10px 14px 10px ${icon ? "38px" : "14px"}`, border: `1.5px solid ${error ? "var(--err)" : focused ? "var(--gmd)" : "var(--border)"}`, borderRadius: 10, fontSize: 14, background: focused ? "white" : "var(--paper)", outline: "none", transition: "all .2s", color: "var(--ink)", fontFamily: isTe ? "'Noto Sans Telugu',sans-serif" : "'Instrument Sans',sans-serif" }} />
            </div>
            {error && <div style={{ fontSize: 11, color: "var(--err)", marginTop: 4 }}>⚠ {error}</div>}
        </div>
    );
}

function Btn({ children, onClick, loading, disabled, color, style }) {
    return (
        <button onClick={onClick} disabled={loading || disabled}
            style={{ background: loading || disabled ? "var(--gmd)" : color || "var(--forest)", color: "white", border: "none", padding: "13px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: loading || disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? .6 : 1, transition: "all .2s", width: "100%", ...style }}>
            {loading && <Spin s={18} />}{children}
        </button>
    );
}

function OwnershipTimeline({ chain }) {
    const TYPE_CFG = { ManualRegister: { label: "Manual", color: "var(--gmd)", bg: "#E8F0E4" }, RegisteredSaleDeed: { label: "Registered", color: "var(--blue)", bg: "var(--blue-bg)" }, OnlineTransfer: { label: "Online", color: "#6A1B9A", bg: "#F3E5F5" }, Unknown: { label: "MISSING", color: "var(--err)", bg: "var(--err-bg)" } };
    return (
        <div style={{ position: "relative", paddingLeft: 22 }}>
            <div style={{ position: "absolute", left: 9, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,var(--gmd),var(--gold))", borderRadius: 2 }} />
            {(chain || []).map((item, i) => {
                const cfg = TYPE_CFG[item.transferType] || TYPE_CFG.ManualRegister;
                const isMissing = item.transferType === "Unknown";
                return (
                    <div key={i} style={{ position: "relative", marginBottom: i < chain.length - 1 ? 14 : 0, animation: `slideIn .4s ease ${i * .08}s both` }}>
                        <div style={{ position: "absolute", left: -17, top: 6, width: 10, height: 10, borderRadius: "50%", background: isMissing ? "var(--err)" : "var(--forest)", border: "2px solid var(--cream)", boxShadow: isMissing ? "0 0 0 3px rgba(192,57,43,.3)" : "none" }} />
                        <div style={{ background: "white", border: `1px solid ${isMissing ? "#FFCDD2" : "var(--border)"}`, borderRadius: 10, padding: "11px 13px", boxShadow: "var(--shadow)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, color: isMissing ? "var(--err)" : "var(--ink)", marginBottom: 2 }}>{item.ownerName}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{item.documentRef || item.documentType}</div>
                                    {item.notes && <div style={{ fontSize: 11, color: "var(--err)", marginTop: 3, fontStyle: "italic" }}>{item.notes}</div>}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ background: cfg.bg, color: cfg.color, fontSize: 9, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{cfg.label}</span>
                                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, fontFamily: "'DM Mono',monospace" }}>{item.transferDate}→{item.endDate || "Now"}</div>
                                    <div style={{ fontSize: 10, color: item.isVerified ? "var(--ok)" : "var(--err)", marginTop: 2 }}>{item.isVerified ? "✓ Verified" : "✗ Unverified"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TeluguAssistant({ onClose }) {
    const { lang, t, isTe } = useLang();
    const [messages, setMessages] = useState([{ role: "assistant", text: t.assistantGreeting }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();
    const fontFamily = isTe ? "'Noto Sans Telugu','Instrument Sans',sans-serif" : "'Instrument Sans',sans-serif";

    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const getResponse = (q) => {
        const lower = q.toLowerCase();
        const responses = ASSISTANT_RESPONSES[lang];
        if (lower.includes("ec") || lower.includes("encumbrance") || lower.includes("ఎన్‌కంబ్రెన్స్")) return responses.ec;
        if (lower.includes("fraud") || lower.includes("మోసం") || lower.includes("fake")) return responses.fraud;
        if (lower.includes("owner") || lower.includes("యజమాని")) return responses.owner;
        if (lower.includes("safe") || lower.includes("సురక్షిత") || lower.includes("buy")) return responses.safe;
        if (lower.includes("meebhoomi") || lower.includes("మీభూమి")) return responses.meebhoomi;
        return responses.default;
    };

    const send = async () => {
        if (!input.trim()) return;
        const q = input.trim(); setInput("");
        setMessages(m => [...m, { role: "user", text: q }]);
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setMessages(m => [...m, { role: "assistant", text: getResponse(q) }]);
        setLoading(false);
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,58,18,.65)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "var(--cream)", borderRadius: "20px 20px 20px 20px", width: "100%", maxWidth: 480, maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.35)", animation: "fadeUp .3s ease" }}>
                <div style={{ background: "var(--forest)", borderRadius: "20px 20px 0 0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 38, height: 38, background: "var(--gold)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, animation: "pulse 2s ease infinite" }}>🤖</div>
                        <div>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "white", fontSize: 15 }}>{t.assistantName}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>AI Powered • {isTe ? "తెలుగు" : "English"}</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
                            {msg.role === "assistant" && <div style={{ width: 28, height: 28, background: "var(--forest)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 4 }}>🤖</div>}
                            <div style={{ background: msg.role === "user" ? "var(--forest)" : "white", color: msg.role === "user" ? "white" : "var(--ink)", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", maxWidth: "80%", fontSize: 13, lineHeight: 1.7, fontFamily, border: msg.role === "assistant" ? "1px solid var(--border)" : "none", boxShadow: "var(--shadow)" }}>{msg.text}</div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ width: 28, height: 28, background: "var(--forest)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                            <div style={{ background: "white", borderRadius: "14px 14px 14px 4px", padding: "10px 16px", border: "1px solid var(--border)" }}>
                                <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, background: "var(--gmd)", borderRadius: "50%", animation: `pulse 1s ease ${i * .2}s infinite` }} />)}</div>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ padding: "0 16px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {SUGGESTED_QUESTIONS[lang].map((q, i) => (
                        <button key={i} onClick={() => setInput(q)} style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "var(--ink2)", fontFamily, whiteSpace: "nowrap" }}>{q}</button>
                    ))}
                </div>
                <div style={{ padding: "8px 16px 16px", display: "flex", gap: 8 }}>
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.assistantPlaceholder}
                        style={{ flex: 1, border: "1.5px solid var(--border)", borderRadius: 12, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily, background: "white", color: "var(--ink)" }}
                        onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                    <button onClick={send} style={{ background: "var(--forest)", color: "white", border: "none", borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily }}>{t.askAssistant}</button>
                </div>
            </div>
        </div>
    );
}

function LanguageScreen() {
    const { setLang } = useLang();
    const [selected, setSelected] = useState(null);
    return (
        <div style={{ minHeight: "100vh", background: "var(--forest)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: "rgba(74,139,53,.15)" }} />
            <div style={{ position: "absolute", bottom: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(200,150,12,.1)" }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, animation: "fadeUp .6s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 72, height: 72, background: "var(--gold)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 16px", animation: "float 3s ease infinite" }}>🗺</div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "white", marginBottom: 6 }}>LandCheck</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>Land Fraud Prevention Platform</div>
                </div>
                <div style={{ background: "rgba(255,255,255,.08)", backdropFilter: "blur(10px)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,.15)" }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🌐</div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 6 }}>Choose Your Language</div>
                        <div style={{ fontFamily: "'Noto Sans Telugu',sans-serif", fontSize: 16, color: "rgba(255,255,255,.6)" }}>మీ భాషను ఎంచుకోండి</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
                        {[{ val: "en", flag: "🇬🇧", title: "English", sub: "For bankers, lawyers, agents" }, { val: "te", flag: "🇮🇳", title: "తెలుగు", subTe: "రైతులు, భూ యజమానుల కోసం" }].map(opt => (
                            <button key={opt.val} onClick={() => setSelected(opt.val)}
                                style={{ background: selected === opt.val ? "white" : "rgba(255,255,255,.1)", border: `2px solid ${selected === opt.val ? "var(--gold)" : "rgba(255,255,255,.2)"}`, borderRadius: 16, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .25s", boxShadow: selected === opt.val ? "0 8px 24px rgba(200,150,12,.3)" : "none" }}>
                                <div style={{ width: 48, height: 48, background: selected === opt.val ? "var(--forest)" : "rgba(255,255,255,.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, transition: "all .25s" }}>{opt.flag}</div>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontFamily: opt.val === "te" ? "'Noto Sans Telugu',sans-serif" : "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: selected === opt.val ? "var(--forest)" : "white" }}>{opt.title}</div>
                                    <div style={{ fontFamily: opt.val === "te" ? "'Noto Sans Telugu',sans-serif" : "inherit", fontSize: 12, color: selected === opt.val ? "var(--muted)" : "rgba(255,255,255,.5)", marginTop: 2 }}>{opt.subTe || opt.sub}</div>
                                </div>
                                {selected === opt.val && <div style={{ marginLeft: "auto", width: 24, height: 24, background: "var(--gold)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 700 }}>✓</div>}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => selected && setLang(selected)} disabled={!selected}
                        style={{ width: "100%", background: selected ? "var(--gold)" : "rgba(255,255,255,.2)", color: "white", border: "none", padding: "15px", borderRadius: 14, fontWeight: 700, fontSize: 16, cursor: selected ? "pointer" : "not-allowed", transition: "all .25s", opacity: selected ? 1 : .6, fontFamily: selected === "te" ? "'Noto Sans Telugu',sans-serif" : "'Syne',sans-serif" }}>
                        {selected === "te" ? "కొనసాగించు →" : "Continue →"}
                    </button>
                </div>
                <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,.3)" }}>You can change language anytime in Profile • ప్రొఫైల్‌లో మార్చవచ్చు</div>
            </div>
        </div>
    );
}

function LoginPage({ onLogin, onRegister }) {
    const { t, isTe, lang, setLang } = useLang();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [showAssistant, setShowAssistant] = useState(false);
    const fontFamily = isTe ? "'Noto Sans Telugu','Instrument Sans',sans-serif" : "'Instrument Sans',sans-serif";

    const DEMO_ACCOUNTS = [
        { email: "farmer@demo.com", pass: "Demo@1234", name: isTe ? "రవి కుమార్" : "Ravi Kumar", role: isTe ? "రైతు" : "Farmer", icon: "🌾" },
        { email: "bank@demo.com", pass: "Demo@1234", name: isTe ? "AP గ్రామీణ బ్యాంకు" : "AP Grameena Bank", role: isTe ? "బ్యాంకు" : "Bank", icon: "🏦" },
        { email: "lawyer@demo.com", pass: "Demo@1234", name: isTe ? "అడ్వకేట్ శ్రీనివాస్" : "Advocate Srinivas", role: isTe ? "న్యాయవాది" : "Lawyer", icon: "⚖️" },
        { email: "admin@landcheck.in", pass: "Admin@2024!", name: isTe ? "అడ్మిన్" : "Admin", role: isTe ? "ప్రభుత్వం" : "Govt", icon: "🏛" },
    ];

    const doLogin = async () => {
        if (!email || !pass) return;
        setLoading(true); setErr("");
        try { await login(email, pass); }
        catch (e) { setErr(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex" }}>
            {showAssistant && <TeluguAssistant onClose={() => setShowAssistant(false)} />}
            <div style={{ flex: "0 0 400px", background: "var(--forest)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 44px 40px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(74,139,53,.15)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
                        <div style={{ width: 42, height: 42, background: "var(--gold)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🗺</div>
                        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "white" }}>{t.appName}</span>
                    </div>
                    <h1 style={{ fontFamily: isTe ? "'Noto Sans Telugu',sans-serif" : "'Syne',sans-serif", fontSize: isTe ? "28px" : "38px", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 14 }}>{t.tagline}</h1>
                    <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, lineHeight: 1.7, marginBottom: 36, fontFamily }}>{t.taglineSub}</p>
                    {[["✓ 12,840+", isTe ? "ధృవీకరణలు" : "verifications"], ["⚠ 1,204", isTe ? "మోసాలు ఆపబడ్డాయి" : "frauds stopped"], ["🏦 38", isTe ? "బ్యాంకులు" : "banks"]].map(([v, l]) => (
                        <div key={l} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 600, color: "var(--gldlt)", minWidth: 80 }}>{v}</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontFamily }}>{l}</span>
                        </div>
                    ))}
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "var(--gold)" : "rgba(255,255,255,.1)", border: "none", color: "white", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>English</button>
                        <button onClick={() => setLang("te")} style={{ background: lang === "te" ? "var(--gold)" : "rgba(255,255,255,.1)", border: "none", color: "white", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans Telugu',sans-serif" }}>తెలుగు</button>
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--cream)" }}>
                <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp .5s ease" }}>
                    <h2 style={{ fontFamily: isTe ? "'Noto Sans Telugu',sans-serif" : "'Syne',sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>{t.welcomeBack}</h2>
                    <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: 14, fontFamily }}>{t.signInSub}</p>
                    {err && <div style={{ background: "var(--err-bg)", border: "1px solid #FFCDD2", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "var(--err)", fontFamily }}>{err}</div>}
                    <Input label={t.email} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" icon="✉" required />
                    <Input label={t.password} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
                    <Btn onClick={doLogin} loading={loading} disabled={!email || !pass} style={{ marginBottom: 14 }}>{loading ? t.signingIn : t.signIn}</Btn>
                    <div style={{ textAlign: "center", marginBottom: 20, fontFamily }}>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.noAccount} </span>
                        <button onClick={onRegister} style={{ background: "none", border: "none", color: "var(--gmd)", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily }}>{t.registerHere}</button>
                    </div>
                    <div style={{ background: "var(--paper)", borderRadius: 12, padding: 14, border: "1px dashed var(--border)", marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, marginBottom: 10 }}>{t.quickDemo}</div>
                        {DEMO_ACCOUNTS.map(a => (
                            <button key={a.email} onClick={() => { setEmail(a.email); setPass(a.pass); }}
                                style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", width: "100%", marginBottom: 6, textAlign: "left" }}
                                onMouseOver={e => e.currentTarget.style.background = "var(--paper)"} onMouseOut={e => e.currentTarget.style.background = "white"}>
                                <span style={{ fontSize: 18 }}>{a.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", fontFamily }}>{a.name}</div>
                                    <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{a.email}</div>
                                </div>
                                <span style={{ fontSize: 10, background: "var(--paper)", color: "var(--muted)", padding: "2px 8px", borderRadius: 8, fontFamily }}>{a.role}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowAssistant(true)} style={{ width: "100%", background: isTe ? "var(--forest)" : "var(--paper)", color: isTe ? "white" : "var(--ink2)", border: `1.5px solid ${isTe ? "var(--forest)" : "var(--border)"}`, borderRadius: 12, padding: "11px", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily }}>
                        🤖 {t.assistantName}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const { t, isTe, lang, setLang } = useLang();
    const { user, logout } = useAuth();
    const [records] = useState(DEMO_RECORDS);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState("records");
    const [search, setSearch] = useState("");
    const [showAssistant, setShowAssistant] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const fontFamily = isTe ? "'Noto Sans Telugu','Instrument Sans',sans-serif" : "'Instrument Sans',sans-serif";

    const filtered = records.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return r.surveyNumber.toLowerCase().includes(q) || r.village.toLowerCase().includes(q) || r.currentOwner.toLowerCase().includes(q);
    });

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t.goodMorning;
        if (h < 17) return t.goodAfternoon;
        return t.goodEvening;
    };

    const TABS = [["records", `📋 ${t.records}`], ["analytics", `📊 ${t.analytics}`], ["reports", `📄 ${t.reports}`]];

    return (
        <div style={{ minHeight: "100vh", background: "#EDE8DC", display: "flex", flexDirection: "column" }}>
            {showAssistant && <TeluguAssistant onClose={() => setShowAssistant(false)} />}
            {showAdd && <AddRecordModal onClose={() => setShowAdd(false)} isTe={isTe} t={t} />}
            <nav style={{ background: "var(--forest)", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", boxShadow: "0 2px 16px rgba(0,0,0,.2)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, background: "var(--gold)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🗺</div>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "white", fontSize: 17 }}>{t.appName}</span>
                    <span style={{ color: "rgba(255,255,255,.25)" }}>|</span>
                    <span style={{ fontSize: 10, background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)", padding: "3px 10px", borderRadius: 10, fontFamily }}>{user?.roleIcon} {user?.role}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "var(--gold)" : "rgba(255,255,255,.1)", border: "none", color: "white", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>EN</button>
                        <button onClick={() => setLang("te")} style={{ background: lang === "te" ? "var(--gold)" : "rgba(255,255,255,.1)", border: "none", color: "white", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Noto Sans Telugu',sans-serif" }}>తె</button>
                    </div>
                    <button onClick={() => setShowAssistant(true)} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "white", fontSize: 12, fontFamily }}>🤖 {isTe ? "సహాయం" : "Help"}</button>
                    <button onClick={() => setShowProfile(!showProfile)} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, padding: "5px 10px", cursor: "pointer" }}>
                        <div style={{ width: 26, height: 26, background: "var(--gmd)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{user?.roleIcon}</div>
                        <span style={{ color: "white", fontSize: 12, fontWeight: 600, fontFamily }}>{user?.fullName?.split(" ")[0]}</span>
                    </button>
                </div>
            </nav>
            {showProfile && (
                <>
                    <div onClick={() => setShowProfile(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
                    <div style={{ position: "fixed", top: 68, right: 20, background: "white", borderRadius: 16, boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", zIndex: 200, width: 260, animation: "fadeUp .2s ease" }}>
                        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <div style={{ width: 40, height: 40, background: "var(--ok-bg)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{user?.roleIcon}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13, fontFamily }}>{user?.fullName}</div>
                                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{user?.email}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 1, marginBottom: 6 }}>{isTe ? "భాష:" : "Language:"}</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => setLang("en")} style={{ flex: 1, background: lang === "en" ? "var(--forest)" : "var(--paper)", color: lang === "en" ? "white" : "var(--ink)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>English</button>
                                    <button onClick={() => setLang("te")} style={{ flex: 1, background: lang === "te" ? "var(--forest)" : "var(--paper)", color: lang === "te" ? "white" : "var(--ink)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Noto Sans Telugu',sans-serif" }}>తెలుగు</button>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: "8px 10px 12px", borderTop: "1px solid var(--border)" }}>
                            <button onClick={logout} style={{ width: "100%", background: "var(--err-bg)", color: "var(--err)", border: "1px solid #FFCDD2", borderRadius: 10, padding: "9px", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily }}>{t.signOut}</button>
                        </div>
                    </div>
                </>
            )}
            <div style={{ background: "white", borderBottom: "1px solid var(--border)", padding: "0 22px", display: "flex" }}>
                {TABS.map(([tab, label]) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", padding: "13px 16px", cursor: "pointer", fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? "var(--green)" : "var(--muted)", borderBottom: activeTab === tab ? "3px solid var(--green)" : "3px solid transparent", fontSize: 13, transition: "all .2s", whiteSpace: "nowrap", fontFamily }}>{label}</button>
                ))}
            </div>
            <div style={{ padding: "20px 22px", maxWidth: 1280, margin: "0 auto", width: "100%", flex: 1 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
                    {[[`📋`, t.totalRecords, 3, "var(--forest)", "#E8F0E4"], [`✅`, t.verified, 1, "var(--ok)", "var(--ok-bg)"], [`⚠️`, t.flagged, 1, "var(--err)", "var(--err-bg)"], [`📄`, t.documents, 6, "var(--blue)", "var(--blue-bg)"]].map(([ic, lb, val, color, bg], i) => (
                        <div key={i} style={{ background: "white", borderRadius: 14, padding: "16px", boxShadow: "var(--shadow)", border: "1px solid var(--border)", animation: `fadeUp .4s ease ${i * .06}s both` }}>
                            <div style={{ fontSize: 22, marginBottom: 8 }}>{ic}</div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 700, color }}>{val}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, fontFamily }}>{lb}</div>
                        </div>
                    ))}
                </div>
                {activeTab === "records" && (
                    <div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: .4 }}>🔍</span>
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchPlaceholder}
                                    style={{ width: "100%", padding: "10px 14px 10px 36px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "white", outline: "none", fontFamily }}
                                    onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                            </div>
                            <button onClick={() => setShowAdd(true)} style={{ background: "var(--gold)", color: "white", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily }}>+ {isTe ? "జోడించు" : "Add"}</button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.1fr" : "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {filtered.map((r, i) => {
                                    const isSel = selected?.id === r.id;
                                    return (
                                        <div key={r.id} onClick={() => setSelected(isSel ? null : r)}
                                            style={{ background: isSel ? "var(--forest)" : "white", border: `2px solid ${isSel ? "var(--forest)" : "var(--border)"}`, borderRadius: 14, padding: "15px 17px", cursor: "pointer", boxShadow: isSel ? "0 8px 32px rgba(28,58,18,.25)" : "var(--shadow)", transition: "all .25s", animation: `fadeUp .4s ease ${i * .05}s both` }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                                <div>
                                                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: isSel ? "rgba(255,255,255,.5)" : "var(--muted)", marginBottom: 3 }}>{r.surveyNumber}</div>
                                                    <div style={{ fontWeight: 700, fontSize: 14, color: isSel ? "white" : "var(--ink)", fontFamily }}>{r.village}, {r.district}</div>
                                                </div>
                                                {!isSel && <StatusChip status={r.status} />}
                                            </div>
                                            <div style={{ display: "flex", gap: 12, fontSize: 12, color: isSel ? "rgba(255,255,255,.7)" : "var(--muted)", marginBottom: isSel ? 0 : 10, fontFamily }}>
                                                <span>👤 {r.currentOwner}</span><span>📐 {r.extentAcres}ac</span>
                                            </div>
                                            {!isSel && r.riskSummary && <RiskBadge level={r.riskSummary.riskLevel} score={r.riskSummary.riskScore} />}
                                        </div>
                                    );
                                })}
                            </div>
                            {selected && (
                                <div style={{ background: "white", borderRadius: 16, padding: "20px 18px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", maxHeight: "calc(100vh - 180px)", overflowY: "auto", position: "sticky", top: 80, animation: "slideIn .3s ease" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                        <div>
                                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>{selected.surveyNumber}</div>
                                            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--ink)", lineHeight: 1.2 }}>{selected.village}<br /><span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>{selected.district}</span></div>
                                        </div>
                                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                            <StatusChip status={selected.status} />
                                            <button onClick={() => setSelected(null)} style={{ background: "var(--paper)", border: "1px solid var(--border)", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 15 }}>×</button>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                                        {[[t.landType, selected.landType], [t.extent, `${selected.extentAcres} ${isTe ? "ఎకరాలు" : "Acres"}`], [t.currentOwner, selected.currentOwner], [t.documents, `${selected.documentCount} ${t.uploaded}`]].map(([k, v]) => (
                                            <div key={k} style={{ background: "var(--paper)", borderRadius: 9, padding: "9px 12px" }}>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: .7, marginBottom: 3, fontFamily, textTransform: "uppercase" }}>{k}</div>
                                                <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ink)", fontFamily }}>{v || "—"}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {selected.riskSummary && (
                                        <div style={{ background: "var(--paper)", borderRadius: 11, padding: 14, marginBottom: 14 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--forest)", fontFamily }}>{t.riskAnalysis}</span>
                                                <RiskBadge level={selected.riskSummary.riskLevel} score={selected.riskSummary.riskScore} />
                                            </div>
                                            {selected.riskSummary.riskLevel === "Low"
                                                ? <div style={{ color: "var(--ok)", fontSize: 13, fontFamily }}>{t.cleanChain}</div>
                                                : <div style={{ color: "var(--err)", fontSize: 12, fontFamily }}>{isTe ? "⚠ సమస్యలు కనుగొనబడ్డాయి." : "⚠ Issues found. Run analysis."}</div>
                                            }
                                            <button style={{ width: "100%", marginTop: 10, background: "var(--gold)", color: "white", border: "none", padding: "9px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily }}>{t.runAnalysis}</button>
                                        </div>
                                    )}
                                    <div style={{ background: "var(--paper)", borderRadius: 11, padding: 14, marginBottom: 14 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--forest)", marginBottom: 14, fontFamily }}>{t.ownershipTimeline}</div>
                                        <OwnershipTimeline chain={selected.ownershipChain} />
                                    </div>
                                    <a href="https://meebhoomi.ap.gov.in" target="_blank" rel="noopener noreferrer"
                                        style={{ display: "block", textAlign: "center", background: "var(--blue-bg)", color: "var(--blue)", border: "1px solid #90CAF9", borderRadius: 10, padding: "10px", fontWeight: 600, fontSize: 13, marginBottom: 10, textDecoration: "none", fontFamily }}>
                                        {t.verifyMeeBhoomi}
                                    </a>
                                    <button style={{ width: "100%", background: "var(--forest)", color: "white", border: "none", padding: "11px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily }}>{t.downloadReport}</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === "analytics" && (
                    <div style={{ animation: "fadeUp .4s ease" }}>
                        <div style={{ background: "white", borderRadius: 14, padding: 22, boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", marginBottom: 18, fontFamily }}>{t.riskDistribution}</div>
                            {[[t.lowRisk, 1, 3, "var(--ok)"], [t.mediumRisk, 1, 3, "var(--warn)"], [t.highRisk, 1, 3, "var(--err)"]].map(([l, v, tot, c]) => (
                                <div key={l} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                                        <span style={{ fontWeight: 600, fontFamily }}>{l}</span>
                                        <span style={{ color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{v}/{tot}</span>
                                    </div>
                                    <div style={{ height: 8, background: "#EEE8D8", borderRadius: 4, overflow: "hidden" }}>
                                        <div style={{ width: `${(v / tot) * 100}%`, height: "100%", background: c, borderRadius: 4, transition: "width 1s ease" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "reports" && (
                    <div style={{ animation: "fadeUp .4s ease" }}>
                        {records.map(r => (
                            <div key={r.id} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "var(--shadow)" }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", fontFamily }}>{r.surveyNumber} — {r.village}</div>
                                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3, fontFamily }}>👤 {r.currentOwner} · 📐 {r.extentAcres} {isTe ? "ఎకరాలు" : "Acres"}</div>
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    {r.riskSummary && <RiskBadge level={r.riskSummary.riskLevel} score={r.riskSummary.riskScore} />}
                                    <button style={{ background: "var(--forest)", color: "white", border: "none", padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>📥 PDF</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => setShowAssistant(true)}
                style={{ position: "fixed", bottom: 28, right: 28, width: 56, height: 56, background: "var(--forest)", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: 24, boxShadow: "0 6px 24px rgba(28,58,18,.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", animation: "bounce 2s ease infinite" }}>
                🤖
            </button>
        </div>
    );
}


function AddRecordModal({ onClose, isTe, t }) {
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState([]);
    const [docType, setDocType] = useState("SaleDeed");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({ surveyNumber: "", village: "", mandal: "", district: "", state: "Andhra Pradesh", extentAcres: "", landType: "Agricultural", currentOwner: "" });
    const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const fontFamily = isTe ? "'Noto Sans Telugu','Instrument Sans',sans-serif" : "'Instrument Sans',sans-serif";

    const submit = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setDone(true);
        setTimeout(() => onClose(), 2000);
        setLoading(false);
    };

    const LAND_TYPES = isTe ? ["వ్యవసాయ భూమి", "నివాస స్థలం", "వాణిజ్య స్థలం", "ఇతరాలు"] : ["Agricultural", "Residential Plot", "Commercial", "Others"];
    const STEPS = isTe ? ["భూమి వివరాలు", "స్థాన వివరాలు", "పత్రాలు"] : ["Land Details", "Location", "Documents"];

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,58,18,.65)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "var(--cream)", borderRadius: 20, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,.3)" }}>
                <div style={{ background: "var(--forest)", borderRadius: "20px 20px 0 0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ color: "var(--gldlt)", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 3, fontFamily }}>{isTe ? "కొత్త రికార్డు" : "NEW RECORD"}</div>
                        <div style={{ color: "white", fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700 }}>{isTe ? "భూమి రికార్డు జోడించండి" : "Add Land Record"}</div>
                    </div>
                    <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "white", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>×</button>
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                    {done ? (
                        <div style={{ textAlign: "center", padding: "32px 0" }}>
                            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--green)", fontFamily }}>{isTe ? "రికార్డు జోడించబడింది!" : "Record Added!"}</div>
                            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, fontFamily }}>{isTe ? "మీ భూమి రికార్డు సేవ్ చేయబడింది." : "Your land record has been saved."}</div>
                        </div>
                    ) : loading ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ width: 44, height: 44, border: "4px solid var(--paper)", borderTop: "4px solid var(--forest)", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 16px" }} />
                            <div style={{ color: "var(--forest)", fontWeight: 600, fontFamily }}>{isTe ? "సేవ్ చేస్తున్నది…" : "Saving…"}</div>
                        </div>
                    ) : step === 3 ? (
                        <>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 8, textTransform: "uppercase", fontFamily }}>{isTe ? "పత్రం రకం" : "Document Type"}</label>
                                <select value={docType} onChange={e => setDocType(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}>
                                    {["SaleDeed", "EC", "ROR1B", "Adangal", "Passbook", "SLRRegister", "CourtOrder", "Other"].map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div onClick={() => document.getElementById("fileInput").click()}
                                style={{ border: "2px dashed var(--gmd)", borderRadius: 12, padding: "28px 20px", textAlign: "center", background: "var(--paper)", cursor: "pointer", marginBottom: 12 }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                                <div style={{ fontWeight: 600, color: "var(--green)", fontSize: 14, fontFamily }}>{isTe ? "పత్రాలు అప్‌లోడ్ చేయండి" : "Upload Documents"}</div>
                                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>PDF, JPG, PNG • Max 20MB</div>
                                <input id="fileInput" type="file" multiple hidden accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files)])} />
                            </div>
                            {files.length > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                    {files.map((f, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "white", borderRadius: 8, marginBottom: 6, border: "1px solid var(--border)" }}>
                                            <span style={{ fontSize: 16 }}>📎</span>
                                            <span style={{ fontSize: 12, flex: 1, color: "var(--ink2)", fontFamily }} >{f.name}</span>
                                            <span style={{ fontSize: 11, color: "var(--muted)" }}>{(f.size / 1024).toFixed(0)}KB</span>
                                            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 16 }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ background: "var(--warn-bg)", border: "1px solid #FFE082", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#795548", fontFamily }}>
                                ⚖️ {isTe ? "లాండ్‌చెక్ రిస్క్ విశ్లేషణ మాత్రమే అందిస్తుంది." : "LandCheck provides risk analysis only — not legal ownership declarations."}
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={() => setStep(2)} style={{ flex: "0 0 90px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontFamily }}>{isTe ? "← వెనుకకు" : "← Back"}</button>
                                <button onClick={submit} style={{ flex: 1, background: "var(--gold)", color: "white", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily }}>
                                    {isTe ? "సమర్పించండి ✓" : "Submit & Verify ✓"}
                                </button>
                            </div>
                        </>
                    ) : step === 1 ? (
                        <>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "సర్వే నంబర్" : "Survey Number"} <span style={{ color: "var(--gold)" }}>*</span></label>
                                <input value={form.surveyNumber} onChange={e => up("surveyNumber", e.target.value)} placeholder="SY-2024-001"
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                    onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "ప్రస్తుత యజమాని" : "Current Owner"} <span style={{ color: "var(--gold)" }}>*</span></label>
                                <input value={form.currentOwner} onChange={e => up("currentOwner", e.target.value)} placeholder={isTe ? "ఆధార్ ప్రకారం పూర్తి పేరు" : "Full legal name as per Aadhaar"}
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                    onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "విస్తీర్ణం (ఎకరాలు)" : "Extent (Acres)"}</label>
                                    <input type="number" value={form.extentAcres} onChange={e => up("extentAcres", e.target.value)} placeholder="2.50"
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                        onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "భూమి రకం" : "Land Type"}</label>
                                    <select value={form.landType} onChange={e => up("landType", e.target.value)}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}>
                                        {LAND_TYPES.map(lt => <option key={lt}>{lt}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} style={{ width: "100%", background: "var(--forest)", color: "white", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily }}>
                                {isTe ? "కొనసాగించు →" : "Continue →"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "గ్రామం" : "Village"} <span style={{ color: "var(--gold)" }}>*</span></label>
                                <input value={form.village} onChange={e => up("village", e.target.value)} placeholder={isTe ? "గ్రామం పేరు" : "Enter village name"}
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                    onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "మండలం" : "Mandal"}</label>
                                    <input value={form.mandal} onChange={e => up("mandal", e.target.value)} placeholder={isTe ? "మండలం" : "Enter mandal"}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                        onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: .6, display: "block", marginBottom: 5, textTransform: "uppercase", fontFamily }}>{isTe ? "జిల్లా" : "District"}</label>
                                    <input value={form.district} onChange={e => up("district", e.target.value)} placeholder={isTe ? "జిల్లా" : "Enter district"}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--paper)", outline: "none", color: "var(--ink)", fontFamily }}
                                        onFocus={e => e.target.style.borderColor = "var(--gmd)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
                                </div>
                            </div>
                            <div style={{ background: "var(--warn-bg)", border: "1px solid #FFE082", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#795548", fontFamily }}>
                                ⚖️ {isTe ? "లాండ్‌చెక్ రిస్క్ విశ్లేషణ మాత్రమే అందిస్తుంది." : "LandCheck provides risk analysis only — not legal ownership declarations."}
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={() => setStep(1)} style={{ flex: "0 0 90px", background: "var(--paper)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontFamily }}>{isTe ? "← వెనుకకు" : "← Back"}</button>
                                <button onClick={() => setStep(3)} style={{ flex: 1, background: "var(--forest)", color: "white", border: "none", padding: "12px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily }}>
                                    {isTe ? "కొనసాగించు →" : "Continue →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function AppInner() {
    const { lang } = useLang();
    const { auth } = useAuth();
    const [page, setPage] = useState("login");
    if (!lang) return <LanguageScreen />;
    if (auth) return <Dashboard />;
    if (page === "register") return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Register Coming Soon</div>
                <button onClick={() => setPage("login")} style={{ background: "var(--forest)", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontWeight: 600 }}>← Back to Login</button>
            </div>
        </div>
    );
    return <LoginPage onLogin={() => { }} onRegister={() => setPage("register")} />;
}

export default function App() {
    return (
        <>
            <style>{STYLES}</style>
            <LangProvider>
                <AuthProvider>
                    <AppInner />
                </AuthProvider>
            </LangProvider>
        </>
    );
}

// NOTE: AddRecordModal and showAdd state already handled above
