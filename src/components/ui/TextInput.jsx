import { C } from "../../lib/constants.js";

export default function TextInput({ label, value, onChange, placeholder, type = "text", mono }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontFamily: C.fontMono, fontSize: 11, color: C.goldDim, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: C.card, border: "1px solid #2a2a2a", borderRadius: 8, color: C.text, fontFamily: mono ? C.fontMono : C.fontBody, fontSize: 15, padding: "14px 18px", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")} />
    </div>
  );
}
