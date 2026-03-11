/* ═══════════════════════════════════════════════════════
   TEMPLATE-BASED INSIGHT GENERATOR
   ビッグファイブ因子に基づくエンジニア特化の分析テキスト
   ═══════════════════════════════════════════════════════ */

import { band } from "./scoring.js";

// ── 16タイプ名 ──────────────────────────────────────────
export const TYPE_NAMES = {
  DBSP: "堅実な職人型", DBSX: "実験的クラフター",
  DBCP: "戦略的アーキテクト", DBCX: "探究するイノベーター",
  DASP: "理論派プランナー", DASX: "柔軟な理論家",
  DACP: "ビジョナリー設計者", DACX: "先駆的リサーチャー",
  TBSP: "チーム志向の実務家", TBSX: "アジャイルプレイヤー",
  TBCP: "推進力のあるリーダー", TBCX: "共創型イノベーター",
  TASP: "対話で深める思考家", TASX: "越境するファシリテーター",
  TACP: "構想力のある導き手", TACX: "変革を楽しむ開拓者",
};

// ── 4軸インサイト（ビッグファイブ対応明示） ────────────
export const AXIS_INSIGHTS = {
  focus_dialogue: {
    bigFive: "外向性 (Extraversion)",
    low: "一人で深く思考に沈む集中型です。静かな環境で最もパフォーマンスを発揮し、問題を自分の頭の中で構造化してから解決に向かう傾向があります。ペアプログラミングよりも、考えをまとめてからレビューで議論するスタイルが合っているかもしれません。",
    mid: "状況に応じて集中と対話を使い分ける柔軟なスタイルです。難問に直面した際、まず自分で整理しつつも、行き詰まったら周囲の視点を取り入れることができます。このバランス感覚はチーム開発において大きな強みとなります。",
    high: "対話を通じて思考を整理する対話型です。アイデアを言語化し、他者のリアクションから新たな視点を得ることで問題解決に向かいます。ブレインストーミングやモブプログラミングのような協働的手法で力を発揮するタイプです。",
  },
  concrete_abstract: {
    bigFive: "開放性 (Openness to Experience)",
    low: "手を動かしながら学ぶBuilder型です。チュートリアルや実装例から入り、動くコードを通じて概念を体得していきます。抽象的な議論よりも「まず動くものを見せて」というアプローチが自然で、プロトタイピングの速さが強みです。",
    mid: "具体と抽象を行き来できるバランス型です。概念を理解した上で手を動かし、実装を通じて理解を深めるサイクルを自然に回せます。設計議論と実装の両方で貢献できるマルチな強みがあります。",
    high: "アーキテクチャや概念モデルから入るArchitect型です。全体像を把握してから部分に取り組む思考パターンで、設計ドキュメントや技術書を好みます。システム全体の整合性を俯瞰する力があり、設計フェーズで大きな価値を発揮します。",
  },
  conservative_adventurous: {
    bigFive: "情緒安定性 (Emotional Stability) + 開放性",
    low: "安定性と実績を重視するSteady型です。本番環境への変更には十分な検証を求め、枯れた技術を信頼します。この姿勢はミッションクリティカルなシステムにおいて極めて重要であり、チームの品質の砦となる存在です。",
    mid: "リスクとリターンを冷静に天秤にかける現実派です。状況に応じて慎重にも大胆にもなれる判断力があります。新技術の採用には実績と課題適合性の両面から評価する、バランスの取れたアプローチをとります。",
    high: "新しい技術や手法に積極的に挑戦するChallenger型です。将来性を見据えた技術選定を好み、不確実性を成長の機会と捉えます。チームに新しい風を吹き込み、技術的な停滞を防ぐ推進力があります。",
  },
  planning_exploration: {
    bigFive: "誠実性 (Conscientiousness)",
    low: "設計を固めてから実装に進むPlanner型です。全体設計やリサーチを先行させ、見通しを立ててから着手します。大規模プロジェクトや複雑な要件での失敗リスクを最小化する力があり、プロジェクトの安定に貢献します。",
    mid: "計画と探索をバランスよく組み合わせるプラグマティストです。ある程度の設計を行いつつ、不確実な部分はプロトタイプで検証するアプローチをとります。チームの進め方に柔軟に適応できる強みがあります。",
    high: "プロトタイプを作りながら最適解を発見するExplorer型です。手を動かしながら設計を洗練させていく反復的アプローチを好みます。仕様が曖昧な段階でも前に進める推進力があり、アジャイル開発との親和性が高いスタイルです。",
  },
};

