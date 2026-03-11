import { useRef, useEffect } from "react";
import { C } from "../lib/constants.js";

export default function FreetextInput({ question, value, onChange }) {
  const ref = useRef(null);
  const minChars = question.minChars || 30;
  const len = (value || "").length;
  const met = len >= minChars;
  useEffect(() => { if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; } }, [value]);
  return (
    <div style={{ marginTop: 24 }}>
      <textarea ref={ref} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={question.placeholder} rows={4}
        style={{ width: "100%", background: C.card, border: `1px solid ${met ? "#2a3a2a" : "#2a2a2a"}`, borderRadius: 8, color: C.text, fontFamily: C.fontBody, fontSize: 15, lineHeight: 1.8, padding: "16px 20px", resize: "none", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = met ? "#2a3a2a" : "#2a2a2a")} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontFamily: C.fontMono, fontSize: 12 }}>
        <span style={{ color: met ? "#5a8a4a" : C.gold, display: "flex", alignItems: "center", gap: 6 }}>
          {met ? <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#5a8a4a" strokeWidth="1.5"/><path d="M4 7.2L6 9.2L10 5" stroke="#5a8a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>OK</span></> : <>最低 {minChars} 文字（あと {Math.max(0, minChars - len)} 文字）</>}
        </span>
        <span style={{ color: C.textDark }}>{len} 文字</span>
      </div>
    </div>
  );
}
