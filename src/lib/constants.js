/* ═══════════════════════════════════════════════════════
   Color & Font Tokens
   ═══════════════════════════════════════════════════════ */

export const C = {
  bg: "#0a0a0a", card: "#0f0f0f", border: "#1a1a1a",
  gold: "#e8c547", goldLight: "#f0d968", goldDim: "#e8c54788",
  text: "#e0e0e0", textMuted: "#7a7a7a", textDim: "#5a5a5a", textDark: "#4a4a4a",
  cyan: "#47c5e8", purple: "#c547e8", green: "#47e8a0",
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Noto Sans JP', sans-serif",
  fontMono: "'DM Mono', monospace",
};

export const CSS_BLOCK = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
  * { margin:0; padding:0; box-sizing:border-box; }
  input[type=range] { -webkit-appearance:none; appearance:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:#e8c547; cursor:pointer; box-shadow:0 0 12px #e8c54744; }
  ::selection { background: #e8c54733; color: #f0f0f0; }
`;