// ── 技術的価値観 ────────────────────────────────────────
const QUALITY_PROFILES = {
  readable: "コードの可読性と意図の明確さを大切にしています。チームで長期的に保守されるコードにとって、読みやすさは最も重要な品質の一つです。",
  testable: "テスタビリティを重視する姿勢は、品質に対する高い意識の表れです。テストしやすい設計は、結果として保守性や信頼性の高いコードにつながります。",
  performant: "パフォーマンスへの意識が高く、効率的な実装を追求します。ユーザー体験やシステムの応答性に対する責任感が見られます。",
  extensible: "変更容易性と拡張性を重視しています。ソフトウェアが長期的に進化し続けることを前提とした、先を見据えた設計思想です。",
  simple: "シンプルさ・最小限の実装を志向しています。YAGNIやKISSの原則に共感し、過度な抽象化よりも明快な解を好む傾向があります。",
  robust: "堅牢性とエラーハンドリングを重視しています。想定外の状況にも耐えるシステムを作りたいという、信頼性への強いこだわりが感じられます。",
};

const DEBUG_PROFILES = {
  a: "再現手順の確立から始める体系的なアプローチ。問題を安定的に再現させることで、仮説検証の精度を上げる手堅い手法です。",
  b: "可観測性を重視し、ログやメトリクスから事実ベースで追跡するアプローチ。データドリブンなデバッグは、複雑なシステムの問題解決に特に効果的です。",
  c: "コードリーディングと仮説検証を組み合わせた分析型アプローチ。システムの内部構造への深い理解に基づく問題解決力が窺えます。",
  d: "二分探索的に原因を絞り込む効率的なアプローチ。問題の切り分けが素早く、複雑な原因でも系統的にたどり着ける強みがあります。",
};

const TRADEOFF_PROFILES = {
  a: "品質を最優先し、技術的負債���蓄積を許容しない姿勢です。長期的なコスト意識が高く、「急がば回れ」の哲学を持っています。品質の門番としてチームに貢献できます。",
  b: "スコープ調整で品質を守る交渉型です。「全部作る」より「良いものを少なく」という判断ができる、プロダクト思考の持ち主です。PMとの建設的な対話が得意かもしれません。",
  c: "まず動くものを出すスピード重視型です。フィードバックループを素早く回すことの価値を理解しており、リファクタリング前提で前に進める判断力があります。スタートアップ的な環境で特に力を発揮します。",
  d: "チームやステークホルダーとの対話で最適解を探る協調型です。一人で抱え込まず、優先順位の再交渉ができるコミュニケーション力が見られます。マネジメント視点も持ち合わせています。",
};

// ── 生成関数群 ──────────────────────────────────────────
export function generateQualityPhilosophy(selected) {
  if (!selected || selected.length === 0) return "コード品質に対する回答が未選択です。";
  const map = { a: "readable", b: "testable", c: "performant", d: "extensible", e: "simple", f: "robust" };
  const profiles = selected.map((id) => QUALITY_PROFILES[map[id]]).filter(Boolean);
  if (profiles.length === 1) return profiles[0];
  if (profiles.length <= 3) return profiles.join("\n\nまた、") + "\n\n複数の品質軸を意識できることは、成熟した技術者の特徴です。";
  return profiles.slice(0, 3).join("\n\n") + "\n\n幅広い品質観点を持ち合わせており、状況に応じて重視する軸を切り替えられる柔軟性があります。";
}

