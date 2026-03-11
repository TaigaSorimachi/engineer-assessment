/**
 * 16タイプのキャラクターSVGを生成するスクリプト
 * node scripts/generate-characters.js
 */
import { writeFileSync } from "fs";

// 各タイプの動物モチーフと配色
const TYPES = {
  DBSP: { name: "堅実な職人型", animal: "beaver", emoji: "🦫", color: "#8B7355", accent: "#D2B48C", desc: "ビーバー — コツコツ積み上げる" },
  DBSX: { name: "実験的クラフター", animal: "raccoon", emoji: "🦝", color: "#708090", accent: "#B0C4DE", desc: "アライグマ — 器用に試す" },
  DBCP: { name: "戦略的アーキテクト", animal: "spider", emoji: "🕷️", color: "#4A0E4E", accent: "#9B59B6", desc: "蜘蛛 — 精緻な設計者" },
  DBCX: { name: "探究するイノベーター", animal: "octopus", emoji: "🐙", color: "#E74C3C", accent: "#F1948A", desc: "タコ — 多腕で探る" },
  DASP: { name: "理論派プランナー", animal: "owl", emoji: "🦉", color: "#5D4E37", accent: "#C4A882", desc: "フクロウ — 静かな知恵" },
  DASX: { name: "柔軟な理論家", animal: "cat", emoji: "🐱", color: "#7B68EE", accent: "#B8A9F0", desc: "猫 — 気まぐれな洞察" },
  DACP: { name: "ビジョナリー設計者", animal: "eagle", emoji: "🦅", color: "#2C3E50", accent: "#5DADE2", desc: "鷲 — 俯瞰する目" },
  DACX: { name: "先駆的リサーチャー", animal: "dolphin", emoji: "🐬", color: "#1ABC9C", accent: "#76D7C4", desc: "イルカ — 知的好奇心" },
  TBSP: { name: "チーム志向の実務家", animal: "dog", emoji: "🐕", color: "#D4A017", accent: "#F4D03F", desc: "犬 — 忠実な仲間" },
  TBSX: { name: "アジャイルプレイヤー", animal: "monkey", emoji: "🐒", color: "#E67E22", accent: "#F5B041", desc: "猿 — 素早い適応" },
  TBCP: { name: "推進力のあるリーダー", animal: "lion", emoji: "🦁", color: "#C0392B", accent: "#E8C547", desc: "ライオン — 堂々と率いる" },
  TBCX: { name: "共創型イノベーター", animal: "parrot", emoji: "🦜", color: "#27AE60", accent: "#58D68D", desc: "オウム — 色鮮やかな共創" },
  TASP: { name: "対話で深める思考家", animal: "elephant", emoji: "🐘", color: "#7F8C8D", accent: "#BDC3C7", desc: "象 — 深い記憶と対話" },
  TASX: { name: "越境するファシリテーター", animal: "fox", emoji: "🦊", color: "#E67E22", accent: "#F0B27A", desc: "狐 — 賢く橋を架ける" },
  TACP: { name: "構想力のある導き手", animal: "whale", emoji: "🐋", color: "#2E4057", accent: "#5B8DB8", desc: "鯨 — 大海を導く" },
  TACX: { name: "変革を楽しむ開拓者", animal: "phoenix", emoji: "🔥", color: "#E74C3C", accent: "#F39C12", desc: "不死鳥 — 変革の炎" },
};

