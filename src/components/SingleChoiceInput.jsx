import ChoiceButton from "./ui/ChoiceButton.jsx";

export default function SingleChoiceInput({ question, value, onChange }) {
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt) => (
        <ChoiceButton key={opt.id} active={value === opt.id} onClick={() => onChange(opt.id)} radio>{opt.label}</ChoiceButton>
      ))}
    </div>
  );
}
