import { C } from "../../lib/constants.js";

export default function SectionHeader({ section, desc }) {
  return (
    <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: C.fontMono, fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>{section}</div>
      {desc && <div style={{ fontFamily: C.fontBody, fontSize: 13, color: C.textDim }}>{desc}</div>}
    </div>
  );
}