function generateSVG(code, t) {
  const animals = {
    beaver: `<circle cx="80" cy="62" r="28" fill="${t.color}"/>
      <ellipse cx="80" cy="55" rx="20" ry="16" fill="${t.accent}"/>
      <circle cx="72" cy="50" r="3.5" fill="#0a0a0a"/><circle cx="88" cy="50" r="3.5" fill="#0a0a0a"/>
      <ellipse cx="80" cy="58" rx="5" ry="3" fill="#0a0a0a"/>
      <rect x="76" y="61" width="3" height="5" rx="1" fill="#fff"/><rect x="81" y="61" width="3" height="5" rx="1" fill="#fff"/>
      <ellipse cx="56" cy="75" rx="12" ry="6" fill="${t.color}" transform="rotate(-20 56 75)"/>`,
    raccoon: `<circle cx="80" cy="62" r="28" fill="${t.color}"/>
      <ellipse cx="80" cy="58" rx="18" ry="14" fill="${t.accent}"/>
      <ellipse cx="70" cy="52" rx="8" ry="6" fill="#333"/><ellipse cx="90" cy="52" rx="8" ry="6" fill="#333"/>
      <circle cx="72" cy="52" r="3" fill="#fff"/><circle cx="88" cy="52" r="3" fill="#fff"/>
      <circle cx="72" cy="52" r="1.5" fill="#0a0a0a"/><circle cx="88" cy="52" r="1.5" fill="#0a0a0a"/>
      <ellipse cx="80" cy="60" rx="4" ry="2.5" fill="#333"/>`,
    spider: `<ellipse cx="80" cy="65" rx="18" ry="22" fill="${t.color}"/>
      <circle cx="80" cy="50" r="14" fill="${t.accent}"/>
      ${[[-20,-8],[-14,-14],[14,-14],[20,-8]].map(([dx,dy])=>`<circle cx="${80+dx}" cy="${50+dy}" r="3" fill="#e8c547"/>`).join("")}
      <circle cx="74" cy="48" r="4" fill="#e8c547"/><circle cx="86" cy="48" r="4" fill="#e8c547"/>
      <circle cx="74" cy="48" r="2" fill="#0a0a0a"/><circle cx="86" cy="48" r="2" fill="#0a0a0a"/>
      ${[-3,-1,1,3].map(i=>`<line x1="${80+i*8}" y1="70" x2="${80+i*14}" y2="95" stroke="${t.color}" stroke-width="2.5" stroke-linecap="round"/>`).join("")}`,
    octopus: `<ellipse cx="80" cy="52" rx="22" ry="20" fill="${t.color}"/>
      <circle cx="72" cy="48" r="5" fill="#fff"/><circle cx="88" cy="48" r="5" fill="#fff"/>
      <circle cx="73" cy="48" r="2.5" fill="#0a0a0a"/><circle cx="89" cy="48" r="2.5" fill="#0a0a0a"/>
      <path d="M74 58 Q80 64 86 58" stroke="${t.accent}" stroke-width="2" fill="none"/>
      ${[-3,-2,-1,0,1,2,3].map((i)=>`<path d="M${80+i*6} 70 Q${80+i*8} 85 ${80+i*5} 98" stroke="${t.color}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("")}`,
    owl: `<ellipse cx="80" cy="62" rx="24" ry="26" fill="${t.color}"/>
      <circle cx="70" cy="52" r="10" fill="#fff"/><circle cx="90" cy="52" r="10" fill="#fff"/>
      <circle cx="71" cy="52" r="5" fill="${t.accent}"/><circle cx="91" cy="52" r="5" fill="${t.accent}"/>
      <circle cx="71" cy="52" r="2.5" fill="#0a0a0a"/><circle cx="91" cy="52" r="2.5" fill="#0a0a0a"/>
      <polygon points="80,58 77,64 83,64" fill="${t.accent}"/>
      <polygon points="60,38 70,48 58,50" fill="${t.color}"/><polygon points="100,38 90,48 102,50" fill="${t.color}"/>`,
    cat: `<ellipse cx="80" cy="65" rx="22" ry="22" fill="${t.color}"/>
      <polygon points="62,42 58,18 76,38" fill="${t.color}"/><polygon points="98,42 102,18 84,38" fill="${t.color}"/>
      <polygon points="64,40 60,22 74,36" fill="${t.accent}"/><polygon points="96,40 100,22 86,36" fill="${t.accent}"/>
      <ellipse cx="71" cy="58" rx="4" ry="5" fill="${t.accent}"/><ellipse cx="89" cy="58" rx="4" ry="5" fill="${t.accent}"/>
      <circle cx="71" cy="57" r="2" fill="#0a0a0a"/><circle cx="89" cy="57" r="2" fill="#0a0a0a"/>
      <ellipse cx="80" cy="65" rx="3" ry="2" fill="#FFB6C1"/>
      <line x1="50" y1="60" x2="66" y2="62" stroke="${t.accent}" stroke-width="1"/><line x1="50" y1="66" x2="66" y2="65" stroke="${t.accent}" stroke-width="1"/>
      <line x1="110" y1="60" x2="94" y2="62" stroke="${t.accent}" stroke-width="1"/><line x1="110" y1="66" x2="94" y2="65" stroke="${t.accent}" stroke-width="1"/>`,
    eagle: `<ellipse cx="80" cy="60" rx="22" ry="24" fill="${t.color}"/>
      <ellipse cx="80" cy="55" rx="16" ry="12" fill="#fff"/>
      <circle cx="73" cy="52" r="3.5" fill="${t.accent}"/><circle cx="87" cy="52" r="3.5" fill="${t.accent}"/>
      <circle cx="73" cy="52" r="1.8" fill="#0a0a0a"/><circle cx="87" cy="52" r="1.8" fill="#0a0a0a"/>
      <polygon points="80,56 76,66 84,66" fill="#F39C12"/>
      <path d="M80 66 L78 70 L82 70 Z" fill="#E67E22"/>
      <path d="M58 40 Q50 30 45 38 Q55 36 62 44" fill="${t.color}"/><path d="M102 40 Q110 30 115 38 Q105 36 98 44" fill="${t.color}"/>`,
    dolphin: `<ellipse cx="80" cy="60" rx="20" ry="24" fill="${t.color}"/>
      <ellipse cx="80" cy="55" rx="14" ry="10" fill="${t.accent}"/>
      <circle cx="74" cy="52" r="3" fill="#fff"/><circle cx="86" cy="52" r="3" fill="#fff"/>
      <circle cx="74" cy="52" r="1.5" fill="#0a0a0a"/><circle cx="86" cy="52" r="1.5" fill="#0a0a0a"/>
      <path d="M74 62 Q80 66 86 62" stroke="#fff" stroke-width="1.5" fill="none"/>
      <path d="M80 36 Q82 24 90 28 Q84 32 82 38" fill="${t.color}"/>
      <path d="M60 70 Q52 80 48 75" stroke="${t.color}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M100 70 Q108 80 112 75" stroke="${t.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    dog: `<ellipse cx="80" cy="62" rx="24" ry="24" fill="${t.color}"/>
      <ellipse cx="80" cy="60" rx="16" ry="12" fill="${t.accent}"/>
      <circle cx="72" cy="54" r="4" fill="#fff"/><circle cx="88" cy="54" r="4" fill="#fff"/>
      <circle cx="73" cy="54" r="2" fill="#0a0a0a"/><circle cx="89" cy="54" r="2" fill="#0a0a0a"/>
      <ellipse cx="80" cy="64" rx="5" ry="3.5" fill="#333"/>
      <path d="M75 70 Q80 76 85 70" stroke="#E74C3C" stroke-width="2" fill="#E74C3C" opacity="0.6"/>
      <ellipse cx="58" cy="44" rx="10" ry="14" fill="${t.color}" transform="rotate(-15 58 44)"/>
      <ellipse cx="102" cy="44" rx="10" ry="14" fill="${t.color}" transform="rotate(15 102 44)"/>`,
    monkey: `<circle cx="80" cy="58" r="26" fill="${t.color}"/>
      <circle cx="80" cy="60" r="18" fill="${t.accent}"/>
      <circle cx="72" cy="54" r="3.5" fill="#0a0a0a"/><circle cx="88" cy="54" r="3.5" fill="#0a0a0a"/>
      <circle cx="73" cy="53" r="1.2" fill="#fff"/><circle cx="89" cy="53" r="1.2" fill="#fff"/>
      <ellipse cx="80" cy="66" rx="8" ry="5" fill="#D4A574"/>
      <ellipse cx="80" cy="64" rx="3" ry="2" fill="#333"/>
      <path d="M76 68 Q80 72 84 68" stroke="#333" stroke-width="1.5" fill="none"/>
      <circle cx="54" cy="52" r="8" fill="${t.accent}"/><circle cx="106" cy="52" r="8" fill="${t.accent}"/>`,
    lion: `<circle cx="80" cy="60" r="32" fill="${t.accent}"/>
      <circle cx="80" cy="62" r="22" fill="${t.color}"/>
      <ellipse cx="80" cy="60" rx="14" ry="10" fill="${t.accent}"/>
      <circle cx="73" cy="56" r="3.5" fill="#fff"/><circle cx="87" cy="56" r="3.5" fill="#fff"/>
      <circle cx="73" cy="56" r="1.8" fill="#0a0a0a"/><circle cx="87" cy="56" r="1.8" fill="#0a0a0a"/>
      <polygon points="80,60 77,65 83,65" fill="#333"/>
      <path d="M73 68 Q80 74 87 68" stroke="#333" stroke-width="2" fill="none"/>`,
    parrot: `<ellipse cx="80" cy="60" rx="20" ry="24" fill="${t.color}"/>
      <ellipse cx="80" cy="54" rx="14" ry="12" fill="${t.accent}"/>
      <circle cx="74" cy="50" r="4" fill="#fff"/><circle cx="86" cy="50" r="4" fill="#fff"/>
      <circle cx="74" cy="50" r="2" fill="#0a0a0a"/><circle cx="86" cy="50" r="2" fill="#0a0a0a"/>
      <path d="M80 56 L76 62 L84 62 Z" fill="#F39C12"/>
      <path d="M76 62 L80 66 L84 62" fill="#E67E22"/>
      <path d="M64 40 Q56 30 60 44" fill="#E74C3C"/><path d="M68 36 Q62 26 64 40" fill="#3498DB"/><path d="M72 34 Q68 24 70 38" fill="#F1C40F"/>
      <path d="M96 40 Q104 30 100 44" fill="#E74C3C"/><path d="M92 36 Q98 26 96 40" fill="#3498DB"/>`,
    elephant: `<ellipse cx="80" cy="58" rx="28" ry="28" fill="${t.color}"/>
      <circle cx="68" cy="48" r="4" fill="#fff"/><circle cx="92" cy="48" r="4" fill="#fff"/>
      <circle cx="69" cy="48" r="2" fill="#0a0a0a"/><circle cx="93" cy="48" r="2" fill="#0a0a0a"/>
      <path d="M80 56 Q78 72 74 82 Q80 80 86 82 Q82 72 80 56" fill="${t.accent}" stroke="${t.color}" stroke-width="1"/>
      <ellipse cx="54" cy="54" rx="14" ry="18" fill="${t.color}"/><ellipse cx="54" cy="54" rx="10" ry="14" fill="${t.accent}"/>
      <ellipse cx="106" cy="54" rx="14" ry="18" fill="${t.color}"/><ellipse cx="106" cy="54" rx="10" ry="14" fill="${t.accent}"/>`,
    fox: `<ellipse cx="80" cy="64" rx="22" ry="22" fill="${t.color}"/>
      <polygon points="60,42 54,16 76,38" fill="${t.color}"/><polygon points="100,42 106,16 84,38" fill="${t.color}"/>
      <polygon points="62,40 56,20 74,36" fill="${t.accent}"/><polygon points="98,40 104,20 86,36" fill="${t.accent}"/>
      <ellipse cx="80" cy="62" rx="14" ry="10" fill="#fff"/>
      <circle cx="73" cy="56" r="3.5" fill="#0a0a0a"/><circle cx="87" cy="56" r="3.5" fill="#0a0a0a"/>
      <circle cx="74" cy="55" r="1.2" fill="#fff"/><circle cx="88" cy="55" r="1.2" fill="#fff"/>
      <ellipse cx="80" cy="64" rx="3.5" ry="2.5" fill="#0a0a0a"/>`,
    whale: `<ellipse cx="80" cy="62" rx="30" ry="26" fill="${t.color}"/>
      <ellipse cx="80" cy="60" rx="22" ry="16" fill="${t.accent}"/>
      <circle cx="68" cy="54" r="3.5" fill="#fff"/><circle cx="92" cy="54" r="3.5" fill="#fff"/>
      <circle cx="68" cy="54" r="1.8" fill="#0a0a0a"/><circle cx="92" cy="54" r="1.8" fill="#0a0a0a"/>
      <path d="M72 66 Q80 72 88 66" stroke="#0a0a0a" stroke-width="1.5" fill="none"/>
      <path d="M80 36 Q76 26 70 30 Q78 28 80 36" fill="${t.accent}"/>
      <path d="M80 36 Q84 26 90 30 Q82 28 80 36" fill="${t.accent}"/>`,
    phoenix: `<ellipse cx="80" cy="62" rx="20" ry="22" fill="${t.color}"/>
      <ellipse cx="80" cy="58" rx="14" ry="12" fill="${t.accent}"/>
      <circle cx="74" cy="54" r="3.5" fill="#fff"/><circle cx="86" cy="54" r="3.5" fill="#fff"/>
      <circle cx="74" cy="54" r="1.8" fill="#0a0a0a"/><circle cx="86" cy="54" r="1.8" fill="#0a0a0a"/>
      <polygon points="80,60 77,66 83,66" fill="#F39C12"/>
      <path d="M70 38 Q64 20 72 30 Q68 16 80 28 Q92 16 88 30 Q96 20 90 38" fill="${t.accent}"/>
      <path d="M74 38 Q70 26 78 32 Q80 22 82 32 Q90 26 86 38" fill="${t.color}"/>
      <path d="M62 72 Q52 90 48 86" stroke="${t.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M98 72 Q108 90 112 86" stroke="${t.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <defs>
    <radialGradient id="bg_${code}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${t.color}22"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
  </defs>
  <rect width="160" height="160" rx="20" fill="url(#bg_${code})"/>
  <g>${animals[t.animal]}</g>
  <text x="80" y="108" text-anchor="middle" font-family="'DM Mono', monospace" font-size="14" font-weight="500" fill="#e8c547" letter-spacing="2">${code}</text>
  <text x="80" y="126" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="9" fill="#e0e0e0">${t.name}</text>
  <text x="80" y="142" text-anchor="middle" font-family="'Noto Sans JP', sans-serif" font-size="8" fill="#7a7a7a">${t.desc}</text>
</svg>`;
}

// Generate all 16 SVGs
for (const [code, typeData] of Object.entries(TYPES)) {
  const svg = generateSVG(code, typeData);
  writeFileSync(`public/characters/${code}.svg`, svg);
  console.log(`✓ ${code} (${typeData.animal}) - ${typeData.name}`);
}

// Generate index file for easy import
const indexContent = `// Auto-generated character map
${Object.keys(TYPES).map(code => `import ${code} from './characters/${code}.svg';`).join("\n")}

export const CHARACTER_IMAGES = {
${Object.keys(TYPES).map(code => `  ${code},`).join("\n")}
};
`;

console.log("\n✓ All 16 character SVGs generated in public/characters/");