export function generateCollabInsight(score, selected) {
  const b = band(score);
  const base = {
    low: "技術的な正しさを重視し、論理的な根拠に基づいてレビューを行うスタイルです。コードの品質向上に対する高い基準を持っており、チームの技術水準の底上げに貢献します。",
    mid: "技術的な正確さと相手への配慮をバランスよく両立するスタイルです。指摘する際も相手の意図を汲み取り、建設的な対話を心がける姿勢が見られます。",
    high: "相手の文脈や意図を理解することを優先する共感型のスタイルです。心理的安全性を大切にし、チームメンバーが安心してコードを出せる環境づくりに貢献します。",
  }[b];

  const strengths = [];
  if (selected?.includes("a")) strengths.push("意図の理解を重視する傾向");
  if (selected?.includes("c")) strengths.push("ポジティブフィードバックの習慣");
  if (selected?.includes("b")) strengths.push("リスク検知への高い意識");
  if (selected?.includes("d")) strengths.push("規約と一貫性の遵守");
  if (selected?.includes("e")) strengths.push("非機能要件への目配り");

  return base + (strengths.length > 0
    ? "\n\nレビューでは特に「" + strengths.join("」「") + "」が強みとして発揮されます。"
    : "");
}

export function generateLearningInsight(score, learnMc) {
  const b = band(score);
  const base = {
    low: "一つの領域を深く掘り下げるスペシャリスト志向です。専門性の深さが強みであり、その領域における第一人者となるポテンシャルを持っています。",
    mid: "深さと広さをバランスよく追求するT型人材の傾向があります。軸となる専門領域を持ちつつ、隣接技術にも関心を広げるスタイルは、多くのチームで重宝される存在です。",
    high: "幅広い技術に好奇心を持つジェネラリスト志向です。多様な技術スタックを横断できる力は、チーム間の橋渡しや新技術の導入提案において大きな価値を発揮します。",
  }[b];

  const growthMap = {
    a: "困難な問題の克服から成長を実感するタイプです。プレッシャーのかかる場面で力を発揮し、そこから得た経験を糧にする強さがあります。",
    b: "新しい技術の習得と実践から成長を感じるタイプです。技術トレンドへの感度が高く、学んだことを素早く業務に還元する力があります。",
    c: "設計やアーキテクチャの意思決定から成長を実感するタイプです。技術の上流工程にやりがいを見出しており、テックリードやアーキテクトとしての成長パスが見えます。",
    d: "人に教え、導くことから成長を感じるタイプです。自分の知識を整理して伝える過程で理解を深め、チーム全体の底上げに貢献する姿勢があります。",
  };

  return base + (growthMap[learnMc] ? "\n\n" + growthMap[learnMc] : "");
}

export function generateCoreBelief(answers) {
  const quality = answers.s3_quality_mc || [];
  const tradeoff = answers.s3_tradeoff_mc;
  if (quality.includes("a") && quality.includes("e")) return "明快で読みやすいコードこそが最良のコード";
  if (quality.includes("d") && quality.includes("b")) return "変化に強く、テストで守られたシステムを作る";
  if (quality.includes("c") && quality.includes("f")) return "パフォーマンスと堅牢性の両立を追求する";
  if (quality.includes("a") && quality.includes("d")) return "意図が伝わり、長期的に進化できるコードを目指す";
  if (tradeoff === "a") return "品質への妥協なき姿勢がプロフェッショナルの証";
  if (tradeoff === "c") return "まず動くものを世に出し、そこから磨き上げる";
  if (tradeoff === "b") return "本当に大切なものに絞り、その品質を極限まで高める";
  if (tradeoff === "d") return "チームで最適解を見つけるプロセスを大切にする";
  if (quality.length >= 4) return "多角的な品質観点でソフトウェアの価値を最大化する";
  return "技術を通じてより良いものを作り続ける";
}

