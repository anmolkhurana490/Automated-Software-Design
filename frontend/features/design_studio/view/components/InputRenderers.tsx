import { Question } from "../../model/elicitation_stage_models";

interface InputOutputRendererProps {
  questions: Question[] | undefined | null;
  nextButton?: string;
  continueAfterInputs?: () => void;
  inputAnswers: Record<string, string>;
  setInputAnswer: (field: string, value: string) => void;
  disabled: boolean;
}

interface InputRendererProps {
  field: string;
  message?: string;
  value: string;
  options?: string[];
  onChange: (checked: string) => void;
  disabled: boolean;
}

// Shared Tailwind classes
const inputBaseClasses = "w-full rounded-lg border border-slate-700 bg-slate-950/85 px-3 py-2 text-sm text-slate-100 outline-none transition-colors hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50";
const inputFocusClasses = "focus:border-cyan-400 focus:bg-slate-950 focus:ring-1 focus:ring-cyan-400/30";

// Boolean checkbox input renderer
const BooleanInputRenderer = ({
  field,
  message,
  value,
  onChange,
  disabled,
}: InputRendererProps) => (
  <label className="inline-flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-950/50 px-2 py-3 sm:px-4 sm:py-3 hover:bg-slate-900/60 transition-colors cursor-pointer group">
    <input
      type="checkbox"
      checked={value === "true"}
      onChange={(e) => onChange(e.target.checked.toString())}
      disabled={disabled}
      className="h-5 w-5 rounded border-slate-600 bg-slate-800 accent-cyan-400 cursor-pointer group-hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
    />
    <span className="text-sm font-medium text-slate-100">{message ?? field}</span>
  </label>
);

// Select dropdown with predefined options
const SelectInputRenderer = ({
  field,
  value,
  options,
  onChange,
  disabled,
}: InputRendererProps) => (
  <select
    value={String(value ?? "")}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`${inputBaseClasses} ${inputFocusClasses} cursor-pointer`}
  >
    <option value="" className="bg-slate-900 text-slate-300">
      Select an option
    </option>
    {options?.map((opt) => (
      <option key={opt} value={opt} className="bg-slate-900 text-slate-100">
        {opt}
      </option>
    ))}
  </select>
);

// List input (comma-separated)
const ListInputRenderer = ({
  field,
  value,
  onChange,
  disabled,
}: InputRendererProps) => (
  <div className="space-y-2">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter comma-separated items (e.g., item1, item2, item3)"
      disabled={disabled}
      className={`${inputBaseClasses} ${inputFocusClasses}`}
    />
    <p className="text-xs text-slate-400">Separate multiple items with commas</p>
  </div>
);

// Plain text input
const TextInputRenderer = ({
  field,
  value,
  onChange,
  disabled,
}: InputRendererProps) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Type your answer here"
    disabled={disabled}
    className={`${inputBaseClasses} ${inputFocusClasses}`}
  />
);

export const InputOutputRenderer = ({
  questions,
  nextButton,
  continueAfterInputs,
  inputAnswers,
  setInputAnswer,
  disabled,
}: InputOutputRendererProps) => {
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const allAnswered = safeQuestions.every((q) => {
    const ans = inputAnswers[q.field] ?? "";
    if (q.required === false) return true; // If explicitly not required, skip validation

    // For boolean types, consider "false" as a valid answer
    return String(ans).trim() !== "";
  });

  const renderInput = (question: Question) => {
    const raw = inputAnswers[question.field];

    // Has predefined options → Select dropdown
    if (question.options && question.options.length > 0) {
      return (
        <SelectInputRenderer
          field={question.field}
          value={String(raw ?? "")}
          options={question.options}
          onChange={(val) => setInputAnswer(question.field, val)}
          disabled={disabled}
        />
      );
    }

    // Boolean type → Checkbox
    if (question.input_type === "boolean") {
      return (
        <BooleanInputRenderer
          field={question.field}
          message={question.message}
          value={String(raw ?? "false")}
          onChange={(checked) => setInputAnswer(question.field, checked)}
          disabled={disabled}
        />
      );
    }

    // List type → Comma-separated input
    if (question.input_type === "list") {
      const listValue = Array.isArray(raw) ? raw.join(", ") : typeof raw === "string" ? raw : "";
      return (
        <ListInputRenderer
          field={question.field}
          value={listValue}
          onChange={(items) => setInputAnswer(question.field, items)}
          disabled={disabled}
        />
      );
    }

    // Default: Plain text input
    const textValue = typeof raw === "string" ? raw : "";
    return (
      <TextInputRenderer
        field={question.field}
        value={textValue}
        onChange={(val) => setInputAnswer(question.field, val)}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="mt-2 space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 sm:p-4 text-sm">
      {safeQuestions.map((question, index) => (
        <div key={question.field + index} className="space-y-2">
          {(question.input_type !== "boolean" || !question.message) && (
            <p className="font-semibold text-amber-100">{question.message ?? question.field}</p>
          )}
          {renderInput(question)}
        </div>
      ))}

      {nextButton ? (
        <button
          type="button"
          onClick={continueAfterInputs}
          disabled={!allAnswered || disabled}
          className="w-full rounded-lg bg-linear-to-r from-slate-900 to-cyan-700 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextButton}
        </button>
      ) : null}
    </div>
  );
}