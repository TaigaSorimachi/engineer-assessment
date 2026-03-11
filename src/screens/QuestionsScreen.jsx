import { C } from "../lib/constants.js";
import QUESTIONS from "../lib/questions.js";
import ProgressBar from "../components/ui/ProgressBar.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import GoldButton from "../components/ui/GoldButton.jsx";
import SpectrumSlider from "../components/SpectrumSlider.jsx";
import MultiChoiceInput from "../components/MultiChoiceInput.jsx";
import SingleChoiceInput from "../components/SingleChoiceInput.jsx";
import FreetextInput from "../components/FreetextInput.jsx";

const TYPE_META = {
  spectrum: { icon: "◁▷", label: "スライダーで選択" },
  multi_choice: { icon: "☑", label: "複数選択可" },
  single_choice: { icon: "○", label: "ひとつ選択" },
  freetext: { icon: "✎", label: "自由記述" },
};

export default function QuestionsScreen({ currentQ, answers, animIn, onAnswer, onNext, onPrev }) {
  const q = QUESTIONS[currentQ];
  const tm = TYPE_META[q.type] || {};

  const canProceed = () => {
    const val = answers[q.id];
    if (q.type === "spectrum") return true;
    if (q.type === "freetext") return val && val.trim().length >= (q.minChars || 30);
    if (q.type === "multi_choice") return val && val.length > 0;
    if (q.type === "single_choice") return !!val;
    return false;
  };

  const isLast = currentQ === QUESTIONS.length - 1;

  return (
    <div style={{ maxWidth: 640, width: "100%" }}>
      <ProgressBar current={currentQ} total={QUESTIONS.length} />
      <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateX(0)" : "translateX(30px)", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <SectionHeader section={q.section} desc={q.sectionDesc} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 12, padding: "4px 12px", background: "#e8c54710", borderRadius: 6 }}>
          <span style={{ fontFamily: C.fontMono, fontSize: 12, color: "#e8c54799" }}>{tm.icon}</span>
          <span style={{ fontFamily: C.fontMono, fontSize: 11, color: "#e8c54799" }}>{tm.label}</span>
        </div>
        <h2 style={{ fontFamily: C.fontBody, fontSize: 20, fontWeight: 600, color: C.text, lineHeight: 1.7, marginTop: 8, marginBottom: 8 }}>{q.question}</h2>
        {q.type === "spectrum" && <SpectrumSlider question={q} value={answers[q.id] ?? 50} onChange={(v) => onAnswer(q.id, v)} />}
        {q.type === "multi_choice" && <MultiChoiceInput question={q} value={answers[q.id]} onChange={(v) => onAnswer(q.id, v)} />}
        {q.type === "single_choice" && <SingleChoiceInput question={q} value={answers[q.id]} onChange={(v) => onAnswer(q.id, v)} />}
        {q.type === "freetext" && <FreetextInput question={q} value={answers[q.id]} onChange={(v) => onAnswer(q.id, v)} />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, gap: 16 }}>
        <GoldButton onClick={onPrev} disabled={currentQ === 0} secondary>戻る</GoldButton>
        <GoldButton onClick={onNext} disabled={!canProceed()}>{isLast ? "分析する" : "次へ"}</GoldButton>
      </div>
    </div>
  );
}
