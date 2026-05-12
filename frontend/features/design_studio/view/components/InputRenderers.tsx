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

// Boolean radio buttons (Yes/No)
const BooleanRadioRenderer = ({
  field,
  message,
  value,
  onChange,
  disabled,
}: InputRendererProps) => (
  <div className="space-y-2">
    <div className="flex flex-wrap gap-3">
      <label key={"Yes"} className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name={field} value={"true"}
          checked={value === "true"}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-4 w-4 border-slate-600 bg-slate-800 accent-cyan-400 cursor-pointer group-hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="text-sm font-medium text-slate-100">Yes</span>
      </label>

      <label key={"No"} className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name={field} value={"false"}
          checked={value === "false"}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-4 w-4 border-slate-600 bg-slate-800 accent-cyan-400 cursor-pointer group-hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="text-sm font-medium text-slate-100">No</span>
      </label>
    </div>
  </div>
);

// Radio buttons with predefined options and optional text input
const OptionsRadioRenderer = ({
  field,
  value,
  options,
  onChange,
  disabled,
}: InputRendererProps) => (
  <div className="space-y-3">
    <div className="space-y-2">
      {options?.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={field}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="h-4 w-4 border-slate-600 bg-slate-800 accent-cyan-400 cursor-pointer group-hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="text-sm font-medium text-slate-100">{option}</span>
        </label>
      ))}
    </div>
    <div className="space-y-2 border-t border-amber-500/20 pt-3">
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="radio"
          name={`${field}-other`}
          checked={!options?.includes(String(value ?? ""))}
          onChange={() => onChange("")}
          disabled={disabled}
          className="h-4 w-4 border-slate-600 bg-slate-800 accent-cyan-400 cursor-pointer group-hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="text-sm font-medium text-slate-100">Other:</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter custom answer"
        disabled={disabled}
        className={`${inputBaseClasses} ${inputFocusClasses}`}
      />
    </div>
  </div>
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

    // Has predefined options → Radio buttons
    if (question.options && question.options.length > 0) {
      return (
        <OptionsRadioRenderer
          field={question.field}
          value={String(raw ?? "")}
          options={question.options}
          onChange={(val) => setInputAnswer(question.field, val)}
          disabled={disabled}
        />
      );
    }

    // Boolean type → Radio buttons (Yes/No)
    if (question.input_type === "boolean") {
      return (
        <BooleanRadioRenderer
          field={question.field}
          message={question.message}
          value={String(raw ?? "")}
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