export function generateSummary(scores, typeCode, typeName) {
  const fd = band(scores.focus_dialogue);
  const ca = band(scores.concrete_abstract);
  const risk = band(scores.conservative_adventurous);
  const plan = band(scores.planning_exploration);

  const thinkStyle = { low: "一人で深く集中して考える", mid: "集中と対話を柔軟に使い分ける", high: "対話を通じて思考を深める" }[fd];
  const infoStyle = { low: "具体的な事実と実装から積み上げる", mid: "具体と抽象を自然に行き来する", high: "概念やモデルで全体を俯瞰する" }[ca];
  const riskStyle = { low: "安定性と実績を重視した慎重な", mid: "状況に応じてバランスの取れた", high: "新しい可能性に果敢に挑む" }[risk];
  const planStyle = { low: "計画を立ててから着実に進める", mid: "計画と探索を柔軟に組み合わせる", high: "試行錯誤しながら最適解を発見する" }[plan];

  return `${typeName}（${typeCode}）タイプ。${thinkStyle}スタイルで、${infoStyle}思考の持ち主です。意思決定においては${riskStyle}判断を下し、${planStyle}アプローチを得意とします。技術的価値観と問題解決パターンに明確な軸を持った技術者です。`;
}

export function generateInterviewSuggestions(scores, answers) {
  const suggestions = [];

  if (answers.s3_passion && answers.s3_passion.trim().length > 0) {
    suggestions.push("自由記述で述べた「こだわり」について、実際のプロジェクトでどう体現したか具���的エピソードを聞いてみてください。");
  }
  if (answers.s4_freetext && answers.s4_freetext.trim().length > 0) {
    suggestions.push("チーム開発エピソードについて、そこから得た学びや、今の自分にどう活きているかを深掘りしてください。");
  }

  if (scores.focus_dialogue < 30) {
    suggestions.push("集中型の傾向が強いため、チーム内でのコミュニケーション頻度やペアプロへの適応について確認すると良いでしょう。");
  } else if (scores.focus_dialogue > 70) {
    suggestions.push("対話型の傾向が強いため、一人で集中して取り組む場面での進め方や、リモート環境での適応について聞いてみてください。");
  }

  if (scores.conservative_adventurous > 70) {
    suggestions.push("挑戦志向が高いため、過去に技術選定で失敗した経験とそこからの学びについて聞くと、リスク判断の成熟度が分かります。");
  } else if (scores.conservative_adventurous < 30) {
    suggestions.push("慎重な傾向があるため、スピードが求められた場面でどう対応したか、技術的負債とスピードのトレードオフ経験を聞いてみてください。");
  }

  if (scores.collaboration < 35) {
    suggestions.push("技術的正しさを重視する傾向があるため、意見が対立した際の具体的な解決プロセスについて確認すると良いでしょう。");
  }

  if (scores.planning_exploration > 70) {
    suggestions.push("探索型の傾向が強いため、長期プロジェクトでの計画性やドキュメンテーションの習慣について確認してみてください。");
  }

  const defaults = [
    "チームで技術的な意思決定を行った経験と、その際の自分の役割について詳しく聞いてみてください。",
    "直近で最も成長を感じた技術領域と、今後伸ばしたいスキルについて聞くと、成長意欲と方向性が見えます。",
    "理想のチームや開発文化についてのビジョンを聞くと、カルチャーフィットの判断材料になります。",
  ];

  while (suggestions.length < 3) {
    const next = defaults.find((d) => !suggestions.includes(d));
    if (next) suggestions.push(next);
    else break;
  }

  return suggestions.slice(0, 5);
}

// Re-export for convenience
export { DEBUG_PROFILES, TRADEOFF_PROFILES };
