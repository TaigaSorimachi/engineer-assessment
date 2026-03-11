import { C } from "../../lib/constants.js";

export default function ChoiceButton({ active, onClick, children, radio }) {
  return (
    <button onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 14, background: active ? "#e8c54712" : C.card, border: `1px solid ${active ? "#e8c54766" : "#1e1e1e"}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.25s", textAlign: "left", width: "100%" }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "#333"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = active ? "#e8c54766" : "#1e1e1e"; }}>
      <div style={{ width: 22, height: 22, borderRadius: radio ? "50%" : 6, border: `2px solid ${active ? C.gold : "#333"}`, background: active ? C.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.25s" }}>
        {active && (radio
          ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.bg }} />
          : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5L4.5 9L10 3" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <span style={{ fontFamily: C.fontBody, fontSize: 14, color: active ? C.text : "#9a9a9a", transition: "color 0.25s" }}>{children}</span>
    </button>
  );
}
