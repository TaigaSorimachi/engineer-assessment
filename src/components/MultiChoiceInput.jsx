import ChoiceButton from "./ui/ChoiceButton.jsx";

export default function MultiChoiceInput({ question, value, onChange }) {
  const selected = value || [];
  const toggle = (id) => selected.includes(id) ? onChange(selected.filter((x) => x !== id)) : onChange([...selected, id]);
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt) => (
        <ChoiceButton key={opt.id} active={selected.includes(opt.id)} onClick={() => toggle(opt.id)}>{opt.label}</ChoiceButton>
      ))}
    </div>
  );
}